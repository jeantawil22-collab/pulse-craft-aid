import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Activity, 
  Thermometer, 
  Droplets,
  Brain,
  Zap,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Target,
  BarChart3,
  Wifi,
  Battery,
  Smartphone
} from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  height: number;
  weight: number;
  age: number;
  gender: 'male' | 'female' | 'other';
  fitnessGoal: 'weight_loss' | 'muscle_gain' | 'general_fitness' | 'performance';
}

interface BiometricMonitoringProps {
  user: UserProfile;
}

const BiometricMonitoring: React.FC<BiometricMonitoringProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('realtime');
  const [isConnected, setIsConnected] = useState(true);
  
  // Simulated real-time data
  const [realtimeData, setRealtimeData] = useState({
    heartRate: 72,
    hrv: 42,
    bodyTemp: 98.2,
    hydration: 68,
    stressLevel: 35,
    vo2Max: 45,
    bloodOxygen: 98,
    bloodPressure: { systolic: 118, diastolic: 75 },
    restingHR: 58,
    sleepScore: 85
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeData(prev => ({
        ...prev,
        heartRate: Math.floor(Math.random() * 20) + 65,
        hrv: Math.floor(Math.random() * 10) + 38,
        bodyTemp: Math.round((Math.random() * 2 + 97.5) * 10) / 10,
        stressLevel: Math.floor(Math.random() * 30) + 25
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const vitals = [
    {
      label: 'Heart Rate',
      value: realtimeData.heartRate,
      unit: 'BPM',
      icon: Heart,
      status: 'normal',
      range: '60-100',
      color: 'text-primary'
    },
    {
      label: 'HRV Score',
      value: realtimeData.hrv,
      unit: 'ms',
      icon: Activity,
      status: 'good',
      range: '20-50',
      color: 'text-success'
    },
    {
      label: 'Body Temperature',
      value: realtimeData.bodyTemp,
      unit: '°F',
      icon: Thermometer,
      status: 'normal',
      range: '97-99',
      color: 'text-accent'
    },
    {
      label: 'Blood Oxygen',
      value: realtimeData.bloodOxygen,
      unit: '%',
      icon: Zap,
      status: 'excellent',
      range: '95-100',
      color: 'text-progress'
    },
    {
      label: 'Stress Level',
      value: realtimeData.stressLevel,
      unit: '%',
      icon: Brain,
      status: realtimeData.stressLevel > 40 ? 'elevated' : 'normal',
      range: '0-30',
      color: realtimeData.stressLevel > 40 ? 'text-warning' : 'text-success'
    },
    {
      label: 'Hydration',
      value: realtimeData.hydration,
      unit: '%',
      icon: Droplets,
      status: realtimeData.hydration < 60 ? 'low' : 'good',
      range: '60-100',
      color: realtimeData.hydration < 60 ? 'text-warning' : 'text-primary'
    }
  ];

  const healthInsights = [
    {
      type: 'positive',
      title: 'Excellent Recovery',
      message: 'Your HRV score indicates optimal recovery. Great time for intense training.',
      icon: CheckCircle,
      color: 'text-success'
    },
    {
      type: 'warning',
      title: 'Hydration Alert',
      message: 'Your hydration level is below optimal. Consider drinking more water.',
      icon: AlertTriangle,
      color: 'text-warning'
    },
    {
      type: 'info',
      title: 'Sleep Quality',
      message: 'Last night\'s sleep score was 85%. Your body is well-rested.',
      icon: TrendingUp,
      color: 'text-primary'
    }
  ];

  const weeklyTrends = [
    { day: 'Mon', heartRate: 68, hrv: 45, stress: 25 },
    { day: 'Tue', heartRate: 70, hrv: 43, stress: 30 },
    { day: 'Wed', heartRate: 72, hrv: 41, stress: 35 },
    { day: 'Thu', heartRate: 69, hrv: 44, stress: 28 },
    { day: 'Fri', heartRate: 71, hrv: 42, stress: 32 },
    { day: 'Sat', heartRate: 67, hrv: 46, stress: 22 },
    { day: 'Sun', heartRate: 65, hrv: 48, stress: 20 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-success/10 text-success';
      case 'good': return 'bg-primary/10 text-primary';
      case 'normal': return 'bg-muted text-muted-foreground';
      case 'elevated': return 'bg-warning/10 text-warning';
      case 'low': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
            Biometric Monitoring
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time health insights powered by advanced biometric sensors
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Wifi className="h-4 w-4 text-success" />
            <span className="text-sm text-success">Connected</span>
          </div>
          <div className="flex items-center gap-1">
            <Battery className="h-4 w-4 text-primary" />
            <span className="text-sm">78%</span>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="realtime" className="space-y-6">
          {/* Live Data Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vitals.map((vital) => (
              <Card key={vital.label} className="shadow-fitness relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-2 bg-success rounded-full m-2 animate-pulse" />
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <vital.icon className={`h-5 w-5 ${vital.color}`} />
                    <Badge className={getStatusColor(vital.status)}>
                      {vital.status}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-medium text-sm">{vital.label}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold">{vital.value}</span>
                      <span className="text-sm text-muted-foreground">{vital.unit}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Normal: {vital.range} {vital.unit}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Blood Pressure */}
          <Card className="shadow-fitness">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-primary" />
                Blood Pressure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {realtimeData.bloodPressure.systolic}
                  </div>
                  <div className="text-sm text-muted-foreground">Systolic</div>
                </div>
                <div className="text-2xl text-muted-foreground">/</div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">
                    {realtimeData.bloodPressure.diastolic}
                  </div>
                  <div className="text-sm text-muted-foreground">Diastolic</div>
                </div>
                <div className="ml-auto">
                  <Badge className="bg-success/10 text-success">
                    Optimal
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Insights */}
          <Card className="shadow-fitness">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI Health Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {healthInsights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg border">
                    <insight.icon className={`h-5 w-5 mt-0.5 ${insight.color}`} />
                    <div>
                      <h4 className="font-medium">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground">{insight.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-fitness">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Heart Rate Trends
                </CardTitle>
                <CardDescription>7-day average trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Heart Rate Chart</p>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{realtimeData.restingHR}</div>
                    <div className="text-sm text-muted-foreground">Resting HR</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-accent">142</div>
                    <div className="text-sm text-muted-foreground">Max HR</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-success">78</div>
                    <div className="text-sm text-muted-foreground">Avg HR</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-fitness">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  HRV & Recovery
                </CardTitle>
                <CardDescription>Heart rate variability trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">HRV Chart</p>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between mb-2">
                    <span>Recovery Score</span>
                    <span className="font-bold">Good (73/100)</span>
                  </div>
                  <Progress value={73} />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-fitness">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Weekly Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Day</th>
                      <th className="text-left p-2">Avg HR</th>
                      <th className="text-left p-2">HRV</th>
                      <th className="text-left p-2">Stress</th>
                      <th className="text-left p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weeklyTrends.map((day) => (
                      <tr key={day.day} className="border-b">
                        <td className="p-2 font-medium">{day.day}</td>
                        <td className="p-2">{day.heartRate} BPM</td>
                        <td className="p-2">{day.hrv} ms</td>
                        <td className="p-2">{day.stress}%</td>
                        <td className="p-2">
                          <Badge className={day.stress < 30 ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}>
                            {day.stress < 30 ? 'Good' : 'Elevated'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card className="gradient-primary text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6" />
                Personalized Health Insights
              </CardTitle>
              <CardDescription className="text-white/80">
                AI-powered analysis of your biometric data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Key Findings</h4>
                  <div className="space-y-2 text-sm">
                    <p>• Your HRV has improved 12% this week</p>
                    <p>• Stress levels are 23% lower than last month</p>
                    <p>• Resting heart rate shows excellent fitness</p>
                    <p>• Recovery patterns indicate good sleep quality</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Recommendations</h4>
                  <div className="space-y-2 text-sm">
                    <p>• Maintain current training intensity</p>
                    <p>• Consider meditation for stress management</p>
                    <p>• Optimal time for high-intensity workouts</p>
                    <p>• Focus on hydration throughout the day</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-fitness">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Health Goals Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Resting HR Goal (&lt; 60 BPM)</span>
                    <CheckCircle className="h-4 w-4 text-success" />
                  </div>
                  <Progress value={100} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>HRV Improvement (+10%)</span>
                    <span>83%</span>
                  </div>
                  <Progress value={83} />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Stress Reduction (&lt; 25%)</span>
                    <span>70%</span>
                  </div>
                  <Progress value={70} />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-fitness">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Fitness Zones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Zone 1 (Recovery)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div className="bg-success h-2 rounded-full" style={{width: '15%'}} />
                      </div>
                      <span className="text-sm">15%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Zone 2 (Aerobic)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{width: '45%'}} />
                      </div>
                      <span className="text-sm">45%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Zone 3 (Threshold)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div className="bg-accent h-2 rounded-full" style={{width: '25%'}} />
                      </div>
                      <span className="text-sm">25%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Zone 4 (VO2 Max)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div className="bg-warning h-2 rounded-full" style={{width: '15%'}} />
                      </div>
                      <span className="text-sm">15%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-fitness">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-primary" />
                  Connected Devices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Heart className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Apple Watch Series 9</p>
                      <p className="text-sm text-muted-foreground">Heart rate, HRV, Activity</p>
                    </div>
                  </div>
                  <Badge className="bg-success/10 text-success">Connected</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-accent" />
                    <div>
                      <p className="font-medium">WHOOP 4.0</p>
                      <p className="text-sm text-muted-foreground">Recovery, Strain, Sleep</p>
                    </div>
                  </div>
                  <Badge className="bg-success/10 text-success">Connected</Badge>
                </div>

                <Button variant="outline" className="w-full">
                  <Wifi className="h-4 w-4 mr-2" />
                  Add New Device
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-fitness">
              <CardHeader>
                <CardTitle>Alert Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>High Heart Rate (&gt; 150 BPM)</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Low HRV Alert</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Stress Level Warnings</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Hydration Reminders</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Recovery Insights</span>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="gradient-accent text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Data Sync Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Sync Frequency</h4>
                  <div className="space-y-2 text-sm">
                    <p>• Real-time: Heart rate, HRV</p>
                    <p>• Every 5 minutes: Stress, Temperature</p>
                    <p>• Hourly: Activity summary</p>
                    <p>• Daily: Sleep analysis, Recovery</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Battery Optimization</h4>
                  <div className="space-y-2 text-sm">
                    <p>• Adaptive sync based on usage</p>
                    <p>• Reduced frequency during sleep</p>
                    <p>• Smart background processing</p>
                    <p>• Low battery mode available</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BiometricMonitoring;