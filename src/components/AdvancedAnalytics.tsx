import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Target,
  Calendar,
  Clock,
  Zap,
  Activity,
  Heart,
  Brain,
  Trophy,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  LineChart,
  PieChart
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell,
  Area,
  AreaChart
} from 'recharts';

interface AdvancedAnalyticsProps {
  user: any;
}

interface MetricTrend {
  id: string;
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  unit: string;
  icon: React.ElementType;
  color: string;
}

interface PredictiveInsight {
  id: string;
  type: 'prediction' | 'recommendation' | 'warning' | 'achievement';
  title: string;
  description: string;
  probability: number;
  timeframe: string;
  impact: 'high' | 'medium' | 'low';
}

export const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({ user }) => {
  const [selectedMetric, setSelectedMetric] = useState('performance');

  // Mock data for advanced analytics
  const performanceData = [
    { week: 'W1', strength: 85, endurance: 78, flexibility: 65, overall: 76 },
    { week: 'W2', strength: 88, endurance: 82, flexibility: 68, overall: 79 },
    { week: 'W3', strength: 92, endurance: 85, flexibility: 72, overall: 83 },
    { week: 'W4', strength: 95, endurance: 88, flexibility: 75, overall: 86 },
    { week: 'W5', strength: 98, endurance: 91, flexibility: 78, overall: 89 },
    { week: 'W6', strength: 100, endurance: 94, flexibility: 82, overall: 92 }
  ];

  const bodyCompositionData = [
    { month: 'Jan', muscle: 65, fat: 18, water: 62 },
    { month: 'Feb', muscle: 67, fat: 17, water: 63 },
    { month: 'Mar', muscle: 69, fat: 16, water: 64 },
    { month: 'Apr', muscle: 71, fat: 15, water: 65 },
    { month: 'May', muscle: 73, fat: 14, water: 66 },
    { month: 'Jun', muscle: 75, fat: 13, water: 67 }
  ];

  const workoutIntensityData = [
    { day: 'Mon', intensity: 85, duration: 65, calories: 520 },
    { day: 'Tue', intensity: 70, duration: 45, calories: 380 },
    { day: 'Wed', intensity: 92, duration: 70, calories: 610 },
    { day: 'Thu', intensity: 60, duration: 30, calories: 250 },
    { day: 'Fri', intensity: 88, duration: 60, calories: 480 },
    { day: 'Sat', intensity: 95, duration: 75, calories: 650 },
    { day: 'Sun', intensity: 40, duration: 25, calories: 180 }
  ];

  const recoveryMetrics = [
    { name: 'Sleep Quality', value: 85 },
    { name: 'HRV', value: 78 },
    { name: 'Resting HR', value: 92 },
    { name: 'Stress Level', value: 25 }
  ];

  const metricTrends: MetricTrend[] = [
    {
      id: '1',
      name: 'Strength Score',
      value: 95,
      change: 12.5,
      trend: 'up',
      unit: '%',
      icon: TrendingUp,
      color: 'text-success'
    },
    {
      id: '2',
      name: 'Avg Workout Duration',
      value: 58,
      change: -5.2,
      trend: 'down',
      unit: 'min',
      icon: Clock,
      color: 'text-warning'
    },
    {
      id: '3',
      name: 'Recovery Rate',
      value: 88,
      change: 8.1,
      trend: 'up',
      unit: '%',
      icon: Heart,
      color: 'text-success'
    },
    {
      id: '4',
      name: 'Consistency Score',
      value: 92,
      change: 15.3,
      trend: 'up',
      unit: '%',
      icon: Target,
      color: 'text-success'
    }
  ];

  const predictiveInsights: PredictiveInsight[] = [
    {
      id: '1',
      type: 'prediction',
      title: 'Goal Achievement Forecast',
      description: 'Based on current trends, you\'ll reach your target weight in 6-8 weeks with 87% probability.',
      probability: 87,
      timeframe: '6-8 weeks',
      impact: 'high'
    },
    {
      id: '2',
      type: 'warning',
      title: 'Overtraining Risk',
      description: 'Your intensity has increased 23% this week. Consider a deload to prevent burnout.',
      probability: 73,
      timeframe: '1-2 weeks',
      impact: 'medium'
    },
    {
      id: '3',
      type: 'recommendation',
      title: 'Optimal Training Window',
      description: 'Your performance peaks at 6:30 AM based on HRV and sleep data.',
      probability: 91,
      timeframe: 'Daily',
      impact: 'medium'
    },
    {
      id: '4',
      type: 'achievement',
      title: 'Strength Plateau Breakthrough',
      description: 'Your progressive overload pattern indicates a new PR attempt window opening.',
      probability: 82,
      timeframe: '2-3 weeks',
      impact: 'high'
    }
  ];

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--nutrition))', 'hsl(var(--progress))'];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'prediction': return <TrendingUp className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'recommendation': return <Brain className="h-4 w-4" />;
      case 'achievement': return <Trophy className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'prediction': return 'border-progress bg-progress/10';
      case 'warning': return 'border-warning bg-warning/10';
      case 'recommendation': return 'border-primary bg-primary/10';
      case 'achievement': return 'border-success bg-success/10';
      default: return 'border-muted bg-muted/10';
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-progress bg-clip-text text-transparent">
            Advanced Analytics
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered insights and predictive fitness analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <Zap className="h-4 w-4 mr-2" />
            AI Insights
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricTrends.map((metric) => (
          <Card key={metric.id} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.name}</p>
                  <p className="text-2xl font-bold">
                    {metric.value}{metric.unit}
                  </p>
                  <div className={`flex items-center gap-1 text-sm ${metric.color}`}>
                    <metric.icon className="h-3 w-3" />
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-gradient-primary/10 flex items-center justify-center ${metric.color}`}>
                  <metric.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={selectedMetric} onValueChange={setSelectedMetric} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="body-comp">Body Composition</TabsTrigger>
          <TabsTrigger value="recovery">Recovery</TabsTrigger>
          <TabsTrigger value="predictions">AI Predictions</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-primary" />
                  Performance Trends (6 Weeks)
                </CardTitle>
                <CardDescription>Strength, endurance, and overall fitness progression</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="strength" stroke="hsl(var(--primary))" strokeWidth={2} />
                    <Line type="monotone" dataKey="endurance" stroke="hsl(var(--accent))" strokeWidth={2} />
                    <Line type="monotone" dataKey="flexibility" stroke="hsl(var(--nutrition))" strokeWidth={2} />
                    <Line type="monotone" dataKey="overall" stroke="hsl(var(--progress))" strokeWidth={3} />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Workout Intensity Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-accent" />
                  Weekly Intensity Pattern
                </CardTitle>
                <CardDescription>Training load and intensity distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={workoutIntensityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="intensity" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="body-comp" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Body Composition Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-nutrition" />
                  Body Composition Changes
                </CardTitle>
                <CardDescription>Muscle mass, body fat, and hydration trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={bodyCompositionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="muscle" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" />
                    <Area type="monotone" dataKey="fat" stackId="2" stroke="hsl(var(--warning))" fill="hsl(var(--warning))" />
                    <Area type="monotone" dataKey="water" stackId="3" stroke="hsl(var(--progress))" fill="hsl(var(--progress))" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Current Composition */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-progress" />
                  Current Body Composition
                </CardTitle>
                <CardDescription>Latest DEXA scan results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <div className="text-2xl font-bold text-primary">75kg</div>
                      <div className="text-sm text-muted-foreground">Muscle Mass</div>
                    </div>
                    <div className="text-center p-4 bg-warning/10 rounded-lg">
                      <div className="text-2xl font-bold text-warning">13%</div>
                      <div className="text-sm text-muted-foreground">Body Fat</div>
                    </div>
                    <div className="text-center p-4 bg-progress/10 rounded-lg">
                      <div className="text-2xl font-bold text-progress">67%</div>
                      <div className="text-sm text-muted-foreground">Hydration</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Muscle Mass</span>
                        <span>75kg (↑2kg)</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Body Fat</span>
                        <span>13% (↓5%)</span>
                      </div>
                      <Progress value={13} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Visceral Fat</span>
                        <span>Level 4 (Optimal)</span>
                      </div>
                      <Progress value={20} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recovery" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recovery Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-destructive" />
                  Recovery Metrics
                </CardTitle>
                <CardDescription>Sleep, HRV, and stress indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recoveryMetrics.map((metric, index) => (
                    <div key={metric.name} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{metric.name}</span>
                        <span className="font-medium">{metric.value}%</span>
                      </div>
                      <Progress 
                        value={metric.value} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recovery Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-accent" />
                  Recovery Recommendations
                </CardTitle>
                <CardDescription>Personalized recovery optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="font-medium">Sleep Quality</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Excellent 8.2hr average. Maintain current bedtime routine.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                      <span className="font-medium">HRV Trend</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      15% decrease this week. Consider reducing training intensity by 20%.
                    </p>
                  </div>
                  
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span className="font-medium">Active Recovery</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Perfect for yoga or light cardio. Your body is ready for movement.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {predictiveInsights.map((insight) => (
              <Card key={insight.id} className={`border-l-4 ${getInsightColor(insight.type)}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getInsightColor(insight.type)}`}>
                        {getInsightIcon(insight.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{insight.title}</h3>
                          <Badge variant={insight.impact === 'high' ? 'default' : 'secondary'}>
                            {insight.impact} impact
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Probability: {insight.probability}%</span>
                          <span>Timeframe: {insight.timeframe}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{insight.probability}%</div>
                      <div className="text-xs text-muted-foreground">Confidence</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Progress value={insight.probability} className="h-2" />
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