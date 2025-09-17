import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain,
  Zap,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface FormAnalysis {
  score: number;
  issues: string[];
  suggestions: string[];
  angles: Record<string, number>;
  timestamp: number;
  perfectForm: boolean;
  improvement: number;
  confidence: number;
}

interface AIFormCoachProps {
  currentAnalysis: FormAnalysis | null;
  sessionStats: any;
  exerciseName: string;
  onSpeak: (text: string) => void;
}

const COACHING_INSIGHTS = {
  'Push-ups': {
    common_mistakes: [
      'Sagging hips indicate weak core engagement',
      'Flared elbows put unnecessary stress on shoulders',
      'Partial range of motion reduces muscle activation',
      'Rushed tempo prevents proper muscle engagement'
    ],
    optimization_tips: [
      'Engage core muscles throughout the entire movement',
      'Keep elbows at 45-degree angle for optimal mechanics',
      'Control the descent for 2 seconds, explosive ascent',
      'Maintain straight line from head to heels'
    ],
    progressive_cues: [
      'Imagine pushing the floor away from you',
      'Squeeze glutes to maintain posterior chain activation',
      'Keep shoulder blades retracted and stable',
      'Drive through your palms with intention'
    ]
  },
  'Squats': {
    common_mistakes: [
      'Forward knee drift compromises joint stability',
      'Shallow depth limits glute and hamstring activation',
      'Forward torso lean indicates hip mobility issues',
      'Heel rise suggests ankle mobility restrictions'
    ],
    optimization_tips: [
      'Drive knees out in line with toes throughout movement',
      'Descend until hip crease is below knee level',
      'Maintain proud chest and neutral spine',
      'Keep weight distributed across entire foot'
    ],
    progressive_cues: [
      'Sit back into the squat, hips lead the movement',
      'Create tension in glutes before descending',
      'Drive through heels to activate posterior chain',
      'Imagine sitting into an invisible chair behind you'
    ]
  },
  'Burpees': {
    common_mistakes: [
      'Sloppy plank position reduces core benefits',
      'Hard landings stress joints unnecessarily',
      'Rushed transitions compromise movement quality',
      'Inconsistent rhythm affects cardiovascular benefit'
    ],
    optimization_tips: [
      'Maintain strong plank with engaged core',
      'Land softly on balls of feet with bent knees',
      'Complete each phase with control and precision',
      'Find sustainable rhythm for entire set'
    ],
    progressive_cues: [
      'Float down into plank position with control',
      'Jump feet back in one explosive movement',
      'Reach up and slightly back during jump',
      'Breathe rhythmically throughout the movement'
    ]
  }
};

export const AIFormCoach: React.FC<AIFormCoachProps> = ({
  currentAnalysis,
  sessionStats,
  exerciseName,
  onSpeak
}) => {
  const [activeInsight, setActiveInsight] = useState<string>('');
  const [coachingMode, setCoachingMode] = useState<'analysis' | 'optimization' | 'motivation'>('analysis');
  const [lastCoachingTime, setLastCoachingTime] = useState(0);

  const exerciseCoaching = COACHING_INSIGHTS[exerciseName as keyof typeof COACHING_INSIGHTS];

  // Advanced AI coaching logic
  const generateAdvancedCoaching = useCallback(() => {
    if (!currentAnalysis || !exerciseCoaching) return;

    const now = Date.now();
    if (now - lastCoachingTime < 8000) return; // Throttle coaching

    let coachingMessage = '';

    // Adaptive coaching based on performance
    if (currentAnalysis.score >= 95) {
      const optimizationTip = exerciseCoaching.optimization_tips[
        Math.floor(Math.random() * exerciseCoaching.optimization_tips.length)
      ];
      coachingMessage = `Excellent form! Advanced tip: ${optimizationTip}`;
      setCoachingMode('optimization');
    } else if (currentAnalysis.score >= 80) {
      const progressiveCue = exerciseCoaching.progressive_cues[
        Math.floor(Math.random() * exerciseCoaching.progressive_cues.length)
      ];
      coachingMessage = `Good work! Try this: ${progressiveCue}`;
      setCoachingMode('optimization');
    } else if (currentAnalysis.score >= 60) {
      if (currentAnalysis.suggestions.length > 0) {
        coachingMessage = `Focus area: ${currentAnalysis.suggestions[0]}`;
      } else {
        const commonMistake = exerciseCoaching.common_mistakes[
          Math.floor(Math.random() * exerciseCoaching.common_mistakes.length)
        ];
        coachingMessage = `Common issue to watch: ${commonMistake}`;
      }
      setCoachingMode('analysis');
    } else {
      coachingMessage = `Let's reset and focus on the basics. ${currentAnalysis.suggestions[0] || 'Take your time and control the movement.'}`;
      setCoachingMode('motivation');
    }

    setActiveInsight(coachingMessage);
    onSpeak(coachingMessage);
    setLastCoachingTime(now);
  }, [currentAnalysis, exerciseCoaching, lastCoachingTime, onSpeak]);

  // Trigger advanced coaching based on form changes
  useEffect(() => {
    if (currentAnalysis && currentAnalysis.score < 75) {
      const timeout = setTimeout(generateAdvancedCoaching, 3000);
      return () => clearTimeout(timeout);
    }
  }, [currentAnalysis, generateAdvancedCoaching]);

  const getCoachingColor = () => {
    switch (coachingMode) {
      case 'optimization': return 'from-green-500 to-emerald-600';
      case 'analysis': return 'from-blue-500 to-cyan-600';
      case 'motivation': return 'from-orange-500 to-red-600';
      default: return 'from-purple-500 to-indigo-600';
    }
  };

  const getCoachingIcon = () => {
    switch (coachingMode) {
      case 'optimization': return <Target className="h-5 w-5" />;
      case 'analysis': return <Brain className="h-5 w-5" />;
      case 'motivation': return <Zap className="h-5 w-5" />;
      default: return <Sparkles className="h-5 w-5" />;
    }
  };

  if (!currentAnalysis) return null;

  return (
    <Card className="shadow-fitness">
      <CardHeader className={`gradient-primary text-white`}>
        <CardTitle className="flex items-center gap-3">
          {getCoachingIcon()}
          AI Form Coach
          <Badge variant="secondary" className="bg-white/20 text-white">
            {coachingMode.charAt(0).toUpperCase() + coachingMode.slice(1)}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Current Analysis Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
            <div className={`text-3xl font-bold ${
              currentAnalysis.score >= 90 ? 'text-success' :
              currentAnalysis.score >= 75 ? 'text-primary' :
              currentAnalysis.score >= 60 ? 'text-warning' : 'text-destructive'
            }`}>
              {currentAnalysis.score}%
            </div>
            <div className="text-sm text-muted-foreground font-medium">Form Score</div>
          </div>
          
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5">
            <div className="text-3xl font-bold text-accent">
              {currentAnalysis.confidence}%
            </div>
            <div className="text-sm text-muted-foreground font-medium">AI Confidence</div>
          </div>
          
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-info/10 to-info/5">
            <div className={`text-3xl font-bold ${
              currentAnalysis.improvement > 0 ? 'text-success' :
              currentAnalysis.improvement < 0 ? 'text-destructive' : 'text-muted-foreground'
            }`}>
              {currentAnalysis.improvement > 0 ? '+' : ''}{currentAnalysis.improvement}
            </div>
            <div className="text-sm text-muted-foreground font-medium">Improvement</div>
          </div>
        </div>

        {/* Advanced Coaching Insight */}
        <AnimatePresence mode="wait">
          {activeInsight && (
            <motion.div
              key={activeInsight}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`p-4 rounded-lg bg-gradient-to-r ${getCoachingColor()} text-white shadow-lg`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getCoachingIcon()}
                </div>
                <div>
                  <div className="font-semibold text-sm mb-1">AI Coach Insight</div>
                  <p className="text-sm leading-relaxed">{activeInsight}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Issues & Suggestions */}
        {currentAnalysis.suggestions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-warning" />
              Form Optimization
            </h4>
            <div className="space-y-2">
              {currentAnalysis.suggestions.slice(0, 2).map((suggestion, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                  <span className="text-sm">{suggestion}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Session Progress */}
        {sessionStats && (
          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              Session Progress
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-gradient-to-br from-success/10 to-success/5">
                <div className="text-xl font-bold text-success">{sessionStats.perfectFormCount}</div>
                <div className="text-xs text-muted-foreground">Perfect Reps</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5">
                <div className="text-xl font-bold text-primary">{sessionStats.consistency}%</div>
                <div className="text-xs text-muted-foreground">Consistency</div>
              </div>
            </div>
          </div>
        )}

        {/* Manual Coaching Controls */}
        <div className="flex gap-2">
          <Button
            onClick={generateAdvancedCoaching}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Get Coaching
          </Button>
          <Button
            onClick={() => {
              if (exerciseCoaching) {
                const tip = exerciseCoaching.optimization_tips[
                  Math.floor(Math.random() * exerciseCoaching.optimization_tips.length)
                ];
                setActiveInsight(tip);
                onSpeak(tip);
              }
            }}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Pro Tip
          </Button>
        </div>

        {/* Perfect Form Celebration */}
        {currentAnalysis.perfectForm && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="p-4 rounded-lg bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-6 w-6" />
              <span className="font-bold text-lg">PERFECT FORM ACHIEVED!</span>
              <Sparkles className="h-6 w-6" />
            </div>
            <p className="text-sm">Your technique is absolutely flawless! 🏆</p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};