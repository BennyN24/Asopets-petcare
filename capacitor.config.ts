import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.asopets.app',
  appName: 'ASOPETS',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
    url: 'https://7767d013-98a9-476c-9458-5bf49e1da2a1-00-39bhyddb787f0.picard.replit.dev',
    cleartext: false,
    allowNavigation: [
      'https://7767d013-98a9-476c-9458-5bf49e1da2a1-00-39bhyddb787f0.picard.replit.dev',
      'https://*.replit.dev',
      'https://asopets.com'
    ]
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      releaseType: 'APK'
    },
    allowMixedContent: false
  }
};

export default config;
