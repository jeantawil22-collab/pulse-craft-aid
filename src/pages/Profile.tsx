import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Settings, 
  Target, 
  Apple, 
  Activity,
  Save,
  Edit,
  Trash2,
  RefreshCw,
  Bell,
  Shield,
  Smartphone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileProps {
  user: any;
  updateUser: (userData: any) => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, updateUser }) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleDietaryPreferenceChange = (preference: string, checked: boolean) => {
    setFormData((prev: any) => ({
      ...prev,
      dietaryPreferences: checked 
        ? [...prev.dietaryPreferences, preference]
        : prev.dietaryPreferences.filter((p: string) => p !== preference)
    }));
  };

  const saveProfile = () => {
    const updatedUser = {
      ...formData,
      height: parseFloat(formData.height),
      weight: parseFloat(formData.weight),
      age: parseInt(formData.age),
      targetWeight: formData.targetWeight ? parseFloat(formData.targetWeight) : undefined,
    };

    updateUser(updatedUser);
    setIsEditing(false);
    
    toast({
      title: "Profile Updated! ✅",
      description: "Your profile has been saved successfully.",
    });
  };

  const resetProfile = () => {
    setFormData(user);
    setIsEditing(false);
    toast({
      title: "Changes Discarded",
      description: "Your profile changes have been reset.",
    });
  };

  const calculateBMI = () => {
    const height = parseFloat(formData.height) / 100; // Convert cm to m
    const weight = parseFloat(formData.weight);
    if (height && weight) {
      return (weight / (height * height)).toFixed(1);
    }
    return 'N/A';
  };

  const getBMICategory = (bmi: string) => {
    const bmiValue = parseFloat(bmi);
    if (isNaN(bmiValue)) return 'Unknown';
    if (bmiValue < 18.5) return 'Underweight';
    if (bmiValue < 25) return 'Normal weight';
    if (bmiValue < 30) return 'Overweight';
    return 'Obese';
  };

  const getGoalIcon = (goal: string) => {
    switch (goal) {
      case 'weight_loss': return '🏃‍♂️';
      case 'muscle_gain': return '💪';
      case 'general_fitness': return '⚡';
      case 'performance': return '🏆';
      default: return '🎯';
    }
  };

  const bmi = calculateBMI();

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Profile Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your personal information and preferences
          </p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="gradient-primary text-white">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetProfile}>
              Cancel
            </Button>
            <Button onClick={saveProfile} className="gradient-primary text-white">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="fitness">Fitness Goals</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Your basic profile information and physical measurements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Gender</Label>
                    <RadioGroup
                      value={formData.gender}
                      onValueChange={(value) => handleInputChange('gender', value)}
                      disabled={!isEditing}
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

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={formData.height}
                      onChange={(e) => handleInputChange('height', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="weight">Current Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>

                  {/* BMI Display */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Body Mass Index (BMI)</span>
                      <Badge variant="outline">{getBMICategory(bmi)}</Badge>
                    </div>
                    <div className="text-2xl font-bold text-primary">{bmi}</div>
                    <div className="text-xs text-muted-foreground">
                      Based on current height and weight
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>Member since:</strong> {new Date(formData.createdAt).toLocaleDateString()}</p>
                    <p><strong>Profile ID:</strong> {formData.id}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fitness" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-accent" />
                Fitness Goals & Activity Level
              </CardTitle>
              <CardDescription>
                Define your fitness objectives and current activity level
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">Primary Fitness Goal</Label>
                <RadioGroup
                  value={formData.fitnessGoal}
                  onValueChange={(value) => handleInputChange('fitnessGoal', value)}
                  disabled={!isEditing}
                  className="mt-3 space-y-3"
                >
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="weight_loss" id="goal_weight_loss" />
                    <Label htmlFor="goal_weight_loss" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🏃‍♂️</span>
                        <div>
                          <div className="font-medium">Weight Loss</div>
                          <div className="text-sm text-muted-foreground">Lose weight and get lean</div>
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="muscle_gain" id="goal_muscle_gain" />
                    <Label htmlFor="goal_muscle_gain" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">💪</span>
                        <div>
                          <div className="font-medium">Muscle Gain</div>
                          <div className="text-sm text-muted-foreground">Build muscle and strength</div>
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="general_fitness" id="goal_general" />
                    <Label htmlFor="goal_general" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">⚡</span>
                        <div>
                          <div className="font-medium">General Fitness</div>
                          <div className="text-sm text-muted-foreground">Stay healthy and active</div>
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="performance" id="goal_performance" />
                    <Label htmlFor="goal_performance" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🏆</span>
                        <div>
                          <div className="font-medium">Performance</div>
                          <div className="text-sm text-muted-foreground">Improve athletic performance</div>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div>
                <Label className="text-base font-medium">Activity Level</Label>
                <RadioGroup
                  value={formData.activityLevel}
                  onValueChange={(value) => handleInputChange('activityLevel', value)}
                  disabled={!isEditing}
                  className="mt-3 space-y-3"
                >
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="beginner" id="level_beginner" />
                    <Label htmlFor="level_beginner" className="flex-1 cursor-pointer">
                      <div className="font-medium">Beginner</div>
                      <div className="text-sm text-muted-foreground">New to exercise or returning after a long break</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="intermediate" id="level_intermediate" />
                    <Label htmlFor="level_intermediate" className="flex-1 cursor-pointer">
                      <div className="font-medium">Intermediate</div>
                      <div className="text-sm text-muted-foreground">Exercise 3-4 times per week regularly</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="advanced" id="level_advanced" />
                    <Label htmlFor="level_advanced" className="flex-1 cursor-pointer">
                      <div className="font-medium">Advanced</div>
                      <div className="text-sm text-muted-foreground">Exercise 5+ times per week with structured training</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div>
                <Label htmlFor="targetWeight">Target Weight (kg) - Optional</Label>
                <Input
                  id="targetWeight"
                  type="number"
                  step="0.1"
                  placeholder="Enter your target weight"
                  value={formData.targetWeight || ''}
                  onChange={(e) => handleInputChange('targetWeight', e.target.value)}
                  disabled={!isEditing}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave empty if you don't have a specific weight goal
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nutrition" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Apple className="h-5 w-5 text-nutrition" />
                Nutrition Preferences
              </CardTitle>
              <CardDescription>
                Set your dietary preferences and restrictions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-3 block">Dietary Preferences</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
                    <div key={preference} className="flex items-center space-x-2 p-3 border rounded-lg">
                      <Checkbox
                        id={preference}
                        checked={formData.dietaryPreferences.includes(preference)}
                        onCheckedChange={(checked) => 
                          handleDietaryPreferenceChange(preference, checked as boolean)
                        }
                        disabled={!isEditing}
                      />
                      <Label htmlFor={preference} className="cursor-pointer text-sm">
                        {preference}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="targetCalories">Target Daily Calories</Label>
                  <Input
                    id="targetCalories"
                    type="number"
                    value={formData.targetCalories || ''}
                    onChange={(e) => handleInputChange('targetCalories', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Auto-calculated based on your goals and activity level
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Current Dietary Preferences</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.dietaryPreferences.length > 0 ? (
                      formData.dietaryPreferences.map((pref: string) => (
                        <Badge key={pref} variant="secondary">{pref}</Badge>
                      ))
                    ) : (
                      <Badge variant="outline">No preferences set</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-muted-foreground" />
                App Settings
              </CardTitle>
              <CardDescription>
                Manage your app preferences and account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Notifications */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Workout Reminders</div>
                      <div className="text-sm text-muted-foreground">Get notified about scheduled workouts</div>
                    </div>
                    <Checkbox defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Meal Logging</div>
                      <div className="text-sm text-muted-foreground">Reminders to log your meals</div>
                    </div>
                    <Checkbox defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">Progress Updates</div>
                      <div className="text-sm text-muted-foreground">Weekly progress summaries</div>
                    </div>
                    <Checkbox defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Data & Privacy */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Data & Privacy
                </h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Export My Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Smartphone className="h-4 w-4 mr-2" />
                    Connected Devices
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Account Actions */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Account Actions</h3>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full gradient-primary text-white"
                    onClick={() => {
                      localStorage.removeItem('fitnessAppUser');
                      window.location.reload();
                    }}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset App Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};