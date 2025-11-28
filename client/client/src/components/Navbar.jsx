import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { BookOpen, LogOut, User, LayoutDashboard, Trophy, BarChart3, Award, Menu, X, Bug, Upload } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50" data-cy="navbar">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 font-bold text-lg sm:text-xl" data-cy="navbar-logo">
              <img src="/web_logo.png" alt="App logo" className="h-6 w-6 object-contain" />
              <span className="truncate">QA ARENA</span>
            </Link>
            {user && (
              <div className="hidden md:flex items-center gap-4">
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" data-cy="navbar-dashboard-link">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/questions">
                  <Button variant="ghost" size="sm" data-cy="navbar-questions-link">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Questions
                  </Button>
                </Link>
                <Link to="/leaderboard">
                  <Button variant="ghost" size="sm" data-cy="navbar-leaderboard-link">
                    <Trophy className="h-4 w-4 mr-2" />
                    Leaderboard
                  </Button>
                </Link>
                <Link to="/progress">
                  <Button variant="ghost" size="sm" data-cy="navbar-progress-link">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Progress
                  </Button>
                </Link>
                <Link to="/achievements">
                  <Button variant="ghost" size="sm" data-cy="navbar-achievements-link">
                    <Award className="h-4 w-4 mr-2" />
                    Achievements
                  </Button>
                </Link>
                <Link to="/bug-hunting-hub">
                  <Button variant="ghost" size="sm" data-cy="navbar-bug-hunting-link">
                    <Bug className="h-4 w-4 mr-2" />
                    Bug Hunting
                  </Button>
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/question-upload">
                    <Button variant="ghost" size="sm" data-cy="navbar-upload-link">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </Link>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2 text-sm" data-cy="navbar-username">
                  <User className="h-4 w-4" />
                  <span className="font-medium truncate max-w-[100px]">{user.username}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout} className="hidden sm:flex" data-cy="navbar-logout-button">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
                
                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  data-cy="navbar-mobile-menu-button"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" data-cy="navbar-login-button">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="default" size="sm" data-cy="navbar-register-button">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {user && isMobileMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-2" data-cy="navbar-mobile-menu">
            <Link to="/dashboard" onClick={closeMobileMenu}>
              <Button variant="ghost" size="sm" className="w-full justify-start" data-cy="navbar-mobile-dashboard">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link to="/questions" onClick={closeMobileMenu}>
              <Button variant="ghost" size="sm" className="w-full justify-start" data-cy="navbar-mobile-questions">
                <BookOpen className="h-4 w-4 mr-2" />
                Questions
              </Button>
            </Link>
            <Link to="/leaderboard" onClick={closeMobileMenu}>
              <Button variant="ghost" size="sm" className="w-full justify-start" data-cy="navbar-mobile-leaderboard">
                <Trophy className="h-4 w-4 mr-2" />
                Leaderboard
              </Button>
            </Link>
            <Link to="/progress" onClick={closeMobileMenu}>
              <Button variant="ghost" size="sm" className="w-full justify-start" data-cy="navbar-mobile-progress">
                <BarChart3 className="h-4 w-4 mr-2" />
                Progress
              </Button>
            </Link>
            <Link to="/achievements" onClick={closeMobileMenu}>
              <Button variant="ghost" size="sm" className="w-full justify-start" data-cy="navbar-mobile-achievements">
                <Award className="h-4 w-4 mr-2" />
                Achievements
              </Button>
            </Link>
            <Link to="/bug-hunting-hub" onClick={closeMobileMenu}>
              <Button variant="ghost" size="sm" className="w-full justify-start" data-cy="navbar-mobile-bug-hunting">
                <Bug className="h-4 w-4 mr-2" />
                Bug Hunting
              </Button>
            </Link>
            {user?.role === 'admin' && (
              <Link to="/question-upload" onClick={closeMobileMenu}>
                <Button variant="ghost" size="sm" className="w-full justify-start" data-cy="navbar-mobile-upload">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Questions
                </Button>
              </Link>
            )}
            <div className="border-t pt-2 mt-2">
              <div className="flex items-center gap-2 px-3 py-2 text-sm">
                <User className="h-4 w-4" />
                <span className="font-medium">{user.username}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="w-full justify-start" data-cy="navbar-mobile-logout">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
