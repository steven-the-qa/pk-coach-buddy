declare module 'expo-constants' {
  import Constants from 'expo-constants';
  
  export interface ExpoConfig {
    name: string;
    slug: string;
    version: string;
    orientation: string;
    icon: string;
    userInterfaceStyle: string;
    splash: {
      image: string;
      resizeMode: string;
      backgroundColor: string;
    };
    extra: {
      supabaseUrl: string;
      supabaseKey: string;
      geminiApiKey: string;
      googleClientIdIos: string;
    };
    // ...other properties
  }

  export interface AppConfig {
    expoConfig: ExpoConfig | null;
    // ...other properties
  }

  // Extend existing Constants with our custom types
  export default Constants as Constants & AppConfig;
} 