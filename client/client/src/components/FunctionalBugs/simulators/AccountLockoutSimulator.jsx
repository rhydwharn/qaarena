import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Lock, AlertCircle, Clock, Shield } from 'lucide-react';

/**
 * FB011: Account Lockout Counter Never Resets
 * Bug: Account remains locked permanently, counter never resets
 */
export default function AccountLockoutSimulator({ onBugFound }) {
  const [password, setPassword] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(null);
  const [message, setMessage] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);

  const MAX_ATTEMPTS = 3;
  const LOCKOUT_DURATION = 15; // seconds (representing 15 minutes in real scenario)
  const CORRECT_PASSWORD = 'SecurePass123';

  useEffect(() => {
    if (isLocked) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isLocked]);

  // BUG: This reset logic is never called!
  // Should check if current time > lockout time + duration
  const checkLockoutExpiry = () => {
    if (lockoutTime && timeElapsed >= LOCKOUT_DURATION) {
      setIsLocked(false);
      setFailedAttempts(0);
      setLockoutTime(null);
      setTimeElapsed(0);
      setMessage('✅ Lockout period expired. You can try logging in again.');
      return true;
    }
    return false;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setMessage('');

    // BUG: Missing call to checkLockoutExpiry()
    // Should be: if (checkLockoutExpiry()) { ... }
    
    if (isLocked) {
      setMessage(`❌ Account is locked. Please wait ${LOCKOUT_DURATION - timeElapsed} more seconds.`);
      if (timeElapsed >= LOCKOUT_DURATION) {
        setMessage(
          `🐛 BUG DETECTED: Account should be unlocked after ${LOCKOUT_DURATION} seconds, but lockout never resets!`
        );
        onBugFound?.();
      }
      return;
    }

    if (password === CORRECT_PASSWORD) {
      setMessage('✅ Login successful!');
      setFailedAttempts(0);
      setPassword('');
      return;
    }

    const newAttempts = failedAttempts + 1;
    setFailedAttempts(newAttempts);

    if (newAttempts >= MAX_ATTEMPTS) {
      setIsLocked(true);
      setLockoutTime(Date.now());
      setTimeElapsed(0);
      setMessage(`❌ Account locked due to ${MAX_ATTEMPTS} failed attempts. Please wait ${LOCKOUT_DURATION} seconds.`);
    } else {
      setMessage(`❌ Incorrect password. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`);
    }

    setPassword('');
  };

  const manualUnlock = () => {
    // This simulates what SHOULD happen automatically
    if (checkLockoutExpiry()) {
      setMessage('✅ Account manually unlocked (this should happen automatically!)');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Account Security</h2>
            <p className="text-red-100">Login with lockout protection</p>
          </div>
          <Shield className="h-12 w-12 opacity-80" />
        </div>
      </div>

      {/* Status Display */}
      <div className={`p-6 rounded-lg border-2 ${
        isLocked 
          ? 'bg-red-50 border-red-300' 
          : failedAttempts > 0 
          ? 'bg-yellow-50 border-yellow-300' 
          : 'bg-green-50 border-green-300'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Lock className={`h-8 w-8 ${
              isLocked ? 'text-red-600' : failedAttempts > 0 ? 'text-yellow-600' : 'text-green-600'
            }`} />
            <div>
              <p className="font-semibold text-lg">
                {isLocked ? '🔒 Account Locked' : '🔓 Account Active'}
              </p>
              <p className="text-sm text-gray-600">
                Failed Attempts: {failedAttempts}/{MAX_ATTEMPTS}
              </p>
            </div>
          </div>
          {isLocked && (
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Time Elapsed</p>
                  <p className="text-2xl font-bold text-red-600">{timeElapsed}s</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Should unlock at: {LOCKOUT_DURATION}s
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Login Form */}
      <div className="bg-white border rounded-lg shadow p-6">
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              disabled={isLocked}
            />
            <p className="text-xs text-gray-500 mt-1">
              Hint: Correct password is &quot;SecurePass123&quot;
            </p>
          </div>

          <button
            type="submit"
            disabled={isLocked}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            {isLocked ? '🔒 Account Locked' : 'Login'}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-4 rounded-lg border-2 ${
            message.includes('BUG') 
              ? 'bg-red-50 border-red-300' 
              : message.includes('✅') 
              ? 'bg-green-50 border-green-300' 
              : 'bg-yellow-50 border-yellow-300'
          }`}>
            <div className="flex items-start space-x-3">
              <AlertCircle className={`h-5 w-5 mt-0.5 ${
                message.includes('BUG') 
                  ? 'text-red-600' 
                  : message.includes('✅') 
                  ? 'text-green-600' 
                  : 'text-yellow-600'
              }`} />
              <p className="text-sm flex-1">{message}</p>
            </div>
          </div>
        )}
      </div>

      {/* Manual Unlock (for testing) */}
      {isLocked && timeElapsed >= LOCKOUT_DURATION && (
        <div className="bg-orange-50 border border-orange-300 rounded-lg p-4">
          <p className="text-sm text-orange-800 mb-3">
            ⚠️ The lockout period has expired, but the account is still locked. 
            This demonstrates the bug - the reset logic is never called!
          </p>
          <button
            onClick={manualUnlock}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 rounded-lg font-semibold transition-colors"
          >
            Manual Unlock (Shows What Should Happen Automatically)
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">🔍 Testing Instructions:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Enter wrong password 3 times to trigger lockout</li>
          <li>• Wait for {LOCKOUT_DURATION} seconds</li>
          <li>• Try to login with correct password after {LOCKOUT_DURATION}s</li>
          <li>• Expected: Account should automatically unlock</li>
          <li>• Actual: Account remains locked permanently</li>
        </ul>
      </div>

      {/* Bug Explanation */}
      <div className="bg-gray-50 border rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">🐛 Bug Details:</h4>
        <p className="text-sm text-gray-700 mb-2">
          The <code className="bg-gray-200 px-1 rounded">checkLockoutExpiry()</code> function 
          exists but is never called. The system sets the lockout flag but never checks if 
          enough time has passed to reset it.
        </p>
        <p className="text-sm text-gray-700">
          <strong>Fix:</strong> Call <code className="bg-gray-200 px-1 rounded">checkLockoutExpiry()</code> 
          at the start of the login function to check if the lockout period has expired.
        </p>
      </div>
    </div>
  );
}

AccountLockoutSimulator.propTypes = {
  onBugFound: PropTypes.func
};
