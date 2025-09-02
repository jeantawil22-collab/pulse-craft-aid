import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  Trophy, 
  Target, 
  Flame, 
  Star, 
  Medal, 
  Crown, 
  Gift, 
  Zap,
  Calendar,
  TrendingUp,
  Award,
  CheckCircle
} from "lucide-react";

interface Achievement {
  id: string;
  achievement_type: string;
  achievement_name: string;
  achievement_description: string;
  points: number;
  earned_at: string;
}

interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  target: number;
  current: number;
  points: number;
  expires_at: string;
  completed: boolean;
}

interface UserStats {
  totalPoints: number;
  level: number;
  rank: string;
  streakDays: number;
  completedChallenges: number;
  totalAchievements: number;
}

interface SmartGamificationProps {
  userId: string;
}

export default function SmartGamification({ userId }: SmartGamificationProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    totalPoints: 0,
    level: 1,
    rank: 'Beginner',
    streakDays: 0,
    completedChallenges: 0,
    totalAchievements: 0
  });
  const [loading, setLoading] = useState(true);
  const [motivationalMessage, setMotivationalMessage] = useState('');

  useEffect(() => {
    loadAchievements();
    loadChallenges();
    calculateUserStats();
    generateMotivationalMessage();
  }, [userId]);

  const loadAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error('Error loading achievements:', error);
      toast.error('Failed to load achievements');
    }
  };

  const loadChallenges = async () => {
    try {
      // Generate sample challenges (in a real app, these would come from the database)
      const sampleChallenges: Challenge[] = [
        {
          id: '1',
          name: '7-Day Streak',
          description: 'Complete workouts for 7 consecutive days',
          type: 'weekly',
          target: 7,
          current: Math.floor(Math.random() * 7),
          points: 100,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          completed: false
        },
        {
          id: '2',
          name: 'Calorie Crusher',
          description: 'Burn 500 calories in a single workout',
          type: 'daily',
          target: 500,
          current: Math.floor(Math.random() * 500),
          points: 50,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          completed: false
        },
        {
          id: '3',
          name: 'Nutrition Master',
          description: 'Log all meals for 30 days',
          type: 'monthly',
          target: 30,
          current: Math.floor(Math.random() * 30),
          points: 200,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          completed: false
        }
      ];

      setChallenges(sampleChallenges.map(challenge => ({
        ...challenge,
        completed: challenge.current >= challenge.target
      })));
    } catch (error) {
      console.error('Error loading challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateUserStats = async () => {
    try {
      // Calculate total points from achievements
      const totalPoints = achievements.reduce((sum, achievement) => sum + achievement.points, 0);
      
      // Calculate level based on points (every 100 points = 1 level)
      const level = Math.floor(totalPoints / 100) + 1;
      
      // Determine rank based on level
      const getRank = (level: number) => {
        if (level < 5) return 'Beginner';
        if (level < 10) return 'Intermediate';
        if (level < 20) return 'Advanced';
        if (level < 50) return 'Expert';
        return 'Master';
      };

      // Calculate streak (simulate based on recent workouts)
      const { data: recentWorkouts } = await supabase
        .from('workouts')
        .select('completed_at')
        .eq('user_id', userId)
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: false })
        .limit(30);

      let streakDays = 0;
      if (recentWorkouts && recentWorkouts.length > 0) {
        const today = new Date();
        let currentDate = new Date(today);
        
        for (const workout of recentWorkouts) {
          const workoutDate = new Date(workout.completed_at);
          const diffDays = Math.floor((currentDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diffDays <= streakDays + 1) {
            streakDays++;
            currentDate = workoutDate;
          } else {
            break;
          }
        }
      }

      setUserStats({
        totalPoints,
        level,
        rank: getRank(level),
        streakDays,
        completedChallenges: challenges.filter(c => c.completed).length,
        totalAchievements: achievements.length
      });
    } catch (error) {
      console.error('Error calculating user stats:', error);
    }
  };

  const generateMotivationalMessage = () => {
    const messages = [
      "🔥 You're on fire! Keep up the momentum!",
      "💪 Every workout counts towards your goals!",
      "⭐ You're building healthy habits that last!",
      "🎯 Focus on progress, not perfection!",
      "🚀 You're stronger than you think!",
      "💎 Consistency is your superpower!",
      "🏆 Champions are made one rep at a time!",
      "🌟 Your future self will thank you!"
    ];
    
    setMotivationalMessage(messages[Math.floor(Math.random() * messages.length)]);
  };

  const completeChallenge = async (challengeId: string) => {
    try {
      // Mark challenge as completed
      setChallenges(prev => 
        prev.map(challenge => 
          challenge.id === challengeId 
            ? { ...challenge, completed: true, current: challenge.target }
            : challenge
        )
      );

      // Award achievement
      const challenge = challenges.find(c => c.id === challengeId);
      if (challenge) {
        await supabase
          .from('user_achievements')
          .insert({
            user_id: userId,
            achievement_type: 'challenge_completion',
            achievement_name: challenge.name,
            achievement_description: `Completed: ${challenge.description}`,
            points: challenge.points
          });

        toast.success(`🎉 Challenge completed! You earned ${challenge.points} points!`);
        loadAchievements();
        calculateUserStats();
      }
    } catch (error) {
      console.error('Error completing challenge:', error);
      toast.error('Failed to complete challenge');
    }
  };

  const claimDailyBonus = async () => {
    try {
      const bonusPoints = 25;
      await supabase
        .from('user_achievements')
        .insert({
          user_id: userId,
          achievement_type: 'daily_bonus',
          achievement_name: 'Daily Login Bonus',
          achievement_description: 'Claimed daily login bonus',
          points: bonusPoints
        });

      toast.success(`🎁 Daily bonus claimed! +${bonusPoints} points!`);
      loadAchievements();
      calculateUserStats();
    } catch (error) {
      console.error('Error claiming daily bonus:', error);
      toast.error('Failed to claim daily bonus');
    }
  };

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'daily': return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'weekly': return <Target className="h-5 w-5 text-green-500" />;
      case 'monthly': return <Crown className="h-5 w-5 text-purple-500" />;
      default: return <Star className="h-5 w-5" />;
    }
  };

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'challenge_completion': return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 'streak': return <Flame className="h-5 w-5 text-orange-500" />;
      case 'milestone': return <Medal className="h-5 w-5 text-blue-500" />;
      case 'daily_bonus': return <Gift className="h-5 w-5 text-green-500" />;
      default: return <Award className="h-5 w-5 text-primary" />;
    }
  };

  const getLevelProgress = () => {
    const pointsInCurrentLevel = userStats.totalPoints % 100;
    return pointsInCurrentLevel;
  };

  if (loading) {
    return <div className="animate-pulse">Loading gamification data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Crown className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Level</p>
                <p className="text-2xl font-bold text-foreground">{userStats.level}</p>
                <Progress value={getLevelProgress()} className="mt-2 h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Star className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Points</p>
                <p className="text-2xl font-bold text-foreground">{userStats.totalPoints.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{userStats.rank}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Flame className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Streak</p>
                <p className="text-2xl font-bold text-foreground">{userStats.streakDays}</p>
                <p className="text-xs text-muted-foreground">days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Trophy className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Achievements</p>
                <p className="text-2xl font-bold text-foreground">{userStats.totalAchievements}</p>
                <p className="text-xs text-muted-foreground">earned</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Motivational Message */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border-green-200 dark:border-green-800">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-100">Daily Motivation</h3>
              <p className="text-green-800 dark:text-green-200">{motivationalMessage}</p>
            </div>
            <Button onClick={claimDailyBonus} size="sm" className="ml-auto">
              <Gift className="h-4 w-4 mr-2" />
              Claim Bonus
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="challenges" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="challenges" className="space-y-4">
          <div className="grid gap-4">
            {challenges.map((challenge) => (
              <Card key={challenge.id} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-4">
                      {getChallengeIcon(challenge.type)}
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{challenge.name}</h3>
                        <p className="text-muted-foreground text-sm mb-3">{challenge.description}</p>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium text-foreground">
                              {challenge.current} / {challenge.target}
                            </span>
                          </div>
                          <Progress value={(challenge.current / challenge.target) * 100} className="h-2" />
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {challenge.type}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {challenge.points} points
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Expires: {new Date(challenge.expires_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      {challenge.completed ? (
                        <Badge className="bg-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      ) : (
                        <Button 
                          size="sm"
                          onClick={() => completeChallenge(challenge.id)}
                          disabled={challenge.current < challenge.target}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          {achievements.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Achievements Yet</h3>
                <p className="text-muted-foreground">Complete challenges and reach milestones to earn achievements!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      {getAchievementIcon(achievement.achievement_type)}
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{achievement.achievement_name}</h3>
                        <p className="text-muted-foreground text-sm">{achievement.achievement_description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-sm font-medium text-primary">+{achievement.points} points</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(achievement.earned_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Weekly Leaderboard</CardTitle>
              <CardDescription>Top performers this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { rank: 1, name: 'You', points: userStats.totalPoints, badge: '🥇' },
                  { rank: 2, name: 'Sarah M.', points: userStats.totalPoints - 50, badge: '🥈' },
                  { rank: 3, name: 'Mike R.', points: userStats.totalPoints - 120, badge: '🥉' },
                  { rank: 4, name: 'Emma L.', points: userStats.totalPoints - 200, badge: '' },
                  { rank: 5, name: 'John D.', points: userStats.totalPoints - 280, badge: '' }
                ].map((entry) => (
                  <div key={entry.rank} className="flex items-center justify-between p-3 rounded-lg bg-background border border-border">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{entry.badge || `#${entry.rank}`}</span>
                      <div>
                        <p className="font-medium text-foreground">{entry.name}</p>
                        <p className="text-sm text-muted-foreground">{entry.points.toLocaleString()} points</p>
                      </div>
                    </div>
                    {entry.name === 'You' && (
                      <Badge className="bg-primary">You</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}