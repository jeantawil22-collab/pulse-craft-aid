import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Trophy, 
  Target, 
  Heart, 
  MessageCircle,
  Share2,
  Crown,
  Flame,
  Zap,
  Star,
  Calendar,
  Award,
  TrendingUp,
  Clock,
  MapPin,
  Activity,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SocialHubProps {
  user: any;
}

interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'individual' | 'team' | 'community';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  participants: number;
  reward: string;
  progress: number;
  deadline: Date;
  isJoined: boolean;
  category: 'strength' | 'cardio' | 'nutrition' | 'consistency';
}

interface FriendActivity {
  id: string;
  user: {
    name: string;
    avatar: string;
    level: number;
  };
  activity: string;
  achievement?: string;
  timestamp: Date;
  likes: number;
  comments: number;
  isLiked: boolean;
}

interface Leaderboard {
  id: string;
  name: string;
  avatar: string;
  score: number;
  rank: number;
  badge?: string;
  streak: number;
  location: string;
}

export const SocialHub: React.FC<SocialHubProps> = ({ user }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('feed');

  const challenges: Challenge[] = [
    {
      id: '1',
      name: '30-Day Consistency Challenge',
      description: 'Complete at least 4 workouts per week for 30 days straight',
      type: 'community',
      difficulty: 'intermediate',
      duration: '30 days',
      participants: 2847,
      reward: 'Consistency Master Badge + 500 XP',
      progress: 67,
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      isJoined: true,
      category: 'consistency'
    },
    {
      id: '2',
      name: 'Squat September',
      description: 'Increase your squat 1RM by 15% this month',
      type: 'individual',
      difficulty: 'advanced',
      duration: '4 weeks',
      participants: 1205,
      reward: 'Leg Day Legend Badge + 300 XP',
      progress: 45,
      deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
      isJoined: false,
      category: 'strength'
    },
    {
      id: '3',
      name: 'Team Cardio Crusher',
      description: 'Join a team of 5 and collectively burn 10,000 calories',
      type: 'team',
      difficulty: 'beginner',
      duration: '2 weeks',
      participants: 890,
      reward: 'Team Spirit Badge + 200 XP each',
      progress: 78,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      isJoined: true,
      category: 'cardio'
    }
  ];

  const friendActivities: FriendActivity[] = [
    {
      id: '1',
      user: { name: 'Sarah Chen', avatar: '/api/placeholder/32/32', level: 15 },
      activity: 'Completed "Heavy Lifting Day" workout - PR on deadlift! 💪',
      achievement: 'New Personal Record',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likes: 12,
      comments: 3,
      isLiked: true
    },
    {
      id: '2',
      user: { name: 'Mike Johnson', avatar: '/api/placeholder/32/32', level: 22 },
      activity: 'Finished 5K morning run in 22:34 - new PB! 🏃‍♂️',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      likes: 8,
      comments: 1,
      isLiked: false
    },
    {
      id: '3',
      user: { name: 'Emily Davis', avatar: '/api/placeholder/32/32', level: 18 },
      activity: 'Hit my protein target for 7 days straight! 🥗',
      achievement: 'Nutrition Ninja Streak',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      likes: 15,
      comments: 5,
      isLiked: true
    },
    {
      id: '4',
      user: { name: 'Alex Rivera', avatar: '/api/placeholder/32/32', level: 12 },
      activity: 'Joined the "Squat September" challenge - who\'s with me? 🔥',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      likes: 6,
      comments: 2,
      isLiked: false
    }
  ];

  const leaderboard: Leaderboard[] = [
    { id: '1', name: 'Jake Thompson', avatar: '/api/placeholder/40/40', score: 2847, rank: 1, badge: 'Champion', streak: 45, location: 'San Francisco, CA' },
    { id: '2', name: 'Maria Garcia', avatar: '/api/placeholder/40/40', score: 2654, rank: 2, badge: 'Elite', streak: 32, location: 'Austin, TX' },
    { id: '3', name: 'David Kim', avatar: '/api/placeholder/40/40', score: 2489, rank: 3, badge: 'Pro', streak: 28, location: 'Seattle, WA' },
    { id: '4', name: 'Lisa Wang', avatar: '/api/placeholder/40/40', score: 2356, rank: 4, streak: 23, location: 'New York, NY' },
    { id: '5', name: user.name, avatar: '/api/placeholder/40/40', score: 2180, rank: 5, streak: 18, location: 'Your City' }
  ];

  const handleJoinChallenge = (challengeId: string) => {
    toast({
      title: "Challenge Joined!",
      description: "You've successfully joined the challenge. Good luck! 🚀"
    });
  };

  const handleLikeActivity = (activityId: string) => {
    toast({
      title: "Activity Liked!",
      description: "Your support means a lot to your fitness buddy! ❤️"
    });
  };

  const getChallengeIcon = (category: string) => {
    switch (category) {
      case 'strength': return <Trophy className="h-4 w-4" />;
      case 'cardio': return <Heart className="h-4 w-4" />;
      case 'nutrition': return <Target className="h-4 w-4" />;
      case 'consistency': return <Flame className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-success text-white';
      case 'intermediate': return 'bg-warning text-white';
      case 'advanced': return 'bg-destructive text-white';
      default: return 'bg-muted';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'individual': return <Target className="h-3 w-3" />;
      case 'team': return <Users className="h-3 w-3" />;
      case 'community': return <Crown className="h-3 w-3" />;
      default: return <Star className="h-3 w-3" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
    return `${hours}h ago`;
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-accent bg-clip-text text-transparent">
            Social Hub
          </h1>
          <p className="text-muted-foreground mt-1">
            Connect, compete, and celebrate with the fitness community
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-accent">#{leaderboard.find(l => l.name === user.name)?.rank || 'N/A'}</div>
            <div className="text-sm text-muted-foreground">Global Rank</div>
          </div>
          <Button>
            <Share2 className="h-4 w-4 mr-2" />
            Share Progress
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="feed" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Feed
          </TabsTrigger>
          <TabsTrigger value="challenges" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Challenges
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Achievements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Activity Feed */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Friend Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {friendActivities.map((activity) => (
                    <div key={activity.id} className="flex gap-3 p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={activity.user.avatar} />
                        <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{activity.user.name}</span>
                          <Badge variant="outline" className="text-xs">
                            Lvl {activity.user.level}
                          </Badge>
                          {activity.achievement && (
                            <Badge variant="secondary" className="text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              {activity.achievement}
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm mb-2">{activity.activity}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{formatTimeAgo(activity.timestamp)}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`h-auto p-1 ${activity.isLiked ? 'text-destructive' : ''}`}
                            onClick={() => handleLikeActivity(activity.id)}
                          >
                            <Heart className={`h-3 w-3 mr-1 ${activity.isLiked ? 'fill-current' : ''}`} />
                            {activity.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="h-auto p-1">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            {activity.comments}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-accent" />
                    Your Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 bg-primary/10 rounded-lg">
                      <div className="text-lg font-bold text-primary">2,180</div>
                      <div className="text-xs text-muted-foreground">Total XP</div>
                    </div>
                    <div className="text-center p-3 bg-accent/10 rounded-lg">
                      <div className="text-lg font-bold text-accent">18</div>
                      <div className="text-xs text-muted-foreground">Day Streak</div>
                    </div>
                    <div className="text-center p-3 bg-success/10 rounded-lg">
                      <div className="text-lg font-bold text-success">127</div>
                      <div className="text-xs text-muted-foreground">Friends</div>
                    </div>
                    <div className="text-center p-3 bg-nutrition/10 rounded-lg">
                      <div className="text-lg font-bold text-nutrition">5</div>
                      <div className="text-xs text-muted-foreground">Challenges</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-destructive" />
                    Active Challenges
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {challenges.filter(c => c.isJoined).map((challenge) => (
                    <div key={challenge.id} className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        {getChallengeIcon(challenge.category)}
                        <span className="font-medium text-sm">{challenge.name}</span>
                      </div>
                      <Progress value={challenge.progress} className="h-2 mb-2" />
                      <div className="text-xs text-muted-foreground">
                        {challenge.progress}% complete
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <Card key={challenge.id} className={`hover:shadow-lg transition-shadow ${challenge.isJoined ? 'ring-2 ring-primary/20' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getChallengeIcon(challenge.category)}
                      <Badge className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {getTypeIcon(challenge.type)}
                      <span className="capitalize">{challenge.type}</span>
                    </div>
                  </div>
                  
                  <CardTitle className="text-lg">{challenge.name}</CardTitle>
                  <CardDescription>{challenge.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span>{challenge.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span>{challenge.participants.toLocaleString()} joined</span>
                    </div>
                  </div>

                  {challenge.isJoined && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{challenge.progress}%</span>
                      </div>
                      <Progress value={challenge.progress} className="h-2" />
                    </div>
                  )}

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="text-sm font-medium text-accent mb-1">Reward</div>
                    <div className="text-xs text-muted-foreground">{challenge.reward}</div>
                  </div>

                  <div className="flex gap-2">
                    {challenge.isJoined ? (
                      <Button variant="outline" className="flex-1" disabled>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Joined
                      </Button>
                    ) : (
                      <Button 
                        className="flex-1"
                        onClick={() => handleJoinChallenge(challenge.id)}
                      >
                        Join Challenge
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-accent" />
                Global Leaderboard
              </CardTitle>
              <CardDescription>Top performers in your region this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <div 
                    key={entry.id} 
                    className={`flex items-center gap-4 p-4 rounded-lg border ${
                      entry.name === user.name ? 'bg-primary/10 border-primary/20' : 'hover:bg-muted/50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      entry.rank === 1 ? 'bg-yellow-500 text-white' :
                      entry.rank === 2 ? 'bg-gray-400 text-white' :
                      entry.rank === 3 ? 'bg-amber-600 text-white' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {entry.rank}
                    </div>
                    
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={entry.avatar} />
                      <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{entry.name}</span>
                        {entry.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {entry.badge}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {entry.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Flame className="h-3 w-3" />
                          {entry.streak} day streak
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">{entry.score.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">XP</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Achievement cards would go here */}
            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold mb-2">First Workout</h3>
              <p className="text-sm text-muted-foreground mb-4">Complete your first workout session</p>
              <Badge variant="secondary">Earned</Badge>
            </Card>
            
            <Card className="text-center p-6 opacity-50">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Flame className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-bold mb-2">Fire Starter</h3>
              <p className="text-sm text-muted-foreground mb-4">Maintain a 10-day workout streak</p>
              <div className="text-xs text-muted-foreground">8/10 days</div>
              <Progress value={80} className="h-1 mt-2" />
            </Card>
            
            <Card className="text-center p-6 opacity-50">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-bold mb-2">Social Butterfly</h3>
              <p className="text-sm text-muted-foreground mb-4">Add 50 fitness friends</p>
              <div className="text-xs text-muted-foreground">12/50 friends</div>
              <Progress value={24} className="h-1 mt-2" />
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};