// MySQL Models
const { Quiz, QuizQuestion, QuizAnswer, Question, QuestionTranslation, QuestionOption, QuestionOptionTranslation, User, Progress, CategoryProgress, RecentActivity, sequelize } = require('../models/mysql');
const ErrorResponse = require('../utils/errorResponse');
const { Op } = require('sequelize');
const { transformQuestionToAPI } = require('../utils/questionHelpers');

exports.startQuiz = async (req, res, next) => {
  try {
    const { mode, category, difficulty, numberOfQuestions = 10, timeLimit, language = 'en' } = req.body;

    // Check if user has an in-progress quiz
    const existingQuiz = await Quiz.findOne({ 
      where: { 
        userId: req.user.id, 
        status: 'in-progress' 
      }
    });

    if (existingQuiz) {
      return next(new ErrorResponse('You have an unfinished quiz. Please complete or abandon it before starting a new one.', 400));
    }

    // Validate numberOfQuestions
    if (numberOfQuestions < 1 || numberOfQuestions > 100) {
      return next(new ErrorResponse('Number of questions must be between 1 and 100', 400));
    }

    const where = { status: 'published' };
    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;

    const totalAvailable = await Question.count({ where });
    
    if (totalAvailable === 0) {
      return next(new ErrorResponse('No questions available for the selected criteria. Please try different filters.', 404));
    }

    const limit = Math.min(numberOfQuestions, totalAvailable);

    // Get random questions
    const questions = await Question.findAll({
      where,
      order: sequelize.random(),
      limit,
      include: [
        { model: QuestionTranslation, as: 'translations' },
        { 
          model: QuestionOption, 
          as: 'options',
          include: [{ model: QuestionOptionTranslation, as: 'translations' }]
        }
      ]
    });

    if (questions.length === 0) {
      return next(new ErrorResponse('Unable to generate quiz. Please try again.', 500));
    }

    // Create quiz and questions in transaction
    const result = await sequelize.transaction(async (t) => {
      const quiz = await Quiz.create({
        userId: req.user.id,
        mode,
        category,
        difficulty,
        numberOfQuestions: questions.length,
        timeLimit,
        language,
        status: 'in-progress'
      }, { transaction: t });

      // Create quiz questions
      for (let i = 0; i < questions.length; i++) {
        await QuizQuestion.create({
          quizId: quiz.id,
          questionId: questions[i].id,
          questionOrder: i
        }, { transaction: t });
      }

      return quiz;
    });

    // Fetch complete quiz with questions
    const completeQuiz = await Quiz.findByPk(result.id, {
      include: [{
        model: QuizQuestion,
        as: 'quizQuestions',
        include: [{
          model: Question,
          as: 'question',
          include: [
            { model: QuestionTranslation, as: 'translations' },
            { 
              model: QuestionOption, 
              as: 'options',
              include: [{ model: QuestionOptionTranslation, as: 'translations' }]
            }
          ]
        }],
        order: [['questionOrder', 'ASC']]
      }]
    });

    res.status(201).json({
      status: 'success',
      message: 'Quiz started successfully',
      data: { quiz: completeQuiz }
    });
  } catch (error) {
    next(error);
  }
};

exports.answerQuestion = async (req, res, next) => {
  try {
    const { quizId, questionId, answer, timeSpent } = req.body;
    
    console.log('Answer request:', { quizId, questionId, answer, timeSpent });

    // Validate required fields
    if (!quizId || !questionId || answer === undefined) {
      return next(new ErrorResponse('Please provide quizId, questionId, and answer', 400));
    }

    const quiz = await Quiz.findByPk(quizId, {
      include: [{
        model: QuizQuestion,
        as: 'quizQuestions',
        include: [{
          model: Question,
          as: 'question',
          include: [{ model: QuestionOption, as: 'options' }]
        }]
      }]
    });
    
    console.log('Quiz found:', quiz ? 'Yes' : 'No');

    if (!quiz) {
      return next(new ErrorResponse('Quiz not found. It may have been deleted or expired.', 404));
    }

    if (quiz.userId !== req.user.id) {
      return next(new ErrorResponse('You are not authorized to answer questions in this quiz', 403));
    }

    if (quiz.status !== 'in-progress') {
      return next(new ErrorResponse(`This quiz is ${quiz.status}. You can only answer questions in an active quiz.`, 400));
    }

    const quizQuestion = quiz.quizQuestions.find(qq => qq.questionId === parseInt(questionId));

    if (!quizQuestion) {
      return next(new ErrorResponse('This question is not part of the current quiz', 404));
    }

    const question = quizQuestion.question;
    
    // Debug logging
    console.log('Question options:', question.options);
    
    const correctAnswers = question.options
      .filter(opt => opt.isCorrect)
      .map(opt => opt.optionIndex);

    const userAnswerArray = Array.isArray(answer) ? answer : [answer];
    
    console.log('correctAnswers:', correctAnswers);
    console.log('userAnswerArray before validation:', userAnswerArray);
    
    // Filter out null/undefined values
    const validAnswers = userAnswerArray.filter(a => a !== null && a !== undefined);
    console.log('validAnswers after filtering:', validAnswers);
    
    if (validAnswers.length === 0) {
      return next(new ErrorResponse('No valid answer provided', 400));
    }
    
    const isCorrect = JSON.stringify(validAnswers.sort()) === JSON.stringify(correctAnswers.sort());

    // Update quiz question
    quizQuestion.isCorrect = isCorrect;
    quizQuestion.timeSpent = timeSpent || 0;
    quizQuestion.answeredAt = new Date();
    await quizQuestion.save();

    // Save user answers
    console.log('Saving answers for quizQuestion.id:', quizQuestion.id);
    console.log('Valid answers to save:', validAnswers);
    
    await QuizAnswer.destroy({ where: { quizQuestionId: quizQuestion.id } });
    
    for (const ans of validAnswers) {
      console.log('Creating answer with optionIndex:', ans, 'Type:', typeof ans);
      
      await QuizAnswer.create({
        quizQuestionId: quizQuestion.id,
        optionIndex: parseInt(ans)
      });
    }

    res.status(200).json({
      status: 'success',
      data: { 
        isCorrect, 
        correctAnswers: question.type === 'single-choice' ? correctAnswers[0] : correctAnswers 
      }
    });
  } catch (error) {
    console.error('Error in answerQuestion:', error);
    next(error);
  }
};

exports.completeQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id, {
      include: [{
        model: QuizQuestion,
        as: 'quizQuestions',
        include: [{
          model: Question,
          as: 'question'
        }]
      }]
    });

    if (!quiz) {
      return next(new ErrorResponse('Quiz not found. It may have been deleted.', 404));
    }

    if (quiz.userId !== req.user.id) {
      return next(new ErrorResponse('You are not authorized to complete this quiz', 403));
    }

    if (quiz.status === 'completed') {
      return next(new ErrorResponse('This quiz has already been completed', 400));
    }

    // Calculate score
    const totalQuestions = quiz.quizQuestions.length;
    const correctAnswers = quiz.quizQuestions.filter(qq => qq.isCorrect === true).length;
    const incorrectAnswers = quiz.quizQuestions.filter(qq => qq.isCorrect === false).length;
    const unanswered = quiz.quizQuestions.filter(qq => qq.isCorrect === null).length;
    const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    console.log('Scoring:', { totalQuestions, correctAnswers, incorrectAnswers, unanswered, percentage });

    // Update quiz with correct field names
    quiz.status = 'completed';
    quiz.completedAt = new Date();
    quiz.totalTime = Math.floor((quiz.completedAt - quiz.createdAt) / 1000);
    quiz.correctCount = correctAnswers;
    quiz.incorrectCount = incorrectAnswers;
    quiz.unansweredCount = unanswered;
    quiz.percentage = percentage;
    quiz.totalPoints = correctAnswers * 10; // Assuming 10 points per question
    await quiz.save();

    // Update user stats
    const user = await User.findByPk(req.user.id);
    user.totalQuizzes += 1;
    user.totalQuestions += totalQuestions;
    user.correctAnswers += correctAnswers;
    user.totalScore += quiz.totalPoints;
    user.updateAverageScore();
    await user.save();

    // Update progress
    const progress = await Progress.findOne({ where: { userId: req.user.id } });
    if (progress) {
      // Update category progress if specific category
      if (quiz.category) {
        let categoryProgress = await CategoryProgress.findOne({
          where: {
            progressId: progress.id,
            category: quiz.category
          }
        });

        if (categoryProgress) {
          categoryProgress.questionsAttempted += totalQuestions;
          categoryProgress.questionsCorrect += correctAnswers;
          categoryProgress.averageScore = Math.round(
            (categoryProgress.questionsCorrect / categoryProgress.questionsAttempted) * 100
          );
          categoryProgress.lastAttempted = new Date();
          await categoryProgress.save();
        } else {
          await CategoryProgress.create({
            progressId: progress.id,
            category: quiz.category,
            questionsAttempted: totalQuestions,
            questionsCorrect: correctAnswers,
            averageScore: percentage,
            lastAttempted: new Date()
          });
        }
      }

      // Add recent activity
      await RecentActivity.create({
        progressId: progress.id,
        activityDate: new Date().toISOString().split('T')[0],
        questionsAnswered: totalQuestions,
        score: percentage,
        timeSpent: quiz.totalTime
      });

      // Update total time
      progress.totalTimeSpent += quiz.totalTime;
      await progress.save();
    }

    // Update question statistics
    for (const qq of quiz.quizQuestions) {
      const question = await Question.findByPk(qq.questionId);
      question.timesAnswered += 1;
      if (qq.isCorrect) {
        question.timesCorrect += 1;
      }
      await question.save();
    }

    res.status(200).json({
      success: true,
      message: `Quiz completed! You scored ${percentage}% (${correctAnswers}/${totalQuestions} correct)`,
      data: { quiz }
    });
  } catch (error) {
    next(error);
  }
};

