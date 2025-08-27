import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Listen for changes to this localStorage key from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage change for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue] as const;
}

// Specialized hooks for fitness app data
export const useFitnessData = () => {
  const [workoutHistory, setWorkoutHistory] = useLocalStorage('workoutHistory', []);
  const [nutritionLog, setNutritionLog] = useLocalStorage('nutritionLog', []);
  const [progressData, setProgressData] = useLocalStorage('progressData', []);
  const [preferences, setPreferences] = useLocalStorage('userPreferences', {
    units: 'metric',
    notifications: true,
    darkMode: false
  });

  const addWorkout = useCallback((workout: any) => {
    setWorkoutHistory((prev: any[]) => [
      { ...workout, id: Date.now(), timestamp: new Date().toISOString() },
      ...prev
    ].slice(0, 100)); // Keep only last 100 workouts for performance
  }, [setWorkoutHistory]);

  const addNutritionEntry = useCallback((entry: any) => {
    setNutritionLog((prev: any[]) => [
      { ...entry, id: Date.now(), timestamp: new Date().toISOString() },
      ...prev
    ].slice(0, 500)); // Keep only last 500 entries
  }, [setNutritionLog]);

  const addProgressEntry = useCallback((entry: any) => {
    setProgressData((prev: any[]) => [
      { ...entry, id: Date.now(), timestamp: new Date().toISOString() },
      ...prev
    ].slice(0, 200)); // Keep only last 200 progress entries
  }, [setProgressData]);

  return {
    workoutHistory,
    nutritionLog,
    progressData,
    preferences,
    setPreferences,
    addWorkout,
    addNutritionEntry,
    addProgressEntry
  };
};