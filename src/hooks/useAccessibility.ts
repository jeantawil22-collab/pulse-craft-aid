import { useEffect, useCallback, useState } from 'react';
import { useLocalStorage } from './useLocalStorage';

interface AccessibilitySettings {
  reducedMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  audioFeedback: boolean;
}

export const useAccessibility = () => {
  const [settings, setSettings] = useLocalStorage<AccessibilitySettings>('accessibilitySettings', {
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    screenReader: false,
    keyboardNavigation: true,
    audioFeedback: false,
  });

  const [isScreenReaderActive, setIsScreenReaderActive] = useState(false);

  // Detect system preferences
  useEffect(() => {
    const detectSystemPreferences = () => {
      // Detect reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // Detect high contrast preference
      const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
      
      // Detect screen reader
      const screenReaderDetected = window.navigator.userAgent.includes('NVDA') ||
                                   window.navigator.userAgent.includes('JAWS') ||
                                   !!window.speechSynthesis;

      setSettings(prev => ({
        ...prev,
        reducedMotion: prefersReducedMotion || prev.reducedMotion,
        highContrast: prefersHighContrast || prev.highContrast,
        screenReader: screenReaderDetected || prev.screenReader,
      }));

      setIsScreenReaderActive(screenReaderDetected);
    };

    detectSystemPreferences();

    // Listen for media query changes
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, reducedMotion: e.matches }));
    };

    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, highContrast: e.matches }));
    };

    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);
    highContrastQuery.addEventListener('change', handleHighContrastChange);

    return () => {
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
      highContrastQuery.removeEventListener('change', handleHighContrastChange);
    };
  }, [setSettings]);

  // Apply accessibility settings to DOM
  useEffect(() => {
    const root = document.documentElement;
    
    // Reduced motion
    if (settings.reducedMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
      root.style.setProperty('--transition-duration', '0.01ms');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }

    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Large text
    if (settings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    // Keyboard navigation
    if (settings.keyboardNavigation) {
      root.classList.add('keyboard-navigation');
    } else {
      root.classList.remove('keyboard-navigation');
    }
  }, [settings]);

  const updateSetting = useCallback((key: keyof AccessibilitySettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, [setSettings]);

  const announceToScreenReader = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!settings.screenReader && !isScreenReaderActive) return;

    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, [settings.screenReader, isScreenReaderActive]);

  const playAudioFeedback = useCallback((type: 'success' | 'error' | 'warning' | 'info') => {
    if (!settings.audioFeedback) return;

    // Create audio feedback using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Different frequencies for different types
    const frequencies = {
      success: 800,
      error: 300,
      warning: 600,
      info: 500,
    };

    oscillator.frequency.setValueAtTime(frequencies[type], audioContext.currentTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  }, [settings.audioFeedback]);

  // Keyboard navigation helpers
  const handleKeyboardNavigation = useCallback((event: KeyboardEvent) => {
    if (!settings.keyboardNavigation) return;

    // Skip links for screen readers
    if (event.key === 'Tab' && event.shiftKey && document.activeElement === document.body) {
      const skipLink = document.querySelector('[data-skip-to-content]') as HTMLElement;
      if (skipLink) {
        event.preventDefault();
        skipLink.focus();
      }
    }

    // Escape to close modals/dropdowns
    if (event.key === 'Escape') {
      const openModal = document.querySelector('[role="dialog"][aria-hidden="false"]') as HTMLElement;
      const openDropdown = document.querySelector('[aria-expanded="true"]') as HTMLElement;
      
      if (openModal) {
        const closeButton = openModal.querySelector('[data-close]') as HTMLElement;
        closeButton?.click();
      } else if (openDropdown) {
        openDropdown.click();
      }
    }
  }, [settings.keyboardNavigation]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyboardNavigation);
    return () => document.removeEventListener('keydown', handleKeyboardNavigation);
  }, [handleKeyboardNavigation]);

  // Focus management
  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKeyPress = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKeyPress);
    return () => container.removeEventListener('keydown', handleTabKeyPress);
  }, []);

  return {
    settings,
    updateSetting,
    announceToScreenReader,
    playAudioFeedback,
    trapFocus,
    isScreenReaderActive,
  };
};