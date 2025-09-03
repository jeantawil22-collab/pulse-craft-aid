import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Watch, Smartphone, Heart, Battery, Wifi, Activity, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WearableIntegrationProps {
  user: any;
}

const WearableIntegration: React.FC<WearableIntegrationProps> = ({ user }) => {
  const [devices, setDevices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      const { data, error } = await supabase
        .from('wearable_devices')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setDevices(data || []);
    } catch (error) {
      console.error('Error loading devices:', error);
      toast({
        title: "Error",
        description: "Failed to load wearable devices",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const connectDevice = async (deviceType: string, deviceName: string) => {
    try {
      const { data, error } = await supabase
        .from('wearable_devices')
        .insert({
          user_id: user.id,
          device_name: deviceName,
          device_type: deviceType,
          is_connected: true,
          battery_level: Math.floor(Math.random() * 100),
          last_sync: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      setDevices(prev => [...prev, data]);
      toast({
        title: "Device Connected",
        description: `${deviceName} has been successfully connected`,
      });
    } catch (error) {
      console.error('Error connecting device:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
            Wearable Integration
          </h1>
          <p className="text-muted-foreground mt-2">
            Connect and sync your fitness devices for comprehensive health tracking
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {['Apple Watch', 'Fitbit Charge', 'Garmin Forerunner'].map((device, index) => (
          <Card key={index} className="hover-lift">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Watch className="h-6 w-6" />
                <CardTitle className="text-sm">{device}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => connectDevice('smartwatch', device)}
                className="w-full"
                size="sm"
              >
                Connect Device
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {devices.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {devices.map((device) => (
            <Card key={device.id} className="hover-lift">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Watch className="h-6 w-6" />
                    <div>
                      <CardTitle className="text-sm">{device.device_name}</CardTitle>
                      <CardDescription>Connected</CardDescription>
                    </div>
                  </div>
                  <Badge>Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Battery</span>
                    <span>{device.battery_level}%</span>
                  </div>
                  <Progress value={device.battery_level} className="h-2" />
                  <Button size="sm" className="w-full">
                    <Zap className="h-4 w-4 mr-2" />
                    Sync Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default WearableIntegration;