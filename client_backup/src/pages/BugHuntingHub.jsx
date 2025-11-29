import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bug, Code, Zap, Target, ArrowRight, Trophy, Clock } from 'lucide-react';

const BugHuntingHub = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12" data-cy="bug-hunting-hub-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Bug className="h-16 w-16 text-red-500 mr-4" />
            <h1 className="text-5xl font-bold text-gray-900" data-cy="bug-hunting-hub-title">
              Bug Hunting Arena
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sharpen your QA skills by hunting bugs in realistic scenarios. 
            Choose your challenge and start earning points!
          </p>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Trophy className="h-10 w-10 text-yellow-500 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900">60+</div>
            <div className="text-gray-600">Total Bugs</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Target className="h-10 w-10 text-blue-500 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900">2</div>
            <div className="text-gray-600">Hunt Types</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Clock className="h-10 w-10 text-green-500 mx-auto mb-3" />
            <div className="text-3xl font-bold text-gray-900">Real-time</div>
            <div className="text-gray-600">Feedback</div>
          </div>
        </div>

        {/* Bug Hunting Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Interactive Bug Hunting */}
          <div 
            onClick={() => handleNavigate('/bug-hunting')}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 text-white">
              <div className="flex items-center justify-between mb-4">
                <Code className="h-12 w-12" />
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium">
                  UI/UX Focus
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-2">
                Interactive Bug Hunting
              </h2>
              <p className="text-purple-100">
                Find visual and interaction bugs in UI components
              </p>
            </div>

            <div className="p-8">
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <span className="text-purple-600 text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Visual Bugs</h3>
                    <p className="text-gray-600 text-sm">Spot layout issues, color problems, and UI inconsistencies</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <span className="text-purple-600 text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Interaction Bugs</h3>
                    <p className="text-gray-600 text-sm">Test buttons, forms, and user interactions</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <span className="text-purple-600 text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Real Scenarios</h3>
                    <p className="text-gray-600 text-sm">Practice with actual UI/UX bug patterns</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Difficulty:</span>
                  <span className="font-semibold text-purple-600">Beginner to Advanced</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600">Available Bugs:</span>
                  <span className="font-semibold text-purple-600">30+ Scenarios</span>
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300">
                Start Interactive Hunt
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Functional Bug Hunting */}
          <div 
            onClick={() => handleNavigate('/functional-bug-hunting')}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
          >
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-8 text-white">
              <div className="flex items-center justify-between mb-4">
                <Zap className="h-12 w-12" />
                <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium">
                  Logic Focus
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-2">
                Functional Bug Hunting
              </h2>
              <p className="text-blue-100">
                Identify logic errors and functional issues in applications
              </p>
            </div>

            <div className="p-8">
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="text-blue-600 text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Business Logic</h3>
                    <p className="text-gray-600 text-sm">Find calculation errors and workflow issues</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="text-blue-600 text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Data Validation</h3>
                    <p className="text-gray-600 text-sm">Test input validation and data integrity</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="text-blue-600 text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Interactive Simulators</h3>
                    <p className="text-gray-600 text-sm">Use realistic app simulators to find bugs</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Difficulty:</span>
                  <span className="font-semibold text-blue-600">Beginner to Advanced</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600">Available Bugs:</span>
                  <span className="font-semibold text-blue-600">11 Scenarios (60 coming)</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600">Domains:</span>
                  <span className="font-semibold text-blue-600">Fintech, E-commerce, Grading</span>
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300">
                Start Functional Hunt
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8" data-cy="bug-hunting-hub-title">
            How Bug Hunting Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Choose Type</h3>
              <p className="text-gray-600 text-sm">
                Select Interactive or Functional bug hunting
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Interact</h3>
              <p className="text-gray-600 text-sm">
                Use the simulator or UI to find the bug
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-pink-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Identify</h3>
              <p className="text-gray-600 text-sm">
                Report the bug type and description
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">4</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Earn Points</h3>
              <p className="text-gray-600 text-sm">
                Get feedback and earn points for correct answers
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Become a Bug Hunter?
          </h2>
          <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
            Join thousands of QA professionals sharpening their skills through practical bug hunting exercises
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleNavigate('/bug-hunting')}
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Try Interactive Hunt
            </button>
            <button
              onClick={() => handleNavigate('/functional-bug-hunting')}
              className="px-8 py-4 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition-colors"
            >
              Try Functional Hunt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BugHuntingHub;
