
import * as React from "react";
import { useState, useEffect } from 'react';

interface AdMobConfig {
  clientId: string;
  bannerAdSlot: string;
  interstitialAdSlot: string;
  rewardedAdSlot?: string;
}

export function useAdMob(config?: AdMobConfig) {
  const [adsLoaded, setAdsLoaded] = useState(false);
  const [showInterstitial, setShowInterstitial] = useState(false);

  useEffect(() => {
    // Check if AdSense script is loaded
    const checkAdSense = () => {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        setAdsLoaded(true);
      }
    };

    checkAdSense();
    
    // Set up a timer to check periodically if ads aren't loaded yet
    const interval = setInterval(() => {
      if (!adsLoaded) {
        checkAdSense();
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [adsLoaded]);

  const showInterstitialAd = () => {
    if (adsLoaded && config?.interstitialAdSlot) {
      setShowInterstitial(true);
    }
  };

  const hideInterstitialAd = () => {
    setShowInterstitial(false);
  };

  return {
    adsLoaded,
    showInterstitial,
    showInterstitialAd,
    hideInterstitialAd,
    config
  };
}
