import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Camera, 
  CameraOff, 
  AlertTriangle, 
  CheckCircle, 
  Volume2,
  VolumeX,
  Eye,
  EyeOff
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
}

interface FormMonitoringCameraProps {
  exerciseName: string;
  isActive: boolean;
  onFormAnalysis: (analysis: FormAnalysis) => void;
}

// Exercise-specific form validation rules
const EXERCISE_FORM_RULES = {
  'Push-ups': {
    requiredAngles: {
      elbowAngle: { min: 45, max: 90, ideal: 70 },
      backAngle: { min: 170, max: 180, ideal: 180 },
      hipAngle: { min: 170, max: 180, ideal: 180 }
    },
    keyPoints: ['leftElbow', 'rightElbow', 'leftShoulder', 'rightShoulder', 'leftHip', 'rightHip'],
    commonIssues: {
      lowBack: 'Keep your back straight - avoid sagging hips',
      wideElbows: 'Keep elbows closer to your body',
      partialRange: 'Go lower - chest should almost touch the floor'
    }
  },
  'Squats': {
    requiredAngles: {
      kneeAngle: { min: 70, max: 90, ideal: 90 },
      hipAngle: { min: 70, max: 110, ideal: 90 },
      ankleAngle: { min: 70, max: 110, ideal: 90 }
    },
    keyPoints: ['leftKnee', 'rightKnee', 'leftHip', 'rightHip', 'leftAnkle', 'rightAnkle'],
    commonIssues: {
      kneeValgus: 'Keep knees aligned with toes',
      forwardLean: 'Keep chest up and maintain upright torso',
      partialDepth: 'Go deeper - thighs should be parallel to floor'
    }
  },
  'Burpees': {
    requiredAngles: {
      plankAngle: { min: 170, max: 180, ideal: 180 },
      jumpAngle: { min: 160, max: 180, ideal: 180 }
    },
    keyPoints: ['leftShoulder', 'rightShoulder', 'leftHip', 'rightHip', 'leftKnee', 'rightKnee'],
    commonIssues: {
      plankForm: 'Maintain straight line in plank position',
      softLanding: 'Land softly on your feet',
      rushingMovement: 'Control each phase of the movement'
    }
  }
};

export const FormMonitoringCamera: React.FC<FormMonitoringCameraProps> = ({
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

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<FormAnalysis | null>(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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

  // Analyze pose based on exercise type
  const analyzePose = useCallback((landmarks: PoseLandmark[]) => {
    if (!landmarks || landmarks.length === 0) return null;

    const exerciseRules = EXERCISE_FORM_RULES[exerciseName as keyof typeof EXERCISE_FORM_RULES];
    if (!exerciseRules) return null;

    const analysis: FormAnalysis = {
      score: 100,
      issues: [],
      suggestions: [],
      angles: {},
      timestamp: Date.now()
    };

    try {
      // Map landmark indices (MediaPipe Pose landmark model)
      const landmarkMap = {
        leftShoulder: 11,
        rightShoulder: 12,
        leftElbow: 13,
        rightElbow: 14,
        leftWrist: 15,
        rightWrist: 16,
        leftHip: 23,
        rightHip: 24,
        leftKnee: 25,
        rightKnee: 26,
        leftAnkle: 27,
        rightAnkle: 28
      };

      // Exercise-specific analysis
      switch (exerciseName) {
        case 'Push-ups':
          // Calculate elbow angle
          if (landmarks[landmarkMap.leftShoulder] && landmarks[landmarkMap.leftElbow] && landmarks[landmarkMap.leftWrist]) {
            const leftElbowAngle = calculateAngle(
              landmarks[landmarkMap.leftShoulder],
              landmarks[landmarkMap.leftElbow],
              landmarks[landmarkMap.leftWrist]
            );
            analysis.angles.leftElbow = leftElbowAngle;

            if (leftElbowAngle < 45) {
              analysis.score -= 20;
              analysis.issues.push('Elbows flaring too wide');
              analysis.suggestions.push('Keep elbows closer to your body');
            }
          }

          // Check body alignment
          if (landmarks[landmarkMap.leftShoulder] && landmarks[landmarkMap.leftHip] && landmarks[landmarkMap.leftAnkle]) {
            const bodyAngle = calculateAngle(
              landmarks[landmarkMap.leftShoulder],
              landmarks[landmarkMap.leftHip],
              landmarks[landmarkMap.leftAnkle]
            );
            analysis.angles.bodyAlignment = bodyAngle;

            if (bodyAngle < 170) {
              analysis.score -= 25;
              analysis.issues.push('Body not in straight line');
              analysis.suggestions.push('Keep your body straight from head to heels');
            }
          }
          break;

        case 'Squats':
          // Calculate knee angle
          if (landmarks[landmarkMap.leftHip] && landmarks[landmarkMap.leftKnee] && landmarks[landmarkMap.leftAnkle]) {
            const leftKneeAngle = calculateAngle(
              landmarks[landmarkMap.leftHip],
              landmarks[landmarkMap.leftKnee],
              landmarks[landmarkMap.leftAnkle]
            );
            analysis.angles.leftKnee = leftKneeAngle;

            if (leftKneeAngle > 110) {
              analysis.score -= 20;
              analysis.issues.push('Not squatting deep enough');
              analysis.suggestions.push('Go deeper - thighs should be parallel to floor');
            }
          }

          // Check knee alignment
          const leftKnee = landmarks[landmarkMap.leftKnee];
          const leftAnkle = landmarks[landmarkMap.leftAnkle];
          if (leftKnee && leftAnkle) {
            const kneeAlignment = Math.abs(leftKnee.x - leftAnkle.x);
            if (kneeAlignment > 0.05) {
              analysis.score -= 15;
              analysis.issues.push('Knees caving inward');
              analysis.suggestions.push('Keep knees aligned with your toes');
            }
          }
          break;

        case 'Burpees':
          // Check plank position during burpee
          if (landmarks[landmarkMap.leftShoulder] && landmarks[landmarkMap.leftHip] && landmarks[landmarkMap.leftAnkle]) {
            const plankAngle = calculateAngle(
              landmarks[landmarkMap.leftShoulder],
              landmarks[landmarkMap.leftHip],
              landmarks[landmarkMap.leftAnkle]
            );
            analysis.angles.plankAlignment = plankAngle;

            if (plankAngle < 170) {
              analysis.score -= 20;
              analysis.issues.push('Poor plank form');
              analysis.suggestions.push('Keep body straight in plank position');
            }
          }
          break;
      }

      // Ensure score doesn't go below 0
      analysis.score = Math.max(0, analysis.score);

      return analysis;
    } catch (error) {
      console.error('Error analyzing pose:', error);
      return null;
    }
  }, [exerciseName, calculateAngle]);

  // Play audio feedback
  const playAudioFeedback = useCallback((type: 'correct' | 'incorrect') => {
    if (!audioEnabled || !audioContextRef.current) return;

    // Throttle audio feedback to avoid spam
    const now = Date.now();
    if (now - lastFeedbackTimeRef.current < 3000) return;
    lastFeedbackTimeRef.current = now;

    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      if (type === 'correct') {
        // Success sound - pleasant tone
        oscillator.frequency.setValueAtTime(600, audioContextRef.current.currentTime);
        oscillator.frequency.setValueAtTime(800, audioContextRef.current.currentTime + 0.1);
      } else {
        // Error sound - lower, warning tone
        oscillator.frequency.setValueAtTime(300, audioContextRef.current.currentTime);
        oscillator.frequency.setValueAtTime(250, audioContextRef.current.currentTime + 0.1);
      }

      gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.3);

      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + 0.3);
    } catch (error) {
      console.error('Error playing audio feedback:', error);
    }
  }, [audioEnabled]);

  // Handle pose detection results
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
      // Draw pose landmarks and connections
      if (window.drawConnectors && window.drawLandmarks && window.POSE_CONNECTIONS) {
        window.drawConnectors(ctx, results.poseLandmarks, window.POSE_CONNECTIONS, {
          color: 'rgba(0, 255, 255, 0.3)',
          lineWidth: 2
        });
        window.drawLandmarks(ctx, results.poseLandmarks, {
          color: 'rgba(255, 0, 255, 0.3)',
          lineWidth: 1,
          radius: 3
        });
      }

      // Analyze pose if active
      if (isActive && isAnalyzing) {
        const analysis = analyzePose(results.poseLandmarks);
        if (analysis) {
          setCurrentAnalysis(analysis);
          onFormAnalysis(analysis);

          // Provide audio feedback
          if (analysis.score < 70 && analysis.suggestions.length > 0) {
            playAudioFeedback('incorrect');
          } else if (analysis.score >= 85) {
            playAudioFeedback('correct');
          }
        }
      }
    }
  }, [isActive, isAnalyzing, showOverlay, analyzePose, onFormAnalysis, playAudioFeedback]);

  // Load MediaPipe Pose
  const loadPose = useCallback(async () => {
    setIsLoading(true);
    try {
      // Load MediaPipe scripts dynamically
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

      // Initialize pose detection
      if (window.Pose) {
        poseRef.current = new window.Pose({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
        });

        poseRef.current.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          enableSegmentation: false,
          smoothSegmentation: false,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
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

  // Start camera
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

        // Initialize audio context
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        toast({
          title: "Camera Started",
          description: "Form monitoring is now active",
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
  }, [loadPose, toast]);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }
    setIsCameraActive(false);
    setIsAnalyzing(false);
    setCurrentAnalysis(null);

    toast({
      title: "Camera Stopped",
      description: "Form monitoring has been disabled",
    });
  }, [toast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Auto-start analysis when camera is active and exercise is active
  useEffect(() => {
    if (isCameraActive && isActive) {
      setIsAnalyzing(true);
    } else {
      setIsAnalyzing(false);
    }
  }, [isCameraActive, isActive]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Form Monitoring
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAudioEnabled(!audioEnabled)}
              disabled={!isCameraActive}
            >
              {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowOverlay(!showOverlay)}
              disabled={!isCameraActive}
            >
              {showOverlay ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Camera Controls */}
        <div className="flex justify-center">
          {!isCameraActive ? (
            <Button 
              onClick={startCamera} 
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              <Camera className="h-4 w-4 mr-2" />
              {isLoading ? 'Loading...' : 'Start Camera'}
            </Button>
          ) : (
            <Button 
              onClick={stopCamera}
              variant="outline"
            >
              <CameraOff className="h-4 w-4 mr-2" />
              Stop Camera
            </Button>
          )}
        </div>

        {/* Camera Feed */}
        {isCameraActive && (
          <div className="relative bg-black rounded-lg overflow-hidden">
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
              className="w-full h-auto"
            />
            
            {/* Status Indicators */}
            <div className="absolute top-2 left-2 flex gap-2">
              <Badge variant={isCameraActive ? "default" : "secondary"}>
                Camera: {isCameraActive ? 'ON' : 'OFF'}
              </Badge>
              <Badge variant={isAnalyzing ? "default" : "secondary"}>
                Analysis: {isAnalyzing ? 'ON' : 'OFF'}
              </Badge>
            </div>

            {/* Exercise Name */}
            <div className="absolute top-2 right-2">
              <Badge variant="outline" className="bg-black/50 text-white">
                {exerciseName}
              </Badge>
            </div>
          </div>
        )}

        {/* Form Analysis Results */}
        {currentAnalysis && isAnalyzing && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Form Score</span>
              <span className={`text-2xl font-bold ${
                currentAnalysis.score >= 80 ? 'text-green-500' : 
                currentAnalysis.score >= 60 ? 'text-yellow-500' : 'text-red-500'
              }`}>
                {currentAnalysis.score}%
              </span>
            </div>
            <Progress value={currentAnalysis.score} className="h-2" />

            {currentAnalysis.issues.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-medium flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  Issues Detected
                </h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {currentAnalysis.issues.map((issue, index) => (
                    <li key={index} className="text-red-600">• {issue}</li>
                  ))}
                </ul>
              </div>
            )}

            {currentAnalysis.suggestions.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-medium flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Suggestions
                </h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {currentAnalysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-blue-600">• {suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};