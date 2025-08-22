import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  Target, 
  Clock, 
  TrendingUp,
  Brain,
  Zap,
  Calendar,
  Apple,
  Dumbbell,
  Moon,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Star,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SmartRecommendationsProps {
  user: any;
}

interface Recommendation {
  id: string;
  category: 'workout' | 'nutrition' | 'recovery' | 'lifestyle';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  reasoning: string;
  impact: number; // 1-10 scale
  effort: number; // 1-10 scale
  timeframe: string;
  actions: Array<{
    label: string;
    type: 'primary' | 'secondary';
    action: () => void;
  }>;
  metrics?: {
    current: number;
    target: number;
    unit: string;
  };
}

interface PersonalizationFactor {
  name: string;
  value: number;
  weight: number;
  description: string;
}

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({ user }) => {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // AI-powered personalization factors
  const personalizationFactors: PersonalizationFactor[] = [
    { name: 'Workout Consistency', value: 92, weight: 0.25, description: 'Regular training schedule adherence' },
    { name: 'Recovery Rate', value: 78, weight: 0.20, description: 'How quickly you bounce back from workouts' },
    { name: 'Nutrition Compliance', value: 85, weight: 0.20, description: 'Following meal plans and macro targets' },
    { name: 'Sleep Quality', value: 88, weight: 0.15, description: 'Sleep duration and efficiency' },
    { name: 'Stress Levels', value: 65, weight: 0.10, description: 'Work and life stress indicators' },
    { name: 'Progressive Overload', value: 94, weight: 0.10, description: 'Increasing workout intensity over time' }
  ];

  // Smart recommendations based on user data and AI analysis
  const recommendations: Recommendation[] = [
    {
      id: '1',
      category: 'workout',
      priority: 'high',
      title: 'Optimize Your Squat Depth',
      description: 'AI video analysis shows 15% depth inconsistency. Improve mobility for better gains.',
      reasoning: 'Form analysis from your last 5 squat sessions indicates you\'re not reaching optimal depth consistently, limiting muscle activation by approximately 23%.',
      impact: 8,
      effort: 6,
      timeframe: '2-3 weeks',
      metrics: {
        current: 85,
        target: 100,
        unit: '% depth consistency'
      },
      actions: [
        {
          label: 'Start Mobility Routine',
          type: 'primary',
          action: () => toast({ title: 'Mobility routine added to your plan!' })
        },
        {
          label: 'Watch Form Video',
          type: 'secondary',
          action: () => toast({ title: 'Opening squat form masterclass...' })
        }
      ]
    },
    {
      id: '2',
      category: 'nutrition',
      priority: 'high',
      title: 'Post-Workout Nutrition Window',
      description: 'You\'re missing the 30-minute anabolic window 60% of the time.',
      reasoning: 'Your muscle protein synthesis could increase by 32% with better post-workout timing. Current average delay is 47 minutes.',
      impact: 9,
      effort: 3,
      timeframe: 'Immediate',
      metrics: {
        current: 40,
        target: 90,
        unit: '% compliance'
      },
      actions: [
        {
          label: 'Set Smart Reminders',
          type: 'primary',
          action: () => toast({ title: 'Post-workout nutrition reminders activated!' })
        },
        {
          label: 'Quick Shake Recipes',
          type: 'secondary',
          action: () => toast({ title: 'Protein shake recipes sent to your phone!' })
        }
      ]
    },
    {
      id: '3',
      category: 'recovery',
      priority: 'medium',
      title: 'Sleep Optimization Protocol',
      description: 'Your REM sleep decreased 18% this week. Recovery might be compromised.',
      reasoning: 'Sleep tracking shows fragmented REM cycles correlating with decreased HRV. This pattern typically leads to 15% reduced training capacity.',
      impact: 7,
      effort: 5,
      timeframe: '1 week',
      metrics: {
        current: 72,
        target: 85,
        unit: '% sleep efficiency'
      },
      actions: [
        {
          label: 'Sleep Hygiene Plan',
          type: 'primary',
          action: () => toast({ title: 'Personalized sleep plan created!' })
        },
        {
          label: 'Blue Light Analysis',
          type: 'secondary',
          action: () => toast({ title: 'Screen time analysis complete!' })
        }
      ]
    },
    {
      id: '4',
      category: 'workout',
      priority: 'medium',
      title: 'Progressive Overload Plateau',
      description: 'Your bench press hasn\'t increased in 3 weeks. Time for periodization.',
      reasoning: 'Strength curve analysis indicates you\'ve adapted to current load. A deload week followed by intensity increase would break this plateau.',
      impact: 8,
      effort: 7,
      timeframe: '3-4 weeks',
      metrics: {
        current: 225,
        target: 245,
        unit: 'lbs 1RM'
      },
      actions: [
        {
          label: 'Generate Periodization Plan',
          type: 'primary',
          action: () => toast({ title: 'New periodization cycle created!' })
        },
        {
          label: 'Deload Week Setup',
          type: 'secondary',
          action: () => toast({ title: 'Deload week scheduled!' })
        }
      ]
    },
    {
      id: '5',
      category: 'nutrition',
      priority: 'low',
      title: 'Micronutrient Optimization',
      description: 'Your vitamin D and B12 levels could support better recovery.',
      reasoning: 'Based on your location, season, and diet analysis, targeted supplementation could improve energy levels by 12-15%.',
      impact: 5,
      effort: 2,
      timeframe: '4-6 weeks',
      actions: [
        {
          label: 'Supplement Recommendations',
          type: 'primary',
          action: () => toast({ title: 'Supplement plan optimized!' })
        },
        {
          label: 'Food Sources Guide',
          type: 'secondary',
          action: () => toast({ title: 'Nutrient-rich food list sent!' })
        }
      ]
    },
    {
      id: '6',
      category: 'lifestyle',
      priority: 'medium',
      title: 'Stress Management Protocol',
      description: 'Elevated cortisol patterns are affecting your gains.',
      reasoning: 'HRV data shows chronic stress markers. This could be reducing muscle protein synthesis and increasing fat storage around the midsection.',
      impact: 7,
      effort: 6,
      timeframe: '2-3 weeks',
      actions: [
        {
          label: 'Breathing Exercises',
          type: 'primary',
          action: () => toast({ title: 'Daily breathing routine activated!' })
        },
        {
          label: 'Stress Audit',
          type: 'secondary',
          action: () => toast({ title: 'Lifestyle stress analysis complete!' })
        }
      ]
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'workout': return <Dumbbell className="h-4 w-4" />;
      case 'nutrition': return <Apple className="h-4 w-4" />;
      case 'recovery': return <Moon className="h-4 w-4" />;
      case 'lifestyle': return <Activity className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'workout': return 'text-primary';
      case 'nutrition': return 'text-nutrition';
      case 'recovery': return 'text-progress';
      case 'lifestyle': return 'text-accent';
      default: return 'text-muted-foreground';
    }
  };

  const filteredRecommendations = activeCategory === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.category === activeCategory);

  const getPersonalizationScore = () => {
    return personalizationFactors.reduce((score, factor) => 
      score + (factor.value * factor.weight), 0
    );
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Smart Recommendations
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered personalized fitness optimization
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {Math.round(getPersonalizationScore())}%
            </div>
            <div className="text-sm text-muted-foreground">AI Confidence</div>
          </div>
          <Button>
            <Sparkles className="h-4 w-4 mr-2" />
            Refresh AI Analysis
          </Button>
        </div>
      </div>

      {/* Personalization Overview */}
      <Card className="gradient-primary text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold">AI Personalization Engine</h3>
              <p className="text-white/90">Based on your unique fitness profile and behavioral patterns</p>
            </div>
            <Brain className="h-8 w-8 text-white/80" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {personalizationFactors.map((factor) => (
              <div key={factor.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/90">{factor.name}</span>
                  <span className="font-medium">{factor.value}%</span>
                </div>
                <div className="bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white rounded-full h-2 transition-all duration-300"
                    style={{ width: `${factor.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={activeCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveCategory('all')}
        >
          All Recommendations
        </Button>
        {['workout', 'nutrition', 'recovery', 'lifestyle'].map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory(category)}
            className="capitalize"
          >
            {getCategoryIcon(category)}
            <span className="ml-2">{category}</span>
          </Button>
        ))}
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRecommendations.map((rec) => (
          <Card key={rec.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg bg-muted flex items-center justify-center ${getCategoryColor(rec.category)}`}>
                    {getCategoryIcon(rec.category)}
                  </div>
                  <Badge variant={getPriorityColor(rec.priority)}>
                    {rec.priority} priority
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-sm font-medium">Impact: {rec.impact}/10</div>
                    <div className="text-xs text-muted-foreground">Effort: {rec.effort}/10</div>
                  </div>
                </div>
              </div>
              
              <CardTitle className="text-lg">{rec.title}</CardTitle>
              <CardDescription>{rec.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* AI Reasoning */}
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Brain className="h-4 w-4 text-primary mt-0.5" />
                  <div>
                    <div className="text-sm font-medium mb-1">AI Analysis</div>
                    <p className="text-xs text-muted-foreground">{rec.reasoning}</p>
                  </div>
                </div>
              </div>

              {/* Progress Metrics */}
              {rec.metrics && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Progress</span>
                    <span className="font-medium">
                      {rec.metrics.current} / {rec.metrics.target} {rec.metrics.unit}
                    </span>
                  </div>
                  <Progress 
                    value={(rec.metrics.current / rec.metrics.target) * 100} 
                    className="h-2"
                  />
                </div>
              )}

              {/* Impact vs Effort */}
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-success/10 rounded-lg">
                  <div className="text-lg font-bold text-success">{rec.impact}/10</div>
                  <div className="text-xs text-muted-foreground">Expected Impact</div>
                </div>
                <div className="text-center p-3 bg-warning/10 rounded-lg">
                  <div className="text-lg font-bold text-warning">{rec.effort}/10</div>
                  <div className="text-xs text-muted-foreground">Required Effort</div>
                </div>
              </div>

              {/* Timeframe */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Expected timeline: {rec.timeframe}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                {rec.actions.map((action, index) => (
                  <Button
                    key={index}
                    variant={action.type === 'primary' ? 'default' : 'outline'}
                    size="sm"
                    onClick={action.action}
                    className="flex-1"
                  >
                    {action.label}
                    {action.type === 'primary' && <ArrowRight className="h-3 w-3 ml-1" />}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Insights Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-accent" />
            This Week's Focus
          </CardTitle>
          <CardDescription>Top 3 AI-recommended actions for maximum impact</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations
              .filter(rec => rec.priority === 'high')
              .slice(0, 3)
              .map((rec, index) => (
                <div key={rec.id} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    {getCategoryIcon(rec.category)}
                    <span className="font-medium text-sm">{rec.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{rec.description}</p>
                  <Button size="sm" variant="outline" className="w-full">
                    Start Now
                  </Button>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};