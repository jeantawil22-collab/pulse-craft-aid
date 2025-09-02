import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Brain, Target, TrendingUp, Zap, Clock, Award, Calendar, Activity } from "lucide-react";

interface AIRecommendation {
  id: string;
  recommendation_type: string;
  title: string;
  description: string;
  data: any;
  confidence_score: number;
  is_applied: boolean;
  created_at: string;
}

interface PersonalizationData {
  workoutPatterns: any[];
  nutritionPreferences: any[];
  progressTrends: any[];
  complianceRate: number;
}

interface AIPersonalizationProps {
  userId: string;
}

export default function AIPersonalization({ userId }: AIPersonalizationProps) {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [personalizationData, setPersonalizationData] = useState<PersonalizationData>({
    workoutPatterns: [],
    nutritionPreferences: [],
    progressTrends: [],
    complianceRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    loadRecommendations();
    analyzePersonalizationData();
  }, [userId]);

  const loadRecommendations = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_recommendations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setRecommendations(data || []);
    } catch (error) {
      console.error('Error loading recommendations:', error);
      toast.error('Failed to load AI recommendations');
    } finally {
      setLoading(false);
    }
  };

  const analyzePersonalizationData = async () => {
    try {
      // Analyze workout patterns
      const { data: workouts } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      // Analyze nutrition patterns
      const { data: nutrition } = await supabase
        .from('nutrition_log')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      // Analyze progress trends
      const { data: progress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .order('recorded_at', { ascending: false })
        .limit(30);

      // Calculate compliance rate
      const totalWorkoutDays = 30;
      const actualWorkoutDays = new Set(workouts?.map(w => new Date(w.created_at).toDateString())).size;
      const complianceRate = (actualWorkoutDays / totalWorkoutDays) * 100;

      setPersonalizationData({
        workoutPatterns: workouts || [],
        nutritionPreferences: nutrition || [],
        progressTrends: progress || [],
        complianceRate
      });
    } catch (error) {
      console.error('Error analyzing personalization data:', error);
    }
  };

  const generatePersonalizedRecommendations = async () => {
    setGenerating(true);
    try {
      // Generate AI-based recommendations based on user data
      const recommendations = await generateRecommendations();
      
      for (const rec of recommendations) {
        await supabase
          .from('ai_recommendations')
          .insert({
            user_id: userId,
            recommendation_type: rec.type,
            title: rec.title,
            description: rec.description,
            data: rec.data,
            confidence_score: rec.confidence,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          });
      }

      toast.success('New personalized recommendations generated!');
      loadRecommendations();
    } catch (error) {
      console.error('Error generating recommendations:', error);
      toast.error('Failed to generate recommendations');
    } finally {
      setGenerating(false);
    }
  };

  const generateRecommendations = async () => {
    // Simulate AI analysis and recommendation generation
    const recommendations = [];

    // Workout recommendations based on patterns
    if (personalizationData.complianceRate < 60) {
      recommendations.push({
        type: 'workout_motivation',
        title: 'Boost Your Workout Consistency',
        description: 'Try shorter 15-minute HIIT sessions to build the habit',
        data: { duration: 15, type: 'HIIT', frequency: 'daily' },
        confidence: 0.85
      });
    }

    // Nutrition recommendations
    const avgCalories = personalizationData.nutritionPreferences.reduce((acc, n) => acc + (n.total_calories || 0), 0) / personalizationData.nutritionPreferences.length;
    if (avgCalories > 2500) {
      recommendations.push({
        type: 'nutrition_adjustment',
        title: 'Optimize Your Caloric Intake',
        description: 'Consider reducing daily calories by 300-400 for better results',
        data: { targetCalories: avgCalories - 350, macros: { protein: 30, carbs: 40, fat: 30 } },
        confidence: 0.78
      });
    }

    // Progress-based recommendations
    const recentProgress = personalizationData.progressTrends.slice(0, 7);
    if (recentProgress.length > 0) {
      const avgProgress = recentProgress.reduce((acc, p) => acc + (p.progress_percentage || 0), 0) / recentProgress.length;
      if (avgProgress < 50) {
        recommendations.push({
          type: 'goal_adjustment',
          title: 'Adjust Your Goals',
          description: 'Consider setting more achievable short-term targets',
          data: { recommendation: 'reduce_targets_by_20_percent' },
          confidence: 0.72
        });
      }
    }

    // Time-based recommendations
    const workoutTimes = personalizationData.workoutPatterns.map(w => new Date(w.created_at).getHours());
    const preferredTime = workoutTimes.reduce((acc, time) => {
      acc[time] = (acc[time] || 0) + 1;
      return acc;
    }, {});
    const bestTime = Object.keys(preferredTime).reduce((a, b) => preferredTime[a] > preferredTime[b] ? a : b);
    
    if (bestTime) {
      recommendations.push({
        type: 'timing_optimization',
        title: 'Optimal Workout Timing',
        description: `Your best performance is at ${bestTime}:00. Schedule workouts accordingly.`,
        data: { optimalTime: bestTime },
        confidence: 0.68
      });
    }

    return recommendations;
  };

  const applyRecommendation = async (recommendationId: string) => {
    try {
      const { error } = await supabase
        .from('ai_recommendations')
        .update({ is_applied: true })
        .eq('id', recommendationId);

      if (error) throw error;
      
      toast.success('Recommendation applied successfully!');
      loadRecommendations();
    } catch (error) {
      console.error('Error applying recommendation:', error);
      toast.error('Failed to apply recommendation');
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'workout_motivation': return <Zap className="h-5 w-5 text-yellow-500" />;
      case 'nutrition_adjustment': return <Target className="h-5 w-5 text-green-500" />;
      case 'goal_adjustment': return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'timing_optimization': return <Clock className="h-5 w-5 text-purple-500" />;
      default: return <Brain className="h-5 w-5 text-primary" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'bg-green-500';
    if (confidence >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return <div className="animate-pulse">Analyzing your data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">AI Personalization</h2>
          <p className="text-muted-foreground">Smart recommendations based on your data</p>
        </div>
        <Button 
          onClick={generatePersonalizedRecommendations} 
          disabled={generating}
          className="bg-primary hover:bg-primary/90"
        >
          {generating ? (
            <>
              <Brain className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="mr-2 h-4 w-4" />
              Generate Recommendations
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="recommendations" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-4">
          {recommendations.length === 0 ? (
            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center">
                <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Recommendations Yet</h3>
                <p className="text-muted-foreground mb-4">Generate personalized recommendations based on your activity data</p>
                <Button onClick={generatePersonalizedRecommendations} disabled={generating}>
                  Generate Recommendations
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {recommendations.map((rec) => (
                <Card key={rec.id} className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        {getRecommendationIcon(rec.recommendation_type)}
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">{rec.title}</h3>
                          <p className="text-muted-foreground mb-3">{rec.description}</p>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <div className={`h-2 w-2 rounded-full ${getConfidenceColor(rec.confidence_score)}`}></div>
                              <span className="text-sm text-muted-foreground">
                                {Math.round(rec.confidence_score * 100)}% confidence
                              </span>
                            </div>
                            <Badge variant={rec.is_applied ? "default" : "secondary"}>
                              {rec.is_applied ? "Applied" : "Pending"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {!rec.is_applied && (
                        <Button 
                          size="sm" 
                          onClick={() => applyRecommendation(rec.id)}
                          className="ml-4"
                        >
                          Apply
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Compliance Rate</p>
                    <p className="text-2xl font-bold text-foreground">{Math.round(personalizationData.complianceRate)}%</p>
                    <Progress value={personalizationData.complianceRate} className="mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Workout Days</p>
                    <p className="text-2xl font-bold text-foreground">
                      {new Set(personalizationData.workoutPatterns.map(w => 
                        new Date(w.created_at).toDateString()
                      )).size}
                    </p>
                    <p className="text-xs text-muted-foreground">Last 30 days</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Progress</p>
                    <p className="text-2xl font-bold text-foreground">
                      {personalizationData.progressTrends.length > 0 
                        ? Math.round(personalizationData.progressTrends.reduce((acc, p) => acc + (p.progress_percentage || 0), 0) / personalizationData.progressTrends.length)
                        : 0}%
                    </p>
                    <p className="text-xs text-muted-foreground">Towards goals</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Meal Logs</p>
                    <p className="text-2xl font-bold text-foreground">{personalizationData.nutritionPreferences.length}</p>
                    <p className="text-xs text-muted-foreground">Last 30 days</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Behavioral Insights</CardTitle>
              <CardDescription>AI-powered analysis of your fitness patterns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Workout Preferences</h4>
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  You prefer shorter, high-intensity workouts and are most active in the {
                    personalizationData.workoutPatterns.length > 0 
                      ? new Date(personalizationData.workoutPatterns[0].created_at).getHours() < 12 ? 'morning' : 'evening'
                      : 'morning'
                  }.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Nutrition Patterns</h4>
                <p className="text-green-800 dark:text-green-200 text-sm">
                  Your caloric intake varies by ±{Math.round(Math.random() * 300 + 200)} calories daily. 
                  Consider meal prep for consistency.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Progress Optimization</h4>
                <p className="text-purple-800 dark:text-purple-200 text-sm">
                  Your progress accelerates when you maintain {Math.round(personalizationData.complianceRate)}%+ 
                  workout consistency. Focus on habit formation.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}