import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  Clock, 
  Dumbbell, 
  Target, 
  Timer,
  RotateCcw,
  TrendingUp,
  Star,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { UltimateFormMonitor } from '@/components/UltimateFormMonitor';

interface WorkoutsProps {
  user: any;
}

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  restTime: number;
  muscleGroups: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  videoUrl?: string;
  completed: boolean;
}

interface Workout {
  id: string;
  name: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  muscleGroups: string[];
  exercises: Exercise[];
  type: 'strength' | 'cardio' | 'flexibility' | 'full_body';
  estimated_calories: number;
}

export const Workouts: React.FC<WorkoutsProps> = ({ user }) => {
  const { toast } = useToast();
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [activeExercise, setActiveExercise] = useState(0);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [workoutTimer, setWorkoutTimer] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);

  // Sample workout data - would come from AI generation based on user profile
  const [availableWorkouts] = useState<Workout[]>([
    {
      id: '1',
      name: 'Upper Body Strength',
      duration: 45,
      difficulty: user.activityLevel as any,
      muscleGroups: ['Chest', 'Back', 'Shoulders', 'Arms'],
      type: 'strength',
      estimated_calories: 300,
      exercises: [
        {
          id: '1',
          name: 'Push-ups',
          sets: 3,
          reps: '10-15',
          restTime: 60,
          muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
          difficulty: user.activityLevel as any,
          instructions: [
            'Start in plank position with hands shoulder-width apart',
            'Lower your chest to the floor',
            'Push back up to starting position',
            'Keep your core tight throughout'
          ],
          completed: false
        },
        {
          id: '2',
          name: 'Dumbbell Rows',
          sets: 3,
          reps: '8-12',
          restTime: 90,
          muscleGroups: ['Back', 'Biceps'],
          difficulty: user.activityLevel as any,
          instructions: [
            'Bend at hips with knees slightly bent',
            'Pull dumbbells to your ribs',
            'Squeeze shoulder blades together',
            'Lower with control'
          ],
          completed: false
        },
        {
          id: '3',
          name: 'Shoulder Press',
          sets: 3,
          reps: '8-12',
          restTime: 75,
          muscleGroups: ['Shoulders', 'Triceps'],
          difficulty: user.activityLevel as any,
          instructions: [
            'Hold dumbbells at shoulder level',
            'Press up overhead until arms are straight',
            'Lower with control to starting position',
            'Keep core engaged'
          ],
          completed: false
        }
      ]
    },
    {
      id: '2',
      name: 'HIIT Cardio Blast',
      duration: 20,
      difficulty: user.activityLevel as any,
      muscleGroups: ['Full Body'],
      type: 'cardio',
      estimated_calories: 250,
      exercises: [
        {
          id: '4',
          name: 'Burpees',
          sets: 4,
          reps: '30 seconds',
          restTime: 30,
          muscleGroups: ['Full Body'],
          difficulty: user.activityLevel as any,
          instructions: [
            'Start standing, then squat down',
            'Jump back into plank position',
            'Do a push-up (optional)',
            'Jump feet back to squat, then jump up'
          ],
          completed: false
        },
        {
          id: '5',
          name: 'Mountain Climbers',
          sets: 4,
          reps: '30 seconds',
          restTime: 30,
          muscleGroups: ['Core', 'Cardio'],
          difficulty: user.activityLevel as any,
          instructions: [
            'Start in plank position',
            'Alternate bringing knees to chest rapidly',
            'Keep hips level and core tight',
            'Maintain steady rhythm'
          ],
          completed: false
        }
      ]
    }
  ]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isWorkoutActive && !isResting) {
      interval = setInterval(() => {
        setWorkoutTimer(prev => prev + 1);
      }, 1000);
    } else if (isResting && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setIsResting(false);
            toast({
              title: "Rest Complete!",
              description: "Ready for your next set?",
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isWorkoutActive, isResting, restTimer, toast]);

  const startWorkout = (workout: Workout) => {
    setCurrentWorkout(workout);
    setActiveExercise(0);
    setIsWorkoutActive(true);
    setWorkoutTimer(0);
    toast({
      title: "Workout Started!",
      description: `Let's crush this ${workout.name} session! 💪`,
    });
  };

  const completeExercise = () => {
    if (!currentWorkout) return;

    const updatedWorkout = { ...currentWorkout };
    updatedWorkout.exercises[activeExercise].completed = true;

    setCurrentWorkout(updatedWorkout);

    // Start rest timer if not the last exercise
    if (activeExercise < updatedWorkout.exercises.length - 1) {
      const restTime = updatedWorkout.exercises[activeExercise].restTime;
      setRestTimer(restTime);
      setIsResting(true);
      
      toast({
        title: "Exercise Complete!",
        description: `Rest for ${restTime} seconds`,
      });
    } else {
      // Workout complete
      completeWorkout();
    }
  };

  const nextExercise = () => {
    if (currentWorkout && activeExercise < currentWorkout.exercises.length - 1) {
      setActiveExercise(prev => prev + 1);
      setIsResting(false);
      setRestTimer(0);
    }
  };

  const completeWorkout = () => {
    setIsWorkoutActive(false);
    
    // Save workout data
    const workoutData = {
      workoutId: currentWorkout?.id,
      date: new Date(),
      duration: workoutTimer,
      completed: true,
      calories_burned: currentWorkout?.estimated_calories || 0
    };
    
    // Save to localStorage (would be API call in real app)
    const savedWorkouts = JSON.parse(localStorage.getItem('completedWorkouts') || '[]');
    savedWorkouts.push(workoutData);
    localStorage.setItem('completedWorkouts', JSON.stringify(savedWorkouts));

    toast({
      title: "Workout Complete! 🎉",
      description: `Great job! You burned ~${currentWorkout?.estimated_calories} calories in ${Math.floor(workoutTimer / 60)} minutes.`,
    });

    setCurrentWorkout(null);
  };

  const generateAIWorkout = () => {
    toast({
      title: "Generating AI Workout...",
      description: "Creating a personalized workout based on your goals and progress.",
    });

    // Simulate AI generation
    setTimeout(() => {
      const aiWorkout: Workout = {
        id: Date.now().toString(),
        name: `Personalized ${user.fitnessGoal.replace('_', ' ')} Workout`,
        duration: 35,
        difficulty: user.activityLevel as any,
        muscleGroups: ['Full Body'],
        type: 'full_body',
        estimated_calories: 280,
        exercises: [
          {
            id: 'ai1',
            name: 'Goblet Squats',
            sets: 3,
            reps: '12-15',
            restTime: 60,
            muscleGroups: ['Legs', 'Glutes'],
            difficulty: user.activityLevel as any,
            instructions: [
              'Hold dumbbell at chest level',
              'Squat down keeping chest up',
              'Drive through heels to stand',
              'Keep core engaged throughout'
            ],
            completed: false
          },
          {
            id: 'ai2',
            name: 'Plank Hold',
            sets: 3,
            reps: '30-60 seconds',
            restTime: 45,
            muscleGroups: ['Core'],
            difficulty: user.activityLevel as any,
            instructions: [
              'Start in forearm plank position',
              'Keep body in straight line',
              'Engage core and glutes',
              'Breathe normally throughout'
            ],
            completed: false
          }
        ]
      };

      setCurrentWorkout(aiWorkout);
      toast({
        title: "AI Workout Ready!",
        description: "Your personalized workout has been generated.",
      });
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getWorkoutProgress = () => {
    if (!currentWorkout) return 0;
    const completed = currentWorkout.exercises.filter(ex => ex.completed).length;
    return (completed / currentWorkout.exercises.length) * 100;
  };

  if (currentWorkout && isWorkoutActive) {
    const currentExercise = currentWorkout.exercises[activeExercise];
    
    return (
      <div className="p-6 max-w-4xl mx-auto">
        {/* Workout Header */}
        <Card className="mb-6 shadow-fitness">
          <CardHeader className="gradient-primary text-white">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl">{currentWorkout.name}</CardTitle>
                <CardDescription className="text-white/90">
                  Exercise {activeExercise + 1} of {currentWorkout.exercises.length}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{formatTime(workoutTimer)}</div>
                <div className="text-sm">Total Time</div>
              </div>
            </div>
            <Progress value={getWorkoutProgress()} className="mt-4" />
          </CardHeader>
        </Card>

        {/* Rest Timer */}
        {isResting && (
          <Card className="mb-6 border-accent bg-accent/5">
            <CardContent className="p-6 text-center">
              <Timer className="h-12 w-12 mx-auto mb-4 text-accent" />
              <h3 className="text-2xl font-bold mb-2">Rest Time</h3>
              <div className="text-4xl font-bold text-accent mb-4">{formatTime(restTimer)}</div>
              <Button variant="outline" onClick={() => setIsResting(false)}>
                Skip Rest
              </Button>
            </CardContent>
          </Card>
        )}

            {/* Enhanced Layout with Virtual Trainer */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Exercise Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Dumbbell className="h-6 w-6 text-primary" />
                    {currentExercise.name}
                  </CardTitle>
                  <div className="flex gap-2">
                    {currentExercise.muscleGroups.map(muscle => (
                      <Badge key={muscle} variant="secondary">{muscle}</Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{currentExercise.sets}</div>
                      <div className="text-sm text-muted-foreground">Sets</div>
                    </div>
                    <div className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-accent">{currentExercise.reps}</div>
                      <div className="text-sm text-muted-foreground">Reps</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Instructions:</h4>
                    <ol className="space-y-2">
                      {currentExercise.instructions.map((instruction, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={completeExercise}
                      className="flex-1 gradient-primary text-white"
                      size="lg"
                    >
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Complete Exercise
                    </Button>
                    {activeExercise < currentWorkout.exercises.length - 1 && (
                      <Button 
                        variant="outline" 
                        onClick={nextExercise}
                      >
                        Skip Exercise
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Ultimate Form Monitor */}
              <div className="lg:col-span-2">
                <UltimateFormMonitor
                  exerciseName={currentExercise.name}
                  isActive={!isResting}
                  onFormAnalysis={(analysis) => {
                    // Handle advanced form analysis feedback
                    if (analysis.perfectForm) {
                      toast({
                        title: "🏆 PERFECT FORM!",
                        description: "Incredible technique! You're absolutely crushing it!",
                      });
                    } else if (analysis.score < 60) {
                      toast({
                        title: "⚡ Form Coach Alert",
                        description: analysis.suggestions[0] || "Small adjustments will make you stronger!",
                        variant: "destructive",
                      });
                    }
                  }}
                />
              </div>
            </div>
        )}

        {/* Exercise List */}
        <Card>
          <CardHeader>
            <CardTitle>Exercise Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentWorkout.exercises.map((exercise, index) => (
                <div 
                  key={exercise.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                    index === activeExercise 
                      ? 'bg-primary/10 border border-primary/20' 
                      : exercise.completed 
                        ? 'bg-success/10 border border-success/20'
                        : 'bg-muted/30'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    exercise.completed ? 'bg-success text-white' : 
                    index === activeExercise ? 'bg-primary text-white' : 'bg-muted'
                  }`}>
                    {exercise.completed ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{exercise.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {exercise.sets} sets × {exercise.reps}
                    </div>
                  </div>
                  {index === activeExercise && (
                    <Badge variant="default">Current</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            AI Workouts
          </h1>
          <p className="text-muted-foreground mt-1">
            Personalized training plans designed for your goals
          </p>
        </div>
        <Button onClick={generateAIWorkout} className="gradient-primary text-white">
          <Zap className="h-4 w-4 mr-2" />
          Generate AI Workout
        </Button>
      </div>

      <Tabs defaultValue="workouts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workouts">Available Workouts</TabsTrigger>
          <TabsTrigger value="history">Workout History</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="workouts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableWorkouts.map((workout) => (
              <Card key={workout.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Dumbbell className="h-5 w-5 text-primary" />
                        {workout.name}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {workout.duration} min • {workout.estimated_calories} calories
                      </CardDescription>
                    </div>
                    <Badge variant={
                      workout.difficulty === 'beginner' ? 'secondary' :
                      workout.difficulty === 'intermediate' ? 'default' : 'destructive'
                    }>
                      {workout.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {workout.muscleGroups.map(muscle => (
                      <Badge key={muscle} variant="outline" className="text-xs">
                        {muscle}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Exercises ({workout.exercises.length})</div>
                    <div className="space-y-1">
                      {workout.exercises.slice(0, 3).map((exercise, index) => (
                        <div key={exercise.id} className="text-sm text-muted-foreground">
                          {index + 1}. {exercise.name} - {exercise.sets} sets
                        </div>
                      ))}
                      {workout.exercises.length > 3 && (
                        <div className="text-sm text-muted-foreground">
                          +{workout.exercises.length - 3} more exercises
                        </div>
                      )}
                    </div>
                  </div>

                  <Button 
                    onClick={() => startWorkout(workout)}
                    className="w-full gradient-primary text-white"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Workout
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Workouts</CardTitle>
              <CardDescription>Your workout history and achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Complete your first workout to see history here!</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Workouts Completed</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 mx-auto mb-2 text-accent" />
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Total Calories Burned</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Star className="h-8 w-8 mx-auto mb-2 text-nutrition" />
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Current Streak</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};