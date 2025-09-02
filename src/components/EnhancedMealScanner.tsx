import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  Camera, 
  Upload, 
  Scan, 
  Utensils, 
  BarChart3, 
  Target,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  TrendingUp
} from "lucide-react";

interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  vitamins: { [key: string]: number };
}

interface FoodItem {
  name: string;
  confidence: number;
  portion_size: string;
  estimated_weight: number;
  nutrition: NutritionData;
}

interface MealAnalysis {
  foods: FoodItem[];
  total_nutrition: NutritionData;
  meal_score: number;
  suggestions: string[];
  alternatives: string[];
  portion_feedback: string;
}

interface EnhancedMealScannerProps {
  userId: string;
}

export default function EnhancedMealScanner({ userId }: EnhancedMealScannerProps) {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<MealAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [portionAdjustment, setPortionAdjustment] = useState(1);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [savingToLog, setSavingToLog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);

  useEffect(() => {
    return () => {
      if (cameraActive) {
        stopCamera();
      }
    };
  }, [cameraActive]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Failed to access camera');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setImage(imageData);
        stopCamera();
        analyzeMeal(imageData);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setImage(imageData);
        analyzeMeal(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeMeal = async (imageData: string) => {
    setLoading(true);
    try {
      // Simulate AI meal analysis (in production, this would call an AI service)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAnalysis: MealAnalysis = {
        foods: [
          {
            name: 'Grilled Chicken Breast',
            confidence: 0.92,
            portion_size: 'medium',
            estimated_weight: 150,
            nutrition: {
              calories: 231,
              protein: 43.5,
              carbs: 0,
              fat: 5.0,
              fiber: 0,
              sugar: 0,
              sodium: 104,
              vitamins: { 'B6': 0.9, 'Niacin': 14.8 }
            }
          },
          {
            name: 'Brown Rice',
            confidence: 0.87,
            portion_size: 'small',
            estimated_weight: 100,
            nutrition: {
              calories: 111,
              protein: 2.6,
              carbs: 22.8,
              fat: 0.9,
              fiber: 1.8,
              sugar: 0.7,
              sodium: 5,
              vitamins: { 'B1': 0.1, 'B6': 0.1 }
            }
          },
          {
            name: 'Steamed Broccoli',
            confidence: 0.89,
            portion_size: 'medium',
            estimated_weight: 80,
            nutrition: {
              calories: 27,
              protein: 3.0,
              carbs: 5.1,
              fat: 0.3,
              fiber: 2.3,
              sugar: 1.2,
              sodium: 33,
              vitamins: { 'C': 89.2, 'K': 101.6 }
            }
          }
        ],
        total_nutrition: {
          calories: 369,
          protein: 49.1,
          carbs: 27.9,
          fat: 6.2,
          fiber: 4.1,
          sugar: 1.9,
          sodium: 142,
          vitamins: { 'C': 89.2, 'B6': 1.0, 'K': 101.6 }
        },
        meal_score: 85,
        suggestions: [
          'Great protein content! This meal supports muscle building.',
          'Consider adding healthy fats like avocado or nuts.',
          'Excellent fiber from broccoli aids digestion.'
        ],
        alternatives: [
          'Swap brown rice for quinoa for complete protein',
          'Add a side of mixed berries for antioxidants',
          'Include a small portion of olive oil for healthy fats'
        ],
        portion_feedback: 'Portion sizes look well-balanced for a moderate calorie meal.'
      };

      setAnalysis(mockAnalysis);
      toast.success('Meal analyzed successfully!');
    } catch (error) {
      console.error('Error analyzing meal:', error);
      toast.error('Failed to analyze meal');
    } finally {
      setLoading(false);
    }
  };

  const adjustPortion = (factor: number) => {
    setPortionAdjustment(factor);
    if (analysis) {
      // Recalculate nutrition based on portion adjustment
      const adjustedNutrition = {
        ...analysis.total_nutrition,
        calories: Math.round(analysis.total_nutrition.calories * factor),
        protein: Math.round(analysis.total_nutrition.protein * factor * 10) / 10,
        carbs: Math.round(analysis.total_nutrition.carbs * factor * 10) / 10,
        fat: Math.round(analysis.total_nutrition.fat * factor * 10) / 10,
        fiber: Math.round(analysis.total_nutrition.fiber * factor * 10) / 10,
        sugar: Math.round(analysis.total_nutrition.sugar * factor * 10) / 10,
        sodium: Math.round(analysis.total_nutrition.sodium * factor)
      };
      
      setAnalysis(prev => prev ? {
        ...prev,
        total_nutrition: adjustedNutrition
      } : null);
    }
  };

  const saveToNutritionLog = async () => {
    if (!analysis) return;
    
    setSavingToLog(true);
    try {
      const { error } = await supabase
        .from('nutrition_log')
        .insert({
          user_id: userId,
          meal_type: mealType,
          food_items: analysis.foods as any,
          total_calories: analysis.total_nutrition.calories,
          macronutrients: {
            protein: analysis.total_nutrition.protein,
            carbs: analysis.total_nutrition.carbs,
            fat: analysis.total_nutrition.fat,
            fiber: analysis.total_nutrition.fiber
          } as any,
          ai_analyzed: true,
          logged_at: new Date().toISOString()
        });

      if (error) throw error;
      
      toast.success('Meal saved to nutrition log!');
      
      // Reset for next scan
      setImage(null);
      setAnalysis(null);
      setPortionAdjustment(1);
    } catch (error) {
      console.error('Error saving to nutrition log:', error);
      toast.error('Failed to save meal');
    } finally {
      setSavingToLog(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { text: 'Excellent', color: 'bg-green-500' };
    if (score >= 60) return { text: 'Good', color: 'bg-yellow-500' };
    return { text: 'Needs Improvement', color: 'bg-red-500' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">AI Meal Scanner</h2>
        <p className="text-muted-foreground">Analyze your meals with advanced AI nutrition detection</p>
      </div>

      {!image ? (
        /* Camera/Upload Interface */
        <div className="space-y-4">
          {cameraActive ? (
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full max-w-md mx-auto rounded-lg"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="flex justify-center space-x-4">
                    <Button onClick={capturePhoto} size="lg" className="bg-primary hover:bg-primary/90">
                      <Camera className="h-5 w-5 mr-2" />
                      Capture Photo
                    </Button>
                    <Button variant="outline" onClick={stopCamera}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-card border-border hover:shadow-lg transition-shadow cursor-pointer" onClick={startCamera}>
                <CardContent className="p-8 text-center">
                  <Camera className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Take Photo</h3>
                  <p className="text-muted-foreground">Use your camera to scan a meal</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center">
                  <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Upload Image</h3>
                  <p className="text-muted-foreground mb-4">Choose a photo from your device</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button onClick={() => fileInputRef.current?.click()}>
                    Choose File
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      ) : (
        /* Analysis Results */
        <div className="space-y-6">
          {/* Image Preview */}
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Scanned Image</h3>
                <Button variant="outline" onClick={() => { setImage(null); setAnalysis(null); }}>
                  Scan New Image
                </Button>
              </div>
              <img src={image} alt="Scanned meal" className="w-full max-w-md mx-auto rounded-lg" />
            </CardContent>
          </Card>

          {loading ? (
            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center">
                <Scan className="h-12 w-12 text-primary mx-auto mb-4 animate-spin" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Analyzing Meal...</h3>
                <p className="text-muted-foreground">Our AI is identifying foods and calculating nutrition</p>
                <Progress value={undefined} className="mt-4 max-w-sm mx-auto" />
              </CardContent>
            </Card>
          ) : analysis && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Food Detection Results */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center">
                      <Utensils className="h-5 w-5 mr-2" />
                      Detected Foods
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analysis.foods.map((food, index) => (
                      <div key={index} className="p-4 rounded-lg border border-border bg-background">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-foreground">{food.name}</h4>
                          <Badge className="bg-green-500">
                            {Math.round(food.confidence * 100)}% confident
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Weight</p>
                            <p className="font-medium text-foreground">{food.estimated_weight}g</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Calories</p>
                            <p className="font-medium text-foreground">{food.nutrition.calories}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Protein</p>
                            <p className="font-medium text-foreground">{food.nutrition.protein}g</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Carbs</p>
                            <p className="font-medium text-foreground">{food.nutrition.carbs}g</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Nutrition Summary */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Nutrition Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {analysis.total_nutrition.calories}
                        </p>
                        <p className="text-sm text-muted-foreground">Calories</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {analysis.total_nutrition.protein}g
                        </p>
                        <p className="text-sm text-muted-foreground">Protein</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
                        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                          {analysis.total_nutrition.carbs}g
                        </p>
                        <p className="text-sm text-muted-foreground">Carbs</p>
                      </div>
                      <div className="text-center p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                          {analysis.total_nutrition.fat}g
                        </p>
                        <p className="text-sm text-muted-foreground">Fat</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Meal Score & Controls */}
              <div className="space-y-4">
                {/* Meal Score */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Meal Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="mb-4">
                      <p className={`text-4xl font-bold ${getScoreColor(analysis.meal_score)}`}>
                        {analysis.meal_score}
                      </p>
                      <p className="text-muted-foreground">out of 100</p>
                    </div>
                    <Badge className={getScoreBadge(analysis.meal_score).color}>
                      {getScoreBadge(analysis.meal_score).text}
                    </Badge>
                    <Progress value={analysis.meal_score} className="mt-4" />
                  </CardContent>
                </Card>

                {/* Portion Adjustment */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Portion Size</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Adjustment</span>
                        <span className="text-sm font-medium text-foreground">{portionAdjustment}x</span>
                      </div>
                      <Slider
                        value={[portionAdjustment]}
                        onValueChange={(value) => adjustPortion(value[0])}
                        max={2}
                        min={0.5}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{analysis.portion_feedback}</p>
                  </CardContent>
                </Card>

                {/* Meal Type Selection */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Meal Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((type) => (
                        <Button
                          key={type}
                          variant={mealType === type ? 'default' : 'outline'}
                          onClick={() => setMealType(type)}
                          className="capitalize"
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Save Button */}
                <Button 
                  onClick={saveToNutritionLog}
                  disabled={savingToLog}
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  {savingToLog ? (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Save to Nutrition Log
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* AI Suggestions */}
          {analysis && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                    AI Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
                        <span className="text-muted-foreground">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                    Healthy Alternatives
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.alternatives.map((alternative, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <AlertCircle className="h-4 w-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0" />
                        <span className="text-muted-foreground">{alternative}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}