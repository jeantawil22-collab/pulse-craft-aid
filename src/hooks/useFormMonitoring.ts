import { useCallback, useRef, useState, useEffect } from 'react';
import { useThrottle, useRAFThrottle, useFitnessCalculations } from './usePerformance';

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
  angles: Record<string, number>;
  timestamp: number;
  perfectForm: boolean;
  improvement: number;
  confidence: number;
}

interface ExerciseProfile {
  name: string;
  keyAngles: Record<string, { min: number; max: number; weight: number }>;
  criticalPoints: string[];
  phases: string[];
  commonErrors: Record<string, string>;
}

// Precision exercise profiles for accurate form analysis
const EXERCISE_PROFILES: Record<string, ExerciseProfile> = {
  'Push-ups': {
    name: 'Push-ups',
    keyAngles: {
      leftElbow: { min: 45, max: 90, weight: 2.0 },
      rightElbow: { min: 45, max: 90, weight: 2.0 },
      bodyAlignment: { min: 175, max: 180, weight: 3.0 },
      shoulderStability: { min: 85, max: 95, weight: 1.5 }
    },
    criticalPoints: ['elbows', 'core', 'shoulders', 'range'],
    phases: ['setup', 'descent', 'bottom', 'ascent', 'reset'],
    commonErrors: {
      flaringElbows: 'Keep elbows at 45° to protect shoulders',
      saggingCore: 'Engage core muscles for straight body line',
      partialRange: 'Lower chest to nearly touch the ground',
      rushed: 'Control the movement - 2 seconds down, 1 second up'
    }
  },
  'Squats': {
    name: 'Squats',
    keyAngles: {
      leftKnee: { min: 80, max: 95, weight: 2.5 },
      rightKnee: { min: 80, max: 95, weight: 2.5 },
      hipHinge: { min: 85, max: 100, weight: 2.0 },
      ankleFlexion: { min: 15, max: 25, weight: 1.0 },
      spinalAlignment: { min: 175, max: 185, weight: 1.5 }
    },
    criticalPoints: ['depth', 'kneeTracking', 'posture', 'balance'],
    phases: ['setup', 'descent', 'bottom', 'ascent', 'reset'],
    commonErrors: {
      shallowDepth: 'Lower until hip crease is below knee level',
      kneeValgus: 'Drive knees out in line with toes',
      forwardLean: 'Keep chest up and spine neutral',
      heelRaise: 'Keep feet flat and weight on heels'
    }
  },
  'Burpees': {
    name: 'Burpees',
    keyAngles: {
      plankAlignment: { min: 175, max: 180, weight: 2.0 },
      squatDepth: { min: 80, max: 95, weight: 1.5 },
      jumpHeight: { min: 6, max: 20, weight: 1.0 }
    },
    criticalPoints: ['plank', 'transition', 'jump', 'landing'],
    phases: ['squat', 'plank', 'pushup', 'jump_back', 'jump_up'],
    commonErrors: {
      lazyPlank: 'Maintain strong plank position',
      hardLanding: 'Land softly with bent knees',
      rushedPhases: 'Complete each phase with control'
    }
  }
};

