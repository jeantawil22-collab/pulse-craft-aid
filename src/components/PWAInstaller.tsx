import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Smartphone, X, Wifi, WifiOff } from 'lucide-react';
import { usePWA, useOfflineStatus } from '@/hooks/usePWA';
import { motion, AnimatePresence } from 'framer-motion';

export const PWAInstaller: React.FC = () => {
  const { isInstallable, isInstalled, installApp } = usePWA();
  const isOffline = useOfflineStatus();
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [showOfflineIndicator, setShowOfflineIndicator] = useState(false);

  useEffect(() => {
    if (isInstallable && !isInstalled) {
      const hasSeenPrompt = localStorage.getItem('pwa-install-prompt-seen');
      if (!hasSeenPrompt) {
        setTimeout(() => setShowInstallPrompt(true), 5000);
      }
    }
  }, [isInstallable, isInstalled]);

  useEffect(() => {
    setShowOfflineIndicator(isOffline);
  }, [isOffline]);

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      setShowInstallPrompt(false);
      localStorage.setItem('pwa-install-prompt-seen', 'true');
    }
  };

  const dismissPrompt = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-prompt-seen', 'true');
  };

  return (
    <>
      {/* Offline Indicator */}
      <AnimatePresence>
        {showOfflineIndicator && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <Card className="bg-warning text-warning-foreground">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <WifiOff className="w-4 h-4" />
                  <span className="text-sm font-medium">You're offline</span>
                  <Badge variant="secondary" className="text-xs">
                    Working in offline mode
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Install Prompt */}
      <AnimatePresence>
        {showInstallPrompt && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
          >
            <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Smartphone className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">Install FitAI Pro</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Add to your home screen for quick access and offline features
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Button size="sm" onClick={handleInstall} className="flex-1">
                        <Download className="w-3 h-3 mr-1" />
                        Install
                      </Button>
                      <Button size="sm" variant="ghost" onClick={dismissPrompt}>
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Online Status Indicator (when coming back online) */}
      <AnimatePresence>
        {!isOffline && showOfflineIndicator && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            onAnimationComplete={() => {
              setTimeout(() => setShowOfflineIndicator(false), 3000);
            }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <Card className="bg-success text-success-foreground">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4" />
                  <span className="text-sm font-medium">Back online</span>
                  <Badge variant="secondary" className="text-xs">
                    Syncing data...
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PWA Features Info (for installed apps) */}
      {isInstalled && (
        <div className="hidden">
          {/* This component provides PWA features when app is installed */}
          <div className="pwa-installed">
            <p>App installed successfully!</p>
          </div>
        </div>
      )}
    </>
  );
};