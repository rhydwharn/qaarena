import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { ArrowLeft, Mail, Lock, User, CheckCircle, AlertCircle, Loader2, Key, Link as LinkIcon } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const getDisplayName = (u) => {
  if (!u) return '';
  const first = u.firstName || u.name || u.username || '';
  const last = u.lastName || '';
  const full = `${first} ${last}`.trim();
  return full || u.email || '';
};

export default function AuthSimulator() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [view, setView] = useState('intro');
  const [mode, setMode] = useState(null); // null until detected, then 'demo' or 'real'
  const [mainAppUser, setMainAppUser] = useState(null); // Store main app user info
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    authMode: 'otp'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState('');

  // Check if user is logged in from main app on mount
  useEffect(() => {
    const mainAppToken = localStorage.getItem('token'); // Main app token
    const mainAppUserStr = localStorage.getItem('user'); // Main app user
    
    console.log('🔍 Auth Simulator Mode Detection:');
    console.log('  Main App Token:', mainAppToken ? '✅ Found' : '❌ Not found');
    console.log('  Main App User:', mainAppUserStr ? '✅ Found' : '❌ Not found');
    
    if (mainAppToken && mainAppUserStr) {
      // User is logged in from main app - use real mode
      console.log('  Mode: REAL ✅');
      setMode('real');
      
      // Parse and store user data
      try {
        const userData = JSON.parse(mainAppUserStr);
        setMainAppUser(userData);
        console.log('  User:', userData.username || userData.email);
      } catch (error) {
        console.error('  Error parsing user data:', error);
      }
      
      // Check if they already have a simulator session
      const simToken = localStorage.getItem('arena_sim_token');
      if (simToken) {
        console.log('  Existing simulator session found - going to dashboard');
        setView('dashboard');
      }
    } else {
      // User not logged in - use demo mode
      console.log('  Mode: DEMO 🎭');
      setMode('demo');
    }
  }, []);

  // Check for verification token in URL
  useEffect(() => {
    const token = searchParams.get('verify');
    if (token) {
      handleVerifyToken(token);
    }
  }, [searchParams]);

  // Check token validity on dashboard view
  useEffect(() => {
    const checkTokenValidity = async () => {
      if (view === 'dashboard') {
        const token = localStorage.getItem('arena_sim_token');
        if (!token) {
          // No token, redirect to intro
          setView('intro');
          return;
        }

        try {
          const response = await fetch(`${API_BASE_URL}/arena-auth/verify-user`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          const data = await response.json();

          if (!response.ok || data.expired) {
            // Token expired or invalid
            localStorage.removeItem('arena_sim_token');
            localStorage.removeItem('arena_sim_user');
            
            // Redirect to main homepage
            navigate('/');
          }
        } catch (error) {
          console.error('Token verification error:', error);
          // On error, clear token and redirect
          localStorage.removeItem('arena_sim_token');
          localStorage.removeItem('arena_sim_user');
          navigate('/');
        }
      }
    };

    checkTokenValidity();
  }, [view, navigate]);

  const validateSignUp = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (!validateSignUp()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${API_BASE_URL}/arena-auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          authMode: formData.authMode
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Show success message if OTP was resent
        if (data.resent) {
          setMessage(data.message);
        }
        
        // Route to appropriate verification screen
        if (formData.authMode === 'otp') {
          setView('verify-otp');
        } else {
          setView('verify-token');
        }
      } else {
        setErrors({ submit: data.message || 'Sign up failed' });
      }
    } catch {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    if (!verificationCode.trim()) {
      setErrors({ code: 'Please enter the OTP' });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${API_BASE_URL}/arena-auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email,
          otp: verificationCode 
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('arena_sim_token', data.token);
        localStorage.setItem('arena_sim_user', JSON.stringify(data.user));
        setView('success');
      } else {
        setErrors({ code: data.message || 'Invalid or expired OTP' });
      }
    } catch {
      setErrors({ code: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToken = async (token) => {
    setLoading(true);
    setErrors({});
    setView('verifying');

    try {
      const response = await fetch(`${API_BASE_URL}/arena-auth/verify-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('arena_sim_token', data.token);
        localStorage.setItem('arena_sim_user', JSON.stringify(data.user));
        setView('dashboard');
      } else {
        setErrors({ token: data.message || 'Invalid or expired token' });
        setView('intro');
      }
    } catch {
      setErrors({ token: 'Network error. Please try again.' });
      setView('intro');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setErrors({ submit: 'Email and password are required' });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/arena-auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('arena_sim_token', data.token);
        localStorage.setItem('arena_sim_user', JSON.stringify(data.user));
        setView('dashboard');
      } else {
        setErrors({ submit: data.message || 'Sign in failed' });
      }
    } catch {
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Show loading while detecting mode
  if (mode === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading simulator...</p>
        </div>
      </div>
    );
  }

  // Intro View
  if (view === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6" data-cy="auth-sim-intro">
        <div className="max-w-4xl mx-auto">
          <Link to="/arena">
            <Button variant="ghost" className="mb-6" data-cy="auth-sim-back">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Arena
            </Button>
          </Link>

          <Card className="border-2 border-purple-200">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-purple-100 rounded-full">
                  <Lock className="h-12 w-12 text-purple-600" />
                </div>
              </div>
              <CardTitle className="text-3xl" data-cy="auth-sim-title">
                🔐 Authentication Simulator
              </CardTitle>
              <CardDescription className="text-lg" data-cy="auth-sim-description">
                {mode === 'real' 
                  ? 'Test complete authentication flows with real email verification' 
                  : 'Learn to test authentication flows (Demo Mode - requires login for real emails)'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mode === 'demo' && (
                  <div className="p-4 bg-yellow-50 border-2 border-yellow-300 rounded-md">
                    <h3 className="font-semibold text-yellow-900 mb-2">ℹ️ Demo Mode</h3>
                    <p className="text-sm text-yellow-800 mb-2">
                      You're in demo mode. Sign up and sign in work, but emails won't be sent to real inboxes.
                    </p>
                    <p className="text-sm text-yellow-800">
                      <strong>Want real emails?</strong> Please <Link to="/login" className="underline font-semibold">login</Link> to your account first, then access this simulator.
                    </p>
                  </div>
                )}
                
                {mode === 'real' && (
                  <div className="p-4 bg-green-50 border-2 border-green-300 rounded-md">
                    <h3 className="font-semibold text-green-900 mb-2">
                      ✅ Real Mode {mainAppUser && `- Welcome, ${getDisplayName(mainAppUser)}!`}
                    </h3>
                    <p className="text-sm text-green-800">
                      You're logged in! Emails will be sent to real inboxes using the configured email service.
                    </p>
                  </div>
                )}

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <h3 className="font-semibold text-blue-900 mb-2">🎯 What You'll Learn:</h3>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>✅ Test user registration forms with validation</li>
                    <li>✅ Handle email verification workflows (OTP & Token)</li>
                    <li>✅ Extract and use verification codes from emails</li>
                    <li>✅ Test sign-in functionality</li>
                    <li>✅ Verify authenticated dashboard access</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <h3 className="font-semibold text-green-900 mb-2">📧 Two Authentication Modes:</h3>
                  <div className="space-y-3 text-sm text-green-800">
                    <div>
                      <strong>1. OTP (One-Time Password):</strong>
                      <p>Receive a 6-digit code via email, enter it to verify your account.</p>
                    </div>
                    <div>
                      <strong>2. Authorization Token:</strong>
                      <p>Click a verification link in your email to auto-verify and login.</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <Button 
                    size="lg" 
                    onClick={() => setView('signup')}
                    data-cy="auth-sim-start-signup"
                  >
                    Start with Sign Up
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={() => setView('signin')}
                    data-cy="auth-sim-start-signin"
                  >
                    Go to Sign In
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Sign Up View
  if (view === 'signup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-6" data-cy="auth-sim-signup-page">
        <Card className="w-full max-w-md" data-cy="auth-sim-signup-card">
          <CardHeader>
            <div className="flex items-center gap-2 mb-4">
              <Button variant="ghost" size="sm" onClick={() => setView('intro')} data-cy="auth-sim-signup-back">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="text-2xl" data-cy="auth-sim-signup-title">
                  Create Account
                </CardTitle>
                <CardDescription data-cy="auth-sim-signup-description">
                  Sign up to test email verification
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} data-cy="auth-sim-signup-form">
              <div className="space-y-4">
                {errors.submit && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md" data-cy="auth-sim-signup-error">
                    <p className="text-sm text-red-600">{errors.submit}</p>
                  </div>
                )}

                <div data-cy="auth-sim-firstname-field">
                  <Label htmlFor="firstName" data-cy="auth-sim-firstname-label">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="pl-10"
                      data-cy="auth-sim-firstname-input"
                    />
                  </div>
                  {errors.firstName && <p className="text-sm text-red-600 mt-1" data-cy="auth-sim-firstname-error">{errors.firstName}</p>}
                </div>

                <div data-cy="auth-sim-lastname-field">
                  <Label htmlFor="lastName" data-cy="auth-sim-lastname-label">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="pl-10"
                      data-cy="auth-sim-lastname-input"
                    />
                  </div>
                  {errors.lastName && <p className="text-sm text-red-600 mt-1" data-cy="auth-sim-lastname-error">{errors.lastName}</p>}
                </div>

                <div data-cy="auth-sim-email-field">
                  <Label htmlFor="email" data-cy="auth-sim-email-label">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10"
                      data-cy="auth-sim-email-input"
                    />
                  </div>
                  {errors.email && <p className="text-sm text-red-600 mt-1" data-cy="auth-sim-email-error">{errors.email}</p>}
                </div>

                <div data-cy="auth-sim-password-field">
                  <Label htmlFor="password" data-cy="auth-sim-password-label">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10"
                      data-cy="auth-sim-password-input"
                    />
                  </div>
                  {errors.password && <p className="text-sm text-red-600 mt-1" data-cy="auth-sim-password-error">{errors.password}</p>}
                </div>

                <div data-cy="auth-sim-confirm-field">
                  <Label htmlFor="confirmPassword" data-cy="auth-sim-confirm-label">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="pl-10"
                      data-cy="auth-sim-confirm-input"
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-red-600 mt-1" data-cy="auth-sim-confirm-error">{errors.confirmPassword}</p>}
                </div>

                {/* Authentication Mode Selector */}
                <div data-cy="auth-sim-authmode-field">
                  <Label htmlFor="authMode" data-cy="auth-sim-authmode-label">Authentication Mode</Label>
                  <select
                    id="authMode"
                    value={formData.authMode}
                    onChange={(e) => setFormData({ ...formData, authMode: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    data-cy="auth-sim-authmode-select"
                  >
                    <option value="otp">OTP (One-Time Password)</option>
                    <option value="token">Authorization Token (Email Link)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.authMode === 'otp' 
                      ? '📱 You will receive a 6-digit code via email'
                      : '🔗 You will receive a clickable verification link via email'}
                  </p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                  data-cy="auth-sim-signup-submit"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Sign Up'
                  )}
                </Button>

                <p className="text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <button 
                    type="button"
                    onClick={() => setView('signin')} 
                    className="text-purple-600 hover:underline"
                    data-cy="auth-sim-goto-signin"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // OTP Verification View
  if (view === 'verify-otp') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-6" data-cy="auth-sim-verify-otp-page">
        <Card className="w-full max-w-md" data-cy="auth-sim-verify-otp-card">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-blue-100 rounded-full">
                <Key className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-2xl" data-cy="auth-sim-verify-otp-title">
              Kindly input the OTP sent to your email
            </CardTitle>
            <CardDescription data-cy="auth-sim-verify-otp-description">
              We've sent a 6-digit OTP to <strong>{formData.email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerifyOTP} data-cy="auth-sim-verify-otp-form">
              <div className="space-y-4">
                {message && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md" data-cy="auth-sim-resend-message">
                    <p className="text-sm text-green-700 font-medium">{message}</p>
                  </div>
                )}

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <h3 className="font-semibold text-yellow-900 mb-2">📝 Instructions:</h3>
                  <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
                    <li>Open your email inbox</li>
                    <li>Find the OTP email</li>
                    <li>Copy the 6-digit code</li>
                    <li>Paste it below and click Verify</li>
                  </ol>
                </div>

                {errors.code && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md" data-cy="auth-sim-verify-otp-error">
                    <p className="text-sm text-red-600">{errors.code}</p>
                  </div>
                )}

                <div data-cy="auth-sim-otp-field">
                  <Label htmlFor="otp" data-cy="auth-sim-otp-label">Enter OTP</Label>
                  <Input
                    id="otp"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    className="text-center text-2xl tracking-widest"
                    data-cy="auth-sim-otp-input"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                  data-cy="auth-sim-verify-otp-submit"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify OTP'
                  )}
                </Button>

                <p className="text-center text-sm text-gray-600">
                  Didn't receive the OTP?{' '}
                  <button 
                    type="button"
                    onClick={() => setView('signup')} 
                    className="text-purple-600 hover:underline"
                    data-cy="auth-sim-resend"
                  >
                    Try again
                  </button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Token Verification View (Waiting for email click)
  if (view === 'verify-token') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-6" data-cy="auth-sim-verify-token-page">
        <Card className="w-full max-w-md" data-cy="auth-sim-verify-token-card">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-green-100 rounded-full">
                <LinkIcon className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl" data-cy="auth-sim-verify-token-title">
              Kindly check your email for the authorization token
            </CardTitle>
            <CardDescription data-cy="auth-sim-verify-token-description">
              We've sent a verification link to <strong>{formData.email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {message && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md" data-cy="auth-sim-resend-message">
                  <p className="text-sm text-green-700 font-medium">{message}</p>
                </div>
              )}

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h3 className="font-semibold text-blue-900 mb-2">📧 Next Steps:</h3>
                <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                  <li>Open your email inbox</li>
                  <li>Find the verification email</li>
                  <li>Click the "Verify My Account" button</li>
                  <li>You'll be automatically logged in!</li>
                </ol>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-md text-center">
                <p className="text-sm text-green-800">
                  <strong>✨ Magic Link:</strong> Clicking the link will automatically verify your account and log you into the dashboard!
                </p>
              </div>

              <Button 
                variant="outline"
                className="w-full" 
                onClick={() => setView('intro')}
                data-cy="auth-sim-back-to-intro"
              >
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Verifying Token (Loading state)
  if (view === 'verifying') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-6" data-cy="auth-sim-verifying-page">
        <Card className="w-full max-w-md text-center p-8">
          <Loader2 className="h-16 w-16 animate-spin text-purple-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Your Account...</h2>
          <p className="text-gray-600">Please wait while we verify your authorization token.</p>
        </Card>
      </div>
    );
  }

  // Success View (After OTP verification)
  if (view === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-6" data-cy="auth-sim-success-page">
        <Card className="w-full max-w-md" data-cy="auth-sim-success-card">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-green-100 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl" data-cy="auth-sim-success-title">
              Email Verified! ✅
            </CardTitle>
            <CardDescription data-cy="auth-sim-success-description">
              Your account has been successfully verified
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-800 text-center">
                  Great job! You've successfully completed the email verification flow. 
                  Now you can access your dashboard.
                </p>
              </div>

              <Button 
                className="w-full" 
                onClick={() => setView('dashboard')}
                data-cy="auth-sim-goto-dashboard"
              >
                Continue to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sign In View
  if (view === 'signin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-6" data-cy="auth-sim-signin-page">
        <Card className="w-full max-w-md" data-cy="auth-sim-signin-card">
          <CardHeader>
            <div className="flex items-center gap-2 mb-4">
              <Button variant="ghost" size="sm" onClick={() => setView('intro')} data-cy="auth-sim-signin-back">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="text-2xl" data-cy="auth-sim-signin-title">
                  Sign In
                </CardTitle>
                <CardDescription data-cy="auth-sim-signin-description">
                  Access your simulator dashboard
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} data-cy="auth-sim-signin-form">
              <div className="space-y-4">
                {errors.submit && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md" data-cy="auth-sim-signin-error">
                    <p className="text-sm text-red-600">{errors.submit}</p>
                  </div>
                )}

                <div data-cy="auth-sim-signin-email-field">
                  <Label htmlFor="email" data-cy="auth-sim-signin-email-label">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10"
                      data-cy="auth-sim-signin-email-input"
                    />
                  </div>
                </div>

                <div data-cy="auth-sim-signin-password-field">
                  <Label htmlFor="password" data-cy="auth-sim-signin-password-label">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10"
                      data-cy="auth-sim-signin-password-input"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                  data-cy="auth-sim-signin-submit"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>

                <p className="text-center text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button 
                    type="button"
                    onClick={() => setView('signup')} 
                    className="text-purple-600 hover:underline"
                    data-cy="auth-sim-goto-signup"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Dashboard View (Success!)
  if (view === 'dashboard') {
    const user = JSON.parse(localStorage.getItem('arena_sim_user') || '{}');
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6" data-cy="auth-sim-dashboard">
        <div className="max-w-4xl mx-auto">
          <Card className="border-4 border-green-400 shadow-2xl">
            <CardHeader className="text-center bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex justify-center mb-6">
                <div className="p-6 bg-green-100 rounded-full animate-bounce">
                  <CheckCircle className="h-16 w-16 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-4xl font-bold text-green-900 mb-4" data-cy="auth-sim-dashboard-title">
                🎉 YOU HAVE JUST CROSSED A MAJOR HURDLE!
              </CardTitle>
              <CardDescription className="text-xl text-green-700" data-cy="auth-sim-dashboard-subtitle">
                WELCOME AND CONTINUE LEARNING
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="space-y-6">
                <div className="p-6 bg-white border-2 border-green-200 rounded-lg">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Welcome, {user.firstName} {user.lastName}! 👋
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Congratulations on completing the Authentication Simulator! You've successfully:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Tested user registration with form validation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Received and verified email authentication</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Completed the sign-in authentication flow</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Accessed a protected dashboard</span>
                    </li>
                  </ul>
                </div>

                <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
                  <h3 className="text-xl font-bold text-blue-900 mb-3">
                    🧪 What You Learned:
                  </h3>
                  <ul className="space-y-2 text-blue-800">
                    <li>• How to automate email verification workflows</li>
                    <li>• Testing OTP and token-based authentication</li>
                    <li>• Extracting verification codes from emails</li>
                    <li>• Testing complete authentication flows</li>
                    <li>• Handling form validation and error states</li>
                    <li>• Verifying protected route access</li>
                  </ul>
                </div>

                <div className="p-6 bg-purple-50 border-2 border-purple-200 rounded-lg">
                  <h3 className="text-xl font-bold text-purple-900 mb-3">
                    🚀 Next Steps:
                  </h3>
                  <p className="text-purple-800 mb-4">
                    You're now ready to tackle more complex simulators! Try these next:
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/arena/simulator/ecommerce">
                      <Button variant="outline" className="w-full" data-cy="auth-sim-next-ecommerce">
                        🛒 E-Commerce
                      </Button>
                    </Link>
                    <Link to="/arena/simulator/school">
                      <Button variant="outline" className="w-full" data-cy="auth-sim-next-school">
                        🎓 School Mgmt
                      </Button>
                    </Link>
                    <Link to="/arena/simulator/atm">
                      <Button variant="outline" className="w-full" data-cy="auth-sim-next-atm">
                        💳 ATM
                      </Button>
                    </Link>
                    <Link to="/arena/simulator/transfer">
                      <Button variant="outline" className="w-full" data-cy="auth-sim-next-transfer">
                        💸 Funds Transfer
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      localStorage.removeItem('arena_sim_token');
                      localStorage.removeItem('arena_sim_user');
                      navigate('/');
                    }}
                    data-cy="auth-sim-logout"
                  >
                    Logout
                  </Button>
                  <Button 
                    className="flex-1" 
                    onClick={() => {
                      localStorage.removeItem('arena_sim_token');
                      localStorage.removeItem('arena_sim_user');
                      setView('intro');
                      setFormData({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', authMode: 'otp' });
                    }}
                    data-cy="auth-sim-try-again"
                  >
                    Try Again
                  </Button>
                  <Link to="/arena/dashboard" className="flex-1">
                    <Button variant="outline" className="w-full" data-cy="auth-sim-all-simulators">
                      View All Simulators
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