export const useFormMonitoring = (exerciseName: string) => {
  const [isActive, setIsActive] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<FormAnalysis | null>(null);
  const [historicalData, setHistoricalData] = useState<FormAnalysis[]>([]);
  
  const analysisHistory = useRef<FormAnalysis[]>([]);
  const confidenceBuffer = useRef<number[]>([]);
  const lastAnalysisTime = useRef<number>(0);
  
  const { calculateFormScore } = useFitnessCalculations();

  // High-precision angle calculation with error handling
  const calculateAngle = useCallback((p1: PoseLandmark, p2: PoseLandmark, p3: PoseLandmark): number => {
    try {
      if (!p1 || !p2 || !p3) return 0;
      if (p1.visibility < 0.7 || p2.visibility < 0.7 || p3.visibility < 0.7) return 0;

      const radians = Math.atan2(p3.y - p2.y, p3.x - p2.x) -
                     Math.atan2(p1.y - p2.y, p1.x - p2.x);
      
      let angle = Math.abs(radians * (180 / Math.PI));
      if (angle > 180) angle = 360 - angle;
      
      return Math.round(angle * 10) / 10; // Round to 1 decimal place
    } catch (error) {
      console.warn('Angle calculation error:', error);
      return 0;
    }
  }, []);

  // Enhanced pose analysis with machine learning principles
  const analyzePose = useCallback((landmarks: PoseLandmark[]): FormAnalysis | null => {
    if (!landmarks || landmarks.length < 33) return null;

    const profile = EXERCISE_PROFILES[exerciseName];
    if (!profile) return null;

    const now = performance.now();
    if (now - lastAnalysisTime.current < 33) return currentAnalysis; // 30fps limit

    try {
      const angles: Record<string, number> = {};
      const issues: string[] = [];
      const suggestions: string[] = [];
      
      // Landmark mapping for MediaPipe Pose
      const landmarkMap = {
        leftShoulder: 11, rightShoulder: 12,
        leftElbow: 13, rightElbow: 14,
        leftWrist: 15, rightWrist: 16,
        leftHip: 23, rightHip: 24,
        leftKnee: 25, rightKnee: 26,
        leftAnkle: 27, rightAnkle: 28,
        nose: 0, leftEye: 1, rightEye: 2
      };

      // Calculate visibility confidence
      const visibilitySum = landmarks.reduce((sum, l) => sum + (l.visibility || 0), 0);
      const confidence = Math.min((visibilitySum / landmarks.length) * 100, 100);
      confidenceBuffer.current.push(confidence);
      
      if (confidenceBuffer.current.length > 5) {
        confidenceBuffer.current.shift();
      }
      
      const avgConfidence = confidenceBuffer.current.reduce((a, b) => a + b, 0) / confidenceBuffer.current.length;

      // Exercise-specific analysis
      switch (exerciseName) {
        case 'Push-ups':
          // Left elbow angle
          if (landmarks[landmarkMap.leftShoulder] && landmarks[landmarkMap.leftElbow] && landmarks[landmarkMap.leftWrist]) {
            angles.leftElbow = calculateAngle(
              landmarks[landmarkMap.leftShoulder],
              landmarks[landmarkMap.leftElbow],
              landmarks[landmarkMap.leftWrist]
            );
          }

          // Right elbow angle
          if (landmarks[landmarkMap.rightShoulder] && landmarks[landmarkMap.rightElbow] && landmarks[landmarkMap.rightWrist]) {
            angles.rightElbow = calculateAngle(
              landmarks[landmarkMap.rightShoulder],
              landmarks[landmarkMap.rightElbow],
              landmarks[landmarkMap.rightWrist]
            );
          }

          // Body alignment
          if (landmarks[landmarkMap.leftShoulder] && landmarks[landmarkMap.leftHip] && landmarks[landmarkMap.leftAnkle]) {
            angles.bodyAlignment = calculateAngle(
              landmarks[landmarkMap.leftShoulder],
              landmarks[landmarkMap.leftHip],
              landmarks[landmarkMap.leftAnkle]
            );
          }
          break;

        case 'Squats':
          // Knee angles
          if (landmarks[landmarkMap.leftHip] && landmarks[landmarkMap.leftKnee] && landmarks[landmarkMap.leftAnkle]) {
            angles.leftKnee = calculateAngle(
              landmarks[landmarkMap.leftHip],
              landmarks[landmarkMap.leftKnee],
              landmarks[landmarkMap.leftAnkle]
            );
          }

          if (landmarks[landmarkMap.rightHip] && landmarks[landmarkMap.rightKnee] && landmarks[landmarkMap.rightAnkle]) {
            angles.rightKnee = calculateAngle(
              landmarks[landmarkMap.rightHip],
              landmarks[landmarkMap.rightKnee],
              landmarks[landmarkMap.rightAnkle]
            );
          }

          // Hip hinge angle
          if (landmarks[landmarkMap.leftShoulder] && landmarks[landmarkMap.leftHip] && landmarks[landmarkMap.leftKnee]) {
            angles.hipHinge = calculateAngle(
              landmarks[landmarkMap.leftShoulder],
              landmarks[landmarkMap.leftHip],
              landmarks[landmarkMap.leftKnee]
            );
          }
          break;

        case 'Burpees':
          // Plank alignment
          if (landmarks[landmarkMap.leftShoulder] && landmarks[landmarkMap.leftHip] && landmarks[landmarkMap.leftAnkle]) {
            angles.plankAlignment = calculateAngle(
              landmarks[landmarkMap.leftShoulder],
              landmarks[landmarkMap.leftHip],
              landmarks[landmarkMap.leftAnkle]
            );
          }
          break;
      }

      // Calculate precision form score
      const score = calculateFormScore(angles, profile.keyAngles, 
        Object.fromEntries(Object.entries(profile.keyAngles).map(([k, v]) => [k, v.weight]))
      );

      // Generate contextual feedback
      Object.entries(angles).forEach(([angleName, angleValue]) => {
        const range = profile.keyAngles[angleName];
        if (range) {
          if (angleValue < range.min) {
            const errorKey = Object.keys(profile.commonErrors).find(key => 
              key.toLowerCase().includes(angleName.toLowerCase())
            );
            if (errorKey) {
              suggestions.push(profile.commonErrors[errorKey]);
            }
          } else if (angleValue > range.max) {
            const errorKey = Object.keys(profile.commonErrors).find(key => 
              key.toLowerCase().includes(angleName.toLowerCase())
            );
            if (errorKey) {
              suggestions.push(profile.commonErrors[errorKey]);
            }
          }
        }
      });

      // Calculate improvement
      let improvement = 0;
      if (currentAnalysis) {
        improvement = score - currentAnalysis.score;
      }

      const analysis: FormAnalysis = {
        score: Math.round(score),
        issues,
        suggestions: [...new Set(suggestions)], // Remove duplicates
        angles,
        timestamp: now,
        perfectForm: score >= 95 && avgConfidence >= 80,
        improvement,
        confidence: Math.round(avgConfidence)
      };

      // Update history
      analysisHistory.current.push(analysis);
      if (analysisHistory.current.length > 100) {
        analysisHistory.current.shift(); // Keep only last 100 analyses
      }

      lastAnalysisTime.current = now;
      return analysis;

    } catch (error) {
      console.error('Form analysis error:', error);
      return null;
    }
  }, [exerciseName, calculateAngle, calculateFormScore, currentAnalysis]);

  // Optimized analysis with RAF throttling
  const throttledAnalysis = useRAFThrottle(analyzePose);

  // Session statistics
  const getSessionStats = useCallback(() => {
    const recent = analysisHistory.current.slice(-50); // Last 50 analyses
    if (recent.length === 0) return null;

    return {
      averageScore: Math.round(recent.reduce((sum, a) => sum + a.score, 0) / recent.length),
      perfectFormCount: recent.filter(a => a.perfectForm).length,
      improvementTrend: recent.length > 1 ? recent[recent.length - 1].score - recent[0].score : 0,
      consistency: Math.round((1 - (Math.max(...recent.map(a => a.score)) - Math.min(...recent.map(a => a.score))) / 100) * 100),
      totalAnalyses: recent.length
    };
  }, []);

  // Real-time feedback processor
  const processAnalysis = useCallback((landmarks: PoseLandmark[]) => {
    if (!isActive) return;

    const analysis = throttledAnalysis(landmarks);
    if (analysis) {
      setCurrentAnalysis(analysis);
      setHistoricalData(prev => [...prev.slice(-99), analysis]); // Keep last 100
    }
  }, [isActive, throttledAnalysis]);

  return {
    isActive,
    setIsActive,
    currentAnalysis,
    historicalData,
    processAnalysis,
    getSessionStats,
    exerciseProfile: EXERCISE_PROFILES[exerciseName] || null
  };
};