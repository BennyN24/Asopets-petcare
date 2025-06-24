# AdMob Integration Setup Guide

## Overview
Your ASOPETS app is now prepared for Google AdMob integration. Follow these steps to complete the setup.

## 1. Google AdMob Account Setup

1. Go to [Google AdMob](https://admob.google.com/)
2. Create an account or sign in
3. Add your app to AdMob
4. Create ad units for your app

## 2. Get Your AdMob IDs

After setting up your app in AdMob, you'll receive:
- **App ID**: `ca-app-pub-XXXXXXXXXXXXXXXXX~XXXXXXXXXX`
- **Client ID**: `ca-pub-XXXXXXXXXXXXXXXXX`
- **Ad Unit IDs** for each ad placement

## 3. Configure Environment Variables

1. Copy `.env.example` to `.env`
2. Replace the placeholder values with your actual AdMob IDs:

```env
VITE_ADMOB_APP_ID=ca-app-pub-YOUR_PUBLISHER_ID~YOUR_APP_ID
VITE_ADMOB_CLIENT_ID=ca-pub-YOUR_PUBLISHER_ID
VITE_ADMOB_BANNER_HOME=ca-app-pub-YOUR_PUBLISHER_ID/YOUR_BANNER_AD_UNIT_ID
# ... etc
```

## 4. Add AdSense Script to HTML

Update `client/index.html` and replace the commented AdMob script with your actual script:

```html
<!-- Replace this commented line -->
<!-- <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXX" crossorigin="anonymous"></script> -->

<!-- With your actual script -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID" crossorigin="anonymous"></script>
```

## 5. Update AdMob Configuration

In `client/src/lib/admob-config.ts`, you can:
- Adjust ad frequency settings
- Enable/disable test mode
- Configure which pages show ads

## 6. Ad Placements Already Configured

The app includes ad placements in:
- **Profile page**: Banner ad after statistics
- **Dashboard**: Ready for banner integration
- **Pet pages**: Ready for interstitial ads

## 7. Testing

During development (NODE_ENV !== 'production'):
- Test ad units are automatically used
- No real ads will be served
- You can test ad placements safely

## 8. Production Deployment

When deploying to production:
- Set `NODE_ENV=production`
- Ensure all environment variables are set
- Test on real devices to verify ad display

## 9. Ad Components Available

- `<AdBanner>`: For banner advertisements
- `<AdInterstitial>`: For full-screen ads
- `useAdMob()`: Hook for ad management
- `adUtils`: Utility functions for ad logic

## 10. Revenue Optimization Tips

1. **Strategic Placement**: Ads are placed in natural break points
2. **Frequency Control**: Interstitial ads have built-in cooldown
3. **User Experience**: Ads don't interfere with core functionality
4. **Mobile Optimized**: All ad units are responsive

## Support

For AdMob-specific issues, refer to:
- [Google AdMob Documentation](https://developers.google.com/admob)
- [AdSense Help Center](https://support.google.com/adsense)

The app infrastructure is ready - you just need to add your AdMob credentials!