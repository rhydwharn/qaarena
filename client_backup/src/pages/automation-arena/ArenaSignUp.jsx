import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Mail, Lock, User, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ArenaSignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-6" data-cy="arena-signup-success-page">
        <Card className="w-full max-w-md" data-cy="arena-signup-success-card">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-green-100 rounded-full" data-cy="arena-success-icon">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl" data-cy="arena-success-title">
              Registration Successful! 🎉
            </CardTitle>
            <CardDescription data-cy="arena-success-description">
              Your account <strong>{formData.email}</strong> has been created
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md" data-cy="arena-demo-notice">
                <p className="text-sm text-blue-800 text-center">
                  <strong>Demo Mode:</strong> Email verification is simulated. You can sign in immediately to start practicing!
                </p>
              </div>
              <p className="text-sm text-gray-600 text-center" data-cy="arena-success-instructions">
                Your account is ready. Click below to sign in and access all 4 simulators.
              </p>
              <Button 
                onClick={() => navigate('/arena/signin')} 
                className="w-full"
                data-cy="arena-success-signin-button"
              >
                Go to Sign In
              </Button>
              <p className="text-xs text-center text-gray-500" data-cy="arena-success-note">
                Use the same email and password to sign in
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-6" data-cy="arena-signup-page">
      <Card className="w-full max-w-md" data-cy="arena-signup-card">
        <CardHeader>
          <div className="flex items-center gap-2 mb-4">
            <Link to="/arena" data-cy="arena-signup-back-link">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <CardTitle className="text-2xl" data-cy="arena-signup-title">
                Create Your Account
              </CardTitle>
              <CardDescription data-cy="arena-signup-description">
                Start your test automation journey today
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md" data-cy="arena-signup-demo-notice">
            <p className="text-sm text-blue-800 text-center">
              <strong>Demo Environment:</strong> No email verification required. Sign up and start practicing immediately!
            </p>
          </div>
          <form onSubmit={handleSubmit} data-cy="arena-signup-form">
            <div className="space-y-4">
              {/* First Name */}
              <div data-cy="arena-signup-firstname-field">
                <Label htmlFor="firstName" data-cy="arena-signup-firstname-label">
                  First Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="pl-10"
                    data-cy="arena-signup-firstname-input"
                  />
                </div>
                {errors.firstName && (
                  <p className="text-sm text-red-500 mt-1" data-cy="arena-signup-firstname-error">
                    {errors.firstName}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div data-cy="arena-signup-lastname-field">
                <Label htmlFor="lastName" data-cy="arena-signup-lastname-label">
                  Last Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="pl-10"
                    data-cy="arena-signup-lastname-input"
                  />
                </div>
                {errors.lastName && (
                  <p className="text-sm text-red-500 mt-1" data-cy="arena-signup-lastname-error">
                    {errors.lastName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div data-cy="arena-signup-email-field">
                <Label htmlFor="email" data-cy="arena-signup-email-label">
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
                    data-cy="arena-signup-email-input"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1" data-cy="arena-signup-email-error">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div data-cy="arena-signup-password-field">
                <Label htmlFor="password" data-cy="arena-signup-password-label">
                  Password
                </Label>
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
                    data-cy="arena-signup-password-input"
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1" data-cy="arena-signup-password-error">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div data-cy="arena-signup-confirm-password-field">
                <Label htmlFor="confirmPassword" data-cy="arena-signup-confirm-password-label">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10"
                    data-cy="arena-signup-confirm-password-input"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1" data-cy="arena-signup-confirm-password-error">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
                data-cy="arena-signup-submit-button"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>

              {/* Sign In Link */}
              <p className="text-center text-sm text-gray-600" data-cy="arena-signup-signin-text">
                Already have an account?{' '}
                <Link 
                  to="/arena/signin" 
                  className="text-blue-600 hover:underline font-medium"
                  data-cy="arena-signup-signin-link"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
