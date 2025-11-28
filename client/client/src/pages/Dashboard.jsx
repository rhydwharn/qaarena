import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { progressAPI, quizAPI, questionsAPI } from '../services/api';
import { BookOpen, Trophy, Target, Flame, PlayCircle } from 'lucide-react';
import { getCategories, formatCategoriesForSelect } from '../services/categoryService';

export default function Dashboard() {
  const [progress, setProgress] = useState(null);
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [category, setCategory] = useState('');
  const [maxAvailable, setMaxAvailable] = useState(null);
  const [numQuestions, setNumQuestions] = useState(10);
  const [allQuestions, setAllQuestions] = useState(false);
  const [categories, setCategories] = useState([]);
  const [inProgressQuiz, setInProgressQuiz] = useState(null);

  useEffect(() => {
    loadCategories();
    loadDashboardData();
    checkInProgressQuiz();
  }, []);

  const loadCategories = async () => {
    const cats = await getCategories();
    setCategories(formatCategoriesForSelect(cats));
  };

  const checkInProgressQuiz = async () => {
    try {
      const response = await quizAPI.getInProgress();
      if (response.data.data.quiz) {
        setInProgressQuiz(response.data.data.quiz);
      }
    } catch (error) {
      console.error('Failed to check for in-progress quiz:', error);
    }
  };

  const normalizePercent = (value) => {
    if (typeof value === 'number' && !isNaN(value)) {
      if (value > 0 && value <= 1) return value * 100;
      return value;
    }
    return 0;
  };

  const loadDashboardData = async () => {
    try {
      const [progressRes, streakRes] = await Promise.allSettled([
        progressAPI.get(),
        progressAPI.getStreak(),
      ]);

      const progressData = progressRes.status === 'fulfilled' ? progressRes.value?.data?.data?.progress : null;
      const streakData = streakRes.status === 'fulfilled' ? streakRes.value?.data?.data?.studyStreak : null;

      if (!progressData || normalizePercent(progressData.averageScore) === 0) {
        await computeFromHistory();
      } else {
        setProgress({ ...progressData, averageScore: normalizePercent(progressData.averageScore) });
      }
      setStreak(streakData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      await computeFromHistory();
    } finally {
      setLoading(false);
    }
  };

  const computeFromHistory = async () => {
    try {
      const res = await quizAPI.getUserQuizzes({ limit: 200 });
      const history = res?.data?.data?.quizzes || res?.data?.data || [];
      if (!Array.isArray(history) || history.length === 0) {
        setProgress({ totalQuizzes: 0, averageScore: 0 });
        return;
      }
      const completed = history.filter(q => (q.status || 'completed') === 'completed');
      const totalQuizzes = completed.length;
      const scores = completed.map(q => {
        const v = Number(q.score);
        const tq = Number(q.totalQuestions || q.meta?.totalQuestions);
        const ca = Number(q.correctAnswers);
        if (!isNaN(v) && v > 0 && v <= 1) return v * 100;
        if (!isNaN(v) && v > 1) return v;
        if (tq > 0 && !isNaN(ca)) return (ca / tq) * 100;
        return 0;
      });
      const avgScore = scores.reduce((s, x) => s + x, 0) / Math.max(totalQuizzes, 1);
      setProgress({ totalQuizzes, averageScore: Number.isFinite(avgScore) ? avgScore : 0 });
    } catch (e) {
      console.error('Failed to compute dashboard progress from history:', e);
      setProgress({ totalQuizzes: 0, averageScore: 0 });
    }
  };

  useEffect(() => {
    const fetchCount = async () => {
      if (!category) { setMaxAvailable(null); return; }
      try {
        const res = await questionsAPI.getAll({ category, limit: 1, page: 1 });
        const total = res?.data?.data?.total ?? null;
        setMaxAvailable(total);
        if (total && numQuestions > total) setNumQuestions(total);
      } catch (e) {
        console.error('Failed to get category count:', e);
        setMaxAvailable(null);
      }
    };
    fetchCount();
  }, [category]);

  const startQuiz = async () => {
    try {
      // Check if there's an in-progress quiz
      if (inProgressQuiz) {
        const confirmed = window.confirm(
          'You have an unfinished quiz. Would you like to resume it instead of starting a new one?'
        );
        if (confirmed) {
          navigate(`/quiz/${inProgressQuiz._id}`);
          return;
        } else {
          return; // User chose not to resume, don't start new quiz
        }
      }

      if (!category) {
        alert('Please select a category');
        return;
      }
      const max = Number(maxAvailable) || 0;
      const requested = allQuestions ? max : Number(numQuestions);
      const count = Math.max(1, Math.min(requested, max));
      const response = await quizAPI.start({
        mode: 'practice',
        category,
        numberOfQuestions: count,
        difficulty: 'foundation',
      });
      navigate(`/quiz/${response.data.data.quiz._id}`);
    } catch (error) {
      console.error('Failed to start quiz:', error);
      const errorMsg = error.response?.data?.message || 'Failed to start quiz';
      
      // If error is about existing quiz, prompt to resume
      if (errorMsg.includes('unfinished quiz')) {
        const confirmed = window.confirm(
          errorMsg + ' Would you like to resume your unfinished quiz?'
        );
        if (confirmed && inProgressQuiz) {
          navigate(`/quiz/${inProgressQuiz._id}`);
        }
      } else {
        alert(errorMsg);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" data-cy="dashboard-loading">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl" data-cy="dashboard-page">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" data-cy="dashboard-title">Dashboard</h1>
        <p className="text-muted-foreground">Track your ISTQB certification progress</p>
      </div>

      {/* Resume Quiz Banner */}
      {inProgressQuiz && (
        <Card className="mb-6 border-primary bg-primary/5" data-cy="resume-quiz-banner">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <PlayCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Resume Your Quiz</h3>
                  <p className="text-sm text-muted-foreground">
                    You have an unfinished quiz with {inProgressQuiz.questions.length} questions
                    {inProgressQuiz.settings?.category && ` in ${inProgressQuiz.settings.category}`}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1" data-cy="resume-quiz-progress">
                    Progress: {inProgressQuiz.questions.filter(q => q.userAnswer !== undefined && q.userAnswer !== null).length}/{inProgressQuiz.questions.length} answered
                  </p>
                </div>
              </div>
              <Button onClick={() => navigate(`/quiz/${inProgressQuiz._id}`)} size="lg" data-cy="resume-quiz-button">
                <PlayCircle className="mr-2 h-5 w-5" />
                Resume Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card data-cy="stats-total-quizzes">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress?.totalQuizzes || 0}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>

        <Card data-cy="stats-average-score">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress?.averageScore?.toFixed(1) || 0}%</div>
            <Progress value={progress?.averageScore || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card data-cy="stats-study-streak">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streak?.current || 0} days</div>
            <p className="text-xs text-muted-foreground">Longest: {streak?.longest || 0} days</p>
          </CardContent>
        </Card>

        <Card data-cy="stats-achievements">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Unlocked</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card data-cy="start-quiz-card">
          <CardHeader>
            <CardTitle>Quick Start</CardTitle>
            <CardDescription>Choose a category and number of questions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="mt-1 w-full border rounded-md h-10 px-3"
                    value={category}
                    onChange={(e) => { setCategory(e.target.value); setAllQuestions(false); }}
                    data-cy="quiz-category-select"
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                  {maxAvailable !== null && (
                    <p className="text-xs text-muted-foreground mt-1" data-cy="quiz-available-count">Max available: {maxAvailable}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="num">Number of questions</Label>
                  <Input
                    id="num"
                    type="number"
                    min={1}
                    max={Math.max(1, maxAvailable || 1)}
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(Number(e.target.value))}
                    disabled={allQuestions}
                    data-cy="quiz-num-questions-input"
                  />
                  {maxAvailable !== null && (
                    <p className="text-xs text-muted-foreground mt-1">You can pick up to {maxAvailable} in this category</p>
                  )}
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={allQuestions}
                  onChange={(e) => setAllQuestions(e.target.checked)}
                  disabled={!category || maxAvailable === null}
                  data-cy="quiz-all-questions-checkbox"
                />
                Select all questions in this category
              </label>
            </div>

            <Button onClick={startQuiz} className="w-full" size="lg" disabled={!category || (maxAvailable === 0)} data-cy="quiz-start-button">
              <PlayCircle className="mr-2 h-5 w-5" />
              Start Practice Quiz
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => navigate('/questions')} data-cy="browse-questions-button">
                Browse Questions
              </Button>
              <Button variant="outline" onClick={() => navigate('/progress')} data-cy="view-progress-button">
                View Progress
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card data-cy="recent-activity-card">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest quiz attempts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No recent activity</p>
              <p className="text-sm">Start a quiz to see your progress here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
