# ASOPETS APK Build Guide

## Overview
This guide provides instructions for building Android APK files from the ASOPETS web application using Capacitor.

## Prerequisites
- Java 21 JDK installed
- Android SDK with API level 34+ installed  
- Node.js and npm

## Environment Setup

### Set Environment Variables
```bash
export JAVA_HOME=/nix/store/2vwkssqpzykk37r996cafq7x63imf4sp-openjdk-21+35
export ANDROID_HOME=~/android-sdk
```

## Build Commands

### 1. Build Web Application
```bash
npm run build
```

### 2. Sync with Capacitor Android Platform
```bash
npx cap sync android
```

### 3. Build Debug APK
```bash
cd android && ./gradlew assembleDebug
```

### 4. Build Release APK (for Play Store)
```bash
cd android && ./gradlew assembleRelease
```

## APK Locations
- **Debug APK**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release APK**: `android/app/build/outputs/apk/release/app-release.apk`

## Complete Build Process
```bash
# Full build from scratch
npm run build
npx cap sync android
cd android && ./gradlew clean assembleDebug
```

## Current APK Status
✅ **Debug APK Successfully Generated**
- Location: `android/app/build/outputs/apk/debug/app-debug.apk`
- Size: 14.4 MB
- Build Date: August 31, 2025 (Updated 5:17 PM)
- **New Features**: Push notifications support added

## Google Play Store Requirements

### For Play Store Upload (Release Build)
1. **Build Release APK**:
   ```bash
   cd android && ./gradlew assembleRelease
   ```

2. **Sign the APK** (required for Play Store):
   - Generate a keystore file
   - Configure signing in `android/app/build.gradle`
   - Or use Android App Bundle (AAB) format instead

3. **Recommended: Use Android App Bundle**:
   ```bash
   cd android && ./gradlew bundleRelease
   ```
   This generates an AAB file at: `android/app/build/outputs/bundle/release/app-release.aab`

### App Store Information
- **App ID**: com.asopets.app
- **App Name**: ASOPETS
- **Target SDK**: Android API 35
- **Min SDK**: Android API 23

## Features Included
- Camera access for pet photos
- Location services for vet clinics
- File storage for medical records
- **Push notifications for reminders** (newly configured)
- QR code scanning for pet profiles
- Firebase Cloud Messaging support
- Notification permissions (POST_NOTIFICATIONS)

## Troubleshooting

### Java Version Issues
If you get "invalid source release" errors:
- Ensure Java 21 is installed and JAVA_HOME is set correctly
- Check that all gradle files use `JavaVersion.VERSION_21`

### Android SDK Issues
If you get "SDK location not found" errors:
- Ensure ANDROID_HOME points to your Android SDK installation
- Install required SDK components: `platforms;android-34`, `build-tools;34.0.0`

### Build Failures
- Run `./gradlew clean` before building
- Check that web app builds successfully first
- Ensure all Capacitor plugins are compatible

## Next Steps for Play Store
1. Create a release keystore for app signing
2. Update version numbers in build.gradle
3. Test the APK on physical devices
4. Create Play Store listing with app descriptions, screenshots
5. Upload signed APK/AAB to Google Play Console
6. Complete Play Store review process