import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ttraigo.app',
  appName: 'Ttraigo',
  webDir: 'www',
  server: {
    url: 'https://www.ttraigo.com/app-mobile.html',
    cleartext: false
  }
};

export default config;
