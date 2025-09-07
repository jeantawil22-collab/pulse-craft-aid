import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Sparkles,
  Heart,
  Zap,
  Target,
  Trophy,
  Star
} from 'lucide-react';

interface VirtualTrainerProps {
  trainerPersona: 'motivational' | 'zen' | 'scientific';
  currentExercise: string;
  formScore: number;
  isActive: boolean;
  onSpeak: (text: string) => void;
}

const TRAINER_AVATARS = {
  motivational: {
    name: "Alex Thunder",
    avatar: "💪",
    color: "from-orange-400 to-red-500",
    bgColor: "from-orange-50 to-red-50",
    mood: {
      excellent: "🔥",
      good: "💪",
      needs_work: "⚡",
      encouraging: "🚀"
    }
  },
  zen: {
    name: "Maya Flow",
    avatar: "🧘‍♀️",
    color: "from-green-400 to-blue-500",
    bgColor: "from-green-50 to-blue-50",
    mood: {
      excellent: "✨",
      good: "🌟",
      needs_work: "🌱",
      encouraging: "🌸"
    }
  },
  scientific: {
    name: "Dr. Precision",
    avatar: "🔬",
    color: "from-blue-400 to-purple-500",
    bgColor: "from-blue-50 to-purple-50",
    mood: {
      excellent: "🎯",
      good: "📊",
      needs_work: "🔍",
      encouraging: "📈"
    }
  }
};

const CONTEXTUAL_COACHING = {
  'Push-ups': {
    phases: {
      setup: "Perfect setup position! Hands under shoulders, core engaged.",
      descent: "Control that descent! Feel those muscles working.",
      bottom: "Great depth! Now explode back up with power!",
      ascent: "Drive through those palms! You're getting stronger!",
      complete: "Excellent rep! Reset and maintain that perfect form!"
    },
    motivational: [
      "Every push-up is building unstoppable strength!",
      "Your chest and arms are getting more powerful!",
      "Feel that burn? That's weakness leaving your body!",
      "You're not just doing push-ups, you're forging resilience!"
    ],
    corrections: {
      sagging: "Core tight! Imagine a steel rod from head to heels!",
      elbows: "Elbows at 45 degrees! Perfect angle for maximum power!",
      range: "Full range of motion! Each rep counts when done right!"
    }
  },
  'Squats': {
    phases: {
      setup: "Feet planted, chest proud! You've got this!",
      descent: "Sit back into that squat! Hips leading the way!",
      bottom: "Perfect depth! Feel those glutes activate!",
      ascent: "Drive through those heels! Power from the ground up!",
      complete: "Outstanding! Stand tall and own that strength!"
    },
    motivational: [
      "Building legs of steel with every squat!",
      "Your lower body is becoming a powerhouse!",
      "These squats are sculpting incredible strength!",
      "You're building the foundation of all athletic power!"
    ],
    corrections: {
      knees: "Knees out! Track them right over your toes!",
      depth: "Go deeper! Hip crease below the knees!",
      chest: "Chest up! Maintain that proud warrior posture!"
    }
  },
  'Burpees': {
    phases: {
      squat: "Drop it down! Controlled power!",
      plank: "Strong plank position! Body like steel!",
      pushup: "Optional push-up! Show that extra strength!",
      jump_in: "Explosive jump in! Feel that power!",
      jump_up: "Reach for the sky! You're unstoppable!"
    },
    motivational: [
      "Burpees are forging ultimate fitness!",
      "Every burpee is a full-body transformation!",
      "You're building explosive athletic power!",
      "This is where champions are made!"
    ],
    corrections: {
      plank: "Tight plank! No sagging, pure strength!",
      landing: "Soft landings! Control that power!",
      rhythm: "Find your rhythm! Smooth and powerful!"
    }
  }
};

export const VirtualTrainer: React.FC<VirtualTrainerProps> = ({
  trainerPersona,
  currentExercise,
  formScore,
  isActive,
  onSpeak
}) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [lastEncouragement, setLastEncouragement] = useState(0);
  const [repCount, setRepCount] = useState(0);
  const [mood, setMood] = useState<'excellent' | 'good' | 'needs_work' | 'encouraging'>('encouraging');
  
  const trainer = TRAINER_AVATARS[trainerPersona];
  const exerciseCoaching = CONTEXTUAL_COACHING[currentExercise as keyof typeof CONTEXTUAL_COACHING];

  // Determine trainer mood based on form score
  useEffect(() => {
    if (formScore >= 90) setMood('excellent');
    else if (formScore >= 75) setMood('good');
    else if (formScore >= 50) setMood('needs_work');
    else setMood('encouraging');
  }, [formScore]);

  // Provide contextual encouragement
  const provideEncouragement = useCallback(() => {
    if (!exerciseCoaching || !isActive) return;

    const now = Date.now();
    if (now - lastEncouragement < 5000) return; // Throttle encouragement

    const messages = exerciseCoaching.motivational;
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    setCurrentMessage(randomMessage);
    setIsAnimating(true);
    setLastEncouragement(now);
    onSpeak(randomMessage);

    setTimeout(() => setIsAnimating(false), 3000);
  }, [exerciseCoaching, isActive, lastEncouragement, onSpeak]);

  // Auto-encouragement based on performance
  useEffect(() => {
    if (!isActive) return;

    const encouragementInterval = setInterval(() => {
      if (formScore < 70) {
        provideEncouragement();
      }
    }, 8000);

    return () => clearInterval(encouragementInterval);
  }, [isActive, formScore, provideEncouragement]);

  // Celebrate perfect reps
  useEffect(() => {
    if (formScore >= 95 && isActive) {
      setRepCount(prev => prev + 1);
      const celebrations = [
        "PERFECT! That's exactly what I want to see!",
        "Absolutely flawless execution! You're on fire!",
        "Textbook form! You're setting the standard!",
        "Incredible! That's champion-level technique!"
      ];
      const celebration = celebrations[Math.floor(Math.random() * celebrations.length)];
      setCurrentMessage(celebration);
      setIsAnimating(true);
      onSpeak(celebration);
      
      setTimeout(() => setIsAnimating(false), 4000);
    }
  }, [formScore, isActive, onSpeak]);

  const handleManualEncouragement = () => {
    if (!exerciseCoaching) return;
    
    const messages = exerciseCoaching.motivational;
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    setCurrentMessage(randomMessage);
    setIsAnimating(true);
    onSpeak(randomMessage);
    
    setTimeout(() => setIsAnimating(false), 3000);
  };

  const getTrainerAnimation = () => {
    if (mood === 'excellent') return { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] };
    if (mood === 'good') return { scale: [1, 1.05, 1] };
    if (mood === 'needs_work') return { x: [-2, 2, -2, 0] };
    return { y: [0, -3, 0] };
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md"
    >
      <Card className={`bg-gradient-to-br ${trainer.bgColor} border-2 border-gradient shadow-lg`}>
        <CardContent className="p-6">
          {/* Trainer Avatar and Info */}
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              animate={getTrainerAnimation()}
              transition={{ duration: 0.5, repeat: isAnimating ? Infinity : 0 }}
              className={`w-16 h-16 rounded-full bg-gradient-to-br ${trainer.color} flex items-center justify-center text-2xl shadow-lg`}
            >
              <span className="text-white text-xl">
                {trainer.mood[mood]}
              </span>
            </motion.div>
            
            <div className="flex-1">
              <h3 className="font-bold text-lg">{trainer.name}</h3>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  AI Coach
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    mood === 'excellent' ? 'border-green-400 text-green-600' :
                    mood === 'good' ? 'border-blue-400 text-blue-600' :
                    mood === 'needs_work' ? 'border-yellow-400 text-yellow-600' :
                    'border-purple-400 text-purple-600'
                  }`}
                >
                  {mood === 'excellent' ? 'Impressed' :
                   mood === 'good' ? 'Pleased' :
                   mood === 'needs_work' ? 'Focused' : 'Encouraging'}
                </Badge>
              </div>
            </div>

            {/* Form Score Display */}
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                formScore >= 90 ? 'text-green-600' :
                formScore >= 75 ? 'text-blue-600' :
                formScore >= 50 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {Math.round(formScore)}%
              </div>
              <div className="text-xs text-muted-foreground">Form Score</div>
            </div>
          </div>

          {/* Current Message */}
          <AnimatePresence mode="wait">
            {currentMessage && (
              <motion.div
                key={currentMessage}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                className="mb-4"
              >
                <div className={`p-4 rounded-lg bg-gradient-to-r ${trainer.color} text-white shadow-inner`}>
                  <div className="flex items-start gap-2">
                    <MessageCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <p className="text-sm font-medium leading-relaxed">
                      {currentMessage}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stats and Controls */}
          <div className="space-y-4">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white/50 rounded-lg p-2">
                <div className="text-lg font-bold text-primary">{repCount}</div>
                <div className="text-xs text-muted-foreground">Perfect Reps</div>
              </div>
              <div className="bg-white/50 rounded-lg p-2">
                <div className="text-lg font-bold text-primary">{currentExercise.split('-')[0]}</div>
                <div className="text-xs text-muted-foreground">Exercise</div>
              </div>
              <div className="bg-white/50 rounded-lg p-2">
                <div className={`text-lg font-bold ${
                  mood === 'excellent' ? 'text-green-600' :
                  mood === 'good' ? 'text-blue-600' :
                  mood === 'needs_work' ? 'text-yellow-600' : 'text-purple-600'
                }`}>
                  {mood === 'excellent' ? '🔥' :
                   mood === 'good' ? '💪' :
                   mood === 'needs_work' ? '⚡' : '🚀'}
                </div>
                <div className="text-xs text-muted-foreground">Status</div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handleManualEncouragement}
                variant="outline"
                size="sm"
                className="flex-1 bg-white/50 hover:bg-white/70"
                disabled={!isActive}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Motivate Me
              </Button>
              <Button
                onClick={() => {
                  const tip = exerciseCoaching?.corrections[
                    Object.keys(exerciseCoaching.corrections)[0] as keyof typeof exerciseCoaching.corrections
                  ];
                  if (tip) {
                    setCurrentMessage(tip);
                    setIsAnimating(true);
                    onSpeak(tip);
                    setTimeout(() => setIsAnimating(false), 3000);
                  }
                }}
                variant="outline"
                size="sm"
                className="flex-1 bg-white/50 hover:bg-white/70"
                disabled={!exerciseCoaching}
              >
                <Target className="h-4 w-4 mr-2" />
                Form Tip
              </Button>
            </div>
          </div>

          {/* Achievement Celebrations */}
          {formScore >= 95 && isActive && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mt-4 p-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg text-white text-center"
            >
              <div className="flex items-center justify-center gap-2">
                <Trophy className="h-5 w-5" />
                <span className="font-bold">PERFECT FORM!</span>
                <Trophy className="h-5 w-5" />
              </div>
              <div className="text-sm mt-1">You're absolutely crushing it!</div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};