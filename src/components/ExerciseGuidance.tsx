import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Play, Pause, SkipForward, Camera, CheckCircle, AlertTriangle, Volume2, VolumeX } from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  description: string;
  instructions: string[];
  duration: number;
  reps?: number;
  sets?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  muscleGroups: string[];
  videoUrl?: string;
  formTips: string[];
}

interface FormFeedback {
  score: number;
  issues: string[];
  suggestions: string[];
  timestamp: number;
}

interface ExerciseGuidanceProps {
  userId: string;
}

export default function ExerciseGuidance({ userId }: ExerciseGuidanceProps) {
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [formFeedback, setFormFeedback] = useState<FormFeedback | null>(null);
  const [difficulty, setDifficulty] = useState(1);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [exerciseTimer, setExerciseTimer] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const sampleExercises: Exercise[] = [
    {
      id: '1',
      name: 'Push-ups',
      description: 'Classic upper body exercise targeting chest, shoulders, and triceps',
      instructions: [
        'Start in a plank position with hands slightly wider than shoulders',
        'Keep your body in a straight line from head to heels',
        'Lower your chest toward the floor by bending your elbows',
        'Push back up to the starting position',
        'Repeat for desired repetitions'
      ],
      duration: 60,
      reps: 10,
      sets: 3,
      difficulty: 'beginner',
      muscleGroups: ['chest', 'shoulders', 'triceps'],
      formTips: [
        'Keep core engaged throughout the movement',
        'Don\'t let hips sag or pike up',
        'Maintain controlled movement speed',
        'Breathe out on the push, in on the descent'
      ]
    },
    {
      id: '2',
      name: 'Squats',
      description: 'Fundamental lower body exercise for legs and glutes',
      instructions: [
        'Stand with feet shoulder-width apart',
        'Keep your chest up and core engaged',
        'Lower by pushing hips back and bending knees',
        'Descend until thighs are parallel to the floor',
        'Drive through heels to return to standing'
      ],
      duration: 45,
      reps: 12,
      sets: 3,
      difficulty: 'beginner',
      muscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
      formTips: [
        'Knees should track over toes',
        'Weight should be on heels',
        'Keep chest up and spine neutral',
        'Go only as low as mobility allows'
      ]
    },
    {
      id: '3',
      name: 'Burpees',
      description: 'High-intensity full-body exercise combining multiple movements',
      instructions: [
        'Start standing with feet shoulder-width apart',
        'Drop into a squat and place hands on the floor',
        'Jump feet back into a plank position',
        'Perform a push-up (optional)',
        'Jump feet back to squat position',
        'Explode up with a jump and arms overhead'
      ],
      duration: 30,
      reps: 8,
      sets: 3,
      difficulty: 'advanced',
      muscleGroups: ['full body'],
      formTips: [
        'Maintain good plank form',
        'Land softly when jumping',
        'Modify by stepping instead of jumping',
        'Keep movements fluid and controlled'
      ]
    }
  ];

  useEffect(() => {
    if (currentExercise && isPlaying) {
      intervalRef.current = setInterval(() => {
        setExerciseTimer(prev => prev + 1);
        setProgress(prev => {
          const newProgress = prev + (100 / currentExercise.duration);
          if (newProgress >= 100) {
            completeExercise();
            return 100;
          }
          return newProgress;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentExercise, isPlaying]);

  useEffect(() => {
    // Simulate form analysis feedback
    if (cameraEnabled && isPlaying) {
      const feedbackInterval = setInterval(() => {
        generateFormFeedback();
      }, 5000);

      return () => clearInterval(feedbackInterval);
    }
  }, [cameraEnabled, isPlaying]);

  const startExercise = (exercise: Exercise) => {
    setCurrentExercise(exercise);
    setCurrentStep(0);
    setProgress(0);
    setExerciseTimer(0);
    setFormFeedback(null);
    setIsPlaying(true);
    
    if (audioEnabled) {
      speak(`Starting ${exercise.name}. ${exercise.instructions[0]}`);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    
    if (audioEnabled) {
      speak(isPlaying ? 'Exercise paused' : 'Exercise resumed');
    }
  };

  const nextStep = () => {
    if (currentExercise && currentStep < currentExercise.instructions.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      
      if (audioEnabled) {
        speak(currentExercise.instructions[newStep]);
      }
    }
  };

  const completeExercise = () => {
    setIsPlaying(false);
    setProgress(100);
    toast.success(`Great job! You completed ${currentExercise?.name}!`);
    
    if (audioEnabled) {
      speak('Exercise completed! Great work!');
    }
  };

  const adjustDifficulty = (newDifficulty: number) => {
    setDifficulty(newDifficulty);
    
    if (currentExercise) {
      const multiplier = newDifficulty / 10;
      const adjustedReps = Math.round((currentExercise.reps || 10) * multiplier);
      
      toast.info(`Difficulty adjusted! Target: ${adjustedReps} reps`);
    }
  };

  const generateFormFeedback = () => {
    // Simulate AI form analysis
    const score = Math.random() * 100;
    const issues = [];
    const suggestions = [];

    if (score < 70) {
      issues.push('Posture needs improvement');
      suggestions.push('Keep your back straight');
    }
    if (score < 50) {
      issues.push('Range of motion is limited');
      suggestions.push('Try to go deeper into the movement');
    }
    if (score < 30) {
      issues.push('Movement speed is too fast');
      suggestions.push('Slow down and focus on control');
    }

    setFormFeedback({
      score: Math.round(score),
      issues,
      suggestions,
      timestamp: Date.now()
    });

    if (audioEnabled && issues.length > 0) {
      speak(suggestions[0]);
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getFormScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Exercise Guidance</h2>
          <p className="text-muted-foreground">AI-powered form correction and adaptive workouts</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCameraEnabled(!cameraEnabled)}
          >
            <Camera className="h-4 w-4 mr-2" />
            {cameraEnabled ? 'Disable' : 'Enable'} Camera
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAudioEnabled(!audioEnabled)}
          >
            {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {!currentExercise ? (
        /* Exercise Selection */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sampleExercises.map((exercise) => (
            <Card key={exercise.id} className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground">{exercise.name}</CardTitle>
                  <Badge className={getDifficultyColor(exercise.difficulty)}>
                    {exercise.difficulty}
                  </Badge>
                </div>
                <CardDescription>{exercise.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{exercise.reps} reps × {exercise.sets} sets</span>
                    <span>{exercise.duration}s</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {exercise.muscleGroups.map((muscle) => (
                      <Badge key={muscle} variant="outline" className="text-xs">
                        {muscle}
                      </Badge>
                    ))}
                  </div>
                  <Button 
                    onClick={() => startExercise(exercise)}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Exercise
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Active Exercise */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Exercise Instructions */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground">{currentExercise.name}</CardTitle>
                  <Badge className={getDifficultyColor(currentExercise.difficulty)}>
                    {currentExercise.difficulty}
                  </Badge>
                </div>
                <CardDescription>{currentExercise.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Timer and Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-sm font-medium text-foreground">
                      {formatTime(exerciseTimer)} / {formatTime(currentExercise.duration)}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Exercise Controls */}
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={togglePlayPause}
                    className="px-8"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={nextStep}
                    disabled={currentStep >= currentExercise.instructions.length - 1}
                  >
                    <SkipForward className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentExercise(null)}
                  >
                    Stop
                  </Button>
                </div>

                {/* Current Instruction */}
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h4 className="font-semibold text-foreground mb-2">
                    Step {currentStep + 1} of {currentExercise.instructions.length}
                  </h4>
                  <p className="text-foreground">{currentExercise.instructions[currentStep]}</p>
                </div>

                {/* All Instructions */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Complete Instructions:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                    {currentExercise.instructions.map((instruction, index) => (
                      <li 
                        key={index} 
                        className={index === currentStep ? 'text-primary font-medium' : ''}
                      >
                        {instruction}
                      </li>
                    ))}
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form Feedback & Controls */}
          <div className="space-y-4">
            {/* Form Analysis */}
            {cameraEnabled && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <Camera className="h-5 w-5 mr-2" />
                    Form Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {formFeedback ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Form Score</span>
                        <span className={`text-2xl font-bold ${getFormScoreColor(formFeedback.score)}`}>
                          {formFeedback.score}%
                        </span>
                      </div>
                      <Progress value={formFeedback.score} className="h-2" />
                      
                      {formFeedback.issues.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="font-medium text-foreground flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-1 text-yellow-500" />
                            Issues Detected
                          </h5>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {formFeedback.issues.map((issue, index) => (
                              <li key={index}>• {issue}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {formFeedback.suggestions.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="font-medium text-foreground flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                            Suggestions
                          </h5>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {formFeedback.suggestions.map((suggestion, index) => (
                              <li key={index}>• {suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-4">
                      <Camera className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Analyzing your form...</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Difficulty Adjustment */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Difficulty Adjustment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Intensity</span>
                    <span className="text-sm font-medium text-foreground">{difficulty}/10</span>
                  </div>
                  <Slider
                    value={[difficulty]}
                    onValueChange={(value) => adjustDifficulty(value[0])}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Target: {Math.round((currentExercise.reps || 10) * (difficulty / 10))} reps</p>
                </div>
              </CardContent>
            </Card>

            {/* Form Tips */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Form Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {currentExercise.formTips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}