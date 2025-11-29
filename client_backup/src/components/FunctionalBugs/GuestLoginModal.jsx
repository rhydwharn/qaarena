import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trophy, User, LogIn, UserPlus } from 'lucide-react';

const GuestLoginModal = ({ isOpen, onClose, onContinueAsGuest }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = () => {
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="h-8 w-8" />
            <h2 className="text-2xl font-bold">Earn Points & Track Progress!</h2>
          </div>
          <p className="text-blue-100 text-sm">
            Create an account to save your progress and compete on the leaderboard
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Benefits Section */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-green-600" />
              With an Account:
            </h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span>Earn points for every bug you find</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span>Track your progress across all bugs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span>Compete on the leaderboard</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span>Save your achievements</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span>Access your stats anytime</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              <LogIn className="h-5 w-5" />
              Login to Existing Account
            </button>

            <button
              onClick={handleRegister}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              <UserPlus className="h-5 w-5" />
              Create New Account
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            <button
              onClick={onContinueAsGuest}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors border border-gray-300"
            >
              <User className="h-5 w-5" />
              Continue as Guest
            </button>
          </div>

          {/* Guest Info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              <strong>Note:</strong> Guest progress is saved only for this session and won't earn points or appear on the leaderboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestLoginModal;
