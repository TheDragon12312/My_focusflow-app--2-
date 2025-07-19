
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'app.lovable.02b271a5be064bc7b0cd0b0d710622c1',
  appName: 'FocusFlow',
  webDir: 'dist',
  server: {
    url: 'https://02b271a5-be06-4bc7-b0cd-0b0d710622c1.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#f0f9ff',
      showSpinner: false
    }
  }
};

export default config;
