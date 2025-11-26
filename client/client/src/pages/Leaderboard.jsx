import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { leaderboardAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Trophy, Medal, Award, Crown, TrendingUp, Shield } from 'lucide-react';
import { getCategories, formatCategoriesForSelect } from '../services/categoryService';

export default function Leaderboard() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('global');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadLeaderboard();
  }, [view, category]);

  const loadCategories = async () => {
    const cats = await getCategories();
    setCategories(formatCategoriesForSelect(cats));
  };

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      let leaderboardRes;
      
      if (view === 'global') {
        leaderboardRes = await leaderboardAPI.getGlobal({ limit: 50 });
      } else {
        leaderboardRes = await leaderboardAPI.getCategory(category, { limit: 50 });
      }
      
      const rankRes = await leaderboardAPI.getUserRank();
      
      const leaderboardData = leaderboardRes.data.data.leaderboard || [];
      console.log('Current user role:', user?.role);
      console.log('Leaderboard data:', leaderboardData);
      console.log('Filtered leaderboard:', leaderboardData.filter(entry => user?.role === 'admin' || entry.role !== 'admin'));
      
      setLeaderboard(leaderboardData);
      setUserRank(rankRes.data.data);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
        <p className="text-muted-foreground">See how you rank against other learners</p>
      </div>

      {/* Your Rank Card - Only show for non-admin users */}
      {userRank && !userRank.isAdmin && (
        <Card className="mb-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Your Rank</p>
                  <p className="text-3xl font-bold">#{userRank.rank || 'N/A'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Points</p>
                <p className="text-2xl font-bold">{userRank.totalScore || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* View Selector */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={view === 'global' ? 'default' : 'outline'}
              onClick={() => setView('global')}
            >
              Global
            </Button>
            <Button
              variant={view === 'category' ? 'default' : 'outline'}
              onClick={() => setView('category')}
            >
              By Category
            </Button>
          </div>
          
          {view === 'category' && (
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          )}
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            {view === 'global' ? 'Global Rankings' : `${category.replace(/-/g, ' ')} Rankings`}
          </CardTitle>
          <CardDescription>
            Top performers based on quiz scores and completion
          </CardDescription>
        </CardHeader>
        <CardContent>
          {leaderboard.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">
                {view === 'category' && !category
                  ? 'Please select a category'
                  : 'No rankings available yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {leaderboard
                .filter(entry => user?.role === 'admin' || entry.role !== 'admin')
                .map((entry, idx) => (
                <div
                  key={entry.username || idx}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                    idx < 3 ? 'bg-accent/50' : 'hover:bg-accent'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10">
                      {getRankIcon(idx + 1) || (
                        <span className="text-lg font-bold text-muted-foreground">
                          #{idx + 1}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{entry.username || 'Anonymous'}</p>
                      <p className="text-sm text-muted-foreground">
                        {entry.totalQuizzes || 0} quizzes • {entry.correctAnswers || 0} correct
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{entry.averageScore?.toFixed(1) || 0}%</p>
                    <p className="text-sm text-muted-foreground">
                      {entry.totalScore || 0} total points
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
