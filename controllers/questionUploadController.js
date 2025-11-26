const XLSX = require('xlsx');
const Question = require('../models/Question');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Upload questions from Excel file
// @route   POST /api/questions/upload
// @access  Private (Admin only)
exports.uploadQuestionsFromExcel = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ErrorResponse('Please upload an Excel file', 400));
    }

    // Parse Excel file
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      return next(new ErrorResponse('Excel file is empty', 400));
    }

    const results = {
      total: data.length,
      successful: 0,
      failed: 0,
      errors: []
    };

    // Process each row
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowNumber = i + 2; // Excel row number (accounting for header)

      try {
        // Validate required fields
        if (!row.question || !row.category) {
          results.failed++;
          results.errors.push({
            row: rowNumber,
            error: 'Missing required fields (question, category)'
          });
          continue;
        }

        // Parse options from separate columns (optionA, optionB, optionC, optionD, etc.)
        let optionsArray = [];
        const optionKeys = ['optionA', 'optionB', 'optionC', 'optionD', 'optionE', 'optionF'];
        
        for (const key of optionKeys) {
          if (row[key] && String(row[key]).trim()) {
            optionsArray.push(String(row[key]).trim());
          }
        }

        if (optionsArray.length < 2) {
          results.failed++;
          results.errors.push({
            row: rowNumber,
            error: 'At least 2 options are required (optionA, optionB, etc.)'
          });
          continue;
        }

        // Parse correct answer (can be index or text)
        let correctAnswerIndex;
        if (row.correctAnswer !== undefined && row.correctAnswer !== null) {
          const answerStr = String(row.correctAnswer).trim();
          // Check if it's a number (index)
          if (!isNaN(answerStr)) {
            correctAnswerIndex = parseInt(answerStr);
          } else {
            // Find index of matching option
            correctAnswerIndex = optionsArray.findIndex(opt => 
              opt.toLowerCase() === answerStr.toLowerCase()
            );
            if (correctAnswerIndex === -1) {
              results.failed++;
              results.errors.push({
                row: rowNumber,
                error: `Correct answer "${answerStr}" not found in options`
              });
              continue;
            }
          }
        } else {
          results.failed++;
          results.errors.push({
            row: rowNumber,
            error: 'Correct answer is required'
          });
          continue;
        }

        if (correctAnswerIndex < 0 || correctAnswerIndex >= optionsArray.length) {
          results.failed++;
          results.errors.push({
            row: rowNumber,
            error: `Correct answer index ${correctAnswerIndex} is out of range`
          });
          continue;
        }

        // Parse tags (comma-separated)
        let tags = [];
        if (row.tags) {
          tags = row.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
        }

        // Create question object matching the Question model
        const questionData = {
          questionText: new Map([['en', row.question.trim()]]),
          type: row.type || 'single-choice',
          options: optionsArray.map((opt, idx) => ({
            text: new Map([['en', opt]]),
            isCorrect: idx === correctAnswerIndex
          })),
          category: row.category.trim().toLowerCase(),
          difficulty: row.difficulty ? row.difficulty.trim().toLowerCase() : 'foundation',
          tags,
          points: row.points ? parseInt(row.points) : 1,
          status: row.status || 'published',
          createdBy: req.user.id
        };

        // Add explanation if provided
        if (row.explanation) {
          questionData.explanation = new Map([['en', row.explanation.trim()]]);
        }

        // Create question in database
        await Question.create(questionData);
        results.successful++;

      } catch (error) {
        results.failed++;
        results.errors.push({
          row: rowNumber,
          error: error.message
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Processed ${results.total} questions: ${results.successful} successful, ${results.failed} failed`,
      data: results
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Download Excel template
// @route   GET /api/questions/template
// @access  Private (Admin only)
exports.downloadTemplate = async (req, res, next) => {
  try {
    // Create sample data with separate option columns
    const templateData = [
      {
        question: 'What is the primary goal of software testing?',
        optionA: 'Find defects',
        optionB: 'Prove software works',
        optionC: 'Meet deadlines',
        optionD: 'Write documentation',
        correctAnswer: 0,
        category: 'fundamentals',
        difficulty: 'foundation',
        explanation: 'The primary goal is to find defects before release',
        tags: 'basics, testing-goals',
        points: 1,
        type: 'single-choice',
        status: 'published'
      },
      {
        question: 'Which testing technique uses equivalence partitioning?',
        optionA: 'Black-box',
        optionB: 'White-box',
        optionC: 'Gray-box',
        optionD: 'Performance',
        correctAnswer: 0,
        category: 'test-techniques',
        difficulty: 'foundation',
        explanation: 'Equivalence partitioning is a black-box testing technique',
        tags: 'black-box, techniques',
        points: 2,
        type: 'single-choice',
        status: 'published'
      }
    ];

    // Create workbook
    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Questions');

    // Set column widths
    ws['!cols'] = [
      { wch: 50 }, // question
      { wch: 30 }, // optionA
      { wch: 30 }, // optionB
      { wch: 30 }, // optionC
      { wch: 30 }, // optionD
      { wch: 15 }, // correctAnswer
      { wch: 15 }, // category
      { wch: 12 }, // difficulty
      { wch: 50 }, // explanation
      { wch: 20 }, // tags
      { wch: 10 }, // points
      { wch: 15 }, // type
      { wch: 12 }  // status
    ];

    // Generate buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Set headers for download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=questions_template.xlsx');
    
    res.send(buffer);

  } catch (error) {
    next(error);
  }
};

// @desc    Get upload statistics
// @route   GET /api/questions/upload/stats
// @access  Private (Admin only)
exports.getUploadStats = async (req, res, next) => {
  try {
    const stats = await Question.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPoints: { $avg: '$points' }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    const totalQuestions = await Question.countDocuments();
    const activeQuestions = await Question.countDocuments({ status: 'published' });

    res.status(200).json({
      success: true,
      data: {
        total: totalQuestions,
        active: activeQuestions,
        inactive: totalQuestions - activeQuestions,
        byCategory: stats
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get all unique categories
// @route   GET /api/questions/upload/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Question.distinct('category');
    
    res.status(200).json({
      success: true,
      data: categories.sort()
    });

  } catch (error) {
    next(error);
  }
};
