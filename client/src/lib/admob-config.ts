
// Production AdMob Configuration
export const ADMOB_CONFIG = {
  // Your AdMob App ID
  APP_ID: import.meta.env.VITE_ADMOB_APP_ID || '',
  
  // Your AdSense Client ID (ca-pub-xxxxxxxxxxxxxxxx)
  CLIENT_ID: import.meta.env.VITE_ADMOB_CLIENT_ID || '',
  
  // Ad Unit IDs for different ad types
  AD_UNITS: {
    // Banner ads for main pages
    BANNER_HOME: import.meta.env.VITE_ADMOB_BANNER_HOME || '',
    BANNER_PROFILE: import.meta.env.VITE_ADMOB_BANNER_PROFILE || '',
    BANNER_PET_LIST: import.meta.env.VITE_ADMOB_BANNER_PET_LIST || '',
    
    // Interstitial ads for transitions
    INTERSTITIAL_PET_ADD: import.meta.env.VITE_ADMOB_INTERSTITIAL_PET_ADD || '',
    INTERSTITIAL_MEDICAL_RECORD: import.meta.env.VITE_ADMOB_INTERSTITIAL_MEDICAL || '',
    
    // Rewarded ads for premium features
    REWARDED_PREMIUM_FEATURE: import.meta.env.VITE_ADMOB_REWARDED_PREMIUM || '',
  },
  
  // Production ad placement settings
  SETTINGS: {
    // Show banner ads in production
    SHOW_BANNERS: true,
    
    // Show interstitial ads every 3 actions
    INTERSTITIAL_FREQUENCY: 3,
    
    // Minimum time between interstitial ads (in minutes)
    INTERSTITIAL_COOLDOWN: 5,
    
    // Disable test mode in production
    TEST_MODE: false,
  }
};
