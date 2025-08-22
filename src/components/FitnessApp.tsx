import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";

// Import all pages and components
import { AppSidebar } from '@/components/AppSidebar';
import { Dashboard } from '@/pages/Dashboard';
import { Onboarding } from '@/pages/Onboarding';
import { Workouts } from '@/pages/Workouts';
import { Nutrition } from '@/pages/Nutrition';
import { MealScanner } from '@/pages/MealScanner';
import { Progress } from '@/pages/Progress';
import { Profile } from '@/pages/Profile';
import { AICoach } from '@/components/AICoach';
import { AdvancedAnalytics } from '@/components/AdvancedAnalytics';
import { SmartRecommendations } from '@/components/SmartRecommendations';
import { SocialHub } from '@/components/SocialHub';

// Types
interface UserProfile {
  id?: string;
  name: string;
  email: string;
  height: number;
  weight: number;
  age: number;
  gender: 'male' | 'female' | 'other';
  fitnessGoal: 'weight_loss' | 'muscle_gain' | 'general_fitness' | 'performance';
  activityLevel: 'beginner' | 'intermediate' | 'advanced';
  dietaryPreferences: string[];
  targetWeight?: number;
  targetCalories?: number;
  createdAt: Date;
  isOnboarded: boolean;
}

const FitnessApp: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data on mount
  useEffect(() => {
    const loadUserData = () => {
      const savedUser = localStorage.getItem('fitnessAppUser');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }
      setIsLoading(false);
    };

    loadUserData();
  }, []);

  // Save user data when it changes
  const updateUser = (userData: UserProfile) => {
    setUser(userData);
    localStorage.setItem('fitnessAppUser', JSON.stringify(userData));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading FitAI Pro...</p>
        </div>
      </div>
    );
  }

  // If user not onboarded, show onboarding
  if (!user || !user.isOnboarded) {
    return <Onboarding onComplete={updateUser} />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Dashboard user={user} />} />
            <Route path="/workouts" element={<Workouts user={user} />} />
            <Route path="/nutrition" element={<Nutrition user={user} />} />
            <Route path="/meal-scanner" element={<MealScanner user={user} />} />
            <Route path="/progress" element={<Progress user={user} />} />
            <Route path="/ai-coach" element={<AICoach user={user} />} />
            <Route path="/analytics" element={<AdvancedAnalytics user={user} />} />
            <Route path="/recommendations" element={<SmartRecommendations user={user} />} />
            <Route path="/social" element={<SocialHub user={user} />} />
            <Route path="/profile" element={<Profile user={user} updateUser={updateUser} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </SidebarProvider>
  );
};

export default FitnessApp;