import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Users, 
  Clock, 
  Star, 
  Calendar,
  Video,
  Mic,
  MicOff,
  VideoOff,
  Heart,
  Flame,
  Trophy,
  MessageCircle,
  Share2,
  BookmarkPlus
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

interface LiveClassesProps {
  user: UserProfile;
}

const LiveClasses: React.FC<LiveClassesProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('live');
  const [isInClass, setIsInClass] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const liveClasses = [
    {
      id: 1,
      title: "HIIT Blast",
      instructor: "Sarah Johnson",
      avatar: "/api/placeholder/40/40",
      participants: 234,
      duration: 30,
      difficulty: "Advanced",
      category: "HIIT",
      startTime: "Now Live",
      description: "High-intensity interval training to torch calories",
      rating: 4.9
    },
    {
      id: 2,
      title: "Zen Yoga Flow",
      instructor: "Michael Chen",
      avatar: "/api/placeholder/40/40",
      participants: 156,
      duration: 45,
      difficulty: "Beginner",
      category: "Yoga",
      startTime: "Starting in 15 min",
      description: "Relaxing yoga flow for flexibility and mindfulness",
      rating: 4.8
    },
    {
      id: 3,
      title: "Strength Training",
      instructor: "Alex Rodriguez",
      avatar: "/api/placeholder/40/40",
      participants: 89,
      duration: 60,
      difficulty: "Intermediate",
      category: "Strength",
      startTime: "Starting in 30 min",
      description: "Full-body strength workout with progressive overload",
      rating: 4.7
    }
  ];

  const upcomingClasses = [
    {
      id: 4,
      title: "Morning Cardio Blast",
      instructor: "Emma Wilson",
      time: "7:00 AM",
      date: "Tomorrow",
      duration: 30,
      category: "Cardio"
    },
    {
      id: 5,
      title: "Pilates Core",
      instructor: "David Kim",
      time: "12:00 PM",
      date: "Tomorrow",
      duration: 45,
      category: "Pilates"
    },
    {
      id: 6,
      title: "Evening Stretch",
      instructor: "Lisa Park",
      time: "7:00 PM",
      date: "Tomorrow",
      duration: 20,
      category: "Stretching"
    }
  ];

  const joinClass = (classId: number) => {
    setIsInClass(true);
  };

  const leaveClass = () => {
    setIsInClass(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-success/10 text-success';
      case 'Intermediate': return 'bg-warning/10 text-warning';
      case 'Advanced': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'HIIT': return 'bg-accent/10 text-accent';
      case 'Yoga': return 'bg-nutrition/10 text-nutrition';
      case 'Strength': return 'bg-primary/10 text-primary';
      case 'Cardio': return 'bg-progress/10 text-progress';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (isInClass) {
    return (
      <div className="h-screen bg-black relative overflow-hidden">
        {/* Main Video Area */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
          <div className="text-center text-white">
            <Play className="h-32 w-32 mx-auto mb-4 opacity-50" />
            <h2 className="text-4xl font-bold mb-2">HIIT Blast</h2>
            <p className="text-xl opacity-80">with Sarah Johnson</p>
          </div>
        </div>

        {/* Class Info Overlay */}
        <div className="absolute top-4 left-4 bg-black/50 rounded-lg p-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4" />
            <span>234 participants</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>15:32 remaining</span>
          </div>
        </div>

        {/* Live Stats */}
        <div className="absolute top-4 right-4 space-y-2">
          <div className="bg-black/50 rounded-lg p-3 text-white flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-500" />
            <span>142 BPM</span>
          </div>
          <div className="bg-black/50 rounded-lg p-3 text-white flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" />
            <span>284 cal</span>
          </div>
        </div>

        {/* Control Bar */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/70 rounded-full px-6 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full ${audioEnabled ? 'text-white' : 'text-red-500'}`}
            onClick={() => setAudioEnabled(!audioEnabled)}
          >
            {audioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full ${videoEnabled ? 'text-white' : 'text-red-500'}`}
            onClick={() => setVideoEnabled(!videoEnabled)}
          >
            {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>

          <Button
            variant="destructive"
            onClick={leaveClass}
            className="px-6"
          >
            Leave Class
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-white"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
        </div>

        {/* Chat Panel (could be toggled) */}
        <div className="absolute right-4 bottom-20 w-80 bg-black/80 rounded-lg p-4 text-white max-h-96 overflow-y-auto">
          <h4 className="font-semibold mb-3">Class Chat</h4>
          <div className="space-y-2 text-sm">
            <div><span className="text-primary">FitUser123:</span> Great workout!</div>
            <div><span className="text-accent">HealthyMom:</span> Love this class! 💪</div>
            <div><span className="text-nutrition">YogaLover:</span> Sarah is amazing!</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
          Live Fitness Classes
        </h1>
        <p className="text-muted-foreground mt-1">
          Join live classes with expert trainers and workout with a global community
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="live">Live Now</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="on-demand">On Demand</TabsTrigger>
        </TabsList>

        <TabsContent value="live" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveClasses.map((class_) => (
              <Card key={class_.id} className="shadow-fitness hover:shadow-glow transition-all duration-300">
                <CardHeader className="relative">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-red-500 text-white animate-pulse">
                      LIVE
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{class_.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{class_.title}</CardTitle>
                  <CardDescription>{class_.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={class_.avatar} />
                      <AvatarFallback>{class_.instructor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{class_.instructor}</p>
                      <p className="text-sm text-muted-foreground">Certified Trainer</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{class_.participants}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{class_.duration} min</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Badge className={getCategoryColor(class_.category)}>
                      {class_.category}
                    </Badge>
                    <Badge className={getDifficultyColor(class_.difficulty)}>
                      {class_.difficulty}
                    </Badge>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button 
                      className="flex-1 gradient-primary"
                      onClick={() => joinClass(class_.id)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Join Now
                    </Button>
                    <Button variant="outline" size="icon">
                      <BookmarkPlus className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <div className="grid gap-4">
            {upcomingClasses.map((class_) => (
              <Card key={class_.id} className="shadow-fitness">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{class_.time}</p>
                        <p className="text-sm text-muted-foreground">{class_.date}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{class_.title}</h3>
                        <p className="text-muted-foreground">with {class_.instructor}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getCategoryColor(class_.category)}>
                            {class_.category}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{class_.duration} min</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <Calendar className="h-4 w-4 mr-2" />
                        Remind Me
                      </Button>
                      <Button className="gradient-primary">
                        <Trophy className="h-4 w-4 mr-2" />
                        Reserve Spot
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="on-demand">
          <div className="text-center py-12">
            <Video className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">On-Demand Library</h3>
            <p className="text-muted-foreground">
              Access thousands of recorded classes anytime, anywhere
            </p>
            <Button className="mt-4 gradient-primary">
              Browse Library
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LiveClasses;