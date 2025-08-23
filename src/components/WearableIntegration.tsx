import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { 
  Watch, 
  Smartphone, 
  Heart, 
  Activity, 
  Zap, 
  Thermometer,
  Droplets,
  Moon,
  Wifi,
  WifiOff,
  RefreshCw,
  Settings,
  TrendingUp,
  Battery
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

interface WearableIntegrationProps {
  user: UserProfile;
}

const WearableIntegration: React.FC<WearableIntegrationProps> = ({ user }) => {
  const [connectedDevices, setConnectedDevices] = useState([
    { id: 'apple-watch', name: 'Apple Watch Series 9', type: 'watch', connected: true, battery: 78 },
    { id: 'fitbit', name: 'Fitbit Charge 6', type: 'fitness', connected: false, battery: 0 },
    { id: 'garmin', name: 'Garmin Forerunner 955', type: 'watch', connected: true, battery: 45 },
    { id: 'whoop', name: 'WHOOP 4.0', type: 'strap', connected: true, battery: 89 }
  ]);

  const [realTimeData, setRealTimeData] = useState({
    heartRate: 72,
    steps: 8420,
    calories: 1247,
    stress: 35,
    bodyTemp: 98.2,
    hydration: 68,
    sleep: 7.2,
    hrv: 42
  });

  const [notifications, setNotifications] = useState({
    heartRateAlerts: true,
    inactivityReminders: true,
    sleepGoals: true,
    hydrationReminders: true
  });

  const toggleDeviceConnection = (deviceId: string) => {
    setConnectedDevices(devices => 
      devices.map(device => 
        device.id === deviceId 
          ? { ...device, connected: !device.connected }
          : device
      )
    );
  };

  const syncData = () => {
    // Simulate data sync
    setRealTimeData(prev => ({
      ...prev,
      heartRate: Math.floor(Math.random() * 40) + 60,
      steps: prev.steps + Math.floor(Math.random() * 100),
      calories: prev.calories + Math.floor(Math.random() * 50)
    }));
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'watch': return Watch;
      case 'fitness': return Activity;
      case 'strap': return Heart;
      default: return Smartphone;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
            Wearable Integration
          </h1>
          <p className="text-muted-foreground mt-1">
            Connect and sync your fitness devices for comprehensive health tracking
          </p>
        </div>
        <Button onClick={syncData} className="gradient-primary">
          <RefreshCw className="h-4 w-4 mr-2" />
          Sync All
        </Button>
      </div>

      {/* Connected Devices */}
      <Card className="shadow-fitness">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Connected Devices
          </CardTitle>
          <CardDescription>
            Manage your wearable devices and their connection status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {connectedDevices.map((device) => {
            const DeviceIcon = getDeviceIcon(device.type);
            return (
              <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${device.connected ? 'bg-primary/10' : 'bg-muted'}`}>
                    <DeviceIcon className={`h-5 w-5 ${device.connected ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <h3 className="font-medium">{device.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {device.connected ? (
                        <>
                          <Wifi className="h-3 w-3 text-success" />
                          <span className="text-xs text-success">Connected</span>
                          <div className="flex items-center gap-1">
                            <Battery className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{device.battery}%</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <WifiOff className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">Disconnected</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <Switch 
                  checked={device.connected}
                  onCheckedChange={() => toggleDeviceConnection(device.id)}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Real-time Biometric Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="gradient-primary text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Heart Rate</p>
                <p className="text-2xl font-bold">{realTimeData.heartRate}</p>
                <p className="text-white/80 text-xs">BPM</p>
              </div>
              <Heart className="h-8 w-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-accent text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Steps Today</p>
                <p className="text-2xl font-bold">{realTimeData.steps.toLocaleString()}</p>
                <Progress value={84} className="mt-2" />
              </div>
              <Activity className="h-8 w-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-nutrition text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Calories Burned</p>
                <p className="text-2xl font-bold">{realTimeData.calories}</p>
                <p className="text-white/80 text-xs">kcal</p>
              </div>
              <Zap className="h-8 w-8 text-white/80" />
            </div>
          </CardContent>
        </Card>

        <Card className="gradient-progress text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Sleep Quality</p>
                <p className="text-2xl font-bold">{realTimeData.sleep}h</p>
                <p className="text-white/80 text-xs">Last night</p>
              </div>
              <Moon className="h-8 w-8 text-white/80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Biometrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Advanced Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Thermometer className="h-4 w-4 text-accent" />
                <span>Body Temperature</span>
              </div>
              <Badge variant="outline">{realTimeData.bodyTemp}°F</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="h-4 w-4 text-progress" />
                <span>Hydration Level</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={realTimeData.hydration} className="w-20" />
                <span className="text-sm">{realTimeData.hydration}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                <span>HRV Score</span>
              </div>
              <Badge variant="secondary">{realTimeData.hrv} ms</Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-accent" />
                <span>Stress Level</span>
              </div>
              <div className="flex items-center gap-2">
                <Progress 
                  value={realTimeData.stress} 
                  className="w-20"
                />
                <span className="text-sm">{realTimeData.stress}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Smart Notifications</CardTitle>
            <CardDescription>
              Configure alerts and reminders based on your biometric data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Heart Rate Alerts</span>
              <Switch 
                checked={notifications.heartRateAlerts}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, heartRateAlerts: checked }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span>Inactivity Reminders</span>
              <Switch 
                checked={notifications.inactivityReminders}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, inactivityReminders: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <span>Sleep Goal Tracking</span>
              <Switch 
                checked={notifications.sleepGoals}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, sleepGoals: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <span>Hydration Reminders</span>
              <Switch 
                checked={notifications.hydrationReminders}
                onCheckedChange={(checked) => 
                  setNotifications(prev => ({ ...prev, hydrationReminders: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WearableIntegration;