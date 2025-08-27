import { useCallback, useMemo, useRef } from 'react';

// Performance optimization hook for debouncing
export const useDebounce = (callback: (...args: any[]) => void, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback((...args: any[]) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  }, [callback, delay]);
};

// Performance optimization hook for throttling
export const useThrottle = (callback: (...args: any[]) => void, delay: number) => {
  const lastRun = useRef(Date.now());

  return useCallback((...args: any[]) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }, [callback, delay]);
};

// Memoized calculations for fitness metrics
export const useFitnessCalculations = () => {
  return useMemo(() => ({
    calculateBMI: (weight: number, height: number) => {
      const heightInM = height / 100;
      return Math.round((weight / (heightInM * heightInM)) * 10) / 10;
    },
    
    calculateCaloriesBurned: (duration: number, intensity: 'low' | 'medium' | 'high', weight: number) => {
      const multipliers = { low: 3.5, medium: 6, high: 9 };
      return Math.round((multipliers[intensity] * weight * (duration / 60)) * 10) / 10;
    },
    
    calculateMacroDistribution: (calories: number, goal: 'weight_loss' | 'muscle_gain' | 'maintenance') => {
      const ratios = {
        weight_loss: { protein: 0.35, carbs: 0.35, fat: 0.30 },
        muscle_gain: { protein: 0.30, carbs: 0.45, fat: 0.25 },
        maintenance: { protein: 0.25, carbs: 0.50, fat: 0.25 }
      };
      
      const ratio = ratios[goal];
      return {
        protein: Math.round((calories * ratio.protein) / 4),
        carbs: Math.round((calories * ratio.carbs) / 4),
        fat: Math.round((calories * ratio.fat) / 9)
      };
    },
    
    calculateProgress: (current: number, start: number, target: number) => {
      const totalChange = Math.abs(target - start);
      const currentChange = Math.abs(current - start);
      return Math.min((currentChange / totalChange) * 100, 100);
    }
  }), []);
};

// Optimized data formatting
export const useDataFormatters = () => {
  return useMemo(() => ({
    formatDuration: (minutes: number) => {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    },
    
    formatWeight: (weight: number, unit: 'kg' | 'lbs' = 'kg') => {
      return unit === 'kg' ? `${weight.toFixed(1)}kg` : `${(weight * 2.20462).toFixed(1)}lbs`;
    },
    
    formatCalories: (calories: number) => {
      return calories >= 1000 ? `${(calories / 1000).toFixed(1)}k` : calories.toString();
    },
    
    formatDate: (date: Date | string) => {
      const d = new Date(date);
      return d.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  }), []);
};