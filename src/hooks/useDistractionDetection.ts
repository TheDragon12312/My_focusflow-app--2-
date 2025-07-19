
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface DistractionData {
  appName: string;
  category: string;
  duration: number;
  timestamp: Date;
}

export const useDistractionDetection = () => {
  const { user } = useAuth();
  const [isEnabled, setIsEnabled] = useState(false);
  const [currentDistractions, setCurrentDistractions] = useState<DistractionData[]>([]);

  // Simuleer schermtijd API integratie
  const detectScreenTime = async (): Promise<DistractionData[]> => {
    // In een echte implementatie zou dit verbinden met:
    // - Windows: GetForegroundWindow() API
    // - macOS: NSWorkspace API  
    // - Android: UsageStatsManager
    // - iOS: Screen Time API (beperkt beschikbaar)
    
    // Voor demo simuleren we wat data
    const mockData: DistractionData[] = [];
    
    if (Math.random() < 0.3) { // 30% kans op detectie
      const apps = [
        { name: 'Facebook', category: 'social_media' },
        { name: 'Instagram', category: 'social_media' },
        { name: 'YouTube', category: 'entertainment' },
        { name: 'Netflix', category: 'entertainment' },
        { name: 'Nu.nl', category: 'news' },
      ];
      
      const randomApp = apps[Math.floor(Math.random() * apps.length)];
      mockData.push({
        appName: randomApp.name,
        category: randomApp.category,
        duration: Math.floor(Math.random() * 600) + 120, // 2-12 minuten
        timestamp: new Date(),
      });
    }
    
    return mockData;
  };

  const recordDistraction = async (distraction: DistractionData) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('distractions')
        .insert({
          user_id: user.id,
          app_name: distraction.appName,
          category: distraction.category,
          duration: distraction.duration,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error recording distraction:', error);
    }
  };

  const startMonitoring = () => {
    setIsEnabled(true);
  };

  const stopMonitoring = () => {
    setIsEnabled(false);
    setCurrentDistractions([]);
  };

  // Monitor afleidingen elke 30 seconden
  useEffect(() => {
    if (!isEnabled || !user) return;

    const interval = setInterval(async () => {
      const distractions = await detectScreenTime();
      
      if (distractions.length > 0) {
        setCurrentDistractions(distractions);
        
        // Record significante afleidingen (>2 minuten)
        for (const distraction of distractions) {
          if (distraction.duration > 120) {
            await recordDistraction(distraction);
          }
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isEnabled, user]);

  return {
    isEnabled,
    currentDistractions,
    startMonitoring,
    stopMonitoring,
  };
};
