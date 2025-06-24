
// AdMob Configuration
// Replace these placeholder values with your actual AdMob IDs

export const ADMOB_CONFIG = {
  // Your AdMob App ID
  APP_ID: process.env.REACT_APP_ADMOB_APP_ID || '',
  
  // Your AdSense Client ID (ca-pub-xxxxxxxxxxxxxxxx)
  CLIENT_ID: process.env.REACT_APP_ADMOB_CLIENT_ID || '',
  
  // Ad Unit IDs for different ad types
  AD_UNITS: {
    // Banner ads for main pages
    BANNER_HOME: process.env.REACT_APP_ADMOB_BANNER_HOME || '',
    BANNER_PROFILE: process.env.REACT_APP_ADMOB_BANNER_PROFILE || '',
    BANNER_PET_LIST: process.env.REACT_APP_ADMOB_BANNER_PET_LIST || '',
    
    // Interstitial ads for transitions
    INTERSTITIAL_PET_ADD: process.env.REACT_APP_ADMOB_INTERSTITIAL_PET_ADD || '',
    INTERSTITIAL_MEDICAL_RECORD: process.env.REACT_APP_ADMOB_INTERSTITIAL_MEDICAL || '',
    
    // Rewarded ads for premium features
    REWARDED_PREMIUM_FEATURE: process.env.REACT_APP_ADMOB_REWARDED_PREMIUM || '',
  },
  
  // Ad placement settings
  SETTINGS: {
    // Show banner ads
    SHOW_BANNERS: process.env.NODE_ENV === 'production',
    
    // Show interstitial ads every N actions
    INTERSTITIAL_FREQUENCY: 3,
    
    // Minimum time between interstitial ads (in minutes)
    INTERSTITIAL_COOLDOWN: 5,
    
    // Enable test mode (set to false in production)
    TEST_MODE: process.env.NODE_ENV !== 'production',
  }
};

// Test Ad Unit IDs (use these during development)
export const TEST_AD_UNITS = {
  BANNER: 'ca-app-pub-3940256099942544/6300978111',
  INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
  REWARDED: 'ca-app-pub-3940256099942544/5224354917',
};
