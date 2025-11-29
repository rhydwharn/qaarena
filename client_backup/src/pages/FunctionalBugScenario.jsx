import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Lightbulb, ArrowLeft, Send } from 'lucide-react';
import { functionalBugsAPI } from '../services/api';
import FintechSimulator from '../components/FunctionalBugs/simulators/FintechSimulator';
import EcommerceSimulator from '../components/FunctionalBugs/simulators/EcommerceSimulator';
import OrderingSimulator from '../components/FunctionalBugs/simulators/OrderingSimulator';
import GradingSimulator from '../components/FunctionalBugs/simulators/GradingSimulator';
import CountdownTimerSimulator from '../components/FunctionalBugs/simulators/CountdownTimerSimulator';
import TransactionFeeSimulator from '../components/FunctionalBugs/simulators/TransactionFeeSimulator';
import LoginBugSimulator from '../components/FunctionalBugs/simulators/LoginBugSimulator';
import AccountLockoutSimulator from '../components/FunctionalBugs/simulators/AccountLockoutSimulator';
import WithdrawalSimulator from '../components/FunctionalBugs/simulators/WithdrawalSimulator';
import RefundSimulator from '../components/FunctionalBugs/simulators/RefundSimulator';
import BugIdentifier from '../components/FunctionalBugs/BugIdentifier';
import FeedbackPanel from '../components/FunctionalBugs/FeedbackPanel';
import GuestLoginModal from '../components/FunctionalBugs/GuestLoginModal';

