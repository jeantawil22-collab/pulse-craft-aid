import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Moon, 
  Waves, 
  Heart, 
  Thermometer, 
  Snowflake,
  Flame,
  Zap,
  Brain,
  Timer,
  Activity,
  Droplets,
  Wind,
  Sparkles,
  Play,
  Pause,
  Volume2
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

interface RecoveryHubProps {
  user: UserProfile;
}

const RecoveryHub: React.FC<RecoveryHubProps> = ({ user }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedRecovery, setSelectedRecovery] = useState<string | null>(null);
  const [recoveryData, setRecoveryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const recoveryProtocols = [
    {
      id: 'ice-bath',
      name: 'Ice Bath Therapy',
      duration: '10-15 min',
      temperature: '50-59°F',
      benefits: ['Reduces inflammation', 'Improves circulation', 'Enhances recovery'],
      icon: Snowflake,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'sauna',
      name: 'Infrared Sauna',
      duration: '15-20 min',
      temperature: '120-140°F',
      benefits: ['Increases blood flow', 'Muscle relaxation', 'Stress relief'],
      icon: Flame,
      color: 'from-red-500 to-orange-500'
    },
    {
      id: 'meditation',
      name: 'Guided Meditation',
      duration: '10-30 min',
      temperature: 'Room temp',
      benefits: ['Reduces cortisol', 'Improves focus', 'Mental recovery'],
      icon: Brain,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'breathing',
      name: 'Breathwork Session',
      duration: '5-15 min',
      temperature: 'Any',
      benefits: ['Activates parasympathetic', 'Reduces stress', 'Better sleep'],
      icon: Wind,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  useEffect(() => {
    fetchRecoveryData();
  }, []);

  const fetchRecoveryData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      // Fetch latest biometric data for recovery metrics
      const { data: biometricData } = await supabase
        .from('biometric_data')
        .select('*')
        .eq('user_id', authUser.id)
        .order('recorded_at', { ascending: false })
        .limit(10);

      // Calculate recovery score based on HRV, sleep, and stress
      const latestHRV = biometricData?.find(d => d.data_type === 'hrv')?.value || 42;
      const latestStress = biometricData?.find(d => d.data_type === 'stress')?.value || 35;
      const sleepQuality = 8.2; // Could be fetched from sleep tracking integration

      const recoveryScore = Math.min(100, (latestHRV * 1.5) + (10 - latestStress / 10) * 5 + (sleepQuality * 5));

      setRecoveryData({
        recoveryScore: Math.round(recoveryScore),
        sleepQuality,
        stressLevel: latestStress,
        hrv: latestHRV,
        restingHR: biometricData?.find(d => d.data_type === 'heart_rate')?.value || 58,
        hydration: 70 // Could be tracked separately
      });
    } catch (error) {
      console.error('Error fetching recovery data:', error);
      toast({
        title: "Error",
        description: "Failed to load recovery data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const startRecoverySession = async (protocolId: string) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      // Log recovery session
      const { error } = await supabase
        .from('user_progress')
        .insert({
          user_id: authUser.id,
          metric_type: 'recovery_session',
          current_value: 1,
          unit: 'session',
          recorded_at: new Date().toISOString()
        });

      if (error) throw error;

      setSelectedRecovery(protocolId);
      setIsPlaying(true);

      toast({
        title: "Recovery Session Started",
        description: `Started ${recoveryProtocols.find(p => p.id === protocolId)?.name} session`
      });
    } catch (error) {
      console.error('Error starting recovery session:', error);
      toast({
        title: "Error",
        description: "Failed to start recovery session",
        variant: "destructive"
      });
    }
  };

  const stopRecoverySession = () => {
    setSelectedRecovery(null);
    setIsPlaying(false);
    
    toast({
      title: "Session Complete",
      description: "Great job! Your recovery session is complete."
    });
  };

  const getRecoveryScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 bg-background min-h-screen">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const recoveryMetrics = [
    { 
      label: 'Sleep Quality', 
      value: recoveryData?.sleepQuality || 8.2, 
      max: 10, 
      unit: '/10', 
      icon: Moon, 
      color: 'bg-nutrition' 
    },
    { 
      label: 'HRV Score', 
      value: recoveryData?.hrv || 42, 
      max: 100, 
      unit: 'ms', 
      icon: Heart, 
      color: 'bg-primary' 
    },
    { 
      label: 'Stress Level', 
      value: recoveryData?.stressLevel || 35, 
      max: 100, 
      unit: '%', 
      icon: Brain, 
      color: 'bg-accent' 
    },
    { 
      label: 'Resting HR', 
      value: recoveryData?.restingHR || 58, 
      max: 100, 
      unit: 'BPM', 
      icon: Activity, 
      color: 'bg-progress' 
    }
  ];

  const sleepOptimization = {
    bedtime: '10:30 PM',
    wakeTime: '6:30 AM',
    sleepDebt: 2.5,
    optimalTemp: '65-68°F',
    environment: {
      lighting: 'Dim 2h before bed',
      noise: 'White noise or silence',
      devices: 'No screens 1h before'
    }
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
          Recovery Hub
        </h1>
        <p className="text-muted-foreground mt-1">
          Optimize your recovery with AI-powered insights and personalized protocols
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="protocols">Protocols</TabsTrigger>
          <TabsTrigger value="sleep">Sleep</TabsTrigger>
          <TabsTrigger value="biometrics">Biometrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Recovery Score */}
          <Card className="shadow-fitness">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Recovery Score
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="relative w-40 h-40 mx-auto mb-4">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-accent p-1">
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${getRecoveryScoreColor(recoveryData?.recoveryScore || 73)}`}>
                        {recoveryData?.recoveryScore || 73}
                      </div>
                      <div className="text-sm text-muted-foreground">/ 100</div>
                    </div>
                  </div>
                </div>
              </div>
              <Badge className="gradient-primary text-white">
                Good Recovery
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">
                Your body is recovering well. Consider a light workout today.
              </p>
            </CardContent>
          </Card>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recoveryMetrics.map((metric) => (
              <Card key={metric.label} className="shadow-fitness">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <metric.icon className="h-5 w-5 text-primary" />
                    <span className="text-2xl font-bold">
                      {metric.value}
                      <span className="text-sm text-muted-foreground">{metric.unit}</span>
                    </span>
                  </div>
                  <p className="text-sm font-medium">{metric.label}</p>
                  <Progress 
                    value={(metric.value / metric.max) * 100} 
                    className="mt-2" 
                  />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Today's Recommendation */}
          <Card className="gradient-nutrition text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Today's Recovery Focus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-semibold mb-2">Active Recovery + Breathwork</h3>
              <p className="text-white/90 mb-4">
                Based on your metrics, focus on gentle movement and stress reduction today.
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  className="text-black"
                  onClick={() => startRecoverySession('breathing')}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Session
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="protocols" className="space-y-6">
          <div className="grid gap-6">
            {recoveryProtocols.map((protocol) => (
              <Card key={protocol.id} className="shadow-fitness overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${protocol.color}`} />
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${protocol.color} text-white`}>
                        <protocol.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{protocol.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Timer className="h-4 w-4" />
                            <span>{protocol.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Thermometer className="h-4 w-4" />
                            <span>{protocol.temperature}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => startRecoverySession(protocol.id)}
                        disabled={isPlaying && selectedRecovery === protocol.id}
                      >
                        {isPlaying && selectedRecovery === protocol.id ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            In Progress
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Start
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Benefits:</h4>
                    <div className="flex flex-wrap gap-2">
                      {protocol.benefits.map((benefit, index) => (
                        <Badge key={index} variant="secondary">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {isPlaying && selectedRecovery === protocol.id && (
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Session in progress...</span>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={stopRecoverySession}
                        >
                          Stop
                        </Button>
                      </div>
                      <Progress value={45} className="mb-2" />
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Volume2 className="h-4 w-4" />
                        <span>Guided audio playing</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sleep" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-fitness">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Moon className="h-5 w-5 text-primary" />
                  Sleep Optimization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Optimal Bedtime</span>
                  <Badge variant="outline">{sleepOptimization.bedtime}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Wake Time</span>
                  <Badge variant="outline">{sleepOptimization.wakeTime}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Sleep Debt</span>
                  <Badge variant="secondary">{sleepOptimization.sleepDebt}h</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Room Temperature</span>
                  <Badge variant="outline">{sleepOptimization.optimalTemp}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-fitness">
              <CardHeader>
                <CardTitle>Sleep Environment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Lighting</h4>
                  <p className="text-sm text-muted-foreground">{sleepOptimization.environment.lighting}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Sound</h4>
                  <p className="text-sm text-muted-foreground">{sleepOptimization.environment.noise}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Devices</h4>
                  <p className="text-sm text-muted-foreground">{sleepOptimization.environment.devices}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="gradient-progress text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Waves className="h-5 w-5" />
                Sleep Sounds & Stories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/90 mb-4">
                Curated sleep content to improve your sleep quality and duration.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Button variant="secondary" className="text-black">Rain Sounds</Button>
                <Button variant="secondary" className="text-black">Ocean Waves</Button>
                <Button variant="secondary" className="text-black">Forest Night</Button>
                <Button variant="secondary" className="text-black">Sleep Story</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="biometrics" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-fitness">
              <CardHeader>
                <CardTitle>Heart Rate Variability</CardTitle>
                <CardDescription>
                  HRV trends over the past 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">HRV Chart Placeholder</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-fitness">
              <CardHeader>
                <CardTitle>Recovery Trends</CardTitle>
                <CardDescription>
                  Weekly recovery score analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Recovery Trend Chart</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-fitness">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-primary" />
                Hydration Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <span>Daily Goal: 3L</span>
                <span>Current: {((recoveryData?.hydration || 70) / 100 * 3).toFixed(1)}L</span>
              </div>
              <Progress value={recoveryData?.hydration || 70} className="mb-4" />
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((glass) => (
                  <Button 
                    key={glass}
                    variant={glass <= Math.ceil((recoveryData?.hydration || 70) / 25) ? "default" : "outline"}
                    size="sm"
                    className="aspect-square"
                  >
                    <Droplets className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecoveryHub;