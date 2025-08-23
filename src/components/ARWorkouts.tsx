import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Eye, 
  Camera, 
  Target, 
  Zap,
  Trophy,
  Clock,
  Dumbbell,
  Activity,
  Volume2,
  VolumeX,
  RotateCcw,
  Settings,
  Smartphone,
  Glasses,
  Play,
  Pause,
  SkipForward,
  CheckCircle
} from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  height: number;
  weight: number;
  age: number;
  gender: 'male' | 'female' | 'other';
  fitnessGoal: 'weight_loss' | 'muscle_gain' | 'general_fitness' | 'performance';
}

interface ARWorkoutsProps {
  user: UserProfile;
}

const ARWorkouts: React.FC<ARWorkoutsProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('experiences');
  const [isInARMode, setIsInARMode] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);

  const arExperiences = [
    {
      id: 1,
      title: "Form Perfect Push-ups",
      description: "AI analyzes your form in real-time and provides instant feedback",
      duration: 15,
      difficulty: "Beginner",
      category: "Form Training",
      exercises: 3,
      rating: 4.9,
      features: ["Real-time Form Analysis", "3D Movement Tracking", "Voice Guidance"]
    },
    {
      id: 2,
      title: "Virtual Boxing Trainer",
      description: "Shadow box with virtual targets and perfect your technique",
      duration: 30,
      difficulty: "Intermediate",
      category: "Cardio",
      exercises: 8,
      rating: 4.8,
      features: ["Virtual Targets", "Punch Tracking", "Combo Analysis"]
    },
    {
      id: 3,
      title: "Yoga Flow Studio",
      description: "Follow along with AR yoga instructor in any environment",
      duration: 45,
      difficulty: "All Levels",
      category: "Flexibility",
      exercises: 12,
      rating: 4.7,
      features: ["AR Instructor", "Pose Correction", "Ambient Environment"]
    },
    {
      id: 4,
      title: "Strength Form Check",
      description: "Perfect your lifting form with computer vision analysis",
      duration: 25,
      difficulty: "Advanced",
      category: "Strength",
      exercises: 6,
      rating: 4.9,
      features: ["Lift Path Analysis", "Range of Motion Check", "Safety Alerts"]
    }
  ];

  const workoutSteps = [
    { exercise: "Push-ups", reps: 10, completed: true },
    { exercise: "Squats", reps: 15, completed: true },
    { exercise: "Planks", duration: "30s", completed: false },
    { exercise: "Mountain Climbers", reps: 20, completed: false }
  ];

  const formMetrics = {
    accuracy: 92,
    consistency: 87,
    tempo: "Good",
    rangeOfMotion: 95
  };

  const startARExperience = (experienceId: number) => {
    setIsInARMode(true);
    setIsWorkoutActive(true);
  };

  const exitARMode = () => {
    setIsInARMode(false);
    setIsWorkoutActive(false);
  };

  const nextExercise = () => {
    if (currentExercise < workoutSteps.length - 1) {
      setCurrentExercise(currentExercise + 1);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-success/10 text-success';
      case 'Intermediate': return 'bg-warning/10 text-warning';
      case 'Advanced': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Form Training': return 'bg-primary/10 text-primary';
      case 'Cardio': return 'bg-accent/10 text-accent';
      case 'Flexibility': return 'bg-nutrition/10 text-nutrition';
      case 'Strength': return 'bg-progress/10 text-progress';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (isInARMode) {
    return (
      <div className="h-screen bg-black relative overflow-hidden">
        {/* AR Camera View */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
          <div className="text-center text-white">
            <Eye className="h-32 w-32 mx-auto mb-4 opacity-50" />
            <h2 className="text-4xl font-bold mb-2">AR Mode Active</h2>
            <p className="text-xl opacity-80">Position yourself in the camera view</p>
          </div>
        </div>

        {/* Form Analysis Overlay */}
        <div className="absolute top-4 left-4 bg-black/80 rounded-lg p-4 text-white">
          <h3 className="font-semibold mb-2">Form Analysis</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Accuracy:</span>
              <span className="text-success">{formMetrics.accuracy}%</span>
            </div>
            <div className="flex justify-between">
              <span>Consistency:</span>
              <span className="text-warning">{formMetrics.consistency}%</span>
            </div>
            <div className="flex justify-between">
              <span>Tempo:</span>
              <span className="text-primary">{formMetrics.tempo}</span>
            </div>
            <div className="flex justify-between">
              <span>ROM:</span>
              <span className="text-success">{formMetrics.rangeOfMotion}%</span>
            </div>
          </div>
        </div>

        {/* Current Exercise Info */}
        <div className="absolute top-4 right-4 bg-black/80 rounded-lg p-4 text-white text-center">
          <h3 className="font-semibold mb-1">Current Exercise</h3>
          <p className="text-2xl font-bold mb-1">{workoutSteps[currentExercise]?.exercise}</p>
          <p className="text-accent">
            {workoutSteps[currentExercise]?.reps || workoutSteps[currentExercise]?.duration}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-80">
          <Progress 
            value={(currentExercise / workoutSteps.length) * 100} 
            className="h-2"
          />
          <p className="text-center text-white text-sm mt-2">
            Exercise {currentExercise + 1} of {workoutSteps.length}
          </p>
        </div>

        {/* Real-time Feedback */}
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 bg-primary/90 rounded-lg px-6 py-3 text-white text-center">
          <p className="font-semibold">Great form! Keep your core engaged.</p>
        </div>

        {/* Control Panel */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black/80 rounded-full px-6 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full ${audioEnabled ? 'text-white' : 'text-red-500'}`}
            onClick={() => setAudioEnabled(!audioEnabled)}
          >
            {audioEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-white"
            onClick={() => setIsWorkoutActive(!isWorkoutActive)}
          >
            {isWorkoutActive ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-white"
            onClick={nextExercise}
          >
            <SkipForward className="h-5 w-5" />
          </Button>

          <Button
            variant="destructive"
            onClick={exitARMode}
            className="px-6"
          >
            Exit AR
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-white"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        {/* Exercise Steps Sidebar */}
        <div className="absolute left-4 bottom-20 w-80 bg-black/80 rounded-lg p-4 text-white">
          <h4 className="font-semibold mb-3">Workout Progress</h4>
          <div className="space-y-2">
            {workoutSteps.map((step, index) => (
              <div 
                key={index}
                className={`flex items-center gap-3 p-2 rounded ${
                  index === currentExercise ? 'bg-primary/30' : ''
                }`}
              >
                {step.completed ? (
                  <CheckCircle className="h-5 w-5 text-success" />
                ) : (
                  <div className={`w-5 h-5 rounded-full border-2 ${
                    index === currentExercise ? 'border-primary' : 'border-gray-500'
                  }`} />
                )}
                <div className="flex-1">
                  <p className="font-medium">{step.exercise}</p>
                  <p className="text-sm text-gray-300">
                    {step.reps || step.duration}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
          AR Fitness Studio
        </h1>
        <p className="text-muted-foreground mt-1">
          Immersive augmented reality workouts with real-time form analysis
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="experiences">AR Experiences</TabsTrigger>
          <TabsTrigger value="form-analysis">Form Analysis</TabsTrigger>
          <TabsTrigger value="virtual-trainer">Virtual Trainer</TabsTrigger>
          <TabsTrigger value="setup">Setup</TabsTrigger>
        </TabsList>

        <TabsContent value="experiences" className="space-y-6">
          <Card className="gradient-primary text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-6 w-6" />
                Immersive Fitness Experiences
              </CardTitle>
              <CardDescription className="text-white/80">
                Step into the future of fitness with AR-powered workouts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="secondary" className="text-black">
                  <Camera className="h-4 w-4 mr-2" />
                  Quick Start AR
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  <Settings className="h-4 w-4 mr-2" />
                  Calibrate Camera
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {arExperiences.map((experience) => (
              <Card key={experience.id} className="shadow-fitness hover:shadow-glow transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={getCategoryColor(experience.category)}>
                      {experience.category}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">{experience.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{experience.title}</CardTitle>
                  <CardDescription>{experience.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{experience.duration} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Dumbbell className="h-4 w-4" />
                      <span>{experience.exercises} exercises</span>
                    </div>
                  </div>

                  <Badge className={getDifficultyColor(experience.difficulty)}>
                    {experience.difficulty}
                  </Badge>

                  <div>
                    <h4 className="font-medium mb-2">AR Features:</h4>
                    <div className="space-y-1">
                      {experience.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Zap className="h-3 w-3 text-accent" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className="w-full gradient-primary"
                    onClick={() => startARExperience(experience.id)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Start AR Experience
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="form-analysis" className="space-y-6">
          <Card className="shadow-fitness">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                AI Form Analysis
              </CardTitle>
              <CardDescription>
                Get real-time feedback on your exercise form using computer vision
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Latest Session Metrics</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Form Accuracy</span>
                        <span>{formMetrics.accuracy}%</span>
                      </div>
                      <Progress value={formMetrics.accuracy} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Consistency</span>
                        <span>{formMetrics.consistency}%</span>
                      </div>
                      <Progress value={formMetrics.consistency} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Range of Motion</span>
                        <span>{formMetrics.rangeOfMotion}%</span>
                      </div>
                      <Progress value={formMetrics.rangeOfMotion} />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Form Insights</h3>
                  <div className="space-y-2">
                    <div className="p-3 bg-success/10 rounded-lg">
                      <p className="text-sm text-success font-medium">✓ Excellent squat depth</p>
                    </div>
                    <div className="p-3 bg-warning/10 rounded-lg">
                      <p className="text-sm text-warning font-medium">⚠ Keep knees aligned</p>
                    </div>
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <p className="text-sm text-primary font-medium">💡 Focus on tempo consistency</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="virtual-trainer" className="space-y-6">
          <Card className="gradient-accent text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-6 w-6" />
                Virtual AI Trainer
              </CardTitle>
              <CardDescription className="text-white/80">
                Your personal AR fitness coach with real-time guidance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Trainer Features</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-white" />
                      <span>Real-time form corrections</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-white" />
                      <span>Adaptive workout intensity</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-white" />
                      <span>Motivational coaching</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-white" />
                      <span>Progress tracking</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Personalization</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Fitness Level:</span>
                      <span>Intermediate</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Primary Goal:</span>
                      <span>{user.fitnessGoal.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Voice Coach:</span>
                      <span>Alex (Motivational)</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Coaching Style:</span>
                      <span>Encouraging</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="setup" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="shadow-fitness">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-primary" />
                  Device Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Camera Access</span>
                    <CheckCircle className="h-4 w-4 text-success" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Motion Tracking</span>
                    <CheckCircle className="h-4 w-4 text-success" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>AR Support</span>
                    <CheckCircle className="h-4 w-4 text-success" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Sufficient Lighting</span>
                    <CheckCircle className="h-4 w-4 text-warning" />
                  </div>
                </div>
                
                <Button className="w-full gradient-primary">
                  <Camera className="h-4 w-4 mr-2" />
                  Test Camera Setup
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-fitness">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  AR Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Tracking Sensitivity</span>
                    <Badge variant="outline">High</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Voice Feedback</span>
                    <Badge variant="outline">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Visual Cues</span>
                    <Badge variant="outline">Enhanced</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Performance Mode</span>
                    <Badge variant="outline">Balanced</Badge>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Calibrate AR Space
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="gradient-progress text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Glasses className="h-5 w-5" />
                Pro Tip: Optimal AR Setup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>• Position yourself 6-8 feet from your device</p>
                <p>• Ensure good lighting (avoid backlighting)</p>
                <p>• Wear contrasting colors for better tracking</p>
                <p>• Clear 8x8 feet of workout space</p>
                <p>• Keep the camera at chest height</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ARWorkouts;