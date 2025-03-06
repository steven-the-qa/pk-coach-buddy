import 'dotenv/config';

export default {
  name: "PK Coach Buddy",
  slug: "pk-coach-buddy",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.stevenboutcher.pkcoachbuddy"
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    package: "com.stevenboutcher.pkcoachbuddy"
  },
  web: {
    favicon: "./assets/favicon.png"
  },
  extra: {
    // Add environment variables here
    supabaseUrl: process.env.SUPABASE_URL || "https://ovmsheguhtvhomizosbs.supabase.co",
    supabaseKey: process.env.SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92bXNoZWd1aHR2aG9taXpvc2JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NjU0MjQsImV4cCI6MjA1NjM0MTQyNH0.h88UsrQTJSdA1RMwb2i6xt_4vWVktbQ12V261TQFbVc",
    geminiApiKey: process.env.GEMINI_API_KEY || "AIzaSyCFPzPJ9bzRe2bdQh4pEWfrAXDOK1NpPT0",
    googleClientIdIos: process.env.GOOGLE_CLIENT_ID_IOS || "901638648628-oq81g7tje1rjv9c9417fdlrcvujsbkqt.apps.googleusercontent.com",
  }
}; 