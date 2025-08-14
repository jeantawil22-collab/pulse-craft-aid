import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Camera, 
  Upload, 
  Scan, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Plus,
  Utensils,
  Target,
  Apple,
  Beef,
  Cookie
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MealScannerProps {
  user: any;
}

interface AnalyzedFood {
  name: string;
  confidence: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  serving_size: string;
  quantity: number;
}

interface ScanResult {
  foods: AnalyzedFood[];
  total_calories: number;
  total_macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  suggestions: string[];
  confidence_score: number;
}

export const MealScanner: React.FC<MealScannerProps> = ({ user }) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');

  // Simulate AI food recognition - in real app this would call computer vision API
  const analyzeFoodImage = async (imageFile: File): Promise<ScanResult> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock analysis result
        const mockResults = [
          {
            foods: [
              {
                name: 'Grilled Chicken Breast',
                confidence: 0.92,
                calories: 165,
                protein: 31,
                carbs: 0,
                fat: 3.6,
                serving_size: '100g',
                quantity: 1.2
              },
              {
                name: 'Steamed Broccoli',
                confidence: 0.88,
                calories: 25,
                protein: 3,
                carbs: 5,
                fat: 0.3,
                fiber: 3,
                serving_size: '100g',
                quantity: 0.8
              },
              {
                name: 'Brown Rice',
                confidence: 0.85,
                calories: 111,
                protein: 2.6,
                carbs: 23,
                fat: 0.9,
                serving_size: '100g cooked',
                quantity: 0.75
              }
            ],
            total_calories: 281,
            total_macros: {
              protein: 39.7,
              carbs: 21.3,
              fat: 4.8
            },
            suggestions: [
              'Great protein choice! Consider adding healthy fats like avocado.',
              'Well-balanced meal with good portion sizes.',
              'High protein content supports your muscle building goals.'
            ],
            confidence_score: 0.88
          },
          {
            foods: [
              {
                name: 'Salmon Fillet',
                confidence: 0.94,
                calories: 208,
                protein: 25.4,
                carbs: 0,
                fat: 12.4,
                serving_size: '100g',
                quantity: 1.0
              },
              {
                name: 'Sweet Potato',
                confidence: 0.87,
                calories: 86,
                protein: 1.6,
                carbs: 20,
                fat: 0.1,
                fiber: 3,
                serving_size: '100g',
                quantity: 1.2
              }
            ],
            total_calories: 311,
            total_macros: {
              protein: 27.3,
              carbs: 24,
              fat: 12.5
            },
            suggestions: [
              'Excellent omega-3 source from salmon!',
              'Sweet potato provides complex carbs and fiber.',
              'Perfect post-workout meal for recovery.'
            ],
            confidence_score: 0.91
          }
        ];

        resolve(mockResults[Math.floor(Math.random() * mockResults.length)]);
      }, 3000);
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file.",
        variant: "destructive"
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Start analysis
    setIsAnalyzing(true);
    setScanResult(null);

    try {
      const result = await analyzeFoodImage(file);
      setScanResult(result);
      
      toast({
        title: "Meal Analyzed! 🍽️",
        description: `Found ${result.foods.length} food items with ${Math.round(result.confidence_score * 100)}% confidence.`,
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const logMeal = () => {
    if (!scanResult) return;

    // Save to localStorage (would be API call in real app)
    const mealLog = {
      id: Date.now().toString(),
      foods: scanResult.foods,
      meal_type: mealType,
      total_calories: scanResult.total_calories,
      macros: scanResult.total_macros,
      logged_at: new Date(),
      source: 'ai_scan'
    };

    const existingLogs = JSON.parse(localStorage.getItem('mealLogs') || '[]');
    existingLogs.push(mealLog);
    localStorage.setItem('mealLogs', JSON.stringify(existingLogs));

    toast({
      title: "Meal Logged Successfully! ✅",
      description: `${scanResult.total_calories} calories added to ${mealType}`,
    });

    // Reset scanner
    setScanResult(null);
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.9) return <Badge className="bg-green-100 text-green-800">High Confidence</Badge>;
    if (confidence >= 0.7) return <Badge variant="secondary">Medium Confidence</Badge>;
    return <Badge variant="destructive">Low Confidence</Badge>;
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-accent bg-clip-text text-transparent">
          AI Meal Scanner
        </h1>
        <p className="text-muted-foreground mt-2">
          Take a photo of your meal and let AI analyze its nutritional content
        </p>
      </div>

      {/* Upload Section */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            Scan Your Meal
          </CardTitle>
          <CardDescription>
            Upload a clear photo of your meal for AI analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Image Upload Area */}
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="meal-image-upload"
            />
            
            {selectedImage ? (
              <div className="relative">
                <img 
                  src={selectedImage} 
                  alt="Selected meal" 
                  className="w-full h-64 object-cover rounded-lg"
                />
                {!isAnalyzing && !scanResult && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="secondary"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Different Image
                    </Button>
                  </div>
                )}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                    <div className="text-center text-white">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                      <p className="font-medium">Analyzing your meal...</p>
                      <p className="text-sm opacity-90">This may take a few seconds</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <label
                htmlFor="meal-image-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Camera className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> a meal photo
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG or JPEG (MAX. 10MB)</p>
                </div>
              </label>
            )}
          </div>

          {/* Meal Type Selection */}
          <div className="grid grid-cols-4 gap-2">
            {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((type) => (
              <Button
                key={type}
                variant={mealType === type ? "default" : "outline"}
                onClick={() => setMealType(type)}
                className="capitalize"
              >
                {type}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {scanResult && (
        <Card className="shadow-lg border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scan className="h-5 w-5 text-primary" />
              Analysis Results
              {getConfidenceBadge(scanResult.confidence_score)}
            </CardTitle>
            <CardDescription>
              AI detected {scanResult.foods.length} food items in your meal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">{scanResult.total_calories}</div>
                <div className="text-sm text-muted-foreground">Calories</div>
              </div>
              <div className="text-center p-4 bg-accent/10 rounded-lg">
                <Beef className="h-6 w-6 mx-auto mb-2 text-accent" />
                <div className="text-2xl font-bold">{Math.round(scanResult.total_macros.protein)}g</div>
                <div className="text-sm text-muted-foreground">Protein</div>
              </div>
              <div className="text-center p-4 bg-nutrition/10 rounded-lg">
                <Cookie className="h-6 w-6 mx-auto mb-2 text-nutrition" />
                <div className="text-2xl font-bold">{Math.round(scanResult.total_macros.carbs)}g</div>
                <div className="text-sm text-muted-foreground">Carbs</div>
              </div>
              <div className="text-center p-4 bg-yellow-500/10 rounded-lg">
                <Apple className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
                <div className="text-2xl font-bold">{Math.round(scanResult.total_macros.fat)}g</div>
                <div className="text-sm text-muted-foreground">Fat</div>
              </div>
            </div>

            {/* Individual Foods */}
            <div className="space-y-3">
              <h4 className="font-semibold">Detected Foods:</h4>
              {scanResult.foods.map((food, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      food.confidence >= 0.9 ? 'bg-green-500' :
                      food.confidence >= 0.7 ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <div className="font-medium">{food.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {food.quantity} × {food.serving_size}
                      </div>
                      <div className={`text-xs ${getConfidenceColor(food.confidence)}`}>
                        {Math.round(food.confidence * 100)}% confidence
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {Math.round(food.calories * food.quantity)} cal
                    </div>
                    <div className="text-xs text-muted-foreground">
                      P: {Math.round(food.protein * food.quantity)}g • 
                      C: {Math.round(food.carbs * food.quantity)}g • 
                      F: {Math.round(food.fat * food.quantity)}g
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Suggestions */}
            {scanResult.suggestions.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold">AI Nutritional Insights:</h4>
                <div className="space-y-2">
                  {scanResult.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Accuracy Warning */}
            {scanResult.confidence_score < 0.8 && (
              <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Lower Confidence Detection
                  </p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                    Some food items may not be accurately identified. Please review and adjust quantities if needed.
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                onClick={logMeal}
                className="flex-1 gradient-primary text-white"
                size="lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Log to {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setScanResult(null);
                  setSelectedImage(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
              >
                Scan Another
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Scanning Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <Camera className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Good Lighting</p>
                <p className="text-muted-foreground">Take photos in bright, natural light for best results</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Utensils className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Clear View</p>
                <p className="text-muted-foreground">Make sure all food items are visible and not overlapping</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Target className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Close Distance</p>
                <p className="text-muted-foreground">Take photos from a reasonable distance to capture details</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Review Results</p>
                <p className="text-muted-foreground">Always verify AI results and adjust portions if needed</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};