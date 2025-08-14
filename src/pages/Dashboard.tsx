import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Dumbbell, 
  Apple, 
  Camera, 
  TrendingUp, 
  Target, 
  Flame, 
  Clock, 
  Calendar,
  Star,
  Trophy,
  Zap,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  user: any;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  const [todayStats, setTodayStats] = useState({
    workoutCompleted: false,
    caloriesLogged: 0,
    waterIntake: 0,
    steps: 0,
    workoutStreak: 5
  });

  const [quickStats, setQuickStats] = useState({
    weeklyProgress: 75,
    totalWorkouts: 12,
    caloriesBurned: 2400,
    averageRating: 4.8
  });

  useEffect(() => {
    // Load today's stats from localStorage or API
    const savedStats = localStorage.getItem('todayStats');
    if (savedStats) {
      setTodayStats(JSON.parse(savedStats));
    }
  }, []);

  const getMotivationalMessage = () => {
    const messages = [
      "Ready to crush today's workout? 💪",
      "Your consistency is paying off! Keep going! 🔥",
      "Every rep counts towards your goal! 🎯",
      "You're stronger than you think! 💫",
      "Time to make today amazing! ⚡"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const quickActions = [
    {
      title: "Start Workout",
      description: "Begin today's AI-generated routine",
      icon: Dumbbell,
      color: "gradient-primary",
      action: () => navigate('/workouts'),
      completed: todayStats.workoutCompleted
    },
    {
      title: "Log Meal",
      description: "Track your nutrition intake",
      icon: Apple,
      color: "gradient-nutrition",
      action: () => navigate('/nutrition'),
      completed: todayStats.caloriesLogged > 1000
    },
    {
      title: "Scan Food",
      description: "Use AI to analyze your meal",
      icon: Camera,
      color: "gradient-accent",
      action: () => navigate('/meal-scanner'),
      completed: false
    },
    {
      title: "View Progress",
      description: "Check your analytics",
      icon: TrendingUp,
      color: "gradient-progress",
      action: () => navigate('/progress'),
      completed: false
    }
  ];

  const achievements = [
    { name: "First Workout", completed: true, icon: Star },
    { name: "5-Day Streak", completed: todayStats.workoutStreak >= 5, icon: Flame },
    { name: "Nutrition Explorer", completed: todayStats.caloriesLogged > 0, icon: Apple },
    { name: "Progress Tracker", completed: quickStats.totalWorkouts > 10, icon: Trophy }
  ];

  const getCalorieProgress = () => {
    const target = user.targetCalories || 2000;
    return Math.min((todayStats.caloriesLogged / target) * 100, 100);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Welcome back, {user.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            {getMotivationalMessage()}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="flex items-center gap-2">
            <Flame className="h-4 w-4" />
            {todayStats.workoutStreak} day streak
          </Badge>
          <Badge variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </Badge>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Card 
            key={action.title}
            className={`cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
              action.completed ? 'ring-2 ring-primary/20' : ''
            }`}
            onClick={action.action}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center shadow-lg`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                {action.completed && (
                  <Badge variant="default" className="bg-success text-white">
                    ✓ Done
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold mb-1">{action.title}</h3>
              <p className="text-sm text-muted-foreground">{action.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today's Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Progress */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Today's Progress
            </CardTitle>
            <CardDescription>Track your daily fitness and nutrition goals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Calories */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-500" />
                  Calories Consumed
                </span>
                <span className="font-medium">
                  {todayStats.caloriesLogged} / {user.targetCalories || 2000} kcal
                </span>
              </div>
              <Progress value={getCalorieProgress()} className="h-2" />
            </div>

            {/* Workout Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Dumbbell className="h-4 w-4 text-primary" />
                  Workout Completion
                </span>
                <span className="font-medium">
                  {todayStats.workoutCompleted ? 'Completed' : 'Pending'}
                </span>
              </div>
              <Progress value={todayStats.workoutCompleted ? 100 : 0} className="h-2" />
            </div>

            {/* Water Intake */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-blue-500" />
                  Water Intake
                </span>
                <span className="font-medium">{todayStats.waterIntake} / 8 glasses</span>
              </div>
              <Progress value={(todayStats.waterIntake / 8) * 100} className="h-2" />
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{quickStats.totalWorkouts}</div>
                <div className="text-sm text-muted-foreground">Total Workouts</div>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-accent">{quickStats.caloriesBurned}</div>
                <div className="text-sm text-muted-foreground">Calories Burned</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements & Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-accent" />
              Achievements
            </CardTitle>
            <CardDescription>Your fitness milestones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {achievements.map((achievement, index) => (
              <div 
                key={achievement.name}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  achievement.completed 
                    ? 'bg-success/10 border border-success/20' 
                    : 'bg-muted/30'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  achievement.completed ? 'bg-success text-white' : 'bg-muted'
                }`}>
                  <achievement.icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className={`font-medium text-sm ${
                    achievement.completed ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {achievement.name}
                  </div>
                </div>
                {achievement.completed && (
                  <Badge variant="secondary" className="text-xs">
                    ✓
                  </Badge>
                )}
              </div>
            ))}

            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => navigate('/progress')}
            >
              View All Progress
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Motivational Banner */}
      <Card className="gradient-hero text-white overflow-hidden relative">
        <CardContent className="p-6">
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">Keep Up The Great Work!</h3>
                <p className="text-white/90 mb-4">
                  You're {quickStats.weeklyProgress}% towards your weekly goal. 
                  {quickStats.weeklyProgress >= 80 ? " You're crushing it! 🔥" : " You've got this! 💪"}
                </p>
                <div className="flex gap-3">
                  <Button variant="secondary" onClick={() => navigate('/workouts')}>
                    Start Today's Workout
                  </Button>
                  <Button variant="outline" className="text-white border-white hover:bg-white/10">
                    View Plan
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center">
                  <Zap className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20" />
        </CardContent>
      </Card>
    </div>
  );
};