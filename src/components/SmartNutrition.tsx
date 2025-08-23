import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  ChefHat, 
  ShoppingCart, 
  Scan, 
  Beaker,
  Apple,
  Truck,
  Clock,
  Star,
  Sparkles,
  Plus,
  Minus,
  Camera,
  Bot,
  Calendar,
  Package,
  Utensils
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

interface SmartNutritionProps {
  user: UserProfile;
}

const SmartNutrition: React.FC<SmartNutritionProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('ai-chef');
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [groceryList, setGroceryList] = useState<any[]>([]);

  const aiGeneratedMeals = [
    {
      id: 1,
      name: "Protein Power Bowl",
      description: "High-protein quinoa bowl with grilled chicken, black beans, and avocado",
      calories: 485,
      protein: 42,
      carbs: 38,
      fat: 18,
      prepTime: 25,
      difficulty: "Easy",
      rating: 4.8,
      image: "/api/placeholder/300/200",
      ingredients: ["Quinoa", "Chicken breast", "Black beans", "Avocado", "Cherry tomatoes"],
      macroOptimized: true
    },
    {
      id: 2,
      name: "Mediterranean Salmon",
      description: "Omega-3 rich salmon with roasted vegetables and herb quinoa",
      calories: 520,
      protein: 38,
      carbs: 32,
      fat: 24,
      prepTime: 30,
      difficulty: "Medium",
      rating: 4.9,
      image: "/api/placeholder/300/200",
      ingredients: ["Salmon fillet", "Zucchini", "Bell peppers", "Quinoa", "Olive oil"],
      macroOptimized: true
    },
    {
      id: 3,
      name: "Plant-Based Power",
      description: "Nutrient-dense lentil and sweet potato curry with coconut rice",
      calories: 445,
      protein: 18,
      carbs: 68,
      fat: 12,
      prepTime: 35,
      difficulty: "Easy",
      rating: 4.7,
      image: "/api/placeholder/300/200",
      ingredients: ["Red lentils", "Sweet potato", "Coconut milk", "Brown rice", "Spinach"],
      macroOptimized: false
    }
  ];

  const mealPlan = [
    { day: "Monday", breakfast: "Greek Yogurt Parfait", lunch: "Protein Power Bowl", dinner: "Mediterranean Salmon" },
    { day: "Tuesday", breakfast: "Oatmeal Bowl", lunch: "Quinoa Salad", dinner: "Chicken Stir-fry" },
    { day: "Wednesday", breakfast: "Smoothie Bowl", lunch: "Turkey Wrap", dinner: "Plant-Based Power" },
    { day: "Thursday", breakfast: "Egg Scramble", lunch: "Buddha Bowl", dinner: "Lean Beef Tacos" },
    { day: "Friday", breakfast: "Chia Pudding", lunch: "Grilled Chicken Salad", dinner: "Fish & Vegetables" }
  ];

  const supplementRecommendations = [
    {
      name: "Whey Protein Isolate",
      purpose: "Muscle Recovery",
      timing: "Post-workout",
      dosage: "25-30g",
      priority: "High",
      benefits: ["Muscle protein synthesis", "Fast absorption", "Leucine rich"]
    },
    {
      name: "Creatine Monohydrate",
      purpose: "Performance",
      timing: "Daily",
      dosage: "5g",
      priority: "High",
      benefits: ["Increased power output", "Enhanced recovery", "Cognitive benefits"]
    },
    {
      name: "Omega-3 EPA/DHA",
      purpose: "Recovery & Health",
      timing: "With meals",
      dosage: "1-2g",
      priority: "Medium",
      benefits: ["Anti-inflammatory", "Heart health", "Brain function"]
    },
    {
      name: "Vitamin D3",
      purpose: "Bone Health",
      timing: "Morning",
      dosage: "2000 IU",
      priority: "Medium",
      benefits: ["Bone density", "Immune function", "Hormone support"]
    }
  ];

  const addToGroceryList = (ingredients: string[]) => {
    const newItems = ingredients.map(ingredient => ({
      id: Date.now() + Math.random(),
      name: ingredient,
      checked: false,
      category: 'ingredient'
    }));
    setGroceryList(prev => [...prev, ...newItems]);
  };

  const toggleGroceryItem = (id: number) => {
    setGroceryList(prev => 
      prev.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const generateMealPlan = () => {
    // AI meal plan generation logic would go here
    console.log("Generating personalized meal plan...");
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
          Smart Nutrition
        </h1>
        <p className="text-muted-foreground mt-1">
          AI-powered nutrition planning with personalized meals and smart shopping
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="ai-chef">AI Chef</TabsTrigger>
          <TabsTrigger value="meal-plan">Meal Plan</TabsTrigger>
          <TabsTrigger value="grocery">Smart Shopping</TabsTrigger>
          <TabsTrigger value="supplements">Supplements</TabsTrigger>
          <TabsTrigger value="scan">Nutrition Scan</TabsTrigger>
        </TabsList>

        <TabsContent value="ai-chef" className="space-y-6">
          <Card className="gradient-primary text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-6 w-6" />
                AI Nutrition Chef
              </CardTitle>
              <CardDescription className="text-white/80">
                Get personalized meal recommendations based on your goals and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="secondary" className="text-black">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate New Meals
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  <Camera className="h-4 w-4 mr-2" />
                  Scan Ingredients
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiGeneratedMeals.map((meal) => (
              <Card key={meal.id} className="shadow-fitness hover:shadow-glow transition-all duration-300">
                <div className="relative">
                  <div className="h-48 bg-muted rounded-t-lg flex items-center justify-center">
                    <ChefHat className="h-16 w-16 text-muted-foreground" />
                  </div>
                  {meal.macroOptimized && (
                    <Badge className="absolute top-2 right-2 gradient-primary text-white">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI Optimized
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{meal.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{meal.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{meal.description}</p>

                  <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                    <div className="flex justify-between">
                      <span>Calories:</span>
                      <span className="font-medium">{meal.calories}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Protein:</span>
                      <span className="font-medium">{meal.protein}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Carbs:</span>
                      <span className="font-medium">{meal.carbs}g</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fat:</span>
                      <span className="font-medium">{meal.fat}g</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{meal.prepTime} min</span>
                    <Badge variant="outline" className="text-xs">
                      {meal.difficulty}
                    </Badge>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 gradient-primary"
                      onClick={() => addToGroceryList(meal.ingredients)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button variant="outline" size="icon">
                      <Star className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="meal-plan" className="space-y-6">
          <Card className="shadow-fitness">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Weekly Meal Plan
              </CardTitle>
              <CardDescription>
                AI-generated meal plan optimized for your fitness goals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mealPlan.map((day, index) => (
                  <div key={day.day} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="font-medium w-20">{day.day}</div>
                    <div className="flex-1 grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Breakfast:</span>
                        <div className="font-medium">{day.breakfast}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Lunch:</span>
                        <div className="font-medium">{day.lunch}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Dinner:</span>
                        <div className="font-medium">{day.dinner}</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Utensils className="h-4 w-4 mr-2" />
                      Cook
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button className="gradient-primary" onClick={generateMealPlan}>
                  <Bot className="h-4 w-4 mr-2" />
                  Regenerate Plan
                </Button>
                <Button variant="outline">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Generate Shopping List
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grocery" className="space-y-6">
          <Card className="shadow-fitness">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-primary" />
                Smart Grocery List
              </CardTitle>
              <CardDescription>
                AI-optimized shopping list with delivery integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              {groceryList.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No items in your list</h3>
                  <p className="text-muted-foreground">
                    Add meals to your cart to generate a smart grocery list
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {groceryList.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 border rounded">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleGroceryItem(item.id)}
                        className="rounded"
                      />
                      <span className={item.checked ? 'line-through text-muted-foreground' : ''}>
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2 mt-4">
                <Button className="gradient-primary">
                  <Truck className="h-4 w-4 mr-2" />
                  Order for Delivery
                </Button>
                <Button variant="outline">
                  <Apple className="h-4 w-4 mr-2" />
                  Find Local Stores
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="supplements" className="space-y-6">
          <Card className="gradient-nutrition text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Beaker className="h-5 w-5" />
                Personalized Supplement Stack
              </CardTitle>
              <CardDescription className="text-white/80">
                Evidence-based recommendations tailored to your goals
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-4">
            {supplementRecommendations.map((supplement, index) => (
              <Card key={index} className="shadow-fitness">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{supplement.name}</h3>
                      <p className="text-muted-foreground">{supplement.purpose}</p>
                    </div>
                    <Badge 
                      className={
                        supplement.priority === 'High' 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-secondary text-secondary-foreground'
                      }
                    >
                      {supplement.priority} Priority
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Timing:</span>
                      <div className="font-medium">{supplement.timing}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Dosage:</span>
                      <div className="font-medium">{supplement.dosage}</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-sm text-muted-foreground">Benefits:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {supplement.benefits.map((benefit, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="gradient-primary">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button variant="outline">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scan" className="space-y-6">
          <Card className="shadow-fitness">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Scan className="h-6 w-6 text-primary" />
                Nutrition Label Scanner
              </CardTitle>
              <CardDescription>
                Scan any food item to get instant nutrition analysis and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 mb-6">
                <Camera className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Tap to scan nutrition label or barcode
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button className="gradient-primary">
                  <Camera className="h-4 w-4 mr-2" />
                  Scan Label
                </Button>
                <Button variant="outline">
                  <Scan className="h-4 w-4 mr-2" />
                  Scan Barcode
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartNutrition;