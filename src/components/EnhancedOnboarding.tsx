import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Target, 
  Activity, 
  Apple, 
  Trophy, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle,
  Sparkles,
  Heart
} from 'lucide-react';
import { useAccessibility } from '@/hooks/useAccessibility';

interface OnboardingProps {
  onComplete: (userData: any) => void;
}

interface StepData {
  personal: {
    name: string;
    age: string;
    height: string;
    weight: string;
    gender: string;
  };
  goals: {
    primary: string;
    target: string;
    timeline: string;
  };
  activity: {
    level: string;
    workoutDays: string[];
    duration: string;
  };
  nutrition: {
    diet: string;
    allergies: string[];
    restrictions: string[];
  };
  preferences: {
    notifications: boolean;
    tracking: string[];
    units: string;
  };
}

const steps = [
  {
    id: 'personal',
    title: 'Personal Information',
    description: 'Tell us about yourself',
    icon: User,
    fields: ['name', 'age', 'height', 'weight', 'gender']
  },
  {
    id: 'goals',
    title: 'Fitness Goals',
    description: 'What do you want to achieve?',
    icon: Target,
    fields: ['primary', 'target', 'timeline']
  },
  {
    id: 'activity',
    title: 'Activity Level',
    description: 'How active are you currently?',
    icon: Activity,
    fields: ['level', 'workoutDays', 'duration']
  },
  {
    id: 'nutrition',
    title: 'Nutrition Preferences',
    description: 'Dietary preferences and restrictions',
    icon: Apple,
    fields: ['diet', 'allergies', 'restrictions']
  },
  {
    id: 'preferences',
    title: 'App Preferences',
    description: 'Customize your experience',
    icon: Trophy,
    fields: ['notifications', 'tracking', 'units']
  }
];

export const EnhancedOnboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<StepData>({
    personal: { name: '', age: '', height: '', weight: '', gender: '' },
    goals: { primary: '', target: '', timeline: '' },
    activity: { level: '', workoutDays: [], duration: '' },
    nutrition: { diet: '', allergies: [], restrictions: [] },
    preferences: { notifications: true, tracking: [], units: 'metric' }
  });

  const { announceToScreenReader, playAudioFeedback } = useAccessibility();

  const progress = ((currentStep + 1) / steps.length) * 100;

  const updateFormData = useCallback((stepId: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [stepId]: {
        ...prev[stepId as keyof StepData],
        [field]: value
      }
    }));
  }, []);

  const validateStep = useCallback((stepIndex: number) => {
    const step = steps[stepIndex];
    const stepData = formData[step.id as keyof StepData];
    
    return step.fields.every(field => {
      const value = (stepData as any)[field];
      if (Array.isArray(value)) return value.length > 0;
      return value && value.toString().trim() !== '';
    });
  }, [formData]);

  const nextStep = useCallback(() => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      announceToScreenReader(`Step ${currentStep + 2} of ${steps.length}: ${steps[currentStep + 1].title}`);
      playAudioFeedback('info');
    }
  }, [currentStep, announceToScreenReader, playAudioFeedback]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      announceToScreenReader(`Step ${currentStep} of ${steps.length}: ${steps[currentStep - 1].title}`);
    }
  }, [currentStep, announceToScreenReader]);

  const completeOnboarding = useCallback(() => {
    const userData = {
      name: formData.personal.name,
      age: parseInt(formData.personal.age),
      height: parseInt(formData.personal.height),
      weight: parseInt(formData.personal.weight),
      gender: formData.personal.gender,
      fitnessGoal: formData.goals.primary,
      activityLevel: formData.activity.level,
      dietaryPreferences: [formData.nutrition.diet, ...formData.nutrition.restrictions],
      targetWeight: parseInt(formData.goals.target),
      createdAt: new Date(),
      isOnboarded: true,
      preferences: formData.preferences
    };

    announceToScreenReader('Onboarding complete! Welcome to your personalized fitness journey.');
    playAudioFeedback('success');
    onComplete(userData);
  }, [formData, onComplete, announceToScreenReader, playAudioFeedback]);

  const currentStepData = steps[currentStep];
  const isStepValid = validateStep(currentStep);
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to FitAI Pro</h1>
          <p className="text-white/80">Let's personalize your fitness journey</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-white/80">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-sm text-white/80">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="glass-card border-white/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <currentStepData.icon className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
            <p className="text-muted-foreground">{currentStepData.description}</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Personal Information Step */}
                {currentStep === 0 && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.personal.name}
                        onChange={(e) => updateFormData('personal', 'name', e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          value={formData.personal.age}
                          onChange={(e) => updateFormData('personal', 'age', e.target.value)}
                          placeholder="25"
                        />
                      </div>
                      <div>
                        <Label>Gender</Label>
                        <RadioGroup
                          value={formData.personal.gender}
                          onValueChange={(value) => updateFormData('personal', 'gender', value)}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="male" />
                            <Label htmlFor="male">Male</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="female" />
                            <Label htmlFor="female">Female</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="other" id="other" />
                            <Label htmlFor="other">Other</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input
                          id="height"
                          type="number"
                          value={formData.personal.height}
                          onChange={(e) => updateFormData('personal', 'height', e.target.value)}
                          placeholder="170"
                        />
                      </div>
                      <div>
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                          id="weight"
                          type="number"
                          value={formData.personal.weight}
                          onChange={(e) => updateFormData('personal', 'weight', e.target.value)}
                          placeholder="70"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Goals Step */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <Label>Primary Fitness Goal</Label>
                      <RadioGroup
                        value={formData.goals.primary}
                        onValueChange={(value) => updateFormData('goals', 'primary', value)}
                        className="grid grid-cols-2 gap-4 mt-2"
                      >
                        {[
                          { value: 'weight_loss', label: 'Weight Loss', icon: '🔥' },
                          { value: 'muscle_gain', label: 'Muscle Gain', icon: '💪' },
                          { value: 'general_fitness', label: 'General Fitness', icon: '❤️' },
                          { value: 'performance', label: 'Performance', icon: '🏃' }
                        ].map((goal) => (
                          <div key={goal.value} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50">
                            <RadioGroupItem value={goal.value} id={goal.value} />
                            <Label htmlFor={goal.value} className="flex items-center gap-2 cursor-pointer">
                              <span>{goal.icon}</span>
                              {goal.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div>
                      <Label htmlFor="target">Target Weight (kg)</Label>
                      <Input
                        id="target"
                        type="number"
                        value={formData.goals.target}
                        onChange={(e) => updateFormData('goals', 'target', e.target.value)}
                        placeholder="65"
                      />
                    </div>

                    <div>
                      <Label>Timeline</Label>
                      <RadioGroup
                        value={formData.goals.timeline}
                        onValueChange={(value) => updateFormData('goals', 'timeline', value)}
                      >
                        {['3 months', '6 months', '1 year', '2+ years'].map((timeline) => (
                          <div key={timeline} className="flex items-center space-x-2">
                            <RadioGroupItem value={timeline} id={timeline} />
                            <Label htmlFor={timeline}>{timeline}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                )}

                {/* Activity Level Step */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <Label>Current Activity Level</Label>
                      <RadioGroup
                        value={formData.activity.level}
                        onValueChange={(value) => updateFormData('activity', 'level', value)}
                      >
                        {[
                          { value: 'beginner', label: 'Beginner', desc: 'Little to no exercise' },
                          { value: 'intermediate', label: 'Intermediate', desc: 'Some regular exercise' },
                          { value: 'advanced', label: 'Advanced', desc: 'Very active lifestyle' }
                        ].map((level) => (
                          <div key={level.value} className="flex items-center space-x-2 p-3 border rounded-lg">
                            <RadioGroupItem value={level.value} id={level.value} />
                            <div>
                              <Label htmlFor={level.value} className="font-medium">{level.label}</Label>
                              <p className="text-sm text-muted-foreground">{level.desc}</p>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div>
                      <Label>Preferred Workout Days</Label>
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                          <Button
                            key={day}
                            variant={formData.activity.workoutDays.includes(day) ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => {
                              const days = formData.activity.workoutDays;
                              const newDays = days.includes(day)
                                ? days.filter(d => d !== day)
                                : [...days, day];
                              updateFormData('activity', 'workoutDays', newDays);
                            }}
                          >
                            {day}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Preferred Workout Duration</Label>
                      <RadioGroup
                        value={formData.activity.duration}
                        onValueChange={(value) => updateFormData('activity', 'duration', value)}
                      >
                        {['15-30 min', '30-45 min', '45-60 min', '60+ min'].map((duration) => (
                          <div key={duration} className="flex items-center space-x-2">
                            <RadioGroupItem value={duration} id={duration} />
                            <Label htmlFor={duration}>{duration}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between pt-6">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>

                  {isLastStep ? (
                    <Button
                      onClick={completeOnboarding}
                      disabled={!isStepValid}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Complete Setup
                    </Button>
                  ) : (
                    <Button
                      onClick={nextStep}
                      disabled={!isStepValid}
                      className="flex items-center gap-2"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Step Indicators */}
        <div className="flex justify-center mt-8 space-x-2">
          {steps.map((_, index) => (
            <motion.div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index <= currentStep ? 'bg-white' : 'bg-white/30'
              }`}
              animate={{
                scale: index === currentStep ? 1.2 : 1,
                backgroundColor: index <= currentStep ? '#ffffff' : 'rgba(255,255,255,0.3)'
              }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};