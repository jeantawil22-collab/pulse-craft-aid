import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, Dumbbell, Target, Activity, Apple } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OnboardingProps {
  onComplete: (userData: any) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const totalSteps = 5;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    height: '',
    weight: '',
    age: '',
    gender: '',
    fitnessGoal: '',
    activityLevel: '',
    dietaryPreferences: [] as string[],
    targetWeight: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDietaryPreferenceChange = (preference: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      dietaryPreferences: checked 
        ? [...prev.dietaryPreferences, preference]
        : prev.dietaryPreferences.filter(p => p !== preference)
    }));
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const validateCurrentStep = () => {
    switch (step) {
      case 1:
        if (!formData.name || !formData.email) {
          toast({
            title: "Missing Information",
            description: "Please fill in your name and email.",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 2:
        if (!formData.height || !formData.weight || !formData.age || !formData.gender) {
          toast({
            title: "Missing Information", 
            description: "Please fill in all physical measurements.",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 3:
        if (!formData.fitnessGoal) {
          toast({
            title: "Missing Information",
            description: "Please select your primary fitness goal.",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 4:
        if (!formData.activityLevel) {
          toast({
            title: "Missing Information",
            description: "Please select your current activity level.",
            variant: "destructive"
          });
          return false;
        }
        break;
    }
    return true;
  };

  const handleComplete = () => {
    const userData = {
      ...formData,
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
      age: parseInt(formData.age),
      targetWeight: formData.targetWeight ? parseFloat(formData.targetWeight) : undefined,
      targetCalories: calculateTargetCalories(),
      createdAt: new Date(),
      isOnboarded: true,
      id: Date.now().toString()
    };

    toast({
      title: "Welcome to FitAI Pro!",
      description: "Your personalized fitness journey starts now.",
    });

    onComplete(userData);
  };

  const calculateTargetCalories = () => {
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const age = parseInt(formData.age);
    
    // Basic BMR calculation (Mifflin-St Jeor)
    let bmr;
    if (formData.gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Activity multiplier
    const activityMultipliers = {
      beginner: 1.375,
      intermediate: 1.55,
      advanced: 1.725
    };

    const totalCalories = bmr * activityMultipliers[formData.activityLevel as keyof typeof activityMultipliers];

    // Adjust based on goal
    switch (formData.fitnessGoal) {
      case 'weight_loss':
        return Math.round(totalCalories - 500);
      case 'muscle_gain':
        return Math.round(totalCalories + 300);
      default:
        return Math.round(totalCalories);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center shadow-fitness">
                <Dumbbell className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Welcome to FitAI Pro</h2>
              <p className="text-muted-foreground">Let's get to know you better to create your personalized fitness plan</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full gradient-accent mx-auto mb-4 flex items-center justify-center">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Physical Information</h2>
              <p className="text-muted-foreground">Help us understand your current physical stats</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="170"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Gender</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange('gender', value)}
                  className="mt-2"
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
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full gradient-progress mx-auto mb-4 flex items-center justify-center">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Fitness Goals</h2>
              <p className="text-muted-foreground">What's your primary fitness objective?</p>
            </div>
            
            <RadioGroup
              value={formData.fitnessGoal}
              onValueChange={(value) => handleInputChange('fitnessGoal', value)}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="weight_loss" id="weight_loss" />
                <Label htmlFor="weight_loss" className="flex-1 cursor-pointer">
                  <div className="font-medium">Weight Loss</div>
                  <div className="text-sm text-muted-foreground">Lose weight and get lean</div>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="muscle_gain" id="muscle_gain" />
                <Label htmlFor="muscle_gain" className="flex-1 cursor-pointer">
                  <div className="font-medium">Muscle Gain</div>
                  <div className="text-sm text-muted-foreground">Build muscle and strength</div>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="general_fitness" id="general_fitness" />
                <Label htmlFor="general_fitness" className="flex-1 cursor-pointer">
                  <div className="font-medium">General Fitness</div>
                  <div className="text-sm text-muted-foreground">Stay healthy and active</div>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="performance" id="performance" />
                <Label htmlFor="performance" className="flex-1 cursor-pointer">
                  <div className="font-medium">Performance</div>
                  <div className="text-sm text-muted-foreground">Improve athletic performance</div>
                </Label>
              </div>
            </RadioGroup>

            {(formData.fitnessGoal === 'weight_loss' || formData.fitnessGoal === 'muscle_gain') && (
              <div>
                <Label htmlFor="targetWeight">Target Weight (kg) - Optional</Label>
                <Input
                  id="targetWeight"
                  type="number"
                  placeholder="65"
                  value={formData.targetWeight}
                  onChange={(e) => handleInputChange('targetWeight', e.target.value)}
                  className="mt-1"
                />
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center shadow-fitness">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Activity Level</h2>
              <p className="text-muted-foreground">How would you describe your current fitness level?</p>
            </div>
            
            <RadioGroup
              value={formData.activityLevel}
              onValueChange={(value) => handleInputChange('activityLevel', value)}
              className="space-y-4"
            >
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="beginner" id="beginner" />
                <Label htmlFor="beginner" className="flex-1 cursor-pointer">
                  <div className="font-medium">Beginner</div>
                  <div className="text-sm text-muted-foreground">New to exercise or returning after a long break</div>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="intermediate" id="intermediate" />
                <Label htmlFor="intermediate" className="flex-1 cursor-pointer">
                  <div className="font-medium">Intermediate</div>
                  <div className="text-sm text-muted-foreground">Exercise 3-4 times per week regularly</div>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="advanced" id="advanced" />
                <Label htmlFor="advanced" className="flex-1 cursor-pointer">
                  <div className="font-medium">Advanced</div>
                  <div className="text-sm text-muted-foreground">Exercise 5+ times per week with structured training</div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full gradient-nutrition mx-auto mb-4 flex items-center justify-center">
                <Apple className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Dietary Preferences</h2>
              <p className="text-muted-foreground">Select any dietary preferences or restrictions (optional)</p>
            </div>
            
            <div className="space-y-3">
              {[
                'Vegetarian',
                'Vegan',
                'Gluten-Free',
                'Dairy-Free',
                'Low-Carb',
                'Keto',
                'Paleo',
                'Mediterranean',
                'No Restrictions'
              ].map((preference) => (
                <div key={preference} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <Checkbox
                    id={preference}
                    checked={formData.dietaryPreferences.includes(preference)}
                    onCheckedChange={(checked) => handleDietaryPreferenceChange(preference, checked as boolean)}
                  />
                  <Label htmlFor={preference} className="flex-1 cursor-pointer font-medium">
                    {preference}
                  </Label>
                </div>
              ))}
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Your Profile Summary:</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p><strong>Goal:</strong> {formData.fitnessGoal.replace('_', ' ').toUpperCase()}</p>
                <p><strong>Level:</strong> {formData.activityLevel.toUpperCase()}</p>
                <p><strong>Target Calories:</strong> ~{calculateTargetCalories()} per day</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Setup Your Profile</CardTitle>
              <CardDescription>Step {step} of {totalSteps}</CardDescription>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">
                {Math.round((step / totalSteps) * 100)}% Complete
              </div>
              <Progress value={(step / totalSteps) * 100} className="w-24" />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="animate-fade-in">
            {renderStep()}
          </div>
          
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={step === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </Button>
            
            {step < totalSteps ? (
              <Button onClick={handleNext} className="flex items-center gap-2">
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleComplete} className="gradient-primary text-white flex items-center gap-2">
                Complete Setup
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};