exports.getQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id, {
      include: [
        {
          model: QuizQuestion,
          as: 'quizQuestions',
          include: [{
            model: Question,
            as: 'question',
            include: [
              { model: QuestionTranslation, as: 'translations' },
              { 
                model: QuestionOption, 
                as: 'options',
                include: [{ model: QuestionOptionTranslation, as: 'translations' }]
              }
            ]
          }],
          order: [['questionOrder', 'ASC']]
        },
        { model: User, as: 'user', attributes: ['id', 'username'] }
      ]
    });

    if (!quiz) {
      return next(new ErrorResponse('Quiz not found. It may have been deleted.', 404));
    }

    if (quiz.userId !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('You do not have permission to view this quiz', 403));
    }

    // Transform quiz data to include text from translations
    console.log('========== Starting quiz transformation ==========');
    const transformedQuiz = quiz.toJSON();
    console.log('Quiz has', transformedQuiz.quizQuestions?.length, 'questions');
    
    if (transformedQuiz.quizQuestions && transformedQuiz.quizQuestions.length > 0) {
      const firstQ = transformedQuiz.quizQuestions[0].question;
      console.log('First question translations:', firstQ.translations);
      console.log('First question options count:', firstQ.options?.length);
      if (firstQ.options && firstQ.options.length > 0) {
        console.log('First option raw:', JSON.stringify(firstQ.options[0], null, 2));
      }
    }
    
    transformedQuiz.quizQuestions = transformedQuiz.quizQuestions.map(qq => {
      const question = qq.question;
      
      // Get English translation or first available
      const questionTranslation = question.translations?.find(t => t.language === 'en') || question.translations?.[0];
      question.questionText = questionTranslation?.questionText || question.questionText || '';
      question.explanation = questionTranslation?.explanation || question.explanation || '';
      
      // Transform options
      if (question.options) {
        question.options = question.options.map(opt => {
          const optTranslation = opt.translations?.find(t => t.language === 'en') || opt.translations?.[0];
          console.log('Option', opt.optionIndex, '- Translation:', optTranslation);
          return {
            id: opt.id,
            optionIndex: opt.optionIndex,
            text: optTranslation?.optionText || optTranslation?.text || opt.text || `Option ${opt.optionIndex}`,
            isCorrect: opt.isCorrect
          };
        });
      }
      
      return qq;
    });
    
    console.log('Sample transformed options:', transformedQuiz.quizQuestions[0]?.question?.options);
    console.log('========== End quiz transformation ==========');

    res.status(200).json({ 
      success: true, 
      data: { quiz: transformedQuiz } 
    });
  } catch (error) {
    next(error);
  }
};

exports.getUserQuizzes = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const where = { userId: req.user.id };
    if (status) where.status = status;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: quizzes } = await Quiz.findAndCountAll({
      where,
      include: [{
        model: QuizQuestion,
        as: 'quizQuestions',
        include: [{
          model: Question,
          as: 'question',
          attributes: ['id', 'category', 'difficulty'],
          include: [{ model: QuestionTranslation, as: 'translations' }]
        }]
      }],
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      status: 'success',
      data: {
        quizzes,
        totalPages: Math.ceil(count / parseInt(limit)),
        currentPage: parseInt(page),
        total: count
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getInProgressQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findOne({ 
      where: { 
        userId: req.user.id, 
        status: 'in-progress' 
      },
      include: [{
        model: QuizQuestion,
        as: 'quizQuestions',
        include: [{
          model: Question,
          as: 'question',
          include: [
            { model: QuestionTranslation, as: 'translations' },
            { 
              model: QuestionOption, 
              as: 'options',
              include: [{ model: QuestionOptionTranslation, as: 'translations' }]
            }
          ]
        }],
        order: [['questionOrder', 'ASC']]
      }],
      order: [['createdAt', 'DESC']]
    });

    // Transform quiz data to include text from translations (same as getQuiz)
    if (quiz) {
      const transformedQuiz = quiz.toJSON();
      transformedQuiz.quizQuestions = transformedQuiz.quizQuestions.map(qq => {
        const question = qq.question;
        
        // Get English translation or first available
        const questionTranslation = question.translations?.find(t => t.language === 'en') || question.translations?.[0];
        question.questionText = questionTranslation?.questionText || question.questionText || '';
        question.explanation = questionTranslation?.explanation || question.explanation || '';
        
        // Transform options
        if (question.options) {
          question.options = question.options.map(opt => {
            const optTranslation = opt.translations?.find(t => t.language === 'en') || opt.translations?.[0];
            return {
              id: opt.id,
              optionIndex: opt.optionIndex,
              text: optTranslation?.optionText || optTranslation?.text || opt.text || `Option ${opt.optionIndex}`,
              isCorrect: opt.isCorrect
            };
          });
        }
        
        return qq;
      });
      
      return res.status(200).json({
        success: true,
        data: { quiz: transformedQuiz }
      });
    }

    res.status(200).json({
      success: true,
      data: { quiz }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;
