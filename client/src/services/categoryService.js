import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Get all unique categories from the database
export const getCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/questions-upload/categories`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Return default categories as fallback
    return [
      'fundamentals',
      'testing-throughout-sdlc',
      'static-testing',
      'test-techniques',
      'test-management',
      'tool-support',
      'agile-testing',
      'test-automation'
    ];
  }
};

// Format categories for select dropdowns
export const formatCategoriesForSelect = (categories) => {
  return categories.map(cat => ({
    value: cat,
    label: cat.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }));
};
