import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { ShoppingCart, GraduationCap, CreditCard, ArrowLeftRight, LogOut, User, Play, CheckCircle, Clock, Trophy, Lock } from 'lucide-react';

export default function ArenaDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is authenticated (optional for demo)
    const token = localStorage.getItem('arena_auth_token');
    const userData = localStorage.getItem('arena_user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    } else {
      // Set demo user for testing
      setUser({
        email: 'demo@arena.com',
        firstName: 'Demo',
        lastName: 'User'
      });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('arena_auth_token');
    localStorage.removeItem('arena_user');
    navigate('/');
  };

  const simulators = [
    {
      id: 'auth',
      icon: <Lock className="h-12 w-12 text-pink-500" />,
      title: 'Authentication Simulator',
      description: 'Master sign-up, email verification, and sign-in flows with real emails',
      color: 'bg-pink-50 border-pink-200',
      route: '/arena/auth-simulator',
      scenarios: 8,
      completed: 0,
      featured: true
    },
    {
      id: 'ecommerce',
      icon: <ShoppingCart className="h-12 w-12 text-blue-500" />,
      title: 'E-Commerce Simulator',
      description: 'Test product browsing, cart management, and checkout flows',
      color: 'bg-blue-50 border-blue-200',
      route: '/arena/simulator/ecommerce',
      scenarios: 15,
      completed: 0
    },
    {
      id: 'school',
      icon: <GraduationCap className="h-12 w-12 text-green-500" />,
      title: 'School Management',
      description: 'Automate student enrollment and course management',
      color: 'bg-green-50 border-green-200',
      route: '/arena/simulator/school',
      scenarios: 12,
      completed: 0
    },
    {
      id: 'atm',
      icon: <CreditCard className="h-12 w-12 text-purple-500" />,
      title: 'ATM Simulator',
      description: 'Test cash withdrawal, deposit, and balance inquiry',
      color: 'bg-purple-50 border-purple-200',
      route: '/arena/simulator/atm',
      scenarios: 10,
      completed: 0
    },
    {
      id: 'transfer',
      icon: <ArrowLeftRight className="h-12 w-12 text-orange-500" />,
      title: 'Funds Transfer',
      description: 'Automate money transfers and transaction history',
      color: 'bg-orange-50 border-orange-200',
      route: '/arena/simulator/transfer',
      scenarios: 8,
      completed: 0
    }
  ];

  const stats = [
    {
      icon: <Play className="h-6 w-6 text-blue-500" />,
      label: 'Simulators Available',
      value: '5',
      color: 'bg-blue-50'
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      label: 'Scenarios Completed',
      value: '0/53',
      color: 'bg-green-50'
    },
    {
      icon: <Clock className="h-6 w-6 text-purple-500" />,
      label: 'Practice Time',
      value: '0h',
      color: 'bg-purple-50'
    },
    {
      icon: <Trophy className="h-6 w-6 text-yellow-500" />,
      label: 'Achievement Points',
      value: '0',
      color: 'bg-yellow-50'
    }
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen" data-cy="arena-dashboard-loading">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" data-cy="arena-dashboard-page">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm" data-cy="arena-dashboard-header">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/arena" className="flex items-center gap-3" data-cy="arena-dashboard-logo">
            <img src="/web_logo.png" alt="QA ARENA" className="h-10 w-10 object-contain rounded-lg" />
            <div>
              <span className="text-xl font-bold text-gray-900">Test Automation Arena</span>
              <p className="text-xs text-gray-500">Dashboard</p>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2" data-cy="arena-dashboard-user-info">
              <User className="h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700" data-cy="arena-dashboard-user-name">
                {user.firstName} {user.lastName}
              </span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              data-cy="arena-dashboard-logout-button"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8" data-cy="arena-dashboard-welcome">
          <h1 className="text-3xl font-bold text-gray-900 mb-2" data-cy="arena-dashboard-welcome-title">
            Welcome back, {user.firstName}! 👋
          </h1>
          <p className="text-gray-600" data-cy="arena-dashboard-welcome-subtitle">
            Choose a simulator below to start practicing test automation
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" data-cy="arena-dashboard-stats">
          {stats.map((stat, index) => (
            <Card key={index} className="border-2" data-cy={`arena-dashboard-stat-${index}`}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1" data-cy={`arena-dashboard-stat-label-${index}`}>
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900" data-cy={`arena-dashboard-stat-value-${index}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 ${stat.color} rounded-lg`} data-cy={`arena-dashboard-stat-icon-${index}`}>
                    {stat.icon}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Simulators Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6" data-cy="arena-dashboard-simulators-title">
            Available Simulators
          </h2>
          <div className="grid md:grid-cols-2 gap-6" data-cy="arena-dashboard-simulators-grid">
            {simulators.map((simulator, index) => (
              <Card 
                key={simulator.id}
                className={`${simulator.color} border-2 hover:shadow-lg transition-all duration-300`}
                data-cy={`arena-dashboard-simulator-${simulator.id}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-lg shadow-sm" data-cy={`arena-dashboard-simulator-icon-${simulator.id}`}>
                        {simulator.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl mb-1" data-cy={`arena-dashboard-simulator-title-${simulator.id}`}>
                          {simulator.title}
                        </CardTitle>
                        <CardDescription data-cy={`arena-dashboard-simulator-description-${simulator.id}`}>
                          {simulator.description}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4" data-cy={`arena-dashboard-simulator-progress-${simulator.id}`}>
                    <span data-cy={`arena-dashboard-simulator-scenarios-${simulator.id}`}>
                      {simulator.scenarios} scenarios
                    </span>
                    <span data-cy={`arena-dashboard-simulator-completed-${simulator.id}`}>
                      {simulator.completed}/{simulator.scenarios} completed
                    </span>
                  </div>
                  <Link to={simulator.route}>
                    <Button className="w-full" data-cy={`arena-dashboard-simulator-launch-${simulator.id}`}>
                      <Play className="h-4 w-4 mr-2" />
                      Launch Simulator
                    </Button>
                  </Link>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Getting Started Guide */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200" data-cy="arena-dashboard-guide">
          <CardHeader>
            <CardTitle data-cy="arena-dashboard-guide-title">
              🚀 Getting Started with Test Automation Arena
            </CardTitle>
            <CardDescription data-cy="arena-dashboard-guide-description">
              Follow these steps to make the most of your learning experience
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3" data-cy="arena-dashboard-guide-steps">
              <li className="flex items-start gap-3" data-cy="arena-dashboard-guide-step-0">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </span>
                <p className="text-gray-700">
                  <strong>Choose a simulator</strong> - Start with the E-Commerce app for a comprehensive introduction
                </p>
              </li>
              <li className="flex items-start gap-3" data-cy="arena-dashboard-guide-step-1">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </span>
                <p className="text-gray-700">
                  <strong>Explore the interface</strong> - Every element has a data-cy attribute for easy automation
                </p>
              </li>
              <li className="flex items-start gap-3" data-cy="arena-dashboard-guide-step-2">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </span>
                <p className="text-gray-700">
                  <strong>Write your tests</strong> - Use Cypress, Playwright, or Selenium to automate the scenarios
                </p>
              </li>
              <li className="flex items-start gap-3" data-cy="arena-dashboard-guide-step-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </span>
                <p className="text-gray-700">
                  <strong>Practice regularly</strong> - Complete all scenarios to master test automation patterns
                </p>
              </li>
            </ol>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
