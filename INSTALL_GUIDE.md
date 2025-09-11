# 📱 Android Studio & Xcode Installation Guide

## 🤖 Android Studio Installation

### 1. Download Android Studio
- Go to [developer.android.com/studio](https://developer.android.com/studio)
- Click "Download Android Studio"
- Accept the license terms and download

### 2. Install Android Studio
**macOS:**
- Open the downloaded `.dmg` file
- Drag Android Studio to Applications folder
- Launch from Applications

**Windows:**
- Run the downloaded `.exe` file
- Follow the installation wizard
- Choose "Standard" installation type

### 3. First Launch Setup
1. Start Android Studio
2. Choose "Do not import settings" (first time)
3. Click "Next" through the welcome wizard
4. Choose "Standard" setup type
5. Accept all license agreements
6. Let it download SDK components (this takes a while!)

### 4. Install Required Components
1. Go to Tools → SDK Manager
2. In "SDK Platforms" tab, install:
   - Android 14 (API level 34)
   - Android 13 (API level 33)
3. In "SDK Tools" tab, ensure these are installed:
   - Android SDK Build-Tools
   - Android Emulator
   - Android SDK Platform-Tools
   - Intel x86 Emulator Accelerator (if Intel Mac/PC)

### 5. Create Virtual Device (Optional)
1. Go to Tools → AVD Manager
2. Click "Create Virtual Device"
3. Choose a phone (e.g., Pixel 7)
4. Download and select a system image (API 34 recommended)
5. Click "Finish"

## 🍎 Xcode Installation (macOS only)

### 1. Install Xcode
- Open Mac App Store
- Search for "Xcode"
- Click "Get" or "Install" (it's free but large ~15GB)
- Wait for download and installation (can take 30+ minutes)

### 2. Launch Xcode
- Open Xcode from Applications
- Accept license agreement
- Install additional components when prompted
- Sign in with Apple ID if you plan to test on device

### 3. Install Command Line Tools
```bash
xcode-select --install
```

### 4. Install CocoaPods
```bash
sudo gem install cocoapods
```

### 5. Setup iOS Simulator
- In Xcode: Window → Devices and Simulators
- Click "Simulators" tab
- Click "+" to add simulator if needed
- Choose iPhone 15 or latest available

## ✅ Verify Installation

### Test Android Studio
1. Run: `npm run build:mobile`
2. Run: `npm run android`
3. Android Studio should open your project
4. You should see "GK Chatbot" in the project panel

### Test Xcode (macOS)
1. Run: `cd ios/App && pod install && cd ../..`
2. Run: `npm run ios`
3. Xcode should open your project
4. You should see "GK Chatbot" in the navigator

## 🎯 Next Steps

Once installed:

**For Android:**
1. Run `npm run build:mobile`
2. Run `npm run android`
3. Click ▶️ in Android Studio to run on emulator
4. Or connect your Android phone with USB debugging enabled

**For iOS:**
1. Run `npm run build:mobile`
2. Run `npm run ios`
3. Click ▶️ in Xcode to run on simulator
4. Or connect your iPhone and configure code signing

## 🔧 Troubleshooting

**Android Studio won't open project:**
- Try: `npx cap sync android`
- Check that Java 17 is installed

**Xcode build errors:**
- Run: `cd ios/App && pod install`
- Update to latest Xcode version
- Check Xcode command line tools

**General issues:**
- Restart your computer after installation
- Make sure you have enough disk space (20GB+ recommended)
- Check your internet connection for downloads

---

🚀 **Ready to build mobile apps!** Follow the steps above and you'll have both Android Studio and Xcode ready for your GK Chatbot mobile development.
