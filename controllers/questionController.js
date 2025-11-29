// MySQL Models
const { Question, QuestionTranslation, QuestionOption, QuestionOptionTranslation, QuestionTag, User, sequelize } = require('../models/mysql');
const ErrorResponse = require('../utils/errorResponse');
const { Op } = require('sequelize');
const { transformQuestionToAPI, transformQuestionsToAPI, extractTranslations, extractOptionTranslations, getLanguagesFromData, validateQuestionData } = require('../utils/questionHelpers');

exports.getQuestions = async (req, res, next) => {
  try {
    const { category, difficulty, language = 'en', tags, status, page = 1, limit = 20 } = req.query;

    const where = {};
    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;
    if (status && req.user?.role === 'admin') where.status = status;
    else where.status = 'published';

    const include = [
      { model: QuestionTranslation, as: 'translations' },
      { 
        model: QuestionOption, 
        as: 'options',
        include: [{ model: QuestionOptionTranslation, as: 'translations' }]
      },
      { model: User, as: 'creator', attributes: ['id', 'username'] }
    ];

    // Handle tags filtering
    if (tags) {
      include.push({
        model: QuestionTag,
        as: 'tags',
        where: { tag: { [Op.in]: tags.split(',') } },
        required: true
      });
    } else {
      include.push({ model: QuestionTag, as: 'tags' });
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: questions } = await Question.findAndCountAll({
      where,
      include,
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']],
      distinct: true
    });

    // Transform to API format
    const transformedQuestions = transformQuestionsToAPI(questions);

    res.status(200).json({
      status: 'success',
      data: {
        questions: transformedQuestions,
        totalPages: Math.ceil(count / parseInt(limit)),
        currentPage: parseInt(page),
        total: count
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getQuestion = async (req, res, next) => {
  try {
    const question = await Question.findByPk(req.params.id, {
      include: [
        { model: QuestionTranslation, as: 'translations' },
        { 
          model: QuestionOption, 
          as: 'options',
          include: [{ model: QuestionOptionTranslation, as: 'translations' }]
        },
        { model: QuestionTag, as: 'tags' },
        { model: User, as: 'creator', attributes: ['id', 'username'] }
      ]
    });

    if (!question) {
      return next(new ErrorResponse('Question not found. It may have been deleted or is not yet published.', 404));
    }

    // Transform to API format
    const transformedQuestion = transformQuestionToAPI(question);

    res.status(200).json({ 
      success: true, 
      data: { question: transformedQuestion } 
    });
  } catch (error) {
    next(error);
  }
};

exports.createQuestion = async (req, res, next) => {
  try {
    const { questionText, explanation, options, category, difficulty, type = 'single-choice', tags, syllabus, points = 10 } = req.body;

    // Validate question data
    const validation = validateQuestionData(req.body);
    if (!validation.isValid) {
      return next(new ErrorResponse(validation.errors.join(', '), 400));
    }

    // Get all languages from the data
    const languages = getLanguagesFromData(req.body);

    // Create question and related data in a transaction
    const result = await sequelize.transaction(async (t) => {
      // 1. Create main question
      const question = await Question.create({
        type,
        category,
        difficulty,
        syllabus,
        points,
        status: 'published',
        createdBy: req.user.id
      }, { transaction: t });

      // 2. Create translations for each language
      for (const lang of languages) {
        const translations = extractTranslations(req.body, lang);
        await QuestionTranslation.create({
          questionId: question.id,
          language: lang,
          questionText: translations.questionText,
          explanation: translations.explanation
        }, { transaction: t });
      }

      // 3. Create options and their translations
      const optionsData = extractOptionTranslations(options, 'en');
      for (let i = 0; i < optionsData.length; i++) {
        const option = await QuestionOption.create({
          questionId: question.id,
          optionIndex: i,
          isCorrect: optionsData[i].isCorrect
        }, { transaction: t });

        // Create option translations for each language
        for (const lang of languages) {
          const langOptions = extractOptionTranslations(options, lang);
          await QuestionOptionTranslation.create({
            optionId: option.id,
            language: lang,
            optionText: langOptions[i].text
          }, { transaction: t });
        }
      }

      // 4. Create tags if provided
      if (tags && Array.isArray(tags) && tags.length > 0) {
        await QuestionTag.bulkCreate(
          tags.map(tag => ({ questionId: question.id, tag })),
          { transaction: t }
        );
      }

      return question;
    });

    // Fetch the complete question with all relations
    const completeQuestion = await Question.findByPk(result.id, {
      include: [
        { model: QuestionTranslation, as: 'translations' },
        { 
          model: QuestionOption, 
          as: 'options',
          include: [{ model: QuestionOptionTranslation, as: 'translations' }]
        },
        { model: QuestionTag, as: 'tags' }
      ]
    });

    const transformedQuestion = transformQuestionToAPI(completeQuestion);

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      data: { question: transformedQuestion }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateQuestion = async (req, res, next) => {
  try {
    const question = await Question.findByPk(req.params.id);

    if (!question) {
      return next(new ErrorResponse('Question not found. It may have been deleted.', 404));
    }

    if (question.createdBy !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('You do not have permission to update this question. Only the creator or an admin can modify it.', 403));
    }

    const { questionText, explanation, options, category, difficulty, type, tags, syllabus, points, status } = req.body;

    // Update in transaction
    await sequelize.transaction(async (t) => {
      // Update main question fields
      await question.update({
        ...(type && { type }),
        ...(category && { category }),
        ...(difficulty && { difficulty }),
        ...(syllabus && { syllabus }),
        ...(points && { points }),
        ...(status && { status })
      }, { transaction: t });

      // Update translations if provided
      if (questionText || explanation) {
        const languages = getLanguagesFromData(req.body);
        
        // Delete old translations
        await QuestionTranslation.destroy({
          where: { questionId: question.id },
          transaction: t
        });

        // Create new translations
        for (const lang of languages) {
          const translations = extractTranslations(req.body, lang);
          await QuestionTranslation.create({
            questionId: question.id,
            language: lang,
            questionText: translations.questionText,
            explanation: translations.explanation
          }, { transaction: t });
        }
      }

      // Update options if provided
      if (options && Array.isArray(options)) {
        const languages = getLanguagesFromData(req.body);
        
        // Delete old options (CASCADE will delete translations)
        await QuestionOption.destroy({
          where: { questionId: question.id },
          transaction: t
        });

        // Create new options
        const optionsData = extractOptionTranslations(options, 'en');
        for (let i = 0; i < optionsData.length; i++) {
          const option = await QuestionOption.create({
            questionId: question.id,
            optionIndex: i,
            isCorrect: optionsData[i].isCorrect
          }, { transaction: t });

          // Create option translations
          for (const lang of languages) {
            const langOptions = extractOptionTranslations(options, lang);
            await QuestionOptionTranslation.create({
              optionId: option.id,
              language: lang,
              optionText: langOptions[i].text
            }, { transaction: t });
          }
        }
      }

      // Update tags if provided
      if (tags && Array.isArray(tags)) {
        await QuestionTag.destroy({
          where: { questionId: question.id },
          transaction: t
        });

        if (tags.length > 0) {
          await QuestionTag.bulkCreate(
            tags.map(tag => ({ questionId: question.id, tag })),
            { transaction: t }
          );
        }
      }
    });

    // Fetch updated question
    const updatedQuestion = await Question.findByPk(question.id, {
      include: [
        { model: QuestionTranslation, as: 'translations' },
        { 
          model: QuestionOption, 
          as: 'options',
          include: [{ model: QuestionOptionTranslation, as: 'translations' }]
        },
        { model: QuestionTag, as: 'tags' }
      ]
    });

    const transformedQuestion = transformQuestionToAPI(updatedQuestion);

    res.status(200).json({ 
      success: true,
      message: 'Question updated successfully',
      data: { question: transformedQuestion } 
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findByPk(req.params.id);

    if (!question) {
      return next(new ErrorResponse('Question not found. It may have been already deleted.', 404));
    }

    if (question.createdBy !== req.user.id && req.user.role !== 'admin') {
      return next(new ErrorResponse('You do not have permission to delete this question. Only the creator or an admin can delete it.', 403));
    }

    await question.destroy();

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

    const question = await Question.findByPk(req.params.id);

    if (!question) {
      return next(new ErrorResponse('Question not found. It may have been deleted.', 404));
    }

    if (voteType === 'up') {
      question.upvotes += 1;
    } else if (voteType === 'down') {
      question.downvotes += 1;
    }

    await question.save();

    res.status(200).json({ 
      success: true,
      message: `Vote recorded successfully`,
      data: { votes: { upvotes: question.upvotes, downvotes: question.downvotes } } 
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

    const question = await Question.findByPk(req.params.id);

    if (!question) {
      return next(new ErrorResponse('Question not found. It may have been deleted.', 404));
    }

    // For now, just mark as flagged (can implement flags table later)
    question.status = 'flagged';
    await question.save();

    res.status(200).json({ 
      success: true, 
      message: 'Question flagged successfully. Our team will review it.' 
    });
  } catch (error) {
    next(error);
  }
};