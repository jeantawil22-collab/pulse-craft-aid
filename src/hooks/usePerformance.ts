import { useCallback, useMemo, useRef, useState, useEffect } from 'react';

// Enhanced performance optimization hooks
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => callback(...args), delay);
  }, [callback, delay]) as T;
};

// High-precision throttling for real-time operations
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastRun = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback((...args: Parameters<T>) => {
    const now = performance.now();
    const timeSinceLastRun = now - lastRun.current;

    if (timeSinceLastRun >= delay) {
      callback(...args);
      lastRun.current = now;
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
        lastRun.current = performance.now();
      }, delay - timeSinceLastRun);
    }
  }, [callback, delay]) as T;
};

// Enhanced RAF-based animation throttling for 60fps performance
export const useRAFThrottle = <T extends (...args: any[]) => any>(
  callback: T
): T => {
  const rafId = useRef<number>();
  const lastArgs = useRef<Parameters<T>>();

  return useCallback((...args: Parameters<T>) => {
    lastArgs.current = args;
    if (rafId.current) return;

    rafId.current = requestAnimationFrame(() => {
      if (lastArgs.current) {
        callback(...lastArgs.current);
      }
      rafId.current = undefined;
    });
  }, [callback]) as T;
};

// Performance monitoring hook
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    fps: 60,
    memoryUsage: 0,
    renderTime: 0,
    isLowPerformance: false
  });

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationId: number;

    const monitor = () => {
      const now = performance.now();
      frameCount++;

      if (now - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (now - lastTime));
        
        setMetrics(prev => ({
          ...prev,
          fps,
          isLowPerformance: fps < 30,
          renderTime: now - lastTime
        }));

        frameCount = 0;
        lastTime = now;
      }

      animationId = requestAnimationFrame(monitor);
    };

    monitor();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return metrics;
};

// Precision fitness calculations with validation
export const useFitnessCalculations = () => {
  return useMemo(() => ({
    calculateBMI: (weight: number, height: number): number => {
      if (weight <= 0 || height <= 0) return 0;
      const heightInM = height / 100;
      return Math.round((weight / (heightInM * heightInM)) * 100) / 100;
    },
    
    calculateCaloriesBurned: (
      duration: number, 
      intensity: 'low' | 'medium' | 'high', 
      weight: number,
      exerciseType?: string
    ): number => {
      if (duration <= 0 || weight <= 0) return 0;
      
      const baseMET = { low: 3.5, medium: 6.0, high: 9.0 };
      const exerciseMET = {
        'Push-ups': 8.0,
        'Squats': 5.0,
        'Burpees': 10.0,
        'Running': 11.5,
        'Cycling': 8.5
      };
      
      const met = exerciseType && exerciseMET[exerciseType as keyof typeof exerciseMET] 
        ? exerciseMET[exerciseType as keyof typeof exerciseMET]
        : baseMET[intensity];
        
      return Math.round((met * weight * (duration / 60)) * 10) / 10;
    },
    
    calculateMacroDistribution: (
      calories: number, 
      goal: 'weight_loss' | 'muscle_gain' | 'maintenance',
      activityLevel: 'low' | 'medium' | 'high' = 'medium'
    ) => {
      if (calories <= 0) return { protein: 0, carbs: 0, fat: 0 };
      
      const baseRatios = {
        weight_loss: { protein: 0.35, carbs: 0.30, fat: 0.35 },
        muscle_gain: { protein: 0.30, carbs: 0.50, fat: 0.20 },
        maintenance: { protein: 0.25, carbs: 0.50, fat: 0.25 }
      };
      
      // Adjust based on activity level
      const ratio = { ...baseRatios[goal] };
      if (activityLevel === 'high' && goal === 'muscle_gain') {
        ratio.carbs += 0.05;
        ratio.fat -= 0.05;
      }
      
      return {
        protein: Math.round((calories * ratio.protein) / 4),
        carbs: Math.round((calories * ratio.carbs) / 4),
        fat: Math.round((calories * ratio.fat) / 9)
      };
    },
    
    calculateProgress: (current: number, start: number, target: number): number => {
      if (start === target) return 100;
      const totalChange = Math.abs(target - start);
      const currentChange = Math.abs(current - start);
      return Math.min(Math.max((currentChange / totalChange) * 100, 0), 100);
    },

    calculateFormScore: (
      angles: Record<string, number>,
      idealRanges: Record<string, { min: number; max: number }>,
      weights: Record<string, number> = {}
    ): number => {
      let totalScore = 0;
      let totalWeight = 0;

      Object.entries(angles).forEach(([key, angle]) => {
        const range = idealRanges[key];
        const weight = weights[key] || 1;
        
        if (range) {
          let score = 100;
          if (angle < range.min) {
            score = Math.max(0, 100 - ((range.min - angle) * 2));
          } else if (angle > range.max) {
            score = Math.max(0, 100 - ((angle - range.max) * 2));
          }
          
          totalScore += score * weight;
          totalWeight += weight;
        }
      });

      return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
    }
  }), []);
};

// Optimized data formatting with caching
export const useDataFormatters = () => {
  const formatCache = useRef<Map<string, string>>(new Map());

  return useMemo(() => ({
    formatDuration: (minutes: number): string => {
      const key = `duration_${minutes}`;
      if (formatCache.current.has(key)) {
        return formatCache.current.get(key)!;
      }
      
      const hours = Math.floor(minutes / 60);
      const mins = Math.round(minutes % 60);
      const result = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
      
      formatCache.current.set(key, result);
      return result;
    },
    
    formatWeight: (weight: number, unit: 'kg' | 'lbs' = 'kg'): string => {
      const key = `weight_${weight}_${unit}`;
      if (formatCache.current.has(key)) {
        return formatCache.current.get(key)!;
      }
      
      const result = unit === 'kg' 
        ? `${weight.toFixed(1)}kg` 
        : `${(weight * 2.20462).toFixed(1)}lbs`;
      
      formatCache.current.set(key, result);
      return result;
    },
    
    formatCalories: (calories: number): string => {
      const key = `calories_${calories}`;
      if (formatCache.current.has(key)) {
        return formatCache.current.get(key)!;
      }
      
      const result = calories >= 1000 
        ? `${(calories / 1000).toFixed(1)}k` 
        : Math.round(calories).toString();
      
      formatCache.current.set(key, result);
      return result;
    },
    
    formatDate: (date: Date | string): string => {
      const d = new Date(date);
      const key = `date_${d.toISOString().split('T')[0]}`;
      
      if (formatCache.current.has(key)) {
        return formatCache.current.get(key)!;
      }
      
      const result = d.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
      
      formatCache.current.set(key, result);
      return result;
    },

    formatPercentage: (value: number, decimals: number = 1): string => {
      return `${value.toFixed(decimals)}%`;
    },

    formatAngle: (angle: number): string => {
      return `${Math.round(angle)}°`;
    }
  }), []);
};