import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Questions from './pages/Questions';
import Quiz from './pages/Quiz';
import Progress from './pages/Progress';
import Leaderboard from './pages/Leaderboard';
import Achievements from './pages/Achievements';
import Events from './pages/Events';
import BugHuntingHub from './pages/BugHuntingHub';
import BugHunting from './pages/BugHunting';
import BugScenario from './pages/BugScenario';
import FunctionalBugHunting from './pages/FunctionalBugHunting';
import FunctionalBugScenario from './pages/FunctionalBugScenario';
import QuestionUpload from './pages/QuestionUpload';

// Test Automation Arena imports
import ArenaLanding from './pages/automation-arena/ArenaLanding';
import ArenaSignUp from './pages/automation-arena/ArenaSignUp';
import ArenaSignIn from './pages/automation-arena/ArenaSignIn';
import ArenaDashboard from './pages/automation-arena/ArenaDashboard';
import EcommerceSimulator from './pages/automation-arena/simulators/EcommerceSimulator';
import SchoolManagementSimulator from './pages/automation-arena/simulators/SchoolManagementSimulator';
import ATMSimulator from './pages/automation-arena/simulators/ATMSimulator';
import FundsTransferSimulator from './pages/automation-arena/simulators/FundsTransferSimulator';
import AuthSimulator from './pages/automation-arena/simulators/AuthSimulator';

// Lazy load Admin page
const Admin = lazy(() => import('./pages/Admin'));

// Admin route protection
function AdminRoute({ children }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<Events />} />
          
          {/* Test Automation Arena - Public Routes */}
          <Route path="/arena" element={<ArenaLanding />} />
          <Route path="/arena/signup" element={<ArenaSignUp />} />
          <Route path="/arena/signin" element={<ArenaSignIn />} />
          <Route path="/arena/dashboard" element={<ArenaDashboard />} />
          <Route path="/arena/auth-simulator" element={<AuthSimulator />} />
          <Route path="/arena/simulator/ecommerce" element={<EcommerceSimulator />} />
          <Route path="/arena/simulator/school" element={<SchoolManagementSimulator />} />
          <Route path="/arena/simulator/atm" element={<ATMSimulator />} />
          <Route path="/arena/simulator/transfer" element={<FundsTransferSimulator />} />
          
          {/* Public Bug Hunting Routes with Navbar */}
          <Route element={<Layout />}>
            <Route path="/bug-hunting-hub" element={<BugHuntingHub />} />
            <Route path="/bug-hunting" element={<BugHunting />} />
            <Route path="/bug-hunting/scenario/:scenarioId" element={<BugScenario />} />
            <Route path="/functional-bug-hunting" element={<FunctionalBugHunting />} />
            <Route path="/functional-bug-hunting/:bugId" element={<FunctionalBugScenario />} />
          </Route>
          
          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/questions" element={<Questions />} />
            <Route path="/quiz/:id" element={<Quiz />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Suspense fallback={
                    <div className="flex items-center justify-center min-h-screen">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                  }>
                    <Admin />
                  </Suspense>
                </AdminRoute>
              }
            />
            <Route
              path="/question-upload"
              element={
                <AdminRoute>
                  <QuestionUpload />
                </AdminRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
