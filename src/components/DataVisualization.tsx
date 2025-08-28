import React, { useMemo } from 'react';
import { Line, LineChart, Area, AreaChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, Flame, Droplets } from 'lucide-react';
import { useFitnessData } from '@/hooks/useLocalStorage';
import { useDataFormatters } from '@/hooks/usePerformance';

interface DataVisualizationProps {
  user: any;
}

export const DataVisualization: React.FC<DataVisualizationProps> = ({ user }) => {
  const { workoutHistory, nutritionLog, progressData } = useFitnessData();
  const { formatDate, formatCalories, formatDuration } = useDataFormatters();

  // Enhanced data processing with memoization
  const chartData = useMemo(() => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    const processedData = last30Days.map(date => {
      const dayWorkouts = workoutHistory.filter((w: any) => 
        w.timestamp?.startsWith(date)
      );
      const dayNutrition = nutritionLog.filter((n: any) => 
        n.timestamp?.startsWith(date)
      );
      const dayProgress = progressData.find((p: any) => 
        p.timestamp?.startsWith(date)
      );

      return {
        date,
        workouts: dayWorkouts.length,
        duration: dayWorkouts.reduce((acc: number, w: any) => acc + (w.duration || 0), 0),
        calories: dayNutrition.reduce((acc: number, n: any) => acc + (n.calories || 0), 0),
        weight: dayProgress?.weight || null,
        mood: dayProgress?.mood || null,
        energy: dayProgress?.energy || null
      };
    });

    return processedData;
  }, [workoutHistory, nutritionLog, progressData]);

  const nutritionBreakdown = useMemo(() => {
    const recent = nutritionLog.slice(0, 7);
    const totals = recent.reduce((acc: any, entry: any) => {
      acc.protein += entry.protein || 0;
      acc.carbs += entry.carbs || 0;
      acc.fat += entry.fat || 0;
      return acc;
    }, { protein: 0, carbs: 0, fat: 0 });

    return [
      { name: 'Protein', value: totals.protein, color: 'hsl(var(--primary))' },
      { name: 'Carbs', value: totals.carbs, color: 'hsl(var(--nutrition))' },
      { name: 'Fat', value: totals.fat, color: 'hsl(var(--accent))' }
    ];
  }, [nutritionLog]);

  const workoutStats = useMemo(() => {
    const recentWorkouts = workoutHistory.slice(0, 10);
    const totalDuration = recentWorkouts.reduce((acc: number, w: any) => acc + (w.duration || 0), 0);
    const avgIntensity = recentWorkouts.reduce((acc: number, w: any) => acc + (w.intensity || 5), 0) / recentWorkouts.length;
    
    return {
      totalWorkouts: recentWorkouts.length,
      totalDuration,
      avgIntensity: Math.round(avgIntensity * 10) / 10,
      consistency: Math.round((recentWorkouts.length / 10) * 100)
    };
  }, [workoutHistory]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{formatDate(label)}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="h-4 w-4 text-success" />;
    if (current < previous) return <TrendingDown className="h-4 w-4 text-destructive" />;
    return <Activity className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Workouts</p>
                <p className="text-2xl font-bold">{workoutStats.totalWorkouts}</p>
              </div>
              <Activity className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Training Time</p>
                <p className="text-2xl font-bold">{formatDuration(workoutStats.totalDuration)}</p>
              </div>
              <Flame className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Intensity</p>
                <p className="text-2xl font-bold">{workoutStats.avgIntensity}/10</p>
              </div>
              <Badge variant={workoutStats.avgIntensity > 7 ? 'default' : 'secondary'}>
                {workoutStats.avgIntensity > 7 ? 'High' : 'Moderate'}
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Consistency</p>
                <p className="text-2xl font-bold">{workoutStats.consistency}%</p>
              </div>
              <Droplets className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Charts */}
      <Tabs defaultValue="fitness" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="fitness">Fitness Progress</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trends & Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="fitness" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Workout Frequency</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      className="text-xs"
                    />
                    <YAxis className="text-xs" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="workouts" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary) / 0.2)" 
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Training Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      className="text-xs"
                    />
                    <YAxis className="text-xs" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="duration" 
                      fill="hsl(var(--nutrition))" 
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="nutrition" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Macro Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={nutritionBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {nutritionBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daily Calories</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      className="text-xs"
                    />
                    <YAxis className="text-xs" />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="calories" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weight & Energy Correlation</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={chartData.filter(d => d.weight && d.energy)}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    className="text-xs"
                  />
                  <YAxis yAxisId="left" className="text-xs" />
                  <YAxis yAxisId="right" orientation="right" className="text-xs" />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="weight" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Weight (kg)"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="energy" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={2}
                    name="Energy Level"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};