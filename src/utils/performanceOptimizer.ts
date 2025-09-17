// Advanced performance optimization utilities for fitness app

export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer;
  private frameRateHistory: number[] = [];
  private lastFrameTime = 0;
  private adaptiveQuality = 1;
  private performanceMetrics = {
    fps: 0,
    frameTime: 0,
    memoryUsage: 0,
    cpuLoad: 0
  };

  private constructor() {
    this.startMonitoring();
  }

  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer();
    }
    return PerformanceOptimizer.instance;
  }

  private startMonitoring() {
    const monitor = () => {
      const now = performance.now();
      if (this.lastFrameTime > 0) {
        const frameTime = now - this.lastFrameTime;
        const fps = 1000 / frameTime;
        
        this.frameRateHistory.push(fps);
        if (this.frameRateHistory.length > 60) {
          this.frameRateHistory.shift();
        }
        
        this.performanceMetrics.fps = this.getAverageFPS();
        this.performanceMetrics.frameTime = frameTime;
        
        // Adaptive quality adjustment
        this.adjustQualityBasedOnPerformance();
      }
      
      this.lastFrameTime = now;
      requestAnimationFrame(monitor);
    };
    
    requestAnimationFrame(monitor);
  }

  private getAverageFPS(): number {
    if (this.frameRateHistory.length === 0) return 60;
    return this.frameRateHistory.reduce((a, b) => a + b, 0) / this.frameRateHistory.length;
  }

  private adjustQualityBasedOnPerformance() {
    const avgFPS = this.getAverageFPS();
    
    if (avgFPS < 20) {
      this.adaptiveQuality = 0.5; // Low quality
    } else if (avgFPS < 30) {
      this.adaptiveQuality = 0.7; // Medium quality
    } else {
      this.adaptiveQuality = 1.0; // High quality
    }
  }

  // Get optimized MediaPipe settings based on current performance
  getOptimalMediaPipeSettings() {
    const settings = {
      modelComplexity: this.adaptiveQuality >= 0.8 ? 1 : 0,
      smoothLandmarks: this.adaptiveQuality >= 0.7,
      minDetectionConfidence: this.adaptiveQuality >= 0.8 ? 0.7 : 0.5,
      minTrackingConfidence: this.adaptiveQuality >= 0.8 ? 0.6 : 0.4
    };

    return settings;
  }

  // Get optimal video resolution based on performance
  getOptimalVideoResolution() {
    if (this.adaptiveQuality >= 0.8) {
      return { width: 1280, height: 720 };
    } else if (this.adaptiveQuality >= 0.6) {
      return { width: 960, height: 540 };
    } else {
      return { width: 640, height: 480 };
    }
  }

  // Throttle function calls based on performance
  createAdaptiveThrottle<T extends (...args: any[]) => any>(
    func: T,
    minInterval: number = 16
  ): T {
    let lastCall = 0;
    let timeoutId: NodeJS.Timeout;

    return ((...args: Parameters<T>) => {
      const now = performance.now();
      const dynamicInterval = this.adaptiveQuality >= 0.8 ? minInterval : minInterval * 2;
      
      const timeSinceLastCall = now - lastCall;
      
      if (timeSinceLastCall >= dynamicInterval) {
        lastCall = now;
        return func.apply(this, args);
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          lastCall = performance.now();
          func.apply(this, args);
        }, dynamicInterval - timeSinceLastCall);
      }
    }) as T;
  }

  // Memory usage monitoring
  getMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
        limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
      };
    }
    return { used: 0, total: 0, limit: 0 };
  }

  // Get current performance metrics
  getMetrics() {
    return {
      ...this.performanceMetrics,
      adaptiveQuality: this.adaptiveQuality,
      memoryInfo: this.getMemoryUsage()
    };
  }

  // Optimize canvas rendering
  optimizeCanvasRendering(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Enable hardware acceleration hints
    ctx.imageSmoothingEnabled = this.adaptiveQuality >= 0.8;
    ctx.imageSmoothingQuality = this.adaptiveQuality >= 0.8 ? 'high' : 'low';
    
    // Optimize for performance
    if (this.adaptiveQuality < 0.6) {
      ctx.globalCompositeOperation = 'source-over';
    }
  }

  // Cleanup resources
  cleanup() {
    this.frameRateHistory = [];
    this.adaptiveQuality = 1;
  }
}

// Export singleton instance
export const performanceOptimizer = PerformanceOptimizer.getInstance();

// Utility functions for performance monitoring
export const measureFunctionPerformance = <T extends (...args: any[]) => any>(
  func: T,
  name: string
): T => {
  return ((...args: Parameters<T>) => {
    const start = performance.now();
    const result = func.apply(this, args);
    const end = performance.now();
    
    if (end - start > 16) { // Log if takes longer than one frame
      console.warn(`Performance: ${name} took ${end - start}ms`);
    }
    
    return result;
  }) as T;
};

// Debounce utility with performance awareness
export const createPerformanceAwareDebounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T => {
  let timeoutId: NodeJS.Timeout;
  const optimizer = PerformanceOptimizer.getInstance();
  
  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    
    const metrics = optimizer.getMetrics();
    const adaptiveDelay = metrics.fps < 30 ? delay * 1.5 : delay;
    
    timeoutId = setTimeout(() => func.apply(this, args), adaptiveDelay);
  }) as T;
};