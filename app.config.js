import 'dotenv/config';

export default {
  expo: {
    name: "pk-coach-buddy",
    slug: "pk-coach-buddy",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "pkcoachbuddy",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.boutchersj.pkcoachbuddy",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false
      }
    },
    web: {
      bundler: "metro",
      output: "single",
      favicon: "./assets/images/favicon.png"
    },
    android: {
      package: "com.boutchersj.pkcoachbuddy",
      versionCode: 1,
      permissions: [
        "android.permission.INTERNET"
      ]
    },
    plugins: [
      "expo-router"
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      // Environment variables with fallbacks for development
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
      geminiApiKey: process.env.GEMINI_API_KEY,
      googleClientIdIos: process.env.GOOGLE_CLIENT_ID_IOS,
      
      // Other configuration values
      router: {
        origin: false
      },
      eas: {
        projectId: "93da7bf7-6205-43df-9ba1-5df12e3ffc66"
      }
    },
    updates: {
      url: "https://u.expo.dev/93da7bf7-6205-43df-9ba1-5df12e3ffc66"
    },
    runtimeVersion: {
      policy: "appVersion"
    }
  },
  // Optional: Add environment-specific configuration
  hooks: {
    postPublish: [
      {
        file: "sentry-expo/upload-sourcemaps",
        config: {
          organization: process.env.SENTRY_ORG,
          project: process.env.SENTRY_PROJECT,
          authToken: process.env.SENTRY_AUTH_TOKEN
        }
      }
    ]
  },
}; 