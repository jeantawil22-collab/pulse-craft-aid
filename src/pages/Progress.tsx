import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  TrendingUp, 
  TrendingDown,
  Target, 
  Calendar,
  Award,
  Scale,
  Dumbbell,
  Activity,
  Heart,
  Zap,
  Plus,
  BarChart3,
  LineChart
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProgressPageProps {
  user: any;
}

interface WeightEntry {
  date: string;
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
}

interface WorkoutStats {
  date: string;
  duration: number;
  calories_burned: number;
  exercises_completed: number;
  workout_type: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: any;
  achieved: boolean;
  achieved_date?: string;
  target_value?: number;
  current_value?: number;
}

export const Progress: React.FC<ProgressPageProps> = ({ user }) => {
  const { toast } = useToast();
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([
    { date: '2024-01-01', weight: 75.5, bodyFat: 18, muscleMass: 35 },
    { date: '2024-01-08', weight: 75.2, bodyFat: 17.5, muscleMass: 35.2 },
    { date: '2024-01-15', weight: 74.8, bodyFat: 17, muscleMass: 35.5 },
    { date: '2024-01-22', weight: 74.5, bodyFat: 16.8, muscleMass: 35.8 },
  ]);

  const [newWeight, setNewWeight] = useState('');
  const [newBodyFat, setNewBodyFat] = useState('');

  const [workoutStats] = useState<WorkoutStats[]>([
    { date: '2024-01-20', duration: 45, calories_burned: 320, exercises_completed: 8, workout_type: 'Strength' },
    { date: '2024-01-18', duration: 30, calories_burned: 250, exercises_completed: 6, workout_type: 'HIIT' },
    { date: '2024-01-16', duration: 50, calories_burned: 380, exercises_completed: 10, workout_type: 'Full Body' },
    { date: '2024-01-14', duration: 25, calories_burned: 200, exercises_completed: 5, workout_type: 'Cardio' },
  ]);

  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      name: 'First Steps',
      description: 'Complete your first workout',
      icon: Dumbbell,
      achieved: true,
      achieved_date: '2024-01-01'
    },
    {
      id: '2',
      name: 'Consistency Champion',
      description: 'Workout 5 days in a row',
      icon: Award,
      achieved: true,
      achieved_date: '2024-01-10',
      target_value: 5,
      current_value: 5
    },
    {
      id: '3',
      name: 'Calorie Crusher',
      description: 'Burn 500+ calories in a single workout',
      icon: Zap,
      achieved: false,
      target_value: 500,
      current_value: 380
    },
    {
      id: '4',
      name: 'Weight Warrior',
      description: 'Lose 5kg from starting weight',
      icon: Scale,
      achieved: false,
      target_value: 5,
      current_value: 1
    },
    {
      id: '5',
      name: 'Marathon Mindset',
      description: 'Complete 50 total workouts',
      icon: Heart,
      achieved: false,
      target_value: 50,
      current_value: 12
    }
  ]);

  const addWeightEntry = () => {
    if (!newWeight) {
      toast({
        title: "Missing Information",
        description: "Please enter your weight",
        variant: "destructive"
      });
      return;
    }

    const newEntry: WeightEntry = {
      date: new Date().toISOString().split('T')[0],
      weight: parseFloat(newWeight),
      bodyFat: newBodyFat ? parseFloat(newBodyFat) : undefined
    };

    setWeightEntries(prev => [...prev, newEntry].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ));

    toast({
      title: "Weight Logged! 📊",
      description: "Your progress has been updated",
    });

    setNewWeight('');
    setNewBodyFat('');
  };

  const getWeightTrend = () => {
    if (weightEntries.length < 2) return { trend: 'stable', change: 0 };
    
    const latest = weightEntries[0];
    const previous = weightEntries[1];
    const change = latest.weight - previous.weight;
    
    if (Math.abs(change) < 0.1) return { trend: 'stable', change: 0 };
    return { 
      trend: change > 0 ? 'up' : 'down', 
      change: Math.abs(change) 
    };
  };

  const getGoalProgress = () => {
    if (!user.targetWeight || weightEntries.length === 0) return 0;
    
    const currentWeight = weightEntries[0].weight;
    const startWeight = user.weight;
    const targetWeight = user.targetWeight;
    
    const totalChange = Math.abs(startWeight - targetWeight);
    const currentChange = Math.abs(startWeight - currentWeight);
    
    return Math.min((currentChange / totalChange) * 100, 100);
  };

  const getWeeklyStats = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const weeklyWorkouts = workoutStats.filter(workout => 
      new Date(workout.date) >= oneWeekAgo
    );

    return {
      workouts: weeklyWorkouts.length,
      totalDuration: weeklyWorkouts.reduce((sum, w) => sum + w.duration, 0),
      totalCalories: weeklyWorkouts.reduce((sum, w) => sum + w.calories_burned, 0),
      avgDuration: weeklyWorkouts.length > 0 ? 
        Math.round(weeklyWorkouts.reduce((sum, w) => sum + w.duration, 0) / weeklyWorkouts.length) : 0
    };
  };

  const weeklyStats = getWeeklyStats();
  const weightTrend = getWeightTrend();
  const goalProgress = getGoalProgress();

  const achievedCount = achievements.filter(a => a.achieved).length;
  const completionRate = (achievedCount / achievements.length) * 100;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-progress bg-clip-text text-transparent">
            Progress Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your fitness journey and celebrate achievements
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          <Award className="h-4 w-4 mr-2" />
          {achievedCount}/{achievements.length} Achievements
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Weight</p>
                <p className="text-2xl font-bold">
                  {weightEntries.length > 0 ? `${weightEntries[0].weight}kg` : `${user.weight}kg`}
                </p>
                <div className="flex items-center gap-1 text-xs mt-1">
                  {weightTrend.trend === 'down' && <TrendingDown className="h-3 w-3 text-green-600" />}
                  {weightTrend.trend === 'up' && <TrendingUp className="h-3 w-3 text-red-600" />}
                  {weightTrend.trend !== 'stable' && (
                    <span className={weightTrend.trend === 'down' ? 'text-green-600' : 'text-red-600'}>
                      {weightTrend.change.toFixed(1)}kg
                    </span>
                  )}
                </div>
              </div>
              <Scale className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Weekly Workouts</p>
                <p className="text-2xl font-bold text-accent">{weeklyStats.workouts}</p>
                <p className="text-xs text-muted-foreground">{weeklyStats.totalDuration} minutes total</p>
              </div>
              <Dumbbell className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Calories Burned</p>
                <p className="text-2xl font-bold text-nutrition">{weeklyStats.totalCalories}</p>
                <p className="text-xs text-muted-foreground">This week</p>
              </div>
              <Zap className="h-8 w-8 text-nutrition" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Goal Progress</p>
                <p className="text-2xl font-bold text-progress">{Math.round(goalProgress)}%</p>
                <p className="text-xs text-muted-foreground">To target weight</p>
              </div>
              <Target className="h-8 w-8 text-progress" />
            </div>
            <ProgressBar value={goalProgress} className="mt-3" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="weight" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="weight">Weight Tracking</TabsTrigger>
          <TabsTrigger value="workouts">Workout History</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="weight" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Weight Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-primary" />
                  Weight Progress
                </CardTitle>
                <CardDescription>Your weight journey over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Weight chart visualization</p>
                    <p className="text-sm">Chart component would render here</p>
                  </div>
                </div>
                
                {/* Recent Entries */}
                <div className="mt-6 space-y-3">
                  <h4 className="font-semibold">Recent Entries</h4>
                  {weightEntries.slice(0, 5).map((entry, index) => (
                    <div key={entry.date} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <div>
                        <div className="font-medium">{entry.weight}kg</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString()}
                        </div>
                      </div>
                      {entry.bodyFat && (
                        <Badge variant="outline">{entry.bodyFat}% body fat</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Add New Entry */}
            <Card>
              <CardHeader>
                <CardTitle>Log Weight</CardTitle>
                <CardDescription>Track your daily weight and body composition</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="75.5"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="bodyFat">Body Fat % (optional)</Label>
                  <Input
                    id="bodyFat"
                    type="number"
                    step="0.1"
                    placeholder="18.5"
                    value={newBodyFat}
                    onChange={(e) => setNewBodyFat(e.target.value)}
                  />
                </div>

                <Button 
                  onClick={addWeightEntry} 
                  className="w-full gradient-primary text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Log Entry
                </Button>

                {/* Stats */}
                <div className="pt-4 space-y-3 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Starting Weight:</span>
                    <span className="font-medium">{user.weight}kg</span>
                  </div>
                  {user.targetWeight && (
                    <div className="flex justify-between text-sm">
                      <span>Target Weight:</span>
                      <span className="font-medium">{user.targetWeight}kg</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>Change:</span>
                    <span className={`font-medium ${
                      weightEntries.length > 0 ? 
                        (weightEntries[0].weight < user.weight ? 'text-green-600' : 'text-red-600') 
                        : ''
                    }`}>
                      {weightEntries.length > 0 ? 
                        `${(weightEntries[0].weight - user.weight).toFixed(1)}kg` 
                        : '0kg'
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workouts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workout History</CardTitle>
              <CardDescription>Your recent training sessions and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {workoutStats.map((workout, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <Activity className="h-8 w-8 text-primary" />
                      <div>
                        <div className="font-medium">{workout.workout_type} Workout</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(workout.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm space-y-1">
                        <div><span className="font-medium">{workout.duration}</span> minutes</div>
                        <div><span className="font-medium">{workout.calories_burned}</span> calories</div>
                        <div><span className="font-medium">{workout.exercises_completed}</span> exercises</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Achievement Gallery</CardTitle>
                  <CardDescription>Your fitness milestones and goals</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{completionRate.toFixed(0)}%</div>
                  <div className="text-sm text-muted-foreground">Complete</div>
                </div>
              </div>
              <ProgressBar value={completionRate} className="mt-4" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <Card 
                    key={achievement.id} 
                    className={`transition-all ${
                      achievement.achieved 
                        ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' 
                        : 'bg-muted/50'
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          achievement.achieved 
                            ? 'bg-green-500 text-white' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          <achievement.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{achievement.name}</h3>
                            {achievement.achieved && (
                              <Badge className="bg-green-500 text-white">✓ Achieved</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {achievement.description}
                          </p>
                          
                          {!achievement.achieved && achievement.target_value && achievement.current_value !== undefined && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-xs">
                                <span>Progress</span>
                                <span>{achievement.current_value} / {achievement.target_value}</span>
                              </div>
                              <ProgressBar 
                                value={(achievement.current_value / achievement.target_value) * 100} 
                                className="h-2" 
                              />
                            </div>
                          )}
                          
                          {achievement.achieved && achievement.achieved_date && (
                            <div className="text-xs text-green-600 dark:text-green-400">
                              Achieved on {new Date(achievement.achieved_date).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      Workout Consistency Improving
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                      You've maintained a {weeklyStats.workouts}-day workout streak this week!
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <Heart className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Cardiovascular Progress
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                      Your average workout duration has increased by 15% this month.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                  <Target className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Goal Adjustment Recommended
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                      Consider increasing workout intensity to accelerate progress.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-accent" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border border-primary/20 rounded-lg">
                    <p className="text-sm font-medium mb-1">Nutrition Focus</p>
                    <p className="text-xs text-muted-foreground">
                      Increase protein intake to 2.2g per kg bodyweight to support your muscle building goals.
                    </p>
                  </div>
                  
                  <div className="p-3 border border-accent/20 rounded-lg">
                    <p className="text-sm font-medium mb-1">Recovery Optimization</p>
                    <p className="text-xs text-muted-foreground">
                      Add 1-2 rest days between intense sessions for better muscle recovery.
                    </p>
                  </div>
                  
                  <div className="p-3 border border-nutrition/20 rounded-lg">
                    <p className="text-sm font-medium mb-1">Progressive Overload</p>
                    <p className="text-xs text-muted-foreground">
                      Gradually increase weight or reps by 5-10% weekly to continue progressing.
                    </p>
                  </div>
                </div>
                
                <Button className="w-full gradient-accent text-white" variant="outline">
                  Get Detailed AI Analysis
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};