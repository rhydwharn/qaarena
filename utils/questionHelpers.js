/**
 * Helper functions for transforming question data between MySQL and API formats
 */

/**
 * Transform MySQL question to API format
 * Converts separate translation tables back to Map-like structure
 */
exports.transformQuestionToAPI = (question) => {
  if (!question) return null;

  const result = {
    id: question.id,
    type: question.type,
    category: question.category,
    difficulty: question.difficulty,
    syllabus: question.syllabus,
    points: question.points,
    status: question.status,
    upvotes: question.upvotes,
    downvotes: question.downvotes,
    createdBy: question.createdBy,
    createdAt: question.createdAt,
    updatedAt: question.updatedAt
  };

  // Transform translations to Map format
  if (question.translations && question.translations.length > 0) {
    result.questionText = {};
    result.explanation = {};
    
    question.translations.forEach(trans => {
      result.questionText[trans.language] = trans.questionText;
      if (trans.explanation) {
        result.explanation[trans.language] = trans.explanation;
      }
    });
  }

  // Transform options
  if (question.options && question.options.length > 0) {
    result.options = question.options.map(option => {
      const optionData = {
        isCorrect: option.isCorrect,
        text: {}
      };

      // Transform option translations
      if (option.translations && option.translations.length > 0) {
        option.translations.forEach(trans => {
          optionData.text[trans.language] = trans.optionText;
        });
      }

      return optionData;
    });
  }

  // Transform tags
  if (question.tags && question.tags.length > 0) {
    result.tags = question.tags.map(t => t.tag);
  }

  // Transform creator
  if (question.creator) {
    result.createdBy = {
      id: question.creator.id,
      username: question.creator.username
    };
  }

  // Statistics
  result.statistics = {
    timesAnswered: question.timesAnswered,
    timesCorrect: question.timesCorrect,
    averageTime: question.averageTime
  };

  // Success rate (virtual field)
  result.successRate = question.getSuccessRate ? question.getSuccessRate() : 0;

  return result;
};

/**
 * Transform multiple questions to API format
 */
exports.transformQuestionsToAPI = (questions) => {
  if (!questions || !Array.isArray(questions)) return [];
  return questions.map(q => exports.transformQuestionToAPI(q));
};

/**
 * Extract translations from request body
 * Handles both Map format and object format
 */
exports.extractTranslations = (data, language = 'en') => {
  const result = {
    questionText: '',
    explanation: ''
  };

  // Handle Map format { en: 'text', fr: 'texte' }
  if (typeof data.questionText === 'object' && !Array.isArray(data.questionText)) {
    result.questionText = data.questionText[language] || data.questionText.en || '';
    if (data.explanation && typeof data.explanation === 'object') {
      result.explanation = data.explanation[language] || data.explanation.en || '';
    }
  } else {
    // Handle string format (single language)
    result.questionText = data.questionText || '';
    result.explanation = data.explanation || '';
  }

  return result;
};

/**
 * Extract option translations from request body
 */
exports.extractOptionTranslations = (options, language = 'en') => {
  if (!options || !Array.isArray(options)) return [];

  return options.map(option => {
    let optionText = '';

    // Handle Map format
    if (typeof option.text === 'object' && !Array.isArray(option.text)) {
      optionText = option.text[language] || option.text.en || '';
    } else {
      // Handle string format
      optionText = option.text || '';
    }

    return {
      text: optionText,
      isCorrect: option.isCorrect
    };
  });
};

/**
 * Get all languages from question data
 */
exports.getLanguagesFromData = (data) => {
  const languages = new Set();

  // Check questionText
  if (typeof data.questionText === 'object' && !Array.isArray(data.questionText)) {
    Object.keys(data.questionText).forEach(lang => languages.add(lang));
  } else {
    languages.add('en'); // Default language
  }

  // Check options
  if (data.options && Array.isArray(data.options)) {
    data.options.forEach(option => {
      if (typeof option.text === 'object' && !Array.isArray(option.text)) {
        Object.keys(option.text).forEach(lang => languages.add(lang));
      }
    });
  }

  return Array.from(languages);
};

/**
 * Validate question data
 */
exports.validateQuestionData = (data) => {
  const errors = [];

  // Required fields
  if (!data.questionText) {
    errors.push('questionText is required');
  }

  if (!data.options || !Array.isArray(data.options)) {
    errors.push('options must be an array');
  } else if (data.options.length < 2) {
    errors.push('At least 2 options are required');
  } else {
    // Check if at least one option is correct
    const hasCorrect = data.options.some(opt => opt.isCorrect === true);
    if (!hasCorrect) {
      errors.push('At least one option must be marked as correct');
    }
  }

  if (!data.category) {
    errors.push('category is required');
  }

  if (!data.difficulty) {
    errors.push('difficulty is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
