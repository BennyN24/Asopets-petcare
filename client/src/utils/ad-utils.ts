
import { ADMOB_CONFIG, TEST_AD_UNITS } from '@/lib/admob-config';

// Track user actions for interstitial ad frequency
let actionCount = 0;
let lastInterstitialTime = 0;

export const adUtils = {
  // Initialize AdMob (call this in your main app component)
  initialize: () => {
    if (typeof window !== 'undefined' && !window.adsbygoogle) {
      window.adsbygoogle = [];
    }
  },

  // Get the appropriate ad unit ID (test or production)
  getAdUnit: (adType: keyof typeof ADMOB_CONFIG.AD_UNITS) => {
    if (ADMOB_CONFIG.SETTINGS.TEST_MODE) {
      switch (adType) {
        case 'BANNER_HOME':
        case 'BANNER_PROFILE':
        case 'BANNER_PET_LIST':
          return TEST_AD_UNITS.BANNER;
        case 'INTERSTITIAL_PET_ADD':
        case 'INTERSTITIAL_MEDICAL_RECORD':
          return TEST_AD_UNITS.INTERSTITIAL;
        case 'REWARDED_PREMIUM_FEATURE':
          return TEST_AD_UNITS.REWARDED;
        default:
          return TEST_AD_UNITS.BANNER;
      }
    }
    return ADMOB_CONFIG.AD_UNITS[adType];
  },

  // Check if we should show an interstitial ad
  shouldShowInterstitial: () => {
    if (!ADMOB_CONFIG.SETTINGS.SHOW_BANNERS) return false;
    
    actionCount++;
    const now = Date.now();
    const timeSinceLastAd = (now - lastInterstitialTime) / (1000 * 60); // minutes
    
    if (
      actionCount >= ADMOB_CONFIG.SETTINGS.INTERSTITIAL_FREQUENCY &&
      timeSinceLastAd >= ADMOB_CONFIG.SETTINGS.INTERSTITIAL_COOLDOWN
    ) {
      actionCount = 0;
      lastInterstitialTime = now;
      return true;
    }
    
    return false;
  },

  // Track user action (call this on important user actions)
  trackAction: (action: string) => {
    console.log(`AdMob: User action tracked - ${action}`);
    // You can add analytics tracking here if needed
  },

  // Load and display an ad
  loadAd: (element: HTMLElement) => {
    if (typeof window !== 'undefined' && window.adsbygoogle) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('Error loading ad:', error);
      }
    }
  }
};
