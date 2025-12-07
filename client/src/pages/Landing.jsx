import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Download, Bug, Radio, MessageSquare, Code2, Calendar, Trophy } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    // {
    //   icon: <Download className="h-8 w-8" />,
    //   title: 'Download QA Materials',
    //   description: 'Access comprehensive study materials, guides, and resources for your QA journey.',
    //   color: 'bg-teal-500',
    //   link: '#'
    // },
    {
      icon: <Bug className="h-8 w-8" />,
      title: 'Bug Hunting Arena',
      description: 'Practice finding bugs in real-world scenarios with interactive and functional bug hunting.',
      color: 'bg-red-500',
      link: '/bug-hunting-hub'
    },
    {
      icon: <Radio className="h-8 w-8" />,
      title: 'QA Live Quizzes',
      description: 'Join live quiz sessions and compete with other QA professionals in real-time.',
      color: 'bg-green-500',
      link: '/questions'
    },
    // {
    //   icon: <MessageSquare className="h-8 w-8" />,
    //   title: 'Interview Questions',
    //   description: 'Prepare for your next QA interview with our curated collection of questions and answers.',
    //   color: 'bg-purple-500',
    //   link: '#'
    // },
    {
      icon: <Code2 className="h-8 w-8" />,
      title: 'Test Automation Arena',
      description: 'Practice Cypress, Playwright & Selenium on real apps with complete data-cy locators.',
      color: 'bg-yellow-500',
      link: '/arena'
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: 'Events',
      description: 'Stay updated with upcoming QA events, webinars, and community meetups.',
      color: 'bg-cyan-500',
      link: '/events'
    }
  ];

  return (
    <div className="min-h-screen bg-white" data-cy="landing-page">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/web_logo.png" alt="QA ARENA" className="h-10 w-10 object-contain rounded-lg" />
            <span className="text-xl font-bold text-gray-900">QA ARENA</span>
          </div>
          <div className="flex items-center gap-3">
            {!user ? (
              <>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6" data-cy="landing-login-button">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" className="text-lg px-8 py-6" data-cy="landing-get-started-button">Sign Up</Button>
                </Link>
              </>
            ) : (
              <Link to="/dashboard">
                <Button size="lg" className="text-lg px-8 py-6">
                  <Trophy className="h-5 w-5 mr-2" />
                  Go to Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left & Center - Main Content (2 columns) */}
          <div className="lg:col-span-2">
            {/* Hero Section */}
            <div className="mb-12">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Master Software Quality Assurance with ease
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                Elevate your QA skills with interactive quizzes, real-world scenarios, and ISTQB-certified content.
              </p>
              <div className="flex gap-6 mb-12">
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600">100+</div>
                  <div className="text-sm text-gray-600">Active Learners</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600">50+</div>
                  <div className="text-sm text-gray-600">Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-600">ISTQB</div>
                  <div className="text-sm text-gray-600">Certified</div>
                </div>
              </div>
            </div>

            {/* Features Grid - 2 per row */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What We Offer</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {features.map((feature, idx) => (
                  <Link key={idx} to={feature.link} className="block">
                    <Card className="hover:shadow-lg transition-all hover:scale-105 cursor-pointer h-full">
                      <CardHeader>
                        <div className="h-12 w-12 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 mb-3">
                          {feature.icon}
                        </div>
                        <CardTitle className="text-base">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Login Card or Info Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {!user ? (
                <Card className="shadow-lg">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4">
                      <img src="/web_logo.png" alt="QA ARENA" className="h-16 w-16 object-contain rounded-xl" />
                    </div>
                    <CardTitle className="text-xl">Start Your QA Journey</CardTitle>
                    <p className="text-sm text-gray-600 mt-2">Login to access 500+ questions</p>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-sm text-red-600">{error}</p>
                        </div>
                      )}
                      
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full bg-teal-600 hover:bg-teal-700" 
                        disabled={loading}
                      >
                        {loading ? 'Logging in...' : 'Login'}
                      </Button>

                      <p className="text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-teal-600 hover:underline">
                          Sign up
                        </Link>
                      </p>
                    </form>

                    <div className="mt-6 pt-6 border-t">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Questions</span>
                          <span className="font-bold text-teal-600">50+</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Categories</span>
                          <span className="font-bold text-teal-600">3</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Access</span>
                          <span className="font-bold text-teal-600">24/7</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-lg border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4">
                      <img src="/web_logo.png" alt="QA ARENA" className="h-16 w-16 object-contain rounded-xl" />
                    </div>
                    <CardTitle className="text-2xl text-teal-900">Welcome to QA ARENA</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <p className="text-gray-700 leading-relaxed mb-4">
                        This is an <span className="font-bold text-teal-700">arena for Quality Assurance engineers</span> to test their knowledge and skillsets.
                      </p>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        Challenge yourself with interactive quizzes, hunt bugs in real scenarios, and master test automation with hands-on practice.
                      </p>
                    </div>

                    <div className="pt-6 border-t border-teal-200">
                      <div className="text-center mb-4">
                        <Trophy className="h-12 w-12 mx-auto text-teal-600 mb-2" />
                        <p className="text-sm font-semibold text-teal-900">Championed by</p>
                        <p className="text-lg font-bold text-teal-700">Ridwan Abdulazeez</p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-teal-200">
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-teal-600" />
                            Questions
                          </span>
                          <span className="font-bold text-teal-700">50+</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 flex items-center gap-2">
                            <Bug className="h-4 w-4 text-teal-600" />
                            Bug Scenarios
                          </span>
                          <span className="font-bold text-teal-700">10+</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 flex items-center gap-2">
                            <Code2 className="h-4 w-4 text-teal-600" />
                            Automation Simulators
                          </span>
                          <span className="font-bold text-teal-700">5+</span>
                        </div>
                      </div>
                    </div>

                    <Link to="/dashboard">
                      <Button className="w-full bg-teal-600 hover:bg-teal-700 text-lg py-6">
                        <Trophy className="h-5 w-5 mr-2" />
                        Go to Dashboard
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-24">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <img src="/web_logo.png" alt="QA ARENA" className="h-8 w-8 object-contain rounded-lg" />
                <span className="text-lg font-bold text-gray-900">QA ARENA</span>
              </div>
              <p className="text-gray-600 text-sm max-w-sm">Empowering QA professionals worldwide with quality learning resources.</p>
            </div>
            <div>
              <h4 className="text-gray-900 font-semibold mb-3 text-sm">Quick Links</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li><Link to="/events" className="hover:text-teal-600">Events</Link></li>
                <li><Link to="/register" className="hover:text-teal-600">Sign Up</Link></li>
                <li><Link to="/login" className="hover:text-teal-600">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 font-semibold mb-3 text-sm">Resources</h4>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="hover:text-teal-600 cursor-pointer">QA Materials</li>
                <li className="hover:text-teal-600 cursor-pointer">Interview Prep</li>
                <li><Link to="/arena" className="hover:text-teal-600">Test Automation Arena</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center">
            <p className="text-gray-600 text-sm">© 2025 QA ARENA. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
