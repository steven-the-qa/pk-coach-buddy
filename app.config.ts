type ExpoConfig = {
  expo: {
    name: string;
    slug: string;
    version: string;
    orientation: 'portrait' | 'landscape' | 'default';
    icon: string;
    scheme: string;
    userInterfaceStyle: 'light' | 'dark' | 'automatic';
    newArchEnabled: boolean;
    ios: {
      supportsTablet: boolean;
      bundleIdentifier: string;
      infoPlist: {
        ITSAppUsesNonExemptEncryption: boolean;
      };
    };
    web: {
      bundler: 'metro';
      output: 'single';
      favicon: string;
    };
    android: {
      package: string;
      versionCode: number;
      permissions: string[];
    };
    plugins: string[];
    experiments: {
      typedRoutes: boolean;
    };
    extra: {
      supabaseUrl?: string;
      supabaseKey?: string;
      geminiApiKey?: string;
      googleClientIdIos?: string;
      router: {
        origin: boolean;
      };
      eas: {
        projectId: string;
      };
    };
    updates: {
      url: string;
    };
    runtimeVersion: {
      policy: string;
    };
  };
  hooks?: {
    postPublish: Array<{
      file: string;
      config: {
        organization?: string;
        project?: string;
        authToken?: string;
      };
    }>;
  };
};

const config: ExpoConfig = {
  expo: {
    name: "pk-coach-buddy",
    slug: "pk-coach-buddy",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "com.boutchersj.pkcoachbuddy",
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
      supabaseUrl: process.env.SUPABASE_URL ?? "https://ovmsheguhtvhomizosbs.supabase.co",
      supabaseKey: process.env.SUPABASE_ANON_KEY ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92bXNoZWd1aHR2aG9taXpvc2JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NjU0MjQsImV4cCI6MjA1NjM0MTQyNH0.h88UsrQTJSdA1RMwb2i6xt_4vWVktbQ12V261TQFbVc",
      geminiApiKey: process.env.GEMINI_API_KEY,
      googleClientIdIos: process.env.GOOGLE_CLIENT_ID_IOS,
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
  }
};

export default config; 