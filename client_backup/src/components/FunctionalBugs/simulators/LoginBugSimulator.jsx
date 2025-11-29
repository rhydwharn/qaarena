import { useState } from 'prop-types';
import PropTypes from 'prop-types';
import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';

/**
 * Multi-purpose Login Simulator for Authentication Bugs
 * FB009: Login Error Reveals User Password
 * FB010: Case-Sensitive Password Validation Inconsistency
 */
export default function LoginBugSimulator({ bugId, onBugFound }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock user database
  const users = {
    'john@example.com': { password: 'SecurePass456!', name: 'John Doe' },
    'user@test.com': { password: 'MyPassword123', name: 'Test User' }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const user = users[email.toLowerCase()];

      if (!user) {
        setError('Invalid username or password');
        setLoading(false);
        return;
      }

      // BUG FB009: Password disclosure in error message
      if (bugId === 'FB009') {
        if (password !== user.password) {
          setError(
            `User ${email} exists but password is incorrect. The correct password is: ${user.password}`
          );
          onBugFound?.();
          setLoading(false);
          return;
        }
      }

      // BUG FB010: Case-insensitive password comparison
      if (bugId === 'FB010') {
        if (password.toLowerCase() === user.password.toLowerCase()) {
          setError('');
          alert(`✅ Login successful! Welcome ${user.name}`);
          if (password !== user.password) {
            onBugFound?.();
          }
          setLoading(false);
          return;
        } else {
          setError('Invalid username or password');
          setLoading(false);
          return;
        }
      }

      // Correct behavior
      if (password === user.password) {
        setError('');
        alert(`✅ Login successful! Welcome ${user.name}`);
      } else {
        setError('Invalid username or password');
      }
      
      setLoading(false);
    }, 1000);
  };

  const getBugDescription = () => {
    if (bugId === 'FB009') {
      return {
        title: 'Password Disclosure Bug',
        description: 'Error messages reveal the actual password',
        testSteps: [
          'Enter email: john@example.com',
          'Enter wrong password: wrongpass123',
          'Click Login',
          'Read the error message carefully'
        ]
      };
    }
    if (bugId === 'FB010') {
      return {
        title: 'Case-Insensitive Password Bug',
        description: 'Password comparison ignores case sensitivity',
        testSteps: [
          'Enter email: user@test.com',
          'Enter password: mypassword123 (all lowercase)',
          'Correct password is: MyPassword123 (mixed case)',
          'Click Login - it should fail but succeeds'
        ]
      };
    }
    return { title: 'Login Test', description: '', testSteps: [] };
  };

  const bugInfo = getBugDescription();

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-2">Login Portal</h2>
          <p className="text-purple-100">{bugInfo.title}</p>
        </div>
      </div>

      {/* Login Form */}
      <div className="bg-white border rounded-lg shadow-lg p-6">
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-700 break-words">{error}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>

      {/* Test Accounts */}
      <div className="bg-gray-50 border rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">Test Accounts:</h4>
        <div className="text-sm text-gray-700 space-y-1">
          <p>• john@example.com / SecurePass456!</p>
          <p>• user@test.com / MyPassword123</p>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">🔍 Testing Instructions:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          {bugInfo.testSteps.map((step, index) => (
            <li key={index}>• {step}</li>
          ))}
        </ul>
      </div>

      {bugId === 'FB009' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-semibold text-red-900 mb-2">⚠️ Security Issue:</h4>
          <p className="text-sm text-red-800">
            This is a critical security vulnerability. Error messages should NEVER reveal 
            actual passwords. Always use generic error messages like &quot;Invalid username or password&quot;.
          </p>
        </div>
      )}

      {bugId === 'FB010' && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h4 className="font-semibold text-orange-900 mb-2">⚠️ Validation Issue:</h4>
          <p className="text-sm text-orange-800">
            Passwords should be case-sensitive. Converting passwords to lowercase before 
            comparison weakens security and allows unauthorized access.
          </p>
        </div>
      )}
    </div>
  );
}

LoginBugSimulator.propTypes = {
  bugId: PropTypes.string.isRequired,
  onBugFound: PropTypes.func
};
