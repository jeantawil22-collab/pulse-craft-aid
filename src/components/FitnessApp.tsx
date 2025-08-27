import React, { useState, useEffect, Suspense, lazy, useMemo } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Performance optimized imports - lazy loading for better initial load
import { AppSidebar } from '@/components/AppSidebar';
import { Dashboard } from '@/pages/Dashboard';
import { Onboarding } from '@/pages/Onboarding';

// Lazy load non-critical components for better performance
const Workouts = lazy(() => import('@/pages/Workouts').then(m => ({ default: m.Workouts })));
const Nutrition = lazy(() => import('@/pages/Nutrition').then(m => ({ default: m.Nutrition })));
const MealScanner = lazy(() => import('@/pages/MealScanner').then(m => ({ default: m.MealScanner })));
const Progress = lazy(() => import('@/pages/Progress').then(m => ({ default: m.Progress })));
const Profile = lazy(() => import('@/pages/Profile').then(m => ({ default: m.Profile })));
const AICoach = lazy(() => import('@/components/AICoach').then(m => ({ default: m.AICoach })));
const AdvancedAnalytics = lazy(() => import('@/components/AdvancedAnalytics').then(m => ({ default: m.AdvancedAnalytics })));
const SmartRecommendations = lazy(() => import('@/components/SmartRecommendations').then(m => ({ default: m.SmartRecommendations })));
const SocialHub = lazy(() => import('@/components/SocialHub').then(m => ({ default: m.SocialHub })));
const WearableIntegration = lazy(() => import('@/components/WearableIntegration'));
const LiveClasses = lazy(() => import('@/components/LiveClasses'));
const RecoveryHub = lazy(() => import('@/components/RecoveryHub'));
const SmartNutrition = lazy(() => import('@/components/SmartNutrition'));
const ARWorkouts = lazy(() => import('@/components/ARWorkouts'));
const BiometricMonitoring = lazy(() => import('@/components/BiometricMonitoring'));

// Loading component for better UX
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">Loading...</p>
    </div>
  </div>
);

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
  // Enhanced state management with performance optimized localStorage
  const [user, setUser] = useLocalStorage<UserProfile | null>('fitnessAppUser', null);
  const [isLoading, setIsLoading] = useState(true);

  // Optimized user data loading
  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Memoized update function for better performance
  const updateUser = useMemo(() => (userData: UserProfile) => {
    setUser(userData);
  }, [setUser]);

  // Memoized loading screen
  const loadingScreen = useMemo(() => (
    <div className="min-h-screen flex items-center justify-center gradient-hero">
      <div className="text-center text-white animate-fade-in">
        <div className="relative mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-white mx-auto"></div>
          <div className="absolute inset-0 animate-pulse-glow rounded-full"></div>
        </div>
        <h2 className="text-2xl font-bold mb-2">FitAI Pro</h2>
        <p className="text-white/90 animate-slide-up">Initializing your AI fitness experience...</p>
      </div>
    </div>
  ), []);

  if (isLoading) {
    return loadingScreen;
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
          <Suspense fallback={<LoadingFallback />}>
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
              <Route path="/wearables" element={<WearableIntegration user={user} />} />
              <Route path="/live-classes" element={<LiveClasses user={user} />} />
              <Route path="/recovery" element={<RecoveryHub user={user} />} />
              <Route path="/smart-nutrition" element={<SmartNutrition user={user} />} />
              <Route path="/ar-workouts" element={<ARWorkouts user={user} />} />
              <Route path="/biometrics" element={<BiometricMonitoring user={user} />} />
              <Route path="/profile" element={<Profile user={user} updateUser={updateUser} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
        <Toaster />
      </div>
    </SidebarProvider>
  );
};

export default FitnessApp;