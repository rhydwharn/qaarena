import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Progress as ProgressBar } from '../components/ui/progress';
import { progressAPI, quizAPI } from '../services/api';
import { TrendingUp, TrendingDown, Target, Flame, Calendar, Award } from 'lucide-react';

export default function Progress() {
  const normalizePercent = (value, totalQuestions, correctAnswers) => {
    if (typeof value === 'number' && !isNaN(value)) {
      // If backend returns 0-1, scale to 0-100
      if (value > 0 && value <= 1) return value * 100;
      return value; // assume already 0-100
    }
    if (typeof totalQuestions === 'number' && totalQuestions > 0 && typeof correctAnswers === 'number') {
      return (correctAnswers / totalQuestions) * 100;
    }
    return 0;
  };
  const [progress, setProgress] = useState(null);
  const [categories, setCategories] = useState([]);
  const [weakAreas, setWeakAreas] = useState([]);
  const [streak, setStreak] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      const [progressRes, categoriesRes, weakAreasRes, streakRes, activityRes] =
        await Promise.allSettled([
          progressAPI.get(),
          progressAPI.getCategories(),
          progressAPI.getWeakAreas(),
          progressAPI.getStreak(),
          progressAPI.getActivity(),
        ]);

      const progressData = progressRes.status === 'fulfilled' ? progressRes.value?.data?.data?.progress : null;
      const categoriesData = categoriesRes.status === 'fulfilled' ? (categoriesRes.value?.data?.data?.categories || []) : [];
      const weakAreasData = weakAreasRes.status === 'fulfilled' ? (weakAreasRes.value?.data?.data?.weakAreas || []) : [];
      const streakData = streakRes.status === 'fulfilled' ? streakRes.value?.data?.data?.studyStreak : null;
      const activityData = activityRes.status === 'fulfilled' ? (activityRes.value?.data?.data?.recentActivity || []) : [];

      const missing = !progressData || categoriesData.length === 0 || weakAreasData.length === 0 || !streakData || activityData.length === 0;

      if (missing) {
        await computeFromHistory();
      } else {
        setProgress(progressData);
        setCategories(categoriesData);
        setWeakAreas(weakAreasData);
        setStreak(streakData);
        setActivity(activityData);
      }
    } catch (error) {
      console.error('Failed to load progress data:', error);
      await computeFromHistory();
    } finally {
      setLoading(false);
    }
  };

  const getQuizDetailsSafe = async (id) => {
    try {
      const res = await quizAPI.getById(id);
      return res?.data?.data?.quiz;
    } catch {
      return null;
    }
  };

  const computeFromHistory = async () => {
    try {
      const res = await quizAPI.getUserQuizzes({ limit: 200 });
      const history = res?.data?.data?.quizzes || res?.data?.data || [];
      if (!Array.isArray(history) || history.length === 0) {
        setProgress({ totalQuizzes: 0, averageScore: 0 });
        setCategories([]);
        setWeakAreas([]);
        setStreak({ current: 0, longest: 0, lastStudyDate: null });
        setActivity([]);
        return;
      }

      // total quizzes and average score
      const completed = history.filter(q => (q.status || 'completed') === 'completed');

      const needDetail = [];
      const baseScoresCompleted = completed.map(q => {
        const base = normalizePercent(Number(q.score), Number(q.totalQuestions || q.meta?.totalQuestions), Number(q.correctAnswers));
        if (!base || base === 0) needDetail.push(q);
        return base;
      });

      // Fetch details for up to 20 recent completed items lacking score info
      if (needDetail.length) {
        const toFetch = needDetail.slice(0, 20);
        const details = await Promise.all(toFetch.map(q => getQuizDetailsSafe(q._id || q.id)));
        details.forEach((dq, idx) => {
          if (dq && Array.isArray(dq.questions) && dq.questions.length) {
            const total = dq.questions.length;
            const correct = dq.questions.filter(qq => qq.isCorrect).length;
            const pct = (correct / total) * 100;
            const pos = completed.indexOf(toFetch[idx]);
            if (pos > -1) baseScoresCompleted[pos] = pct;
            // enrich the original history item too (used in activity)
            const hIdx = history.indexOf(toFetch[idx]);
            if (hIdx > -1) {
              history[hIdx].totalQuestions = total;
              history[hIdx].correctAnswers = correct;
              history[hIdx].score = pct;
              history[hIdx].category = dq.category || history[hIdx].category;
              history[hIdx].completedAt = dq.updatedAt || dq.completedAt || history[hIdx].completedAt;
            }
          }
        });
      }

      const totalQuizzes = completed.length;
      const avgScore = baseScoresCompleted.reduce((sum, s) => sum + (isNaN(s) ? 0 : s), 0) / Math.max(totalQuizzes, 1);
      setProgress({ totalQuizzes, averageScore: Number.isFinite(avgScore) ? avgScore : 0 });

      // category performance
      const catMap = new Map();
      completed.forEach(q => {
        const cat = (q.category || q.meta?.category || 'mixed').toString();
        const score = Number(q.score) || 0;
        const totalQuestions = Number(q.totalQuestions || q.meta?.totalQuestions || 0);
        const entry = catMap.get(cat) || { category: cat, sum: 0, count: 0, totalQuestions: 0 };
        entry.sum += score;
        entry.count += 1;
        entry.totalQuestions += totalQuestions;
        catMap.set(cat, entry);
      });
      const categoriesAgg = Array.from(catMap.values()).map(c => ({
        category: c.category,
        averageScore: c.sum / c.count,
        totalQuestions: c.totalQuestions,
      }));
      setCategories(categoriesAgg);

      // weak areas = bottom 3 categories by averageScore < 60
      const weak = categoriesAgg
        .filter(c => (c.averageScore || 0) < 60)
        .sort((a, b) => (a.averageScore || 0) - (b.averageScore || 0))
        .slice(0, 3);
      setWeakAreas(weak);

      // recent activity (latest 10)
      const activityItems = completed
        .filter(q => {
          const totalQ = Number(q.totalQuestions || q.meta?.totalQuestions || 0);
          const corr = Number(q.correctAnswers || 0);
          const scorePct = normalizePercent(Number(q.score), totalQ, corr);
          // keep only attempts that have either counts or a non-zero score
          return totalQ > 0 || scorePct > 0;
        })
        .sort((a, b) => new Date(b.completedAt || b.updatedAt || b.createdAt) - new Date(a.completedAt || a.updatedAt || a.createdAt))
        .slice(0, 10)
        .map(q => {
          const totalQ = Number(q.totalQuestions || q.meta?.totalQuestions || 0);
          const corr = Number(q.correctAnswers || 0);
          const scorePct = normalizePercent(Number(q.score), totalQ, corr);
          return ({
            date: q.completedAt || q.updatedAt || q.createdAt || new Date().toISOString(),
            score: scorePct,
            correctAnswers: corr || (totalQ ? Math.round((scorePct / 100) * totalQ) : 0),
            totalQuestions: totalQ,
            category: q.category || q.meta?.category || 'Mixed',
          });
        });
      setActivity(activityItems);

      // study streak (use all history dates)
      const dates = Array.from(
        new Set(history.map(q => new Date(q.completedAt || q.updatedAt || q.createdAt).toDateString()))
      )
        .map(d => new Date(d))
        .sort((a, b) => b - a);
      let current = 0, longest = 0;
      let prev = null;
      dates.forEach((d, idx) => {
        if (idx === 0) {
          // today or not
          const diffDays = Math.floor((new Date().setHours(0,0,0,0) - d.setHours(0,0,0,0)) / 86400000);
          current = diffDays === 0 ? 1 : 0;
          longest = Math.max(longest, current);
          prev = d;
          return;
        }
        const diff = Math.floor((prev.setHours(0,0,0,0) - d.setHours(0,0,0,0)) / 86400000);
        if (diff === 1) current += 1; else current = Math.max(current, 1);
        longest = Math.max(longest, current);
        prev = d;
      });
      const lastStudyDate = dates.length ? dates[0] : null;
      setStreak({ current, longest, lastStudyDate });
    } catch (e) {
      console.error('Failed to compute progress from history:', e);
      // Set safe defaults
      setProgress({ totalQuizzes: 0, averageScore: 0 });
      setCategories([]);
      setWeakAreas([]);
      setStreak({ current: 0, longest: 0, lastStudyDate: null });
      setActivity([]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
        <p className="text-muted-foreground">Track your learning journey</p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress?.totalQuizzes || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress?.averageScore?.toFixed(1) || 0}%</div>
            <ProgressBar value={progress?.averageScore || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streak?.current || 0} days</div>
            <p className="text-xs text-muted-foreground mt-1">
              Longest: {streak?.longest || 0} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Active</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {streak?.lastStudyDate
                ? new Date(streak.lastStudyDate).toLocaleDateString()
                : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Study date</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Category Performance</CardTitle>
            <CardDescription>Your performance across different categories</CardDescription>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No category data available yet
              </p>
            ) : (
              <div className="space-y-4">
                {categories.map((cat, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium capitalize">
                        {cat.category?.replace(/-/g, ' ')}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {cat.averageScore?.toFixed(1) || 0}%
                      </span>
                    </div>
                    <ProgressBar value={cat.averageScore || 0} />
                    <p className="text-xs text-muted-foreground mt-1">
                      {cat.totalQuestions || 0} questions answered
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weak Areas */}
        <Card>
          <CardHeader>
            <CardTitle>Areas for Improvement</CardTitle>
            <CardDescription>Focus on these topics to improve</CardDescription>
          </CardHeader>
          <CardContent>
            {weakAreas.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Great job! No weak areas identified
              </p>
            ) : (
              <div className="space-y-3">
                {weakAreas.map((area, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium capitalize">
                        {area.category?.replace(/-/g, ' ')}
                      </span>
                    </div>
                    <span className="text-sm text-red-600 font-medium">
                      {area.averageScore?.toFixed(1) || 0}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest quiz attempts</CardDescription>
        </CardHeader>
        <CardContent>
          {activity.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No recent activity. Start a quiz to see your progress!
            </p>
          ) : (
            <div className="space-y-3">
              {activity.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 border rounded-md hover:bg-accent transition-colors"
                >
                  <div>
                    <p className="font-medium">{item.category || 'Mixed'} Quiz</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.date).toLocaleDateString()} at{' '}
                      {new Date(item.date).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{item.score?.toFixed(1) || 0}%</p>
                    <p className="text-xs text-muted-foreground">
                      {item.correctAnswers || 0}/{item.totalQuestions || 0} correct
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
