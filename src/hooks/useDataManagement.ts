import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface ExportData {
  workouts: any[];
  nutrition: any[];
  progress: any[];
  preferences: any;
  timestamp: string;
  version: string;
}

interface SyncStatus {
  isOnline: boolean;
  lastSync: Date | null;
  pendingSync: boolean;
  syncError: string | null;
}

export const useDataManagement = () => {
  const [workoutHistory, setWorkoutHistory] = useLocalStorage('workoutHistory', []);
  const [nutritionLog, setNutritionLog] = useLocalStorage('nutritionLog', []);
  const [progressData, setProgressData] = useLocalStorage('progressData', []);
  const [preferences, setPreferences] = useLocalStorage('userPreferences', {});
  
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    lastSync: null,
    pendingSync: false,
    syncError: null,
  });

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setSyncStatus(prev => ({ ...prev, isOnline: true }));
    const handleOffline = () => setSyncStatus(prev => ({ ...prev, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Export data to JSON
  const exportData = useCallback(() => {
    const exportData: ExportData = {
      workouts: workoutHistory,
      nutrition: nutritionLog,
      progress: progressData,
      preferences,
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fitness-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  }, [workoutHistory, nutritionLog, progressData, preferences]);

  // Import data from JSON
  const importData = useCallback(async (file: File): Promise<boolean> => {
    try {
      const text = await file.text();
      const data: ExportData = JSON.parse(text);

      // Validate data structure
      if (!data.workouts || !data.nutrition || !data.progress) {
        throw new Error('Invalid data format');
      }

      // Merge with existing data (preserve newer entries)
      const mergeArrays = (existing: any[], imported: any[]) => {
        const existingIds = new Set(existing.map(item => item.id));
        const newItems = imported.filter(item => !existingIds.has(item.id));
        return [...existing, ...newItems].sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      };

      setWorkoutHistory(prev => mergeArrays(prev, data.workouts));
      setNutritionLog(prev => mergeArrays(prev, data.nutrition));
      setProgressData(prev => mergeArrays(prev, data.progress));
      setPreferences(prev => ({ ...prev, ...data.preferences }));

      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  }, [setWorkoutHistory, setNutritionLog, setProgressData, setPreferences]);

  // Clear all data
  const clearAllData = useCallback(() => {
    setWorkoutHistory([]);
    setNutritionLog([]);
    setProgressData([]);
    setPreferences({});
    localStorage.clear();
  }, [setWorkoutHistory, setNutritionLog, setProgressData, setPreferences]);

  // Cloud sync simulation (replace with actual service)
  const syncToCloud = useCallback(async () => {
    if (!syncStatus.isOnline) return false;

    setSyncStatus(prev => ({ ...prev, pendingSync: true, syncError: null }));

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const data = {
        workouts: workoutHistory,
        nutrition: nutritionLog,
        progress: progressData,
        preferences,
        timestamp: new Date().toISOString()
      };

      // In real implementation, send to your backend
      console.log('Syncing data to cloud:', data);

      setSyncStatus(prev => ({
        ...prev,
        pendingSync: false,
        lastSync: new Date(),
        syncError: null
      }));

      return true;
    } catch (error) {
      setSyncStatus(prev => ({
        ...prev,
        pendingSync: false,
        syncError: 'Sync failed. Will retry automatically.'
      }));
      return false;
    }
  }, [workoutHistory, nutritionLog, progressData, preferences, syncStatus.isOnline]);

  // Auto-sync when online
  useEffect(() => {
    if (syncStatus.isOnline && !syncStatus.pendingSync) {
      const autoSync = setTimeout(() => {
        syncToCloud();
      }, 30000); // Auto-sync every 30 seconds when online

      return () => clearTimeout(autoSync);
    }
  }, [syncStatus.isOnline, syncStatus.pendingSync, syncToCloud]);

  // Data validation and cleanup
  const validateAndCleanData = useCallback(() => {
    // Remove corrupted or invalid entries
    const cleanWorkouts = workoutHistory.filter(w => w.id && w.timestamp);
    const cleanNutrition = nutritionLog.filter(n => n.id && n.timestamp);
    const cleanProgress = progressData.filter(p => p.id && p.timestamp);

    // Limit data size (keep only recent entries)
    const maxEntries = { workouts: 1000, nutrition: 2000, progress: 500 };
    
    setWorkoutHistory(cleanWorkouts.slice(0, maxEntries.workouts));
    setNutritionLog(cleanNutrition.slice(0, maxEntries.nutrition));
    setProgressData(cleanProgress.slice(0, maxEntries.progress));

    return {
      cleaned: {
        workouts: workoutHistory.length - cleanWorkouts.length,
        nutrition: nutritionLog.length - cleanNutrition.length,
        progress: progressData.length - cleanProgress.length,
      }
    };
  }, [workoutHistory, nutritionLog, progressData, setWorkoutHistory, setNutritionLog, setProgressData]);

  // Backup data to IndexedDB for offline access
  const createBackup = useCallback(async () => {
    try {
      const dbName = 'FitnessAppBackup';
      const dbVersion = 1;

      return new Promise<boolean>((resolve, reject) => {
        const request = indexedDB.open(dbName, dbVersion);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const db = request.result;
          const transaction = db.transaction(['backups'], 'readwrite');
          const store = transaction.objectStore('backups');

          const backupData = {
            id: Date.now(),
            workouts: workoutHistory,
            nutrition: nutritionLog,
            progress: progressData,
            preferences,
            timestamp: new Date().toISOString()
          };

          store.put(backupData);
          transaction.oncomplete = () => resolve(true);
          transaction.onerror = () => reject(transaction.error);
        };

        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains('backups')) {
            db.createObjectStore('backups', { keyPath: 'id' });
          }
        };
      });
    } catch (error) {
      console.error('Backup failed:', error);
      return false;
    }
  }, [workoutHistory, nutritionLog, progressData, preferences]);

  // Calculate storage usage
  const getStorageUsage = useCallback(() => {
    const calculateSize = (data: any) => {
      return new Blob([JSON.stringify(data)]).size;
    };

    return {
      workouts: calculateSize(workoutHistory),
      nutrition: calculateSize(nutritionLog),
      progress: calculateSize(progressData),
      preferences: calculateSize(preferences),
      total: calculateSize({
        workouts: workoutHistory,
        nutrition: nutritionLog,
        progress: progressData,
        preferences
      })
    };
  }, [workoutHistory, nutritionLog, progressData, preferences]);

  return {
    // Data operations
    exportData,
    importData,
    clearAllData,
    
    // Cloud sync
    syncToCloud,
    syncStatus,
    
    // Data management
    validateAndCleanData,
    createBackup,
    getStorageUsage,
    
    // Data access
    workoutHistory,
    nutritionLog,
    progressData,
    preferences,
  };
};
