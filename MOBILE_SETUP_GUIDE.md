# 📱 Mobile App Setup Guide

Your Next.js chatbot has been successfully configured for mobile app development using Capacitor! This guide will help you build and deploy your app to Android and iOS.

## ✅ What's Already Done

- ✅ Capacitor installed and initialized
- ✅ Next.js configured for static export
- ✅ Android platform added
- ✅ iOS platform added (requires additional setup)
- ✅ Build scripts configured
- ✅ App configured with ID: `com.gk.chatbot`

## 🏗️ Project Structure

```
gk-chatbot/
├── android/          # Android native project
├── ios/             # iOS native project  
├── out/             # Static export output
├── capacitor.config.ts
└── ...
```

## 🚀 Development Workflow

### Building for Mobile
```bash
# Build and sync web assets to native projects
npm run build:mobile

# Or step by step:
npx next build     # Build static export
npx cap sync       # Copy to native projects
```

### Opening Native IDEs
```bash
# Open Android Studio
npm run android
# or: npx cap open android

# Open Xcode (macOS only)
npm run ios
# or: npx cap open ios
```

## 📱 Android Development

### Prerequisites
1. **Android Studio** - Download from [developer.android.com](https://developer.android.com/studio)
2. **Java 17** - Required for Android development

### Setup Steps
1. Open Android Studio
2. Install Android SDK (API level 34 recommended)
3. Create/connect Android Virtual Device (AVD) or physical device
4. Enable USB debugging on physical device

### Building & Running
1. Run `npm run build:mobile`
2. Run `npm run android` to open Android Studio
3. Wait for Gradle sync to complete
4. Click ▶️ Run button or press Shift+F10
5. Select device/emulator and run

## 🍎 iOS Development (macOS only)

### Prerequisites
1. **Xcode** - Download from Mac App Store
2. **CocoaPods** - Install with: `sudo gem install cocoapods`
3. **Apple Developer Account** - For device testing and App Store

### Setup Steps
1. Install CocoaPods dependencies:
   ```bash
   cd ios/App
   pod install
   cd ../..
   ```

2. Open Xcode:
   ```bash
   npm run ios
   ```

3. Configure code signing:
   - Select your project in Xcode
   - Go to "Signing & Capabilities"
   - Select your Apple Developer team
   - Choose a unique Bundle Identifier

### Building & Running
1. Run `npm run build:mobile`
2. Run `npm run ios` to open Xcode
3. Select device/simulator from dropdown
4. Click ▶️ Run button or press Cmd+R

## 🔧 Configuration

### App Information
- **App Name**: GK Chatbot
- **Bundle ID**: com.gk.chatbot
- **Web Directory**: `out/`

### Capacitor Config (`capacitor.config.ts`)
```typescript
const config: CapacitorConfig = {
  appId: 'com.gk.chatbot',
  appName: 'GK Chatbot',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    allowNavigation: ['*'],
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: '#ffffff',
    },
  },
};
```

## 🔄 Live Reload Development

For faster development, you can run the app with live reload:

1. Start Next.js dev server:
   ```bash
   npm run dev
   ```

2. Update `capacitor.config.ts` temporarily:
   ```typescript
   server: {
     url: 'http://localhost:3000',
     cleartext: true
   }
   ```

3. Sync and run:
   ```bash
   npx cap sync
   npx cap run android  # or ios
   ```

**Remember**: Remove the server URL before building for production!

## 📦 Adding Native Features

Capacitor provides plugins for native features:

```bash
# Camera access
npm install @capacitor/camera

# Device info
npm install @capacitor/device

# Haptics
npm install @capacitor/haptics

# After installing plugins:
npx cap sync
```

## 🚀 Production Build

### Android APK/AAB
1. Open Android Studio
2. Build → Generate Signed Bundle/APK
3. Follow signing wizard
4. Choose release build type

### iOS App Store
1. Open Xcode
2. Product → Archive
3. Upload to App Store Connect
4. Submit for review

## 🐛 Troubleshooting

### Common Issues

**Build Errors**:
- Clean build: `npx cap sync --force`
- Rebuild: `rm -rf out && npm run build:mobile`

**Android Issues**:
- Update Android SDK
- Check Java version (should be 17)
- Clear Gradle cache

**iOS Issues**:
- Run `pod install` in `ios/App/`
- Update CocoaPods: `pod repo update`
- Check Xcode command line tools

**Network Requests**:
- API calls won't work in production build (static export)
- Consider using Capacitor's HTTP plugin for native requests

## 📚 Next Steps

1. Test your app thoroughly on physical devices
2. Add app icons and splash screens
3. Configure app store metadata
4. Consider adding native features like push notifications
5. Set up CI/CD for automated builds

## 🔗 Useful Links

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com/guide)
- [iOS Developer Guide](https://developer.apple.com/documentation/)
- [Capacitor Plugins](https://capacitorjs.com/docs/plugins)

---

🎉 **Your Next.js chatbot is now ready for mobile!** Start by running `npm run build:mobile` and then opening your preferred IDE.
