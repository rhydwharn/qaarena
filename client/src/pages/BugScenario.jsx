import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle 
} from '../components/ui/dialog';
import { 
  Bug, ArrowLeft, CheckCircle2, XCircle, Lightbulb, 
  AlertTriangle, Info, Trophy, Target, BookOpen 
} from 'lucide-react';
import { bugHuntingScenarios } from '../data/bugHuntingData';
import ScenarioRenderer from '../components/bug-hunting/ScenarioRenderer';

export default function BugScenario() {
  const { scenarioId } = useParams();
  const navigate = useNavigate();
  const scenario = bugHuntingScenarios.find(s => s.id === parseInt(scenarioId));
  
  const [foundBugs, setFoundBugs] = useState(() => {
    const saved = localStorage.getItem('bugHuntingProgress');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [selectedBug, setSelectedBug] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Scroll to top when scenario changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [scenarioId]);

  useEffect(() => {
    localStorage.setItem('bugHuntingProgress', JSON.stringify(foundBugs));
  }, [foundBugs]);

  if (!scenario) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="pt-6">
            <p className="text-red-600">Scenario not found</p>
            <Button onClick={() => navigate('/bug-hunting')} className="mt-4">
              Back to Bug Hunting
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const scenarioBugs = scenario.bugs.map(b => b.id);
  const foundInScenario = scenarioBugs.filter(bugId => foundBugs[bugId]).length;
  const progressPercentage = (foundInScenario / scenario.totalBugs) * 100;
  const isCompleted = progressPercentage === 100;

  const handleBugClick = (bug) => {
    // Mark bug as found if not already found
    if (!foundBugs[bug.id]) {
      setFoundBugs(prev => ({
        ...prev,
        [bug.id]: {
          foundAt: new Date().toISOString(),
          points: bug.severity.points
        }
      }));
    }
    // Show bug details in modal
    setSelectedBug(bug);
    setIsModalOpen(true);
    setShowHint(false);
  };

  const getSeverityIcon = (severity) => {
    switch (severity.label) {
      case 'Critical': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'High': return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'Medium': return <Info className="h-5 w-5 text-yellow-600" />;
      case 'Low': return <Info className="h-5 w-5 text-blue-600" />;
      default: return <Bug className="h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity.label) {
      case 'Critical': return 'bg-red-100 text-red-700 border-red-300';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Low': return 'bg-blue-100 text-blue-700 border-blue-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Mobile Responsive */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button onClick={() => navigate('/bug-hunting')} variant="outline" size="sm" className="shrink-0">
                <ArrowLeft className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-xl font-bold text-gray-900 truncate">{scenario.title}</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">{scenario.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
              <div className="text-left sm:text-right">
                <p className="text-xs sm:text-sm text-gray-600">Progress</p>
                <p className="text-base sm:text-lg font-bold text-gray-900">
                  {foundInScenario} / {scenario.totalBugs}
                </p>
              </div>
              {isCompleted && (
                <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />
              )}
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2 mt-2 sm:mt-3" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Side-by-side layout: Application and Checklist */}
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Interactive Application - 2 columns on desktop */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Target className="h-5 w-5 text-red-600" />
                  Interactive Application
                </CardTitle>
                <p className="text-xs sm:text-sm text-gray-600 mt-2">
                  Click on elements you think contain bugs. A modal will show the bug details.
                </p>
              </CardHeader>
              <CardContent className="pt-4 sm:pt-6 overflow-x-auto">
                <ScenarioRenderer 
                  scenario={scenario} 
                  onBugClick={handleBugClick} 
                  foundBugs={foundBugs}
                  selectedBug={selectedBug}
                />
              </CardContent>
            </Card>
          </div>

          {/* Bug Checklist - 1 column on desktop */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Instructions Card */}
            <Card className="shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader className="py-3 sm:py-4">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 shrink-0" />
                  <span>Instructions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs sm:text-sm text-gray-700">
                <p className="font-semibold text-blue-900">👆 Click on elements to discover bugs</p>
                <p>✅ Bug details will appear in a modal</p>
                <p>🎯 Find all {scenario.totalBugs} bugs to complete!</p>
              </CardContent>
            </Card>

            {/* Bug Checklist */}
            <Card className="shadow-lg">
              <CardHeader className="py-3 sm:py-4">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Bug className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 shrink-0" />
                  <span>Bug Checklist ({foundInScenario}/{scenario.totalBugs})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[60vh] sm:max-h-[70vh] overflow-y-auto">
                {scenario.bugs.map((bug) => (
                  <div
                    key={bug.id}
                    onClick={() => handleBugClick(bug)}
                    className={`p-2 sm:p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedBug?.id === bug.id
                        ? 'bg-yellow-50 border-yellow-400 ring-2 ring-yellow-400'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100 active:bg-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {foundBugs[bug.id] ? (
                          <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 shrink-0" />
                        ) : (
                          <div className="h-3 w-3 sm:h-4 sm:w-4 rounded-full border-2 border-gray-300 shrink-0" />
                        )}
                        <span className={`text-xs sm:text-sm font-medium truncate ${foundBugs[bug.id] ? 'text-green-700' : 'text-gray-900'}`}>
                          {bug.type}
                        </span>
                      </div>
                      <Badge className={`text-[10px] sm:text-xs ${getSeverityColor(bug.severity)} shrink-0`}>
                        {bug.severity.label}
                      </Badge>
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-600 mt-1 ml-5 sm:ml-6 truncate">{bug.location}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Hint Button */}
            {!isCompleted && (
              <Card className="shadow-lg bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6">
                  <Button
                    onClick={() => setShowHint(!showHint)}
                    variant="outline"
                    className="w-full text-sm sm:text-base"
                  >
                    <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    {showHint ? 'Hide Hint' : 'Need a Hint?'}
                  </Button>
                  {showHint && (
                    <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-white rounded-lg border border-purple-200">
                      <p className="text-xs sm:text-sm text-gray-700">
                        💡 Look for the first unfound bug in the checklist and carefully examine that area of the application!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Completion Card */}
            {isCompleted && (
              <Card className="shadow-lg bg-gradient-to-r from-green-50 to-emerald-50 border-green-300">
                <CardContent className="pt-4 sm:pt-6 pb-4 sm:pb-6 text-center">
                  <Trophy className="h-10 w-10 sm:h-12 sm:w-12 text-yellow-500 mx-auto mb-2 sm:mb-3" />
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                    Scenario Complete! 🎉
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4">
                    You found all {scenario.totalBugs} bugs in this scenario!
                  </p>
                  <Button
                    onClick={() => navigate('/bug-hunting')}
                    className="w-full bg-green-600 hover:bg-green-700 text-sm sm:text-base"
                  >
                    Back to Scenarios
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Bug Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedBug && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between gap-2 pr-8">
                  <div className="flex items-center gap-2">
                    {foundBugs[selectedBug.id] ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                    ) : (
                      <Bug className="h-5 w-5 text-red-600 shrink-0" />
                    )}
                    <span>Bug Details</span>
                  </div>
                  <Badge className={`${getSeverityColor(selectedBug.severity)} shrink-0`}>
                    {selectedBug.severity.label}
                  </Badge>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 pt-4">
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 flex items-center gap-2">
                      <Bug className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 shrink-0" />
                      <span>Bug Type</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-700 bg-gray-50 p-2 rounded break-words">{selectedBug.type}</p>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 flex items-center gap-2">
                      <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 shrink-0" />
                      <span>What's Wrong</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-700 bg-red-50 p-2 sm:p-3 rounded border border-red-200 break-words">
                      {selectedBug.bugText}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 shrink-0" />
                      <span>Correct Version</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-700 bg-green-50 p-2 sm:p-3 rounded border border-green-200 break-words">
                      {selectedBug.correctText}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 flex items-center gap-2">
                      <Info className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 shrink-0" />
                      <span>Explanation</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-700 bg-blue-50 p-2 sm:p-3 rounded border border-blue-200 break-words">
                      {selectedBug.explanation}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 flex items-center gap-2">
                      <Lightbulb className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600 shrink-0" />
                      <span>Learning Point</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-700 bg-yellow-50 p-2 sm:p-3 rounded border border-yellow-200 break-words">
                      {selectedBug.learningPoint}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1 flex items-center gap-2">
                      {getSeverityIcon(selectedBug.severity)}
                      <span>Impact</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-700 bg-gray-50 p-2 sm:p-3 rounded break-words">
                      {selectedBug.impact}
                    </p>
                  </div>

                  {foundBugs[selectedBug.id] && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm font-semibold text-green-700 flex items-center gap-2">
                        <Trophy className="h-4 w-4" />
                        +{selectedBug.severity.points} points earned!
                      </p>
                    </div>
                  )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
