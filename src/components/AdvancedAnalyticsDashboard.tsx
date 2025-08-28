import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Target, 
  Calendar,
  Zap,
  Heart,
  Award,
  BarChart3,
  PieChart,
  LineChart,
  Download
} from 'lucide-react';
import { DataVisualization } from './DataVisualization';
import { useFitnessData } from '@/hooks/useLocalStorage';
import { useFitnessCalculations, useDataFormatters } from '@/hooks/usePerformance';

interface AdvancedAnalyticsDashboardProps {
  user: any;
}

export const AdvancedAnalyticsDashboard: React.FC<AdvancedAnalyticsDashboardProps> = ({ user }) => {
  const { workoutHistory, nutritionLog, progressData } = useFitnessData();
  const { calculateProgress, calculateCaloriesBurned } = useFitnessCalculations();
  const { formatDuration, formatCalories, formatDate } = useDataFormatters();
  
  const [timeframe, setTimeframe] = useState('30');
  const [selectedMetric, setSelectedMetric] = useState('all');

  // Advanced analytics calculations
  const analytics = useMemo(() => {
    const days = parseInt(timeframe);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recentWorkouts = workoutHistory.filter((w: any) => 
      new Date(w.timestamp) >= cutoffDate
    );
    const recentNutrition = nutritionLog.filter((n: any) => 
      new Date(n.timestamp) >= cutoffDate
    );
    const recentProgress = progressData.filter((p: any) => 
      new Date(p.timestamp) >= cutoffDate
    );

    // Workout analytics
    const totalWorkouts = recentWorkouts.length;
    const totalDuration = recentWorkouts.reduce((acc: number, w: any) => acc + (w.duration || 0), 0);
    const avgWorkoutDuration = totalWorkouts > 0 ? totalDuration / totalWorkouts : 0;
    const workoutFrequency = totalWorkouts / days;

    // Intensity analysis
    const intensityDistribution = recentWorkouts.reduce((acc: any, w: any) => {
      const intensity = w.intensity || 'medium';
      acc[intensity] = (acc[intensity] || 0) + 1;
      return acc;
    }, {});

    // Nutrition analytics
    const avgCalories = recentNutrition.length > 0 
      ? recentNutrition.reduce((acc: number, n: any) => acc + (n.calories || 0), 0) / recentNutrition.length
      : 0;

    const macroTrends = recentNutrition.reduce((acc: any, n: any) => {
      acc.protein += n.protein || 0;
      acc.carbs += n.carbs || 0;
      acc.fat += n.fat || 0;
      return acc;
    }, { protein: 0, carbs: 0, fat: 0 });

    // Progress analytics
    const weightTrend = recentProgress.length > 1 
      ? recentProgress[0]?.weight - recentProgress[recentProgress.length - 1]?.weight
      : 0;

    // Performance metrics
    const consistencyScore = Math.min((workoutFrequency / 1) * 100, 100); // Target: 1 workout per day
    const improvementRate = recentWorkouts.length > 5 
      ? ((recentWorkouts[0]?.performance || 0) - (recentWorkouts[4]?.performance || 0)) / 5
      : 0;

    // Goal progress
    const goalProgress = user.targetWeight 
      ? calculateProgress(user.weight, user.weight + (user.fitnessGoal === 'weight_loss' ? 10 : -10), user.targetWeight)
      : 0;

    return {
      workouts: {
        total: totalWorkouts,
        duration: totalDuration,
        avgDuration: avgWorkoutDuration,
        frequency: workoutFrequency,
        intensityDistribution
      },
      nutrition: {
        avgCalories,
        macroTrends
      },
      progress: {
        weightTrend,
        goalProgress
      },
      performance: {
        consistencyScore,
        improvementRate
      }
    };
  }, [workoutHistory, nutritionLog, progressData, timeframe, user, calculateProgress]);

  // Insights generation
  const insights = useMemo(() => {
    const insights = [];

    // Workout insights
    if (analytics.workouts.frequency < 0.5) {
      insights.push({
        type: 'warning',
        title: 'Low Workout Frequency',
        message: 'Consider increasing your workout frequency to reach your goals faster.',
        action: 'Schedule more workouts'
      });
    }

    if (analytics.performance.consistencyScore > 80) {
      insights.push({
        type: 'success',
        title: 'Excellent Consistency',
        message: 'You\'re maintaining great workout consistency. Keep it up!',
        action: 'Maintain current routine'
      });
    }

    // Nutrition insights
    if (analytics.nutrition.avgCalories < user.targetCalories * 0.8) {
      insights.push({
        type: 'info',
        title: 'Low Calorie Intake',
        message: 'Your calorie intake might be too low for your goals.',
        action: 'Consider increasing portions'
      });
    }

    // Progress insights
    if (Math.abs(analytics.progress.weightTrend) < 0.5) {
      insights.push({
        type: 'info',
        title: 'Stable Weight',
        message: 'Your weight has been stable. This might indicate muscle gain.',
        action: 'Focus on body composition'
      });
    }

    return insights;
  }, [analytics, user]);

  const exportReport = () => {
    const report = {
      user: {
        name: user.name,
        goals: user.fitnessGoal,
        targetWeight: user.targetWeight
      },
      timeframe: `${timeframe} days`,
      analytics,
      insights,
      generatedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fitness-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Advanced Analytics</h1>
          <p className="text-muted-foreground">Deep insights into your fitness journey</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
              <SelectItem value="365">1 year</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportReport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Consistency Score</p>
                <p className="text-2xl font-bold">{Math.round(analytics.performance.consistencyScore)}%</p>
              </div>
              <div className="relative">
                <Progress 
                  value={analytics.performance.consistencyScore} 
                  className="w-12 h-12 rotate-90"
                />
                <Target className="absolute top-2 left-2 h-8 w-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Workout Frequency</p>
                <p className="text-2xl font-bold">{analytics.workouts.frequency.toFixed(1)}/day</p>
              </div>
              <Activity className="h-8 w-8 text-nutrition" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Duration</p>
                <p className="text-2xl font-bold">{formatDuration(analytics.workouts.avgDuration)}</p>
              </div>
              <Calendar className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Goal Progress</p>
                <p className="text-2xl font-bold">{Math.round(analytics.progress.goalProgress)}%</p>
              </div>
              <Award className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workouts">Workouts</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <DataVisualization user={user} />
        </TabsContent>

        <TabsContent value="workouts" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Workout Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(analytics.workouts.intensityDistribution).map(([intensity, count]) => (
                    <div key={intensity} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${
                          intensity === 'high' ? 'bg-destructive' :
                          intensity === 'medium' ? 'bg-warning' : 'bg-success'
                        }`} />
                        <span className="capitalize">{intensity} Intensity</span>
                      </div>
                      <Badge variant="secondary">{count as number}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Total Workouts</span>
                      <span>{analytics.workouts.total}</span>
                    </div>
                    <Progress value={(analytics.workouts.total / 30) * 100} className="mt-1" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Total Duration</span>
                      <span>{formatDuration(analytics.workouts.duration)}</span>
                    </div>
                    <Progress value={(analytics.workouts.duration / 900) * 100} className="mt-1" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Improvement Rate</span>
                      <span className="flex items-center gap-1">
                        {analytics.performance.improvementRate > 0 ? (
                          <TrendingUp className="w-3 h-3 text-success" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-destructive" />
                        )}
                        {Math.abs(analytics.performance.improvementRate).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="nutrition" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Macro Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Protein</span>
                      <span>{analytics.nutrition.macroTrends.protein.toFixed(0)}g</span>
                    </div>
                    <Progress value={(analytics.nutrition.macroTrends.protein / 150) * 100} className="mt-1" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Carbohydrates</span>
                      <span>{analytics.nutrition.macroTrends.carbs.toFixed(0)}g</span>
                    </div>
                    <Progress value={(analytics.nutrition.macroTrends.carbs / 300) * 100} className="mt-1" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Fat</span>
                      <span>{analytics.nutrition.macroTrends.fat.toFixed(0)}g</span>
                    </div>
                    <Progress value={(analytics.nutrition.macroTrends.fat / 100) * 100} className="mt-1" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Calorie Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold">{formatCalories(analytics.nutrition.avgCalories)}</p>
                    <p className="text-sm text-muted-foreground">Average Daily Calories</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Target</span>
                      <span>{formatCalories(user.targetCalories || 2000)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Difference</span>
                      <span className={`flex items-center gap-1 ${
                        analytics.nutrition.avgCalories > (user.targetCalories || 2000) 
                          ? 'text-destructive' : 'text-success'
                      }`}>
                        {analytics.nutrition.avgCalories > (user.targetCalories || 2000) ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {Math.abs(analytics.nutrition.avgCalories - (user.targetCalories || 2000)).toFixed(0)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4">
            {insights.map((insight, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      insight.type === 'success' ? 'bg-success/10 text-success' :
                      insight.type === 'warning' ? 'bg-warning/10 text-warning' :
                      'bg-primary/10 text-primary'
                    }`}>
                      {insight.type === 'success' ? (
                        <Heart className="w-4 h-4" />
                      ) : insight.type === 'warning' ? (
                        <Zap className="w-4 h-4" />
                      ) : (
                        <BarChart3 className="w-4 h-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{insight.message}</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        {insight.action}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};