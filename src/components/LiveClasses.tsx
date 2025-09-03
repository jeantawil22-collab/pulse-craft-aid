import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Video, Users, Clock } from 'lucide-react';

interface LiveClassesProps {
  user: any;
}

const LiveClasses: React.FC<LiveClassesProps> = ({ user }) => {
  const [joinedClasses, setJoinedClasses] = useState<string[]>([]);

  const classes = [
    {
      id: '1',
      title: 'Morning HIIT Blast',
      instructor: 'Sarah Johnson',
      duration: 30,
      participants: 24,
      isLive: false,
      isUpcoming: true,
      startTime: '9:00 AM'
    },
    {
      id: '2',
      title: 'Zen Flow Yoga',
      instructor: 'Michael Chen',
      duration: 45,
      participants: 18,
      isLive: true,
      isUpcoming: false,
      startTime: 'Live Now'
    }
  ];

  const joinClass = (classId: string) => {
    setJoinedClasses([...joinedClasses, classId]);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
            Live Fitness Classes
          </h1>
          <p className="text-muted-foreground mt-2">
            Join live workouts with certified trainers and fitness enthusiasts
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls) => (
          <Card key={cls.id} className="hover-lift">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{cls.title}</CardTitle>
                  <CardDescription>by {cls.instructor}</CardDescription>
                </div>
                {cls.isLive && <Badge className="bg-red-500">🔴 Live</Badge>}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {cls.duration}m
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {cls.participants}
                  </div>
                </div>
                <span>{cls.startTime}</span>
              </div>

              <Button 
                onClick={() => joinClass(cls.id)}
                disabled={joinedClasses.includes(cls.id)}
                className="w-full"
              >
                {joinedClasses.includes(cls.id) ? (
                  <>
                    <Video className="h-4 w-4 mr-2" />
                    Joined
                  </>
                ) : (
                  'Join Class'
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LiveClasses;