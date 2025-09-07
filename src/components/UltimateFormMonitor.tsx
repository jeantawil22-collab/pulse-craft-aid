import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { 
  Camera, 
  CameraOff, 
  AlertTriangle, 
  CheckCircle, 
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Trophy,
  Star,
  Zap,
  Target,
  Award,
  TrendingUp,
  Flame,
  Heart,
  Shield,
  Crown,
  Sparkles,
  Dumbbell
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// MediaPipe Pose imports
declare global {
  interface Window {
    Pose: any;
    Camera: any;
    drawConnectors: any;
    drawLandmarks: any;
    POSE_CONNECTIONS: any;
    POSE_LANDMARKS: any;
  }
}

interface PoseLandmark {
  x: number;
  y: number;
  z: number;
  visibility: number;
}

interface FormAnalysis {
  score: number;
  issues: string[];
  suggestions: string[];
  angles: { [key: string]: number };
  timestamp: number;
  perfectForm?: boolean;
  improvement?: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

interface UltimateFormMonitorProps {
  exerciseName: string;
  isActive: boolean;
  onFormAnalysis: (analysis: FormAnalysis) => void;
}

// Virtual Trainer Personas
const TRAINER_PERSONAS = {
  motivational: {
    name: "Alex Thunder",
    voice: "Chris", // ElevenLabs voice ID
    style: "energetic",
    phrases: {
      perfect: ["INCREDIBLE! That's what I'm talking about!", "You're absolutely crushing it!", "PERFECT FORM! You're a machine!"],
      good: ["Great work! Keep that energy up!", "Nice form! You're getting stronger!", "Excellent! I can see the improvement!"],
      needs_work: ["Almost there! Small adjustment needed!", "Good effort! Let's perfect this together!", "You've got this! Just a tiny tweak!"],
      encouragement: ["Don't give up! You're stronger than you know!", "Every rep counts! Keep pushing!", "I believe in you! Let's go!"]
    }
  },
  zen: {
    name: "Maya Flow",
    voice: "Sarah",
    style: "calm",
    phrases: {
      perfect: ["Beautiful form. You're in perfect harmony.", "Excellent. Your body and mind are aligned.", "Perfect. You've found your flow."],
      good: ["Good work. Feel the connection with your body.", "Nice. You're improving with each movement.", "Well done. Stay present and focused."],
      needs_work: ["Breathe and adjust. Your body knows the way.", "Gentle correction needed. Stay mindful.", "Almost there. Listen to your body."],
      encouragement: ["Trust the process. You're exactly where you need to be.", "Every breath brings you closer to perfection.", "Stay patient. Growth happens gradually."]
    }
  },
  scientific: {
    name: "Dr. Precision",
    voice: "Brian",
    style: "analytical",
    phrases: {
      perfect: ["Biomechanically perfect! Optimal muscle activation achieved.", "Excellent kinetic chain alignment. Maximum efficiency.", "Perfect joint angles. Textbook execution."],
      good: ["Good movement pattern. 85% efficiency achieved.", "Solid technique. Minor optimization opportunities.", "Well executed. Muscle recruitment is on target."],
      needs_work: ["Slight deviation detected. Adjust hip angle by 5 degrees.", "Form efficiency at 70%. Small correction needed.", "Movement compensation detected. Focus on primary movers."],
      encouragement: ["Data shows consistent improvement. Continue protocol.", "Your progress metrics are trending upward.", "Neuromotor adaptation is occurring. Stay consistent."]
    }
  }
};

// Exercise-specific coaching rules
const EXERCISE_COACHING = {
  'Push-ups': {
    perfectFormCriteria: {
      elbowAngle: { min: 60, max: 90 },
      bodyAlignment: { min: 175, max: 180 },
      rangeOfMotion: { min: 80, max: 100 }
    },
    realTimeCoaching: {
      starting: "Position yourself in a strong plank. Hands under shoulders.",
      descending: "Lower with control. Keep that core tight!",
      bottom: "Perfect depth! Now drive back up powerfully!",
      ascending: "Push through those palms! You've got this!",
      top: "Excellent! Reset and prepare for the next rep!"
    },
    commonFixes: {
      saggingHips: "Engage your core! Imagine a straight line from head to heels!",
      wideElbows: "Bring those elbows closer to your sides! More tricep activation!",
      partialRange: "Go deeper! Your chest should almost kiss the ground!",
      rushingReps: "Slow it down! Control the movement for maximum benefit!"
    }
  },
  'Squats': {
    perfectFormCriteria: {
      kneeAngle: { min: 80, max: 95 },
      hipHinge: { min: 85, max: 100 },
      kneeTracking: { max: 5 }
    },
    realTimeCoaching: {
      starting: "Feet shoulder-width apart. Chest proud, core engaged!",
      descending: "Sit back like you're sitting in a chair. Knees tracking over toes!",
      bottom: "Perfect depth! Feel that glute activation!",
      ascending: "Drive through your heels! Power through those glutes!",
      top: "Outstanding! Stand tall and proud!"
    },
    commonFixes: {
      kneeValgus: "Drive those knees out! Track them over your toes!",
      forwardLean: "Chest up! Keep that proud posture!",
      shallowDepth: "Go deeper! Hip crease below knee level!",
      heelRise: "Stay planted! Keep those heels glued to the ground!"
    }
  },
  'Burpees': {
    perfectFormCriteria: {
      plankQuality: { min: 175, max: 180 },
      jumpHeight: { min: 6, max: 20 },
      transitionSpeed: { optimal: 2.5 }
    },
    realTimeCoaching: {
      squat: "Drop into that squat! Hands ready to hit the ground!",
      plank: "Jump back to plank! Make it strong and straight!",
      pushUp: "Optional push-up! Show me that strength!",
      jump_back: "Jump those feet back in! Explosive power!",
      jump_up: "Explode up! Reach for the sky! You're unstoppable!"
    },
    commonFixes: {
      lazyPlank: "Tighten that plank! Core engaged, body straight!",
      softLanding: "Land like a ninja! Soft and controlled!",
      rushedMovement: "Quality over speed! Each phase matters!",
      lowJump: "Jump higher! Reach for the stars!"
    }
  }
};

// Achievement system
const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_perfect',
    title: 'Perfect Form',
    description: 'Achieve 100% form score',
    icon: Trophy,
    color: 'text-yellow-500',
    unlocked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'streak_10',
    title: 'Consistency King',
    description: 'Maintain 90%+ form for 10 reps',
    icon: Flame,
    color: 'text-orange-500',
    unlocked: false,
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'improvement_master',
    title: 'Rapid Improvement',
    description: 'Improve form by 30% in one session',
    icon: TrendingUp,
    color: 'text-green-500',
    unlocked: false,
    progress: 0,
    maxProgress: 30
  },
  {
    id: 'form_guardian',
    title: 'Form Guardian',
    description: 'Complete 100 reps with perfect form',
    icon: Shield,
    color: 'text-blue-500',
    unlocked: false,
    progress: 0,
    maxProgress: 100
  },
  {
    id: 'perfectionist',
    title: 'The Perfectionist',
    description: 'Achieve 95%+ average form score',
    icon: Crown,
    color: 'text-purple-500',
    unlocked: false,
    progress: 0,
    maxProgress: 95
  }
];

export const UltimateFormMonitor: React.FC<UltimateFormMonitorProps> = ({
  exerciseName,
  isActive,
  onFormAnalysis
}) => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const poseRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const lastFeedbackTimeRef = useRef<number>(0);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Core states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<FormAnalysis | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Advanced states
  const [selectedTrainer, setSelectedTrainer] = useState<keyof typeof TRAINER_PERSONAS>('motivational');
  const [totalReps, setTotalReps] = useState(0);
  const [perfectReps, setPerfectReps] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [sessionScore, setSessionScore] = useState(0);
  const [improvements, setImprovements] = useState<number[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [showCelebration, setShowCelebration] = useState(false);
  const [recentAchievement, setRecentAchievement] = useState<Achievement | null>(null);
  const [motivationalQuotes] = useState([
    "Every rep is a step closer to greatness!",
    "Your only competition is who you were yesterday!",
    "Strong body, stronger mind!",
    "Perfect practice makes perfect!",
    "You're not just working out, you're building character!"
  ]);
  const [currentPhase, setCurrentPhase] = useState('ready');

  // Calculate angle between three points
  const calculateAngle = useCallback((point1: PoseLandmark, point2: PoseLandmark, point3: PoseLandmark): number => {
    const radians = Math.atan2(point3.y - point2.y, point3.x - point2.x) -
                   Math.atan2(point1.y - point2.y, point1.x - point2.x);
    let angle = Math.abs(radians * (180 / Math.PI));
    if (angle > 180) {
      angle = 360 - angle;
    }
    return angle;
  }, []);

  // Advanced AI voice coaching
  const speakWithPersonality = useCallback((text: string, priority: 'high' | 'medium' | 'low' = 'medium') => {
    if (!audioEnabled) return;

    // Cancel current speech if high priority
    if (priority === 'high' && speechSynthesisRef.current) {
      speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const trainer = TRAINER_PERSONAS[selectedTrainer];
    
    // Set voice characteristics based on trainer personality
    utterance.rate = trainer.style === 'energetic' ? 1.1 : trainer.style === 'calm' ? 0.8 : 0.9;
    utterance.pitch = trainer.style === 'energetic' ? 1.2 : trainer.style === 'calm' ? 0.9 : 1.0;
    utterance.volume = 0.8;

    speechSynthesisRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, [audioEnabled, selectedTrainer]);

  // Enhanced pose analysis with real-time coaching
  const analyzePose = useCallback((landmarks: PoseLandmark[]) => {
    if (!landmarks || landmarks.length === 0) return null;

    const exerciseRules = EXERCISE_COACHING[exerciseName as keyof typeof EXERCISE_COACHING];
    if (!exerciseRules) return null;

    const analysis: FormAnalysis = {
      score: 100,
      issues: [],
      suggestions: [],
      angles: {},
      timestamp: Date.now(),
      perfectForm: false,
      improvement: 0
    };

    try {
      const landmarkMap = {
        leftShoulder: 11, rightShoulder: 12, leftElbow: 13, rightElbow: 14,
        leftWrist: 15, rightWrist: 16, leftHip: 23, rightHip: 24,
        leftKnee: 25, rightKnee: 26, leftAnkle: 27, rightAnkle: 28
      };

      let majorIssues = 0;
      let minorIssues = 0;

      // Exercise-specific analysis with detailed coaching
      switch (exerciseName) {
        case 'Push-ups':
          // Elbow angle analysis
          if (landmarks[landmarkMap.leftShoulder] && landmarks[landmarkMap.leftElbow] && landmarks[landmarkMap.leftWrist]) {
            const leftElbowAngle = calculateAngle(
              landmarks[landmarkMap.leftShoulder],
              landmarks[landmarkMap.leftElbow],
              landmarks[landmarkMap.leftWrist]
            );
            analysis.angles.leftElbow = leftElbowAngle;

            if (leftElbowAngle < 45) {
              analysis.score -= 25;
              analysis.issues.push('Elbows flaring too wide');
              analysis.suggestions.push('Keep elbows at 45-degree angle to your body');
              majorIssues++;
            } else if (leftElbowAngle < 60) {
              analysis.score -= 10;
              minorIssues++;
            }
          }

          // Body alignment analysis
          if (landmarks[landmarkMap.leftShoulder] && landmarks[landmarkMap.leftHip] && landmarks[landmarkMap.leftAnkle]) {
            const bodyAngle = calculateAngle(
              landmarks[landmarkMap.leftShoulder],
              landmarks[landmarkMap.leftHip],
              landmarks[landmarkMap.leftAnkle]
            );
            analysis.angles.bodyAlignment = bodyAngle;

            if (bodyAngle < 165) {
              analysis.score -= 30;
              analysis.issues.push('Body sagging - engage your core!');
              analysis.suggestions.push('Imagine a straight line from head to heels');
              majorIssues++;
            } else if (bodyAngle < 175) {
              analysis.score -= 15;
              minorIssues++;
            }
          }
          break;

        case 'Squats':
          // Knee angle and depth analysis
          if (landmarks[landmarkMap.leftHip] && landmarks[landmarkMap.leftKnee] && landmarks[landmarkMap.leftAnkle]) {
            const leftKneeAngle = calculateAngle(
              landmarks[landmarkMap.leftHip],
              landmarks[landmarkMap.leftKnee],
              landmarks[landmarkMap.leftAnkle]
            );
            analysis.angles.leftKnee = leftKneeAngle;

            if (leftKneeAngle > 120) {
              analysis.score -= 25;
              analysis.issues.push('Not squatting deep enough');
              analysis.suggestions.push('Go deeper - hip crease below knee level');
              majorIssues++;
            } else if (leftKneeAngle > 100) {
              analysis.score -= 10;
              minorIssues++;
            }
          }

          // Knee tracking analysis
          const leftKnee = landmarks[landmarkMap.leftKnee];
          const leftAnkle = landmarks[landmarkMap.leftAnkle];
          if (leftKnee && leftAnkle) {
            const kneeAlignment = Math.abs(leftKnee.x - leftAnkle.x);
            if (kneeAlignment > 0.08) {
              analysis.score -= 20;
              analysis.issues.push('Knees caving inward');
              analysis.suggestions.push('Drive knees out over your toes');
              majorIssues++;
            } else if (kneeAlignment > 0.05) {
              analysis.score -= 10;
              minorIssues++;
            }
          }
          break;

        case 'Burpees':
          // Multi-phase analysis for burpees
          if (landmarks[landmarkMap.leftShoulder] && landmarks[landmarkMap.leftHip] && landmarks[landmarkMap.leftAnkle]) {
            const plankAngle = calculateAngle(
              landmarks[landmarkMap.leftShoulder],
              landmarks[landmarkMap.leftHip],
              landmarks[landmarkMap.leftAnkle]
            );
            analysis.angles.plankAlignment = plankAngle;

            if (plankAngle < 165) {
              analysis.score -= 25;
              analysis.issues.push('Poor plank form during transition');
              analysis.suggestions.push('Maintain straight body line in plank');
              majorIssues++;
            } else if (plankAngle < 175) {
              analysis.score -= 10;
              minorIssues++;
            }
          }
          break;
      }

      // Determine if perfect form achieved
      analysis.perfectForm = analysis.score >= 95 && majorIssues === 0;
      analysis.score = Math.max(0, Math.min(100, analysis.score));

      // Calculate improvement
      if (currentAnalysis) {
        analysis.improvement = analysis.score - currentAnalysis.score;
      }

      return analysis;
    } catch (error) {
      console.error('Error analyzing pose:', error);
      return null;
    }
  }, [exerciseName, calculateAngle, currentAnalysis]);

  // Achievement system
  const checkAchievements = useCallback((analysis: FormAnalysis) => {
    const updatedAchievements = [...achievements];
    let newAchievements: Achievement[] = [];

    updatedAchievements.forEach(achievement => {
      if (achievement.unlocked) return;

      switch (achievement.id) {
        case 'first_perfect':
          if (analysis.perfectForm) {
            achievement.progress = 1;
            achievement.unlocked = true;
            newAchievements.push(achievement);
          }
          break;
        case 'streak_10':
          if (analysis.score >= 90) {
            achievement.progress = Math.min(currentStreak + 1, achievement.maxProgress);
            if (achievement.progress >= achievement.maxProgress) {
              achievement.unlocked = true;
              newAchievements.push(achievement);
            }
          }
          break;
        case 'improvement_master':
          if (analysis.improvement && analysis.improvement > 0) {
            achievement.progress = Math.min(achievement.progress + analysis.improvement, achievement.maxProgress);
            if (achievement.progress >= achievement.maxProgress) {
              achievement.unlocked = true;
              newAchievements.push(achievement);
            }
          }
          break;
        case 'form_guardian':
          if (analysis.perfectForm) {
            achievement.progress = Math.min(perfectReps + 1, achievement.maxProgress);
            if (achievement.progress >= achievement.maxProgress) {
              achievement.unlocked = true;
              newAchievements.push(achievement);
            }
          }
          break;
        case 'perfectionist':
          const avgScore = sessionScore / Math.max(totalReps, 1);
          achievement.progress = Math.min(avgScore, achievement.maxProgress);
          if (achievement.progress >= achievement.maxProgress) {
            achievement.unlocked = true;
            newAchievements.push(achievement);
          }
          break;
      }
    });

    if (newAchievements.length > 0) {
      setAchievements(updatedAchievements);
      setRecentAchievement(newAchievements[0]);
      setShowCelebration(true);
      
      speakWithPersonality(
        `INCREDIBLE! You've unlocked the ${newAchievements[0].title} achievement! ${newAchievements[0].description}`,
        'high'
      );

      setTimeout(() => {
        setShowCelebration(false);
        setRecentAchievement(null);
      }, 5000);
    }
  }, [achievements, currentStreak, perfectReps, sessionScore, totalReps, speakWithPersonality]);

  // Enhanced audio feedback with personality
  const playAdvancedAudioFeedback = useCallback((analysis: FormAnalysis) => {
    if (!audioEnabled) return;

    const now = Date.now();
    if (now - lastFeedbackTimeRef.current < 2000) return;
    lastFeedbackTimeRef.current = now;

    const trainer = TRAINER_PERSONAS[selectedTrainer];
    let message = '';

    if (analysis.perfectForm) {
      message = trainer.phrases.perfect[Math.floor(Math.random() * trainer.phrases.perfect.length)];
    } else if (analysis.score >= 80) {
      message = trainer.phrases.good[Math.floor(Math.random() * trainer.phrases.good.length)];
    } else if (analysis.score >= 60) {
      message = trainer.phrases.needs_work[Math.floor(Math.random() * trainer.phrases.needs_work.length)];
    } else {
      message = trainer.phrases.encouragement[Math.floor(Math.random() * trainer.phrases.encouragement.length)];
    }

    speakWithPersonality(message, 'medium');

    // Play motivational sound effects
    try {
      if (!audioContextRef.current) return;
      
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      if (analysis.perfectForm) {
        // Perfect form - triumphant chord
        oscillator.frequency.setValueAtTime(523, audioContextRef.current.currentTime); // C
        oscillator.frequency.setValueAtTime(659, audioContextRef.current.currentTime + 0.1); // E
        oscillator.frequency.setValueAtTime(784, audioContextRef.current.currentTime + 0.2); // G
      } else if (analysis.score >= 80) {
        // Good form - positive tone
        oscillator.frequency.setValueAtTime(440, audioContextRef.current.currentTime);
        oscillator.frequency.setValueAtTime(554, audioContextRef.current.currentTime + 0.1);
      } else {
        // Needs improvement - gentle correction tone
        oscillator.frequency.setValueAtTime(330, audioContextRef.current.currentTime);
        oscillator.frequency.setValueAtTime(370, audioContextRef.current.currentTime + 0.1);
      }

      gainNode.gain.setValueAtTime(0.2, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.4);

      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 0.4);
    } catch (error) {
      console.error('Error playing audio feedback:', error);
    }
  }, [audioEnabled, selectedTrainer, speakWithPersonality]);

  // Handle pose detection results with advanced processing
  const onPoseResults = useCallback((results: any) => {
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw video frame
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    if (results.poseLandmarks && showOverlay) {
      // Enhanced pose visualization
      if (window.drawConnectors && window.drawLandmarks && window.POSE_CONNECTIONS) {
        // Dynamic colors based on form quality
        const connectionColor = currentAnalysis?.score >= 90 ? '#10B981' : 
                               currentAnalysis?.score >= 70 ? '#F59E0B' : '#EF4444';
        
        window.drawConnectors(ctx, results.poseLandmarks, window.POSE_CONNECTIONS, {
          color: connectionColor,
          lineWidth: 3
        });
        
        window.drawLandmarks(ctx, results.poseLandmarks, {
          color: connectionColor,
          lineWidth: 2,
          radius: 4
        });
      }

      // Draw form score overlay
      if (currentAnalysis) {
        ctx.font = 'bold 24px Arial';
        ctx.fillStyle = currentAnalysis.score >= 90 ? '#10B981' : 
                       currentAnalysis.score >= 70 ? '#F59E0B' : '#EF4444';
        ctx.fillText(`${Math.round(currentAnalysis.score)}%`, 20, 40);
        
        if (currentAnalysis.perfectForm) {
          ctx.font = 'bold 20px Arial';
          ctx.fillStyle = '#FFD700';
          ctx.fillText('PERFECT FORM! ⭐', 20, 70);
        }
      }

      // Analyze pose if active
      if (isActive && isAnalyzing) {
        const analysis = analyzePose(results.poseLandmarks);
        if (analysis) {
          setCurrentAnalysis(analysis);
          onFormAnalysis(analysis);

          // Update statistics
          setTotalReps(prev => prev + 1);
          setSessionScore(prev => prev + analysis.score);
          
          if (analysis.perfectForm) {
            setPerfectReps(prev => prev + 1);
            setCurrentStreak(prev => prev + 1);
          } else {
            if (currentStreak > bestStreak) {
              setBestStreak(currentStreak);
            }
            setCurrentStreak(0);
          }

          if (analysis.improvement && analysis.improvement > 0) {
            setImprovements(prev => [...prev.slice(-9), analysis.improvement]);
          }

          // Provide enhanced feedback
          playAdvancedAudioFeedback(analysis);
          checkAchievements(analysis);
        }
      }
    }
  }, [isActive, isAnalyzing, showOverlay, analyzePose, onFormAnalysis, currentAnalysis, playAdvancedAudioFeedback, checkAchievements, currentStreak, bestStreak]);

  // Load MediaPipe Pose
  const loadPose = useCallback(async () => {
    setIsLoading(true);
    try {
      await new Promise<void>((resolve, reject) => {
        const script1 = document.createElement('script');
        script1.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js';
        script1.onload = () => {
          const script2 = document.createElement('script');
          script2.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js';
          script2.onload = () => {
            const script3 = document.createElement('script');
            script3.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js';
            script3.onload = () => resolve();
            script3.onerror = reject;
            document.head.appendChild(script3);
          };
          script2.onerror = reject;
          document.head.appendChild(script2);
        };
        script1.onerror = reject;
        document.head.appendChild(script1);
      });

      if (window.Pose) {
        poseRef.current = new window.Pose({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
        });

        poseRef.current.setOptions({
          modelComplexity: 2, // Highest accuracy
          smoothLandmarks: true,
          enableSegmentation: false,
          smoothSegmentation: false,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.7
        });

        poseRef.current.onResults(onPoseResults);
      }
    } catch (error) {
      console.error('Error loading MediaPipe Pose:', error);
      toast({
        title: "Error",
        description: "Failed to load pose detection. Please refresh and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [onPoseResults, toast]);

  // Start camera with welcome message
  const startCamera = useCallback(async () => {
    if (!poseRef.current) {
      await loadPose();
    }

    try {
      if (videoRef.current && window.Camera) {
        cameraRef.current = new window.Camera(videoRef.current, {
          onFrame: async () => {
            if (poseRef.current && videoRef.current) {
              await poseRef.current.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480
        });

        await cameraRef.current.start();
        setIsCameraActive(true);

        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        const trainer = TRAINER_PERSONAS[selectedTrainer];
        speakWithPersonality(
          `Hello! I'm ${trainer.name}, your AI form coach! I'm here to help you achieve perfect form and reach your fitness goals. Let's make every rep count!`,
          'high'
        );

        toast({
          title: "🚀 Ultimate Form Coach Activated!",
          description: `${trainer.name} is ready to coach you to perfection!`,
        });
      }
    } catch (error) {
      console.error('Error starting camera:', error);
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  }, [loadPose, selectedTrainer, speakWithPersonality, toast]);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }
    if (speechSynthesisRef.current) {
      speechSynthesis.cancel();
    }
    setIsCameraActive(false);
    setIsAnalyzing(false);
    setCurrentAnalysis(null);

    toast({
      title: "Session Complete! 🎯",
      description: `Great work! You completed ${totalReps} reps with ${Math.round((perfectReps / Math.max(totalReps, 1)) * 100)}% perfect form!`,
    });
  }, [toast, totalReps, perfectReps]);

  // Auto-start analysis when camera is active and exercise is active
  useEffect(() => {
    if (isCameraActive && isActive) {
      setIsAnalyzing(true);
    } else {
      setIsAnalyzing(false);
    }
  }, [isCameraActive, isActive]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (speechSynthesisRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="relative">
      {/* Celebration Confetti */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 pointer-events-none"
          >
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              recycle={false}
              numberOfPieces={200}
              gravity={0.3}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Modal */}
      <AnimatePresence>
        {recentAchievement && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <Card className="max-w-md mx-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-2xl">
              <CardHeader className="text-center pb-2">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                  className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center ${recentAchievement.color}`}
                >
                  <recentAchievement.icon className="h-8 w-8 text-white" />
                </motion.div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  Achievement Unlocked!
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <h3 className="text-xl font-semibold mb-2">{recentAchievement.title}</h3>
                <p className="text-muted-foreground mb-4">{recentAchievement.description}</p>
                <div className="flex items-center justify-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Card className="w-full bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-primary/20 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-primary to-primary/80 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <motion.div
                animate={isCameraActive ? { rotate: 360 } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Camera className="h-6 w-6" />
              </motion.div>
              Ultimate Form Coach
              <Badge variant="secondary" className="bg-white/20 text-white">
                AI Powered
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-3">
              {/* Trainer Selection */}
              <select
                value={selectedTrainer}
                onChange={(e) => setSelectedTrainer(e.target.value as keyof typeof TRAINER_PERSONAS)}
                className="bg-white/20 text-white border-white/30 rounded px-2 py-1 text-sm"
              >
                <option value="motivational" className="text-black">Alex Thunder (Motivational)</option>
                <option value="zen" className="text-black">Maya Flow (Zen)</option>
                <option value="scientific" className="text-black">Dr. Precision (Scientific)</option>
              </select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAudioEnabled(!audioEnabled)}
                disabled={!isCameraActive}
                className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOverlay(!showOverlay)}
                disabled={!isCameraActive}
                className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              >
                {showOverlay ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Statistics Dashboard */}
          {isCameraActive && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
            >
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-4 text-center">
                  <Target className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-blue-800">{totalReps}</div>
                  <div className="text-sm text-blue-600">Total Reps</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold text-green-800">{perfectReps}</div>
                  <div className="text-sm text-green-600">Perfect Form</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-4 text-center">
                  <Flame className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <div className="text-2xl font-bold text-orange-800">{currentStreak}</div>
                  <div className="text-sm text-orange-600">Current Streak</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold text-purple-800">
                    {totalReps > 0 ? Math.round((sessionScore / totalReps)) : 0}%
                  </div>
                  <div className="text-sm text-purple-600">Avg Score</div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Camera Controls */}
          <div className="flex justify-center">
            {!isCameraActive ? (
              <Button 
                onClick={startCamera} 
                disabled={isLoading}
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                <motion.div
                  animate={isLoading ? { rotate: 360 } : {}}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Camera className="h-5 w-5 mr-2" />
                </motion.div>
                {isLoading ? 'Initializing AI Coach...' : 'Start Ultimate Coaching Session'}
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button 
                  onClick={stopCamera}
                  variant="outline"
                  size="lg"
                  className="hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                >
                  <CameraOff className="h-5 w-5 mr-2" />
                  End Session
                </Button>
                <Button
                  onClick={() => {
                    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
                    speakWithPersonality(randomQuote, 'medium');
                  }}
                  variant="outline"
                  size="lg"
                  className="bg-gradient-to-r from-green-50 to-blue-50 hover:from-green-100 hover:to-blue-100"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Motivate Me!
                </Button>
              </div>
            )}
          </div>

          {/* Camera Feed with Enhanced Overlay */}
          {isCameraActive && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-2xl"
            >
              <video
                ref={videoRef}
                className="hidden"
                autoPlay
                playsInline
                muted
              />
              <canvas
                ref={canvasRef}
                width={640}
                height={480}
                className="w-full h-auto rounded-xl"
              />
              
              {/* Status Overlays */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <Badge 
                  variant={isCameraActive ? "default" : "secondary"}
                  className={`${isCameraActive ? 'bg-green-500' : 'bg-gray-500'} text-white`}
                >
                  <div className={`w-2 h-2 rounded-full mr-2 ${isCameraActive ? 'bg-white animate-pulse' : 'bg-gray-300'}`} />
                  Camera: {isCameraActive ? 'LIVE' : 'OFF'}
                </Badge>
                <Badge 
                  variant={isAnalyzing ? "default" : "secondary"}
                  className={`${isAnalyzing ? 'bg-blue-500' : 'bg-gray-500'} text-white`}
                >
                  <Zap className="w-3 h-3 mr-1" />
                  AI Analysis: {isAnalyzing ? 'ACTIVE' : 'STANDBY'}
                </Badge>
              </div>

              {/* Exercise and Trainer Info */}
              <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                <Badge variant="outline" className="bg-black/70 text-white border-white/30">
                  <Dumbbell className="w-3 h-3 mr-1" />
                  {exerciseName}
                </Badge>
                <Badge variant="outline" className="bg-black/70 text-white border-white/30">
                  <Heart className="w-3 h-3 mr-1" />
                  {TRAINER_PERSONAS[selectedTrainer].name}
                </Badge>
              </div>

              {/* Current Score Display */}
              {currentAnalysis && (
                <motion.div
                  animate={{ scale: currentAnalysis.perfectForm ? [1, 1.1, 1] : 1 }}
                  transition={{ duration: 0.5 }}
                  className="absolute bottom-4 left-4 bg-black/80 text-white px-4 py-2 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className={`text-3xl font-bold ${
                      currentAnalysis.score >= 90 ? 'text-green-400' : 
                      currentAnalysis.score >= 70 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {Math.round(currentAnalysis.score)}%
                    </div>
                    {currentAnalysis.perfectForm && (
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <Crown className="h-6 w-6 text-yellow-400" />
                      </motion.div>
                    )}
                  </div>
                  <div className="text-xs opacity-75">Form Score</div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Enhanced Form Analysis Results */}
          {currentAnalysis && isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Score Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Form Quality</span>
                  <span className={`text-3xl font-bold ${
                    currentAnalysis.score >= 90 ? 'text-green-500' : 
                    currentAnalysis.score >= 70 ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {currentAnalysis.score}%
                  </span>
                </div>
                <Progress 
                  value={currentAnalysis.score} 
                  className="h-3 bg-gray-200"
                />
                
                {currentAnalysis.perfectForm && (
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="flex items-center gap-2 text-yellow-600 font-semibold"
                  >
                    <Sparkles className="h-5 w-5" />
                    PERFECT FORM ACHIEVED!
                    <Sparkles className="h-5 w-5" />
                  </motion.div>
                )}
              </div>

              {/* Issues and Suggestions */}
              <div className="grid md:grid-cols-2 gap-4">
                {currentAnalysis.issues.length > 0 && (
                  <Card className="border-red-200 bg-red-50">
                    <CardHeader className="pb-2">
                      <h5 className="font-semibold flex items-center gap-2 text-red-700">
                        <AlertTriangle className="h-4 w-4" />
                        Form Issues
                      </h5>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {currentAnalysis.issues.map((issue, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="text-sm text-red-600 flex items-start gap-2"
                          >
                            <span className="text-red-400 mt-1">•</span>
                            {issue}
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {currentAnalysis.suggestions.length > 0 && (
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader className="pb-2">
                      <h5 className="font-semibold flex items-center gap-2 text-blue-700">
                        <CheckCircle className="h-4 w-4" />
                        Coaching Tips
                      </h5>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {currentAnalysis.suggestions.map((suggestion, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="text-sm text-blue-600 flex items-start gap-2"
                          >
                            <span className="text-blue-400 mt-1">•</span>
                            {suggestion}
                          </motion.li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            </motion.div>
          )}

          {/* Achievements Display */}
          {achievements.some(a => a.unlocked) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Your Achievements
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {achievements.map(achievement => (
                  <motion.div
                    key={achievement.id}
                    whileHover={{ scale: 1.05 }}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      achievement.unlocked 
                        ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-md' 
                        : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className={`mx-auto w-10 h-10 rounded-full bg-gradient-to-br ${
                      achievement.unlocked ? 'from-yellow-400 to-orange-500' : 'from-gray-300 to-gray-400'
                    } flex items-center justify-center mb-2`}>
                      <achievement.icon className={`h-5 w-5 ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`} />
                    </div>
                    <div className={`text-xs font-medium ${achievement.unlocked ? 'text-gray-800' : 'text-gray-500'}`}>
                      {achievement.title}
                    </div>
                    {!achievement.unlocked && (
                      <div className="text-xs text-gray-400 mt-1">
                        {achievement.progress}/{achievement.maxProgress}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};