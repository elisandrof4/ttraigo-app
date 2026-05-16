import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ttraigo.app',
  appName: 'Ttraigo',
  webDir: 'www',
  server: {
    url: 'https://www.ttraigo.com',
    cleartext: false
  },
  plugins: {
    Geolocation: {
      permissions: ['location']
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }
};

export default config;
