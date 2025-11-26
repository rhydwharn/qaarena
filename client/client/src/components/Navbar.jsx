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
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 font-bold text-lg sm:text-xl">
              <img src="/web_logo.png" alt="App logo" className="h-6 w-6 object-contain" />
              <span className="truncate">QA ARENA</span>
            </Link>
            {user && (
              <div className="hidden md:flex items-center gap-4">
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/questions">
                  <Button variant="ghost" size="sm">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Questions
                  </Button>
                </Link>
                <Link to="/leaderboard">
                  <Button variant="ghost" size="sm">
                    <Trophy className="h-4 w-4 mr-2" />
                    Leaderboard
                  </Button>
                </Link>
                <Link to="/progress">
                  <Button variant="ghost" size="sm">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Progress
                  </Button>
                </Link>
                <Link to="/achievements">
                  <Button variant="ghost" size="sm">
                    <Award className="h-4 w-4 mr-2" />
                    Achievements
                  </Button>
                </Link>
                <Link to="/bug-hunting-hub">
                  <Button variant="ghost" size="sm">
                    <Bug className="h-4 w-4 mr-2" />
                    Bug Hunting
                  </Button>
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/question-upload">
                    <Button variant="ghost" size="sm">
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
                <div className="hidden sm:flex items-center gap-2 text-sm">
                  <User className="h-4 w-4" />
                  <span className="font-medium truncate max-w-[100px]">{user.username}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout} className="hidden sm:flex">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
                
                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="default" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {user && isMobileMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-2">
            <Link to="/dashboard" onClick={closeMobileMenu}>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link to="/questions" onClick={closeMobileMenu}>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <BookOpen className="h-4 w-4 mr-2" />
                Questions
              </Button>
            </Link>
            <Link to="/leaderboard" onClick={closeMobileMenu}>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Trophy className="h-4 w-4 mr-2" />
                Leaderboard
              </Button>
            </Link>
            <Link to="/progress" onClick={closeMobileMenu}>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Progress
              </Button>
            </Link>
            <Link to="/achievements" onClick={closeMobileMenu}>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Award className="h-4 w-4 mr-2" />
                Achievements
              </Button>
            </Link>
            <Link to="/bug-hunting-hub" onClick={closeMobileMenu}>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Bug className="h-4 w-4 mr-2" />
                Bug Hunting
              </Button>
            </Link>
            {user?.role === 'admin' && (
              <Link to="/question-upload" onClick={closeMobileMenu}>
                <Button variant="ghost" size="sm" className="w-full justify-start">
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
              <Button variant="outline" size="sm" onClick={handleLogout} className="w-full justify-start">
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
