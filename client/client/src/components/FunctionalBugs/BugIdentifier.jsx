import React, { useState } from 'react';
import { Send } from 'lucide-react';

const BugIdentifier = ({ bug, onSubmit, submitting }) => {
  const [selectedType, setSelectedType] = useState('');
  const [description, setDescription] = useState('');
  const [confidence, setConfidence] = useState(50);

  const bugTypes = [
    'Calculation Error',
    'Validation Error',
    'Business Logic Error',
    'Data Sync Issue',
    'UI State Bug',
    'Security Issue',
    'Concurrency Issue',
    'Idempotency Failure',
    'Date Calculation Error',
    'Stale Data',
    'Integration Failure',
    'State Management',
    'Data Export Bug',
    'Access Control',
    'Rounding Error'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedType || !description.trim()) {
      alert('Please select a bug type and provide a description');
      return;
    }
    onSubmit({
      bugType: selectedType,
      description: description.trim(),
      confidence
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🔍 Identify the Bug
        </h2>
        <p className="text-gray-600">
          Based on your interaction with the system, what type of bug did you find?
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bug Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What type of bug is this? <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select bug type...</option>
            {bugTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe what you found <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What is wrong? What did you expect vs what happened? Be specific..."
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            required
          />
          <p className="mt-2 text-sm text-gray-500">
            Tip: Include what you expected to happen and what actually happened
          </p>
        </div>

        {/* Confidence Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How confident are you? {confidence}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={confidence}
            onChange={(e) => setConfidence(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${confidence}%, #e5e7eb ${confidence}%, #e5e7eb 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Not sure</span>
            <span>Very confident</span>
          </div>
          {confidence >= 80 && (
            <p className="mt-2 text-sm text-green-600">
              💪 High confidence! You'll earn bonus points if correct.
            </p>
          )}
        </div>

        {/* Expected vs Actual */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">
            📝 Scenario Reminder:
          </h3>
          <p className="text-sm text-blue-800 mb-2">
            <strong>Expected:</strong> {bug.expected}
          </p>
          <p className="text-sm text-blue-800">
            <strong>What you observed:</strong> Compare this with what you saw in the simulator
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || !selectedType || !description.trim()}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              Submit Answer
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default BugIdentifier;