const FunctionalBugScenario = () => {
  const { bugId } = useParams();
  const navigate = useNavigate();
  
  const [bug, setBug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hints, setHints] = useState([]);
  const [showIdentifier, setShowIdentifier] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);
  const [pendingAnswer, setPendingAnswer] = useState(null);

  useEffect(() => {
    startBugScenario();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bugId]);

  useEffect(() => {
    if (!feedback && bug) {
      const interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [feedback, bug]);

  const startBugScenario = async () => {
    try {
      setLoading(true);
      
      // First, get the bug details (public endpoint)
      const bugResponse = await functionalBugsAPI.getById(bugId);
      setBug(bugResponse.data.bug);
      
      // Then, if user is logged in, track the start (optional)
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await functionalBugsAPI.start(bugId);
        } catch (err) {
          // Ignore error if not logged in, just don't track progress
          console.log('Progress tracking skipped:', err.message);
        }
      }
    } catch (error) {
      console.error('Error starting bug scenario:', error);
      alert('Failed to load bug scenario. Please try again.');
      navigate('/functional-bug-hunting');
    } finally {
      setLoading(false);
    }
  };

  const handleGetHint = async () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to use hints');
      navigate('/login');
      return;
    }

    try {
      const response = await functionalBugsAPI.getHint(bugId);
      setHints([...hints, response.data.hint]);
      setHintsUsed(response.data.hintsUsed);
    } catch (error) {
      console.error('Error getting hint:', error);
      alert('Failed to get hint. Please try again.');
    }
  };

  const handleBugFound = () => {
    setShowIdentifier(true);
  };

  const handleSubmitAnswer = async (answer) => {
    // Check if user is logged in or guest
    const token = localStorage.getItem('token');
    const guestMode = sessionStorage.getItem('guestMode');
    
    if (!token && !guestMode) {
      // Show modal to choose login or guest
      setPendingAnswer(answer);
      setShowGuestModal(true);
      return;
    }

    // Submit answer (either as logged in user or guest)
    await submitAnswer(answer, guestMode === 'true');
  };

  const submitAnswer = async (answer, asGuest = false) => {
    try {
      setSubmitting(true);
      
      if (asGuest) {
        // Guest mode - create mock feedback without backend call
        const guestFeedback = createGuestFeedback(answer);
        setFeedback(guestFeedback);
        
        // Save to session storage
        saveGuestProgress(answer, guestFeedback);
      } else {
        // Logged in user - submit to backend
        const response = await functionalBugsAPI.submit(bugId, {
          ...answer,
          timeSpent: timer,
          hintsUsed
        });
        setFeedback(response.data);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      if (error.response?.status === 401) {
        alert('Your session has expired. Please login again.');
        navigate('/login');
      } else {
        const errorMessage = error.response?.data?.message || 'Failed to submit answer. Please try again.';
        alert(errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const createGuestFeedback = (answer) => {
    // Check if answer is correct
    const isCorrect = answer.bugType === bug.bugType;
    
    return {
      isCorrect,
      pointsEarned: 0, // No points for guests
      feedback: {
        bugType: bug.bugType,
        expected: bug.expected,
        actual: bug.actual,
        rootCause: bug.rootCause,
        fix: bug.fix,
        preventionTips: bug.preventionTips,
        testingTips: bug.testingTips
      },
      userAnswer: {
        bugType: answer.bugType,
        description: answer.description,
        confidence: answer.confidence
      }
    };
  };

  const saveGuestProgress = (answer, feedback) => {
    // Save guest progress to session storage
    const guestProgress = JSON.parse(sessionStorage.getItem('guestBugProgress') || '{}');
    guestProgress[bugId] = {
      bugId,
      answer,
      feedback,
      timeSpent: timer,
      hintsUsed,
      completedAt: new Date().toISOString()
    };
    sessionStorage.setItem('guestBugProgress', JSON.stringify(guestProgress));
  };

  const handleContinueAsGuest = () => {
    sessionStorage.setItem('guestMode', 'true');
    setShowGuestModal(false);
    
    if (pendingAnswer) {
      submitAnswer(pendingAnswer, true);
      setPendingAnswer(null);
    }
  };

  const handleCloseModal = () => {
    setShowGuestModal(false);
    setPendingAnswer(null);
  };

  const handleNextBug = () => {
    navigate('/functional-bug-hunting');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderSimulator = () => {
    if (!bug) return null;

    const simulatorProps = {
      bug,
      bugId: bug.bugId,
      onBugFound: handleBugFound,
      disabled: showIdentifier || feedback
    };

    // Map specific bug IDs to their simulators
    const bugSimulatorMap = {
      'FB006': CountdownTimerSimulator,
      'FB007': TransactionFeeSimulator,
      'FB009': LoginBugSimulator,
      'FB010': LoginBugSimulator,
      'FB011': AccountLockoutSimulator,
      'FB013': WithdrawalSimulator,
      'FB015': RefundSimulator
    };

    // Check if there's a specific simulator for this bug
    if (bugSimulatorMap[bug.bugId]) {
      const SpecificSimulator = bugSimulatorMap[bug.bugId];
      return <SpecificSimulator {...simulatorProps} />;
    }

    // Fall back to domain-based simulators
    switch (bug.domain) {
      case 'fintech':
        return <FintechSimulator {...simulatorProps} />;
      case 'ecommerce':
        return <EcommerceSimulator {...simulatorProps} />;
      case 'ordering':
        return <OrderingSimulator {...simulatorProps} />;
      case 'grading':
        return <GradingSimulator {...simulatorProps} />;
      case 'authentication':
        return <LoginBugSimulator {...simulatorProps} />;
      default:
        return <div>Simulator not available for this domain</div>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading bug scenario...</p>
        </div>
      </div>
    );
  }

  if (!bug) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Bug not found</p>
          <button
            onClick={() => navigate('/functional-bug-hunting')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Back to Bug Hunting
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/functional-bug-hunting')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Bug Hunting
          </button>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-mono text-gray-500">{bug.bugId}</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    bug.difficulty === 'beginner' ? 'bg-blue-100 text-blue-800' :
                    bug.difficulty === 'intermediate' ? 'bg-purple-100 text-purple-800' :
                    'bg-pink-100 text-pink-800'
                  }`}>
                    {bug.difficulty}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    bug.severity === 'low' ? 'bg-green-100 text-green-800' :
                    bug.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    bug.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {bug.severity}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{bug.title}</h1>
                <p className="text-gray-600">{bug.scenario.description}</p>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="flex items-center gap-6 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-400" />
                <span className="font-mono text-lg">{formatTime(timer)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <span className="text-sm text-gray-600">
                  Hints used: {hintsUsed}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Points: <span className="font-bold text-yellow-600">{bug.points}</span>
                </span>
              </div>
              {!showIdentifier && !feedback && (
                <button
                  onClick={handleGetHint}
                  className="ml-auto flex items-center gap-2 px-4 py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg transition-colors"
                >
                  <Lightbulb className="h-4 w-4" />
                  Get Hint (-10 pts)
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Hints Display */}
        {hints.length > 0 && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">💡 Hints:</h3>
            <ul className="space-y-1">
              {hints.map((hint, index) => (
                <li key={index} className="text-yellow-800">
                  {index + 1}. {hint}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Simulator */}
        {!feedback && (
          <div className="mb-6">
            {renderSimulator()}
          </div>
        )}

        {/* Bug Identifier */}
        {showIdentifier && !feedback && (
          <div className="mb-6">
            <BugIdentifier
              bug={bug}
              onSubmit={handleSubmitAnswer}
              submitting={submitting}
            />
          </div>
        )}

        {/* Feedback Panel */}
        {feedback && (
          <FeedbackPanel
            feedback={feedback}
            onNext={handleNextBug}
          />
        )}
      </div>

      {/* Guest Login Modal */}
      <GuestLoginModal
        isOpen={showGuestModal}
        onClose={handleCloseModal}
        onContinueAsGuest={handleContinueAsGuest}
      />
    </div>
  );
};

export default FunctionalBugScenario;
