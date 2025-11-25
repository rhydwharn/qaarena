import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  Bug, Trophy, Target, BookOpen, ArrowRight, CheckCircle2, 
  AlertCircle, Star, Award, TrendingUp 
} from 'lucide-react';
import { bugHuntingScenarios, getTotalBugsCount } from '../data/bugHuntingData';

export default function BugHunting() {
  const navigate = useNavigate();
  const [userProgress] = useState(() => {
    const saved = localStorage.getItem('bugHuntingProgress');
    return saved ? JSON.parse(saved) : {};
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const totalBugs = getTotalBugsCount();
  const foundBugs = Object.keys(userProgress).length;
  const progressPercentage = (foundBugs / totalBugs) * 100;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getScenarioProgress = (scenarioId) => {
    const scenario = bugHuntingScenarios.find(s => s.id === scenarioId);
    if (!scenario) return 0;
    
    const scenarioBugs = scenario.bugs.map(b => b.id);
    const foundInScenario = scenarioBugs.filter(bugId => userProgress[bugId]).length;
    return (foundInScenario / scenario.totalBugs) * 100;
  };

  const handleStartScenario = (scenarioId) => {
    navigate(`/bug-hunting/scenario/${scenarioId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
              <Bug className="h-6 w-6 sm:h-7 sm:w-7 text-red-600" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">Interactive Bug Hunting</h1>
              <p className="text-sm sm:text-base text-gray-600 hidden sm:block">Learn to identify UI bugs through hands-on practice</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">Total Bugs</p>
                  <p className="text-3xl font-bold">{totalBugs}</p>
                </div>
                <Bug className="h-10 w-10 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Bugs Found</p>
                  <p className="text-3xl font-bold">{foundBugs}</p>
                </div>
                <CheckCircle2 className="h-10 w-10 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Scenarios</p>
                  <p className="text-3xl font-bold">{bugHuntingScenarios.length}</p>
                </div>
                <Target className="h-10 w-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Progress</p>
                  <p className="text-3xl font-bold">{Math.round(progressPercentage)}%</p>
                </div>
                <TrendingUp className="h-10 w-10 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overall Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Your Bug Hunting Journey
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Overall Progress</span>
                <span className="font-semibold text-gray-900">
                  {foundBugs} / {totalBugs} bugs found
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <div className="flex gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  <span>Found</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-3 w-3 bg-gray-300 rounded-full"></div>
                  <span>Remaining</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              How Bug Hunting Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex gap-3">
                <div className="flex-shrink-0 h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Choose a Scenario</h3>
                  <p className="text-sm text-gray-600">
                    Select from real-world application scenarios with hidden bugs
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Find the Bugs</h3>
                  <p className="text-sm text-gray-600">
                    Click on elements you think contain bugs to reveal them
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Learn & Improve</h3>
                  <p className="text-sm text-gray-600">
                    Read detailed explanations and learn why each issue is a bug
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scenarios Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Bug Hunting Scenarios</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bugHuntingScenarios.map((scenario) => {
              const scenarioProgress = getScenarioProgress(scenario.id);
              const isCompleted = scenarioProgress === 100;

              return (
                <Card 
                  key={scenario.id} 
                  className="hover:shadow-xl transition-all duration-300 border-2 hover:border-red-200"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getDifficultyColor(scenario.difficulty)}>
                        {scenario.difficulty}
                      </Badge>
                      {isCompleted && (
                        <Award className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>
                    <CardTitle className="text-lg">{scenario.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {scenario.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-1">
                        <Bug className="h-4 w-4" />
                        {scenario.totalBugs} bugs to find
                      </span>
                      <span className="font-semibold text-gray-900">
                        {Math.round(scenarioProgress)}%
                      </span>
                    </div>
                    <Progress value={scenarioProgress} className="h-2" />
                    <Button 
                      onClick={() => handleStartScenario(scenario.id)}
                      className="w-full bg-red-600 hover:bg-red-700"
                    >
                      {scenarioProgress > 0 ? 'Continue' : 'Start'} Hunting
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Tips Section */}
        <Card className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              Pro Tips for Bug Hunting
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <span>Look for spelling mistakes in buttons, labels, and headings</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <span>Check if form validations work correctly (try entering invalid data)</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <span>Test buttons and links to ensure they perform the expected action</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <span>Notice alignment issues, overlapping elements, or inconsistent spacing</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <span>Pay attention to color contrast and accessibility concerns</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
