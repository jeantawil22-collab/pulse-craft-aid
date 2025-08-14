import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Apple, 
  Plus, 
  Clock, 
  Target, 
  Droplets,
  Utensils,
  Coffee,
  Cookie,
  Fish,
  Beef,
  Carrot,
  Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NutritionProps {
  user: any;
}

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  serving_size: string;
  category: 'protein' | 'carbs' | 'vegetables' | 'fruits' | 'dairy' | 'snacks' | 'beverages';
}

interface MealEntry {
  id: string;
  food: FoodItem;
  quantity: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  logged_at: Date;
}

interface MealPlan {
  id: string;
  name: string;
  description: string;
  meals: {
    breakfast: FoodItem[];
    lunch: FoodItem[];
    dinner: FoodItem[];
    snacks: FoodItem[];
  };
  total_calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export const Nutrition: React.FC<NutritionProps> = ({ user }) => {
  const { toast } = useToast();
  const [todayEntries, setTodayEntries] = useState<MealEntry[]>([]);
  const [waterIntake, setWaterIntake] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample food database
  const [foodDatabase] = useState<FoodItem[]>([
    {
      id: '1',
      name: 'Grilled Chicken Breast',
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      serving_size: '100g',
      category: 'protein'
    },
    {
      id: '2', 
      name: 'Brown Rice',
      calories: 111,
      protein: 2.6,
      carbs: 23,
      fat: 0.9,
      serving_size: '100g cooked',
      category: 'carbs'
    },
    {
      id: '3',
      name: 'Broccoli',
      calories: 25,
      protein: 3,
      carbs: 5,
      fat: 0.3,
      fiber: 3,
      serving_size: '100g',
      category: 'vegetables'
    },
    {
      id: '4',
      name: 'Greek Yogurt',
      calories: 100,
      protein: 10,
      carbs: 6,
      fat: 5,
      serving_size: '100g',
      category: 'dairy'
    },
    {
      id: '5',
      name: 'Banana',
      calories: 89,
      protein: 1.1,
      carbs: 23,
      fat: 0.3,
      fiber: 2.6,
      sugar: 12,
      serving_size: '1 medium (118g)',
      category: 'fruits'
    },
    {
      id: '6',
      name: 'Almonds',
      calories: 161,
      protein: 6,
      carbs: 2.5,
      fat: 14,
      serving_size: '28g (1 oz)',
      category: 'snacks'
    }
  ]);

  // Sample meal plans
  const [mealPlans] = useState<MealPlan[]>([
    {
      id: '1',
      name: 'Balanced Weight Loss',
      description: 'High protein, moderate carbs for sustainable weight loss',
      meals: {
        breakfast: [foodDatabase[3], foodDatabase[4]], // Greek yogurt + banana
        lunch: [foodDatabase[0], foodDatabase[1], foodDatabase[2]], // Chicken + rice + broccoli
        dinner: [foodDatabase[0], foodDatabase[2]], // Chicken + broccoli
        snacks: [foodDatabase[5]] // Almonds
      },
      total_calories: 1450,
      macros: {
        protein: 125,
        carbs: 89,
        fat: 45
      }
    },
    {
      id: '2',
      name: 'Muscle Building',
      description: 'Higher calories and protein for muscle gain',
      meals: {
        breakfast: [foodDatabase[3], foodDatabase[4], foodDatabase[5]], 
        lunch: [foodDatabase[0], foodDatabase[1], foodDatabase[2]],
        dinner: [foodDatabase[0], foodDatabase[1], foodDatabase[2]],
        snacks: [foodDatabase[5], foodDatabase[3]]
      },
      total_calories: 1980,
      macros: {
        protein: 165,
        carbs: 142,
        fat: 68
      }
    }
  ]);

  const getDailyTotals = () => {
    return todayEntries.reduce((totals, entry) => ({
      calories: totals.calories + (entry.food.calories * entry.quantity),
      protein: totals.protein + (entry.food.protein * entry.quantity),
      carbs: totals.carbs + (entry.food.carbs * entry.quantity),
      fat: totals.fat + (entry.food.fat * entry.quantity)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const addFoodEntry = (food: FoodItem, mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack', quantity: number = 1) => {
    const newEntry: MealEntry = {
      id: Date.now().toString(),
      food,
      quantity,
      meal_type: mealType,
      logged_at: new Date()
    };

    setTodayEntries(prev => [...prev, newEntry]);
    
    toast({
      title: "Food Added!",
      description: `${food.name} added to ${mealType}`,
    });
  };

  const addWater = () => {
    setWaterIntake(prev => prev + 1);
    toast({
      title: "Great hydration! 💧",
      description: `You've had ${waterIntake + 1} glasses of water today.`,
    });
  };

  const getCalorieProgress = () => {
    const consumed = getDailyTotals().calories;
    const target = user.targetCalories || 2000;
    return Math.min((consumed / target) * 100, 100);
  };

  const getMacroProgress = (macro: 'protein' | 'carbs' | 'fat') => {
    const consumed = getDailyTotals()[macro];
    const target = user.targetCalories || 2000;
    
    // Rough macro targets based on calories
    const targets = {
      protein: target * 0.25 / 4, // 25% of calories from protein
      carbs: target * 0.45 / 4,   // 45% of calories from carbs  
      fat: target * 0.30 / 9      // 30% of calories from fat
    };

    return Math.min((consumed / targets[macro]) * 100, 100);
  };

  const filteredFoods = foodDatabase.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMealEntries = (mealType: string) => {
    return todayEntries.filter(entry => entry.meal_type === mealType);
  };

  const getMealCalories = (mealType: string) => {
    return getMealEntries(mealType).reduce((total, entry) => 
      total + (entry.food.calories * entry.quantity), 0
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'protein': return <Beef className="h-4 w-4" />;
      case 'carbs': return <Cookie className="h-4 w-4" />;
      case 'vegetables': return <Carrot className="h-4 w-4" />;
      case 'fruits': return <Apple className="h-4 w-4" />;
      case 'dairy': return <Coffee className="h-4 w-4" />;
      case 'snacks': return <Cookie className="h-4 w-4" />;
      default: return <Utensils className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-nutrition bg-clip-text text-transparent">
            Nutrition Tracker
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your meals and reach your nutrition goals
          </p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          Quick Add Food
        </Button>
      </div>

      {/* Daily Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Calories</p>
                <p className="text-2xl font-bold">
                  {Math.round(getDailyTotals().calories)}
                </p>
                <p className="text-xs text-muted-foreground">
                  of {user.targetCalories || 2000} goal
                </p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
            <Progress value={getCalorieProgress()} className="mt-4" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Protein</p>
                <p className="text-2xl font-bold text-accent">
                  {Math.round(getDailyTotals().protein)}g
                </p>
              </div>
              <Beef className="h-8 w-8 text-accent" />
            </div>
            <Progress value={getMacroProgress('protein')} className="mt-4" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Carbs</p>
                <p className="text-2xl font-bold text-nutrition">
                  {Math.round(getDailyTotals().carbs)}g
                </p>
              </div>
              <Cookie className="h-8 w-8 text-nutrition" />
            </div>
            <Progress value={getMacroProgress('carbs')} className="mt-4" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Water</p>
                <p className="text-2xl font-bold text-blue-500">
                  {waterIntake}
                </p>
                <p className="text-xs text-muted-foreground">of 8 glasses</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={addWater}
                className="flex items-center gap-1"
              >
                <Droplets className="h-4 w-4" />
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <Progress value={(waterIntake / 8) * 100} className="mt-4" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="today">Today's Meals</TabsTrigger>
          <TabsTrigger value="food-search">Add Food</TabsTrigger>
          <TabsTrigger value="meal-plans">Meal Plans</TabsTrigger>
          <TabsTrigger value="recipes">Recipes</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          {/* Meal Sections */}
          {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => (
            <Card key={mealType}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="capitalize flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-primary" />
                    {mealType}
                  </CardTitle>
                  <div className="text-sm text-muted-foreground">
                    {getMealCalories(mealType)} calories
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {getMealEntries(mealType).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Apple className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No {mealType} logged yet</p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => {/* Switch to food search tab */}}
                    >
                      Add Food
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getMealEntries(mealType).map((entry) => (
                      <div key={entry.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getCategoryIcon(entry.food.category)}
                          <div>
                            <div className="font-medium">{entry.food.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {entry.quantity} × {entry.food.serving_size}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {Math.round(entry.food.calories * entry.quantity)} cal
                          </div>
                          <div className="text-xs text-muted-foreground">
                            P: {Math.round(entry.food.protein * entry.quantity)}g • 
                            C: {Math.round(entry.food.carbs * entry.quantity)}g • 
                            F: {Math.round(entry.food.fat * entry.quantity)}g
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="food-search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Search Foods</CardTitle>
              <CardDescription>Find and add foods to your meals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search for foods..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredFoods.map((food) => (
                  <Card key={food.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(food.category)}
                          <div>
                            <div className="font-medium">{food.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {food.serving_size}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">{food.calories} cal</Badge>
                      </div>

                      <div className="text-xs text-muted-foreground mb-3">
                        Protein: {food.protein}g • Carbs: {food.carbs}g • Fat: {food.fat}g
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => addFoodEntry(food, 'breakfast')}
                        >
                          + Breakfast
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => addFoodEntry(food, 'lunch')}
                        >
                          + Lunch
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => addFoodEntry(food, 'dinner')}
                        >
                          + Dinner
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => addFoodEntry(food, 'snack')}
                        >
                          + Snack
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meal-plans" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mealPlans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-primary">{plan.total_calories}</div>
                      <div className="text-xs text-muted-foreground">Calories</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-accent">{plan.macros.protein}g</div>
                      <div className="text-xs text-muted-foreground">Protein</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-nutrition">{plan.macros.carbs}g</div>
                      <div className="text-xs text-muted-foreground">Carbs</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {Object.entries(plan.meals).map(([mealType, foods]) => (
                      <div key={mealType} className="flex justify-between items-center">
                        <span className="capitalize font-medium">{mealType}</span>
                        <span className="text-sm text-muted-foreground">
                          {foods.length} items
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full gradient-nutrition text-white">
                    Use This Plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recipes" className="space-y-4">
          <Card>
            <CardContent className="p-6 text-center">
              <Utensils className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Recipe feature coming soon!</p>
              <p className="text-sm text-muted-foreground mt-2">
                Get personalized recipes based on your dietary preferences and goals.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};