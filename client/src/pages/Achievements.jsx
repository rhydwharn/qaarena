import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { achievementsAPI } from '../services/api';
import { Trophy, Lock, CheckCircle, Award, Star } from 'lucide-react';

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [newAchievements, setNewAchievements] = useState([]);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      const response = await achievementsAPI.getAll();
      setAchievements(response.data.data.achievements || []);
    } catch (error) {
      console.error('Failed to load achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkForNewAchievements = async () => {
    try {
      setChecking(true);
      const response = await achievementsAPI.check();
      const newOnes = response.data.data.newAchievements || [];
      
      if (newOnes.length > 0) {
        setNewAchievements(newOnes);
        setTimeout(() => setNewAchievements([]), 5000);
        loadAchievements();
      } else {
        alert('No new achievements unlocked. Keep practicing!');
      }
    } catch (error) {
      console.error('Failed to check achievements:', error);
    } finally {
      setChecking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" data-cy="achievements-loading">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading achievements...</p>
        </div>
      </div>
    );
  }

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const progress = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;

  return (
    <div className="container mx-auto p-6 max-w-7xl" data-cy="achievements-page">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2" data-cy="achievements-title">
          Achievements
        </h1>
        <p className="text-muted-foreground">Track your learning milestones</p>
      </div>

      {newAchievements.length > 0 && (
        <Card className="mb-6 border-yellow-500 bg-yellow-50" data-cy="new-achievements-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Trophy className="h-12 w-12 text-yellow-600" />
              <div>
                <h3 className="text-lg font-bold text-yellow-900">🎉 New Achievement Unlocked!</h3>
                {newAchievements.map((ach, idx) => (
                  <p key={idx} className="text-yellow-800">
                    <strong>{typeof ach.name === 'string' ? ach.name : ach.name?.en || 'Achievement'}</strong>
                    {' '}-{' '}
                    {typeof ach.description === 'string' ? ach.description : ach.description?.en || ''}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>
            {unlockedCount} of {totalCount} achievements unlocked ({progress.toFixed(0)}%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div className="bg-primary h-4 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <Button onClick={checkForNewAchievements} disabled={checking}>
              {checking ? 'Checking...' : 'Check for New Achievements'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement) => (
          <Card key={achievement._id} className={`transition-all ${achievement.unlocked ? 'border-primary bg-primary/5' : 'opacity-60 grayscale'}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-full ${achievement.unlocked ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'}`}>
                  {achievement.unlocked ? <Trophy className="h-8 w-8" /> : <Lock className="h-8 w-8" />}
                </div>
                {achievement.unlocked && <CheckCircle className="h-6 w-6 text-green-600" />}
              </div>
              <CardTitle className="mt-4">
                {typeof achievement.name === 'string' ? achievement.name : achievement.name?.en || 'Achievement'}
              </CardTitle>
              <CardDescription>
                {typeof achievement.description === 'string' ? achievement.description : achievement.description?.en || 'Complete this achievement'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Points:</span>
                  <span className="font-bold">{achievement.points}</span>
                </div>
                
                <div className={`p-2 border rounded text-xs ${
                  achievement.unlocked 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-amber-50 border-amber-200'
                }`}>
                  <p className={`font-medium ${
                    achievement.unlocked ? 'text-green-800' : 'text-amber-900'
                  }`}>
                    {achievement.unlocked ? '✅ Unlocked!' : '🔒 How to unlock:'}
                  </p>
                  <p className={`mt-1 ${
                    achievement.unlocked ? 'text-green-700' : 'text-amber-800'
                  }`}>
                    {achievement.criteria?.metric === 'totalQuizzes' && `Complete ${achievement.criteria.threshold} quiz${achievement.criteria.threshold > 1 ? 'es' : ''}`}
                    {achievement.criteria?.metric === 'totalScore' && `Earn ${achievement.criteria.threshold} total points`}
                    {achievement.criteria?.metric === 'averageScore' && `Maintain ${achievement.criteria.threshold}% average score`}
                    {achievement.criteria?.metric === 'correctAnswers' && `Get ${achievement.criteria.threshold} correct answers`}
                    {achievement.criteria?.metric === 'streak' && `Maintain ${achievement.criteria.threshold} day streak`}
                  </p>
                  {achievement.unlocked && achievement.unlockedAt && (
                    <p className="text-green-600 mt-1 text-[10px]">
                      Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <span className={`px-2 py-1 rounded-full ${
                    achievement.rarity === 'common' ? 'bg-gray-100 text-gray-700' :
                    achievement.rarity === 'rare' ? 'bg-teal-100 text-teal-700' :
                    achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {achievement.rarity?.toUpperCase() || 'COMMON'}
                  </span>
                  <span className="text-muted-foreground">
                    {achievement.type || 'achievement'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
