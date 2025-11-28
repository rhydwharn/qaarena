import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { BookOpen, AlertCircle, Home, ArrowLeft } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100" data-cy="login-page">
      {/* Navigation Bar */}
      <nav className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg">
              <img src="/web_logo.png" alt="App logo" className="h-6 w-6 object-contain" />
              <span>QA ARENA</span>
            </Link>
            <div className="flex items-center gap-2">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="default" size="sm">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="flex items-center justify-center p-4 pt-20">
        <Card className="w-full max-w-md" data-cy="login-card">
          <CardHeader className="space-y-1">
            {/* Back to Home Button */}
            <div className="flex justify-start mb-2">
              <Link to="/">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary rounded-full">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">Sign in to your QA ARENA account</CardDescription>
          </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" data-cy="login-form">
            {error && (
              <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-300 rounded-md flex items-start gap-2" data-cy="login-error-message">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span data-cy="login-error-text">{error}</span>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@istqb.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-cy="login-email-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                data-cy="login-password-input"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading} data-cy="login-submit-button">
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link to="/register" className="text-primary hover:underline font-medium" data-cy="login-signup-link">
              Sign up
            </Link>
          </div>
          {/* <div className="mt-4 p-3 bg-muted rounded-md text-xs text-center">
            <p className="font-medium mb-1">Demo Credentials:</p>
            <p>User: test@example.com / Test123!</p>
          </div> */}
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
