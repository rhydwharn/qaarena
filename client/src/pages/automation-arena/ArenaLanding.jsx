import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Code2, CheckCircle, BookOpen, Users, ShoppingCart, GraduationCap, CreditCard, ArrowLeftRight, Zap, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ArenaLanding() {
  const { user } = useAuth();
  const features = [
    {
      icon: <Lock className="h-12 w-12 text-pink-500" />,
      title: 'Authentication Simulator',
      description: 'Master sign-up, email verification, and sign-in flows with real email verification tokens.',
      color: 'bg-pink-50 border-pink-200',
      route: '/arena/auth-simulator'
    },
    {
      icon: <ShoppingCart className="h-12 w-12 text-blue-500" />,
      title: 'E-Commerce Simulator',
      description: 'Practice testing product browsing, cart management, checkout flows, and payment processing.',
      color: 'bg-blue-50 border-blue-200',
      route: '/arena/simulator/ecommerce'
    },
    {
      icon: <GraduationCap className="h-12 w-12 text-green-500" />,
      title: 'School Management',
      description: 'Automate student enrollment, course registration, and grade management workflows.',
      color: 'bg-green-50 border-green-200',
      route: '/arena/simulator/school'
    },
    {
      icon: <CreditCard className="h-12 w-12 text-purple-500" />,
      title: 'ATM Simulator',
      description: 'Test cash withdrawal, deposits, balance inquiries, and PIN management scenarios.',
      color: 'bg-purple-50 border-purple-200',
      route: '/arena/simulator/atm'
    },
    {
      icon: <ArrowLeftRight className="h-12 w-12 text-orange-500" />,
      title: 'Funds Transfer',
      description: 'Practice testing money transfers, beneficiary management, and transaction history.',
      color: 'bg-orange-50 border-orange-200',
      route: '/arena/simulator/transfer'
    }
  ];

  const benefits = [
    {
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      title: 'Real-World Scenarios',
      description: 'Practice with realistic applications that mirror production environments'
    },
    {
      icon: <Code2 className="h-6 w-6 text-blue-500" />,
      title: 'Complete Data-CY Locators',
      description: 'Every element tagged with data-cy attributes for easy automation'
    },
    {
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      title: 'Instant Feedback',
      description: 'See your tests in action with immediate visual feedback'
    },
    {
      icon: <Users className="h-6 w-6 text-purple-500" />,
      title: 'Multi-Tool Support',
      description: 'Perfect for Cypress, Playwright, Selenium, and other frameworks'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50" data-cy="arena-landing-page">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3" data-cy="arena-home-link">
            <img src="/web_logo.png" alt="QA ARENA" className="h-10 w-10 object-contain rounded-lg" />
            <div>
              <span className="text-xl font-bold text-gray-900">Test Automation Arena</span>
              <p className="text-xs text-gray-500">Master E2E Testing</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              // Logged in to main app - show direct access
              <>
                <span className="text-sm text-gray-600" data-cy="arena-welcome-user">
                  Welcome, {user.name || user.email}
                </span>
                <Link to="/arena/dashboard">
                  <Button size="lg" data-cy="arena-access-button">
                    Access Simulators
                  </Button>
                </Link>
              </>
            ) : (
              // Not logged in - show auth simulator options
              <>
                <Link to="/arena/dashboard">
                  <Button variant="ghost" size="lg" data-cy="arena-demo-button">
                    Try Demo
                  </Button>
                </Link>
                <Link to="/arena/auth-simulator">
                  <Button variant="outline" size="lg" data-cy="arena-auth-simulator-button">
                    Try Auth Simulator
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button size="lg" data-cy="arena-main-login-button">
                    Login to Main App
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center" data-cy="arena-hero-section">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6" data-cy="arena-hero-title">
            Master Test Automation with
            <span className="text-blue-600"> Real Applications</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8" data-cy="arena-hero-description">
            Practice Cypress, Playwright, and Selenium on fully functional web applications. 
            Every element is tagged with data-cy locators for seamless automation learning.
          </p>
          <div className="flex gap-4 justify-center">
            {user ? (
              <Link to="/arena/dashboard">
                <Button size="lg" className="text-lg px-8 py-6" data-cy="arena-hero-access-button">
                  Access All Simulators
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/arena/auth-simulator">
                  <Button size="lg" className="text-lg px-8 py-6" data-cy="arena-hero-cta-button">
                    Try Auth Simulator
                  </Button>
                </Link>
                <Link to="/arena/dashboard">
                  <Button variant="outline" size="lg" className="text-lg px-8 py-6" data-cy="arena-hero-demo-button">
                    Try Demo
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16" data-cy="arena-features-section">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4" data-cy="arena-features-title">
            Five Complete Applications to Master
          </h2>
          <p className="text-xl text-gray-600" data-cy="arena-features-subtitle">
            Each simulator provides unique testing challenges and real-world scenarios
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Link key={index} to={feature.route} className="block">
              <Card 
                className={`${feature.color} border-2 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer h-full`}
                data-cy={`arena-feature-card-${index}`}
              >
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-white rounded-lg shadow-sm" data-cy={`arena-feature-icon-${index}`}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-2xl" data-cy={`arena-feature-title-${index}`}>
                      {feature.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-base" data-cy={`arena-feature-description-${index}`}>
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-16" data-cy="arena-benefits-section">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4" data-cy="arena-benefits-title">
              Why Test Automation Arena?
            </h2>
            <p className="text-xl text-gray-600" data-cy="arena-benefits-subtitle">
              Everything you need to become a test automation expert
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="text-center"
                data-cy={`arena-benefit-${index}`}
              >
                <div className="flex justify-center mb-4" data-cy={`arena-benefit-icon-${index}`}>
                  <div className="p-4 bg-gray-100 rounded-full">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2" data-cy={`arena-benefit-title-${index}`}>
                  {benefit.title}
                </h3>
                <p className="text-gray-600" data-cy={`arena-benefit-description-${index}`}>
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20" data-cy="arena-cta-section">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="text-4xl font-bold mb-6" data-cy="arena-cta-title">
            Ready to Level Up Your Testing Skills?
          </h2>
          <p className="text-xl mb-8 opacity-90" data-cy="arena-cta-description">
            Join thousands of QA professionals mastering test automation
          </p>
          <Link to="/arena/signup">
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-lg px-12 py-6 bg-white text-blue-600 hover:bg-gray-100"
              data-cy="arena-cta-button"
            >
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12" data-cy="arena-footer">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400" data-cy="arena-footer-text">
            © 2024 Test Automation Arena. Part of QA ARENA Platform.
          </p>
          <div className="mt-4 flex justify-center gap-6">
            <Link to="/" className="text-gray-400 hover:text-white" data-cy="arena-footer-home">
              Back to QA Arena
            </Link>
            <Link to="/arena/about" className="text-gray-400 hover:text-white" data-cy="arena-footer-about">
              About
            </Link>
            <Link to="/arena/contact" className="text-gray-400 hover:text-white" data-cy="arena-footer-contact">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
