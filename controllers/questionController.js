const Question = require('../models/Question');
const ErrorResponse = require('../utils/errorResponse');
const mongoose = require('mongoose');

exports.getQuestions = async (req, res, next) => {
  try {
    const { category, difficulty, language, tags, status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (tags) query.tags = { $in: tags.split(',') };
    if (status && req.user?.role === 'admin') query.status = status;
    else query.status = 'published';

    const questions = await Question.find(query)
      .populate('createdBy', 'username')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Question.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        questions,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getQuestion = async (req, res, next) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorResponse('Invalid question ID format', 400));
    }

    const question = await Question.findById(req.params.id)
      .populate('createdBy', 'username')
      .populate('contributors.user', 'username');

    if (!question) {
      return next(new ErrorResponse('Question not found. It may have been deleted or is not yet published.', 404));
    }

    res.status(200).json({ 
      success: true, 
      data: { question } 
    });
  } catch (error) {
    next(error);
  }
};

exports.createQuestion = async (req, res, next) => {
  try {
    const { questionText, options, category, difficulty } = req.body;

    // Validate required fields
    if (!questionText || !options || !category || !difficulty) {
      return next(new ErrorResponse('Please provide all required fields: questionText, options, category, and difficulty', 400));
    }

    // Validate options array
    if (!Array.isArray(options) || options.length < 2) {
      return next(new ErrorResponse('Please provide at least 2 options for the question', 400));
    }

    // Validate that at least one option is marked as correct
    const hasCorrectAnswer = options.some(opt => opt.isCorrect === true);
    if (!hasCorrectAnswer) {
      return next(new ErrorResponse('Please mark at least one option as correct', 400));
    }

    const questionData = { ...req.body, createdBy: req.user.id };
    const question = await Question.create(questionData);

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      data: { question }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateQuestion = async (req, res, next) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorResponse('Invalid question ID format', 400));
    }

    let question = await Question.findById(req.params.id);

    if (!question) {
      return next(new ErrorResponse('Question not found. It may have been deleted.', 404));
    }

    if (question.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('You do not have permission to update this question. Only the creator or an admin can modify it.', 403));
    }

    question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ 
      success: true,
      message: 'Question updated successfully',
      data: { question } 
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteQuestion = async (req, res, next) => {
  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorResponse('Invalid question ID format', 400));
    }

    const question = await Question.findById(req.params.id);

    if (!question) {
      return next(new ErrorResponse('Question not found. It may have been already deleted.', 404));
    }

    if (question.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('You do not have permission to delete this question. Only the creator or an admin can delete it.', 403));
    }

    await question.deleteOne();

    res.status(200).json({ 
      success: true, 
      message: 'Question deleted successfully' 
    });
  } catch (error) {
    next(error);
  }
};

exports.voteQuestion = async (req, res, next) => {
  try {
    const { voteType } = req.body;

    // Validate voteType
    if (!voteType || !['up', 'down'].includes(voteType)) {
      return next(new ErrorResponse('Please provide a valid vote type: "up" or "down"', 400));
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorResponse('Invalid question ID format', 400));
    }

    const question = await Question.findById(req.params.id);

    if (!question) {
      return next(new ErrorResponse('Question not found. It may have been deleted.', 404));
    }

    if (voteType === 'up') {
      question.votes.upvotes += 1;
    } else if (voteType === 'down') {
      question.votes.downvotes += 1;
    }

    await question.save();

    res.status(200).json({ 
      success: true,
      message: `Vote recorded successfully`,
      data: { votes: question.votes } 
    });
  } catch (error) {
    next(error);
  }
};

exports.flagQuestion = async (req, res, next) => {
  try {
    const { reason } = req.body;

    // Validate reason
    if (!reason || reason.trim().length < 10) {
      return next(new ErrorResponse('Please provide a detailed reason for flagging (at least 10 characters)', 400));
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorResponse('Invalid question ID format', 400));
    }

    const question = await Question.findById(req.params.id);

    if (!question) {
      return next(new ErrorResponse('Question not found. It may have been deleted.', 404));
    }

    // Check if user already flagged this question
    const alreadyFlagged = question.flags.some(flag => flag.user.toString() === req.user.id);
    if (alreadyFlagged) {
      return next(new ErrorResponse('You have already flagged this question', 400));
    }

    question.flags.push({ user: req.user.id, reason });
    if (question.flags.length >= 3) {
      question.status = 'flagged';
    }

    await question.save();

    res.status(200).json({ 
      success: true, 
      message: 'Question flagged successfully. Our team will review it.' 
    });
  } catch (error) {
    next(error);
  }
};