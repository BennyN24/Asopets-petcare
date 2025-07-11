
import * as React from 'react';
import { useEffect } from 'react';

interface AdInterstitialProps {
  adSlot: string;
  show: boolean;
  onClose?: () => void;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function AdInterstitial({ adSlot, show, onClose }: AdInterstitialProps) {
  useEffect(() => {
    if (show && typeof window !== 'undefined' && window.adsbygoogle && adSlot) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense Interstitial error:', error);
      }
    }
  }, [show, adSlot]);

  if (!show || !adSlot) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-4 max-w-sm w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600">Advertisement</span>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          )}
        </div>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={process.env.REACT_APP_ADMOB_CLIENT_ID || ''}
          data-ad-slot={adSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
