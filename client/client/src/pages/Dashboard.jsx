import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { progressAPI, quizAPI, questionsAPI } from '../services/api';
import { BookOpen, Trophy, Target, Flame, PlayCircle } from 'lucide-react';

export default function Dashboard() {
  const [progress, setProgress] = useState(null);
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [category, setCategory] = useState('');
  const [maxAvailable, setMaxAvailable] = useState(null);
  const [numQuestions, setNumQuestions] = useState(10);
  const [allQuestions, setAllQuestions] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

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
      alert(error.response?.data?.message || 'Failed to start quiz');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Track your ISTQB certification progress</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress?.totalQuizzes || 0}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress?.averageScore?.toFixed(1) || 0}%</div>
            <Progress value={progress?.averageScore || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streak?.current || 0} days</div>
            <p className="text-xs text-muted-foreground">Longest: {streak?.longest || 0} days</p>
          </CardContent>
        </Card>

        <Card>
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
        <Card>
          <CardHeader>
            <CardTitle>Quick Start</CardTitle>
            <CardDescription>Choose a category and number of questions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="mt-1 w-full border rounded-md h-10 px-3"
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); setAllQuestions(false); }}
                >
                  <option value="" disabled>Select a category</option>
                  <option value="fundamentals">Fundamentals of Testing</option>
                  <option value="testing-throughout-sdlc">Testing Throughout the SDLC</option>
                  <option value="static-testing">Static Testing</option>
                  <option value="test-techniques">Test Design Techniques</option>
                  <option value="test-management">Test Management</option>
                  <option value="tool-support">Tool Support for Testing</option>
                  <option value="agile-testing">Agile Testing</option>
                  <option value="test-automation">Test Automation</option>
                </select>
                {maxAvailable !== null && (
                  <p className="text-xs text-muted-foreground mt-1">Max available: {maxAvailable}</p>
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
                />
                {maxAvailable !== null && (
                  <p className="text-xs text-muted-foreground mt-1">You can pick up to {maxAvailable} in this category</p>
                )}
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={allQuestions}
                  onChange={(e) => setAllQuestions(e.target.checked)}
                  disabled={!category || maxAvailable === null}
                />
                Select all questions in this category
              </label>
            </div>

            <Button onClick={startQuiz} className="w-full" size="lg" disabled={!category || (maxAvailable === 0)}>
              <PlayCircle className="mr-2 h-5 w-5" />
              Start Practice Quiz
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => navigate('/questions')}>
                Browse Questions
              </Button>
              <Button variant="outline" onClick={() => navigate('/progress')}>
                View Progress
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
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
