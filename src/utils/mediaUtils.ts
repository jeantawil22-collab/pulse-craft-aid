// Media utility functions for camera handling and optimization

export interface CameraConfig {
  width: { ideal: number };
  height: { ideal: number };
  frameRate: { ideal: number; max: number };
  facingMode?: 'user' | 'environment';
}

export interface MediaPipeConfig {
  modelComplexity: number;
  smoothLandmarks: boolean;
  enableSegmentation: boolean;
  minDetectionConfidence: number;
  minTrackingConfidence: number;
}

export class MediaUtils {
  private static supportedConstraints: MediaTrackSupportedConstraints | null = null;

  // Get optimal camera configuration based on device capabilities
  static async getOptimalCameraConfig(): Promise<CameraConfig> {
    if (!this.supportedConstraints) {
      this.supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
    }

    // Detect device type and capabilities
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEnd = navigator.hardwareConcurrency <= 2;

    let config: CameraConfig;

    if (isMobile || isLowEnd) {
      config = {
        width: { ideal: 640 },
        height: { ideal: 480 },
        frameRate: { ideal: 24, max: 30 }
      };
    } else {
      config = {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30, max: 30 }
      };
    }

    return config;
  }

  // Get optimal MediaPipe configuration
  static getOptimalMediaPipeConfig(): MediaPipeConfig {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isLowEnd = navigator.hardwareConcurrency <= 2;

    if (isMobile || isLowEnd) {
      return {
        modelComplexity: 0,
        smoothLandmarks: true,
        enableSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.4
      };
    } else {
      return {
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        minDetectionConfidence: 0.7,
        minTrackingConfidence: 0.6
      };
    }
  }

  // Check camera permission status
  static async checkCameraPermission(): Promise<PermissionState | 'unknown'> {
    try {
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        return permission.state;
      }
      return 'unknown';
    } catch (error) {
      console.warn('Could not check camera permission:', error);
      return 'unknown';
    }
  }

  // Request camera access with fallback resolutions
  static async requestCameraAccess(preferredConfig?: CameraConfig): Promise<MediaStream | null> {
    const config = preferredConfig || await this.getOptimalCameraConfig();
    
    const attempts = [
      // Try preferred configuration
      config,
      // Fallback to lower resolution
      {
        width: { ideal: 640 },
        height: { ideal: 480 },
        frameRate: { ideal: 24, max: 30 }
      },
      // Final fallback
      {
        width: { ideal: 320 },
        height: { ideal: 240 },
        frameRate: { ideal: 15, max: 24 }
      }
    ];

    for (const attempt of attempts) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: attempt,
          audio: false
        });
        
        console.log('Camera access granted with config:', attempt);
        return stream;
      } catch (error) {
        console.warn('Camera access attempt failed:', error);
        continue;
      }
    }

    throw new Error('Unable to access camera with any configuration');
  }

  // Clean up media stream
  static cleanupMediaStream(stream: MediaStream | null) {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
        console.log(`Stopped ${track.kind} track`);
      });
    }
  }

  // Get video element dimensions for canvas matching
  static getVideoElementDimensions(video: HTMLVideoElement) {
    return {
      width: video.videoWidth || video.clientWidth,
      height: video.videoHeight || video.clientHeight,
      aspectRatio: (video.videoWidth || video.clientWidth) / (video.videoHeight || video.clientHeight)
    };
  }

  // Optimize canvas for performance
  static optimizeCanvas(canvas: HTMLCanvasElement, video: HTMLVideoElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Match video dimensions
    const { width, height } = this.getVideoElementDimensions(video);
    canvas.width = width;
    canvas.height = height;

    // Performance optimizations
    ctx.imageSmoothingEnabled = false;
    ctx.globalCompositeOperation = 'source-over';
    
    return ctx;
  }

  // Check WebGL support for potential hardware acceleration
  static checkWebGLSupport(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch (error) {
      return false;
    }
  }

  // Device performance estimation
  static estimateDevicePerformance(): 'high' | 'medium' | 'low' {
    const cores = navigator.hardwareConcurrency || 2;
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const hasWebGL = this.checkWebGLSupport();

    if (cores >= 8 && !isMobile && hasWebGL) {
      return 'high';
    } else if (cores >= 4 && hasWebGL) {
      return 'medium';
    } else {
      return 'low';
    }
  }

  // Load script utility for MediaPipe
  static loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if script already exists
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }

  // Batch load MediaPipe scripts
  static async loadMediaPipeScripts(): Promise<void> {
    const scripts = [
      'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js',
      'https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js',
      'https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js'
    ];

    try {
      await Promise.all(scripts.map(src => this.loadScript(src)));
      console.log('All MediaPipe scripts loaded successfully');
    } catch (error) {
      console.error('Failed to load MediaPipe scripts:', error);
      throw error;
    }
  }
}

// Export utility functions
export const {
  getOptimalCameraConfig,
  getOptimalMediaPipeConfig,
  checkCameraPermission,
  requestCameraAccess,
  cleanupMediaStream,
  getVideoElementDimensions,
  optimizeCanvas,
  checkWebGLSupport,
  estimateDevicePerformance,
  loadScript,
  loadMediaPipeScripts
} = MediaUtils;