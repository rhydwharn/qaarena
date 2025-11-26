const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const User = require('../models/User');
const Progress = require('../models/Progress');
const ErrorResponse = require('../utils/errorResponse');
const mongoose = require('mongoose');

exports.startQuiz = async (req, res, next) => {
  try {
    const { mode, category, difficulty, numberOfQuestions = 10, timeLimit, language = 'en' } = req.body;

    // Validate numberOfQuestions
    if (numberOfQuestions < 1 || numberOfQuestions > 100) {
      return next(new ErrorResponse('Number of questions must be between 1 and 100', 400));
    }

    const query = { status: 'published' };
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const totalAvailable = await Question.countDocuments(query);
    
    if (totalAvailable === 0) {
      return next(new ErrorResponse('No questions available for the selected criteria. Please try different filters.', 404));
    }

    const limit = Math.min(numberOfQuestions, totalAvailable);

    // Use $sample with a larger size to account for potential duplicates
    const sampleSize = Math.min(limit * 2, totalAvailable);
    const sampledQuestions = await Question.aggregate([
      { $match: query },
      { $sample: { size: sampleSize } }
    ]);

    // Remove duplicates by tracking unique question IDs
    const uniqueQuestions = [];
    const seenIds = new Set();
    
    for (const question of sampledQuestions) {
      const questionId = question._id.toString();
      if (!seenIds.has(questionId)) {
        seenIds.add(questionId);
        uniqueQuestions.push(question);
        if (uniqueQuestions.length === limit) {
          break;
        }
      }
    }

    // If we still don't have enough unique questions, fetch more
    if (uniqueQuestions.length < limit) {
      const additionalNeeded = limit - uniqueQuestions.length;
      const excludeIds = uniqueQuestions.map(q => q._id);
      
      const additionalQuestions = await Question.find({
        ...query,
        _id: { $nin: excludeIds }
      }).limit(additionalNeeded);
      
      uniqueQuestions.push(...additionalQuestions);
    }

    if (uniqueQuestions.length === 0) {
      return next(new ErrorResponse('Unable to generate quiz. Please try again.', 500));
    }

    const quiz = await Quiz.create({
      user: req.user.id,
      mode,
      questions: uniqueQuestions.map(q => ({ question: q._id })),
      settings: { language, category, difficulty, numberOfQuestions: uniqueQuestions.length, timeLimit }
    });

    const populatedQuiz = await Quiz.findById(quiz._id).populate('questions.question');

    res.status(201).json({
      status: 'success',
      message: 'Quiz started successfully',
      data: { quiz: populatedQuiz }
    });
  } catch (error) {
    next(error);
  }
};

exports.answerQuestion = async (req, res, next) => {
  try {
    const { quizId, questionId, answer, timeSpent } = req.body;

    // Validate required fields
    if (!quizId || !questionId || answer === undefined) {
      return next(new ErrorResponse('Please provide quizId, questionId, and answer', 400));
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      return next(new ErrorResponse('Invalid quiz ID format', 400));
    }
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return next(new ErrorResponse('Invalid question ID format', 400));
    }

    const quiz = await Quiz.findById(quizId).populate('questions.question');

    if (!quiz) {
      return next(new ErrorResponse('Quiz not found. It may have been deleted or expired.', 404));
    }

    if (quiz.user.toString() !== req.user.id) {
      return next(new ErrorResponse('You are not authorized to answer questions in this quiz', 403));
    }

    if (quiz.status !== 'in-progress') {
      return next(new ErrorResponse(`This quiz is ${quiz.status}. You can only answer questions in an active quiz.`, 400));
    }

    const questionIndex = quiz.questions.findIndex(q => q.question._id.toString() === questionId);

    if (questionIndex === -1) {
      return next(new ErrorResponse('This question is not part of the current quiz', 404));
    }

    const question = quiz.questions[questionIndex].question;
    const correctAnswers = question.options
      .map((opt, idx) => opt.isCorrect ? idx : null)
      .filter(idx => idx !== null);

    const userAnswerArray = Array.isArray(answer) ? answer : [answer];
    const isCorrect = JSON.stringify(userAnswerArray.sort()) === JSON.stringify(correctAnswers.sort());

    quiz.questions[questionIndex].userAnswer = userAnswerArray;
    quiz.questions[questionIndex].isCorrect = isCorrect;
    quiz.questions[questionIndex].timeSpent = timeSpent || 0;
    quiz.questions[questionIndex].answeredAt = Date.now();

    await quiz.save();

    res.status(200).json({
      status: 'success',
      data: { isCorrect, correctAnswers: question.type === 'single-choice' ? correctAnswers[0] : correctAnswers }
    });
  } catch (error) {
    next(error);
  }
};

exports.completeQuiz = async (req, res, next) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorResponse('Invalid quiz ID format', 400));
    }

    const quiz = await Quiz.findById(req.params.id).populate('questions.question');

    if (!quiz) {
      return next(new ErrorResponse('Quiz not found. It may have been deleted.', 404));
    }

    if (quiz.user.toString() !== req.user.id) {
      return next(new ErrorResponse('You are not authorized to complete this quiz', 403));
    }

    if (quiz.status === 'completed') {
      return next(new ErrorResponse('This quiz has already been completed', 400));
    }

    quiz.status = 'completed';
    quiz.completedAt = Date.now();
    quiz.totalTime = Math.floor((quiz.completedAt - quiz.startedAt) / 1000);

    await quiz.save();

    const user = await User.findById(req.user.id);
    user.stats.totalQuizzes += 1;
    user.stats.totalQuestions += quiz.questions.length;
    user.stats.correctAnswers += quiz.score.correct;
    user.stats.totalScore += quiz.score.percentage;
    user.updateAverageScore();
    await user.save();

    const progress = await Progress.findOne({ user: req.user.id });
    if (progress) {
      // Only update category progress if a specific category was selected
      if (quiz.settings.category) {
        const categoryIndex = progress.categoryProgress.findIndex(cp => cp.category === quiz.settings.category);
        if (categoryIndex > -1) {
          progress.categoryProgress[categoryIndex].questionsAttempted += quiz.questions.length;
          progress.categoryProgress[categoryIndex].questionsCorrect += quiz.score.correct;
          progress.categoryProgress[categoryIndex].averageScore = Math.round(
            (progress.categoryProgress[categoryIndex].questionsCorrect / progress.categoryProgress[categoryIndex].questionsAttempted) * 100
          );
          progress.categoryProgress[categoryIndex].lastAttempted = Date.now();
        } else {
          progress.categoryProgress.push({
            category: quiz.settings.category,
            questionsAttempted: quiz.questions.length,
            questionsCorrect: quiz.score.correct,
            averageScore: Math.round((quiz.score.correct / quiz.questions.length) * 100),
            lastAttempted: Date.now()
          });
        }
      }

      progress.recentActivity.unshift({
        date: Date.now(),
        questionsAnswered: quiz.questions.length,
        score: quiz.score.percentage,
        timeSpent: quiz.totalTime
      });

      if (progress.recentActivity.length > 30) {
        progress.recentActivity = progress.recentActivity.slice(0, 30);
      }

      progress.totalTimeSpent += quiz.totalTime;
      progress.updateAreas();
      await progress.save();
    }

    for (const q of quiz.questions) {
      await Question.findByIdAndUpdate(q.question._id, {
        $inc: {
          'statistics.timesAnswered': 1,
          'statistics.timesCorrect': q.isCorrect ? 1 : 0
        }
      });
    }

    res.status(200).json({
      success: true,
      message: `Quiz completed! You scored ${quiz.score.percentage}% (${quiz.score.correct}/${quiz.questions.length} correct)`,
      data: { quiz }
    });
  } catch (error) {
    next(error);
  }
};

exports.getQuiz = async (req, res, next) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorResponse('Invalid quiz ID format', 400));
    }

    const quiz = await Quiz.findById(req.params.id)
      .populate('questions.question')
      .populate('user', 'username');

    if (!quiz) {
      return next(new ErrorResponse('Quiz not found. It may have been deleted.', 404));
    }

    if (quiz.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('You do not have permission to view this quiz', 403));
    }

    res.status(200).json({ 
      success: true, 
      data: { quiz } 
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserQuizzes = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { user: req.user.id };
    if (status) query.status = status;

    const quizzes = await Quiz.find(query)
      .populate('questions.question', 'questionText category difficulty')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Quiz.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        quizzes,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      }
    });
  } catch (error) {
    next(error);
  }
};