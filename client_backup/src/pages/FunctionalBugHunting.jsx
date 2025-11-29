import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bug, TrendingUp, Award, Clock, Target, ArrowLeft } from 'lucide-react';
import api from '../services/api';

const FunctionalBugHunting = () => {
  const navigate = useNavigate();
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [userProgress, setUserProgress] = useState(null);

  const domains = [
    { id: 'all', name: 'All Domains', icon: '🎯', color: 'bg-gray-500' },
    { id: 'fintech', name: 'Fintech', icon: '🏦', color: 'bg-purple-500' },
    { id: 'ecommerce', name: 'E-commerce', icon: '🛒', color: 'bg-pink-500' },
    { id: 'ordering', name: 'Ordering', icon: '📦', color: 'bg-blue-500' },
    { id: 'grading', name: 'Grading', icon: '🎓', color: 'bg-green-500' }
  ];

  const difficulties = [
    { id: 'all', name: 'All Levels', color: 'text-gray-600' },
    { id: 'beginner', name: 'Beginner', color: 'text-blue-600' },
    { id: 'intermediate', name: 'Intermediate', color: 'text-purple-600' },
    { id: 'advanced', name: 'Advanced', color: 'text-pink-600' }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchBugs();
    fetchUserProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDomain, selectedDifficulty]);

  const fetchBugs = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedDomain !== 'all') params.domain = selectedDomain;
      if (selectedDifficulty !== 'all') params.difficulty = selectedDifficulty;

      const response = await api.get('/functional-bugs', { params });
      setBugs(response.data.bugs);
    } catch (error) {
      console.error('Error fetching bugs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    try {
      // Only fetch if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        setUserProgress(null);
        return;
      }
      
      const response = await api.get('/functional-bugs/user/progress');
      setUserProgress(response.data.stats);
    } catch (error) {
      console.error('Error fetching progress:', error);
      // Don't show error to user, just don't display progress
      setUserProgress(null);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[severity] || colors.medium;
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: 'bg-blue-100 text-blue-800',
      intermediate: 'bg-purple-100 text-purple-800',
      advanced: 'bg-pink-100 text-pink-800'
    };
    return colors[difficulty] || colors.beginner;
  };

  const handleStartBug = (bugId) => {
    navigate(`/functional-bug-hunting/${bugId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/bug-hunting-hub')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Bug Hunting Hub
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Bug className="h-12 w-12 text-red-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">
              Functional Bug Hunting
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Practice identifying real-world functional bugs across different domains. 
            Interact with buggy applications and sharpen your QA skills!
          </p>
        </div>

        {/* User Progress Stats */}
        {userProgress && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Bugs Found</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {userProgress.completed}
                  </p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Points</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {userProgress.totalPoints}
                  </p>
                </div>
                <Award className="h-8 w-8 text-yellow-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {userProgress.successRate ? userProgress.successRate.toFixed(0) : 0}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Time</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {userProgress.averageTime ? Math.round(userProgress.averageTime) : 0}s
                  </p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Domain Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Domain
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {domains.map((domain) => (
                  <button
                    key={domain.id}
                    onClick={() => setSelectedDomain(domain.id)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedDomain === domain.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{domain.icon}</div>
                    <div className="text-sm font-medium">{domain.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Difficulty
              </label>
              <div className="space-y-2">
                {difficulties.map((diff) => (
                  <button
                    key={diff.id}
                    onClick={() => setSelectedDifficulty(diff.id)}
                    className={`w-full p-3 rounded-lg border-2 text-left transition-all ${
                      selectedDifficulty === diff.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className={`font-medium ${diff.color}`}>
                      {diff.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bug List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading bugs...</p>
          </div>
        ) : bugs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Bug className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No bugs found with current filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bugs.map((bug) => (
              <div
                key={bug.bugId}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  {/* Bug Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono text-gray-500">
                          {bug.bugId}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(bug.difficulty)}`}>
                          {bug.difficulty}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {bug.title}
                      </h3>
                    </div>
                  </div>

                  {/* Bug Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Domain:</span>
                      <span className="font-medium capitalize">{bug.domain}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Severity:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(bug.severity)}`}>
                        {bug.severity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium">{bug.category}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Points:</span>
                      <span className="font-bold text-yellow-600">{bug.points}</span>
                    </div>
                  </div>

                  {/* Scenario Preview */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {bug.scenario.description}
                  </p>

                  {/* Action Button */}
                  <button
                    onClick={() => handleStartBug(bug.bugId)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Start Bug Hunt
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FunctionalBugHunting;
