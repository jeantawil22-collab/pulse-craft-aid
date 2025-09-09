import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
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
  Target,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useFormMonitoring } from '@/hooks/useFormMonitoring';
import { usePerformanceMonitor } from '@/hooks/usePerformance';
import { VirtualTrainer } from './VirtualTrainer';

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

interface UltimateFormMonitorProps {
  exerciseName: string;
  isActive: boolean;
  onFormAnalysis: (analysis: FormAnalysis) => void;
}

export const UltimateFormMonitor: React.FC<UltimateFormMonitorProps> = ({
  exerciseName,
  isActive: parentIsActive,
  onFormAnalysis
}) => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const poseRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Enhanced form monitoring hook
  const {
    isActive,
    setIsActive,
    currentAnalysis,
    processAnalysis,
    getSessionStats
  } = useFormMonitoring(exerciseName);

  // Performance monitoring
  const performanceMetrics = usePerformanceMonitor();

  // Optimized states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<'motivational' | 'zen' | 'scientific'>('motivational');

  // Sync with parent active state
  useEffect(() => {
    setIsActive(parentIsActive);
  }, [parentIsActive, setIsActive]);

  // Optimized camera initialization
  const initializeCamera = useCallback(async () => {
    if (!videoRef.current) return false;
    
    setIsLoading(true);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, frameRate: 30 },
        audio: false
      });
      
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      
      await new Promise((resolve) => {
        if (videoRef.current) {
          videoRef.current.onloadedmetadata = () => resolve(void 0);
        }
      });

      return true;
    } catch (error) {
      console.error('Camera access failed:', error);
      toast({
        title: "Camera Access Failed",
        description: "Please allow camera access for form monitoring",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Start monitoring
  const startMonitoring = useCallback(async () => {
    setIsLoading(true);
    
    const cameraReady = await initializeCamera();
    if (cameraReady) {
      setIsCameraActive(true);
    }
    
    setIsLoading(false);
  }, [initializeCamera]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setIsCameraActive(false);
  }, []);

  // Enhanced AI voice feedback
  const speakFeedback = useCallback((text: string) => {
    if (!audioEnabled || !text) return;

    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.warn('Speech synthesis failed:', error);
    }
  }, [audioEnabled]);

  // Process analysis updates
  useEffect(() => {
    if (currentAnalysis) {
      onFormAnalysis(currentAnalysis);
    }
  }, [currentAnalysis, onFormAnalysis]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopMonitoring();
      speechSynthesis.cancel();
    };
  }, [stopMonitoring]);

  // Session statistics
  const sessionStats = useMemo(() => getSessionStats(), [getSessionStats]);

  return (
    <div className="w-full space-y-6">
      {/* Main monitoring card */}
      <Card className="shadow-fitness">
        <CardHeader className="gradient-primary text-white">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-3">
                <Target className="h-6 w-6" />
                Ultimate Form Monitor
              </CardTitle>
              <div className="text-white/90 text-sm">
                {exerciseName} Analysis
              </div>
            </div>
            <div className="flex items-center gap-2">
              {performanceMetrics.isLowPerformance && (
                <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-200">
                  Performance Mode
                </Badge>
              )}
              <Badge variant="secondary" className="bg-white/20 text-white">
                {performanceMetrics.fps} FPS
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
            <div className="flex gap-2">
              {!isCameraActive ? (
                <Button
                  onClick={startMonitoring}
                  disabled={isLoading}
                  className="gradient-primary text-white"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white mr-2"></div>
                  ) : (
                    <Camera className="h-4 w-4 mr-2" />
                  )}
                  {isLoading ? 'Starting...' : 'Start Form Monitor'}
                </Button>
              ) : (
                <Button onClick={stopMonitoring} variant="destructive">
                  <CameraOff className="h-4 w-4 mr-2" />
                  Stop Monitor
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAudioEnabled(!audioEnabled)}
              >
                {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOverlay(!showOverlay)}
              >
                {showOverlay ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </div>

            {/* Trainer selection */}
            <div className="flex gap-2">
              {(['motivational', 'zen', 'scientific'] as const).map((persona) => (
                <Button
                  key={persona}
                  variant={selectedTrainer === persona ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTrainer(persona)}
                >
                  {persona.charAt(0).toUpperCase() + persona.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Video feed */}
          <div className="relative rounded-lg overflow-hidden bg-gray-900 mb-6">
            <video
              ref={videoRef}
              className="w-full h-auto max-h-96 object-cover"
              autoPlay
              playsInline
              muted
            />
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
              style={{ display: showOverlay ? 'block' : 'none' }}
            />
            
            {!isCameraActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Camera Not Active</p>
                  <p className="text-sm opacity-75">Click "Start Form Monitor" to begin</p>
                </div>
              </div>
            )}

            {isCameraActive && (
              <div className="absolute top-4 right-4 flex gap-2">
                <Badge variant="secondary" className="bg-success/90 text-white">
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                  Live
                </Badge>
                <Badge variant="secondary" className="bg-primary/90 text-white">
                  <Zap className="h-3 w-3 mr-1" />
                  AI Active
                </Badge>
              </div>
            )}
          </div>

          {/* Current analysis */}
          {currentAnalysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Card className={`border-2 ${
                currentAnalysis.perfectForm ? 'border-success bg-success/5' :
                currentAnalysis.score >= 80 ? 'border-primary bg-primary/5' :
                currentAnalysis.score >= 60 ? 'border-warning bg-warning/5' :
                'border-destructive bg-destructive/5'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {currentAnalysis.perfectForm ? (
                        <Trophy className="h-5 w-5 text-success" />
                      ) : currentAnalysis.score >= 80 ? (
                        <CheckCircle className="h-5 w-5 text-primary" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-warning" />
                      )}
                      <span className="font-semibold">
                        Form Score: {currentAnalysis.score}%
                      </span>
                    </div>
                    <Badge variant="outline">
                      Confidence: {currentAnalysis.confidence}%
                    </Badge>
                  </div>
                  
                  <Progress value={currentAnalysis.score} className="mb-3" />
                  
                  {currentAnalysis.suggestions.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Suggestions:</p>
                      {currentAnalysis.suggestions.map((suggestion, index) => (
                        <p key={index} className="text-sm text-muted-foreground">
                          • {suggestion}
                        </p>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Session statistics */}
          {sessionStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{sessionStats.averageScore}%</div>
                <div className="text-sm text-muted-foreground">Average Score</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-success">{sessionStats.perfectFormCount}</div>
                <div className="text-sm text-muted-foreground">Perfect Reps</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-accent">{sessionStats.consistency}%</div>
                <div className="text-sm text-muted-foreground">Consistency</div>
              </Card>
              <Card className="p-4 text-center">
                <div className="text-2xl font-bold text-info">{sessionStats.totalAnalyses}</div>
                <div className="text-sm text-muted-foreground">Total Reps</div>
              </Card>
            </div>
          )}

          {/* Virtual Trainer Integration */}
          {currentAnalysis && isCameraActive && (
            <VirtualTrainer
              trainerPersona={selectedTrainer}
              currentExercise={exerciseName}
              formScore={currentAnalysis.score}
              isActive={isActive}
              onSpeak={speakFeedback}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};