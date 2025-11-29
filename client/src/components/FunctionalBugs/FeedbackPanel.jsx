import React from 'react';
import { CheckCircle, XCircle, Award, ArrowRight, Lightbulb, TestTube } from 'lucide-react';

const FeedbackPanel = ({ feedback: responseFeedback, onNext }) => {
  const { isCorrect, pointsEarned, userAnswer, feedback } = responseFeedback;

  return (
    <div className={`rounded-lg shadow-lg overflow-hidden ${
      isCorrect ? 'bg-green-50 border-2 border-green-500' : 'bg-orange-50 border-2 border-orange-500'
    }`}>
      {/* Result Header */}
      <div className={`p-6 ${isCorrect ? 'bg-green-500' : 'bg-orange-500'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {isCorrect ? (
              <CheckCircle className="h-12 w-12 text-white" />
            ) : (
              <XCircle className="h-12 w-12 text-white" />
            )}
            <div>
              <h2 className="text-3xl font-bold text-white">
                {isCorrect ? 'Correct! Well Done! 🎉' : 'Not Quite Right 🤔'}
              </h2>
              <p className="text-white text-lg mt-1">
                {isCorrect 
                  ? 'You successfully identified the bug!' 
                  : 'But you\'re learning! Keep practicing!'}
              </p>
            </div>
          </div>
          <div className="text-right">
            {pointsEarned > 0 ? (
              <>
                <div className="flex items-center gap-2 text-white">
                  <Award className="h-8 w-8" />
                  <span className="text-4xl font-bold">+{pointsEarned}</span>
                </div>
                <p className="text-white text-sm mt-1">points earned</p>
              </>
            ) : (
              <div className="bg-white/20 rounded-lg px-4 py-2">
                <p className="text-white text-sm font-medium">Guest Mode</p>
                <p className="text-white/80 text-xs mt-1">No points earned</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Bug Analysis */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            🔍 Bug Analysis
          </h3>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Bug Type:</h4>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg font-medium">
                  {feedback.bugType}
                </span>
                {isCorrect && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">What Happened:</h4>
              <p className="text-gray-600 bg-red-50 border-l-4 border-red-500 p-3 rounded">
                {feedback.actual}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">What Should Happen:</h4>
              <p className="text-gray-600 bg-green-50 border-l-4 border-green-500 p-3 rounded">
                {feedback.expected}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Root Cause:</h4>
              <p className="text-gray-600 bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
                {feedback.rootCause}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">The Fix:</h4>
              <p className="text-gray-600 bg-blue-50 border-l-4 border-blue-500 p-3 rounded font-mono text-sm">
                {feedback.fix}
              </p>
            </div>
          </div>
        </div>

        {/* Your Answer */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            📝 Your Answer
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-600">Bug Type:</span>
              <p className={`mt-1 ${
                userAnswer.bugType === feedback.bugType 
                  ? 'text-green-600 font-semibold' 
                  : 'text-orange-600'
              }`}>
                {userAnswer.bugType}
                {userAnswer.bugType === feedback.bugType && ' ✓'}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Your Description:</span>
              <p className="mt-1 text-gray-700 bg-gray-50 p-3 rounded">
                {userAnswer.description}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Confidence:</span>
              <div className="mt-1 flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${userAnswer.confidence}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{userAnswer.confidence}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Prevention Tips */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Lightbulb className="h-6 w-6 text-yellow-500" />
            Prevention Tips
          </h3>
          <ul className="space-y-2">
            {feedback.preventionTips && feedback.preventionTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-500 font-bold mt-1">•</span>
                <span className="text-gray-700">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Testing Tips */}
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TestTube className="h-6 w-6 text-purple-500" />
            Testing Tips
          </h3>
          <ul className="space-y-2">
            {feedback.testingTips && feedback.testingTips.map((tip, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-purple-500 font-bold mt-1">•</span>
                <span className="text-gray-700">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Next Button */}
        <button
          onClick={onNext}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-6 rounded-lg transition-colors text-lg"
        >
          Continue to Next Bug
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default FeedbackPanel;
