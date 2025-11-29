import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Mail, Lock, ArrowLeft, AlertCircle } from 'lucide-react';

export default function ArenaSignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear errors when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (generalError) {
      setGeneralError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setGeneralError('');

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Mock: Check if email is verified
      const isVerified = localStorage.getItem('arena_email_verified') === 'true';
      
      if (!isVerified) {
        setGeneralError('Please verify your email before signing in. Check your inbox for the verification link.');
      } else {
        // Store mock auth token
        localStorage.setItem('arena_auth_token', 'mock-jwt-token');
        localStorage.setItem('arena_user', JSON.stringify({
          email: formData.email,
          firstName: 'Test',
          lastName: 'User'
        }));
        navigate('/arena/dashboard');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-6" data-cy="arena-signin-page">
      <Card className="w-full max-w-md" data-cy="arena-signin-card">
        <CardHeader>
          <div className="flex items-center gap-2 mb-4">
            <Link to="/arena" data-cy="arena-signin-back-link">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <CardTitle className="text-2xl" data-cy="arena-signin-title">
                Welcome Back
              </CardTitle>
              <CardDescription data-cy="arena-signin-description">
                Sign in to continue your learning journey
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} data-cy="arena-signin-form">
            <div className="space-y-4">
              {/* General Error */}
              {generalError && (
                <div 
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start gap-2"
                  data-cy="arena-signin-general-error"
                >
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{generalError}</p>
                </div>
              )}

              {/* Email */}
              <div data-cy="arena-signin-email-field">
                <Label htmlFor="email" data-cy="arena-signin-email-label">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    data-cy="arena-signin-email-input"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1" data-cy="arena-signin-email-error">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div data-cy="arena-signin-password-field">
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="password" data-cy="arena-signin-password-label">
                    Password
                  </Label>
                  <Link 
                    to="/arena/forgot-password" 
                    className="text-sm text-blue-600 hover:underline"
                    data-cy="arena-signin-forgot-password-link"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10"
                    data-cy="arena-signin-password-input"
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1" data-cy="arena-signin-password-error">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me */}
              <div className="flex items-center" data-cy="arena-signin-remember-field">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  data-cy="arena-signin-remember-checkbox"
                />
                <label 
                  htmlFor="remember" 
                  className="ml-2 block text-sm text-gray-700"
                  data-cy="arena-signin-remember-label"
                >
                  Remember me
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                data-cy="arena-signin-submit-button"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-gray-600" data-cy="arena-signin-signup-text">
                Don't have an account?{' '}
                <Link 
                  to="/arena/signup" 
                  className="text-blue-600 hover:underline font-medium"
                  data-cy="arena-signin-signup-link"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
