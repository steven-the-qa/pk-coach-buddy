import React, { useEffect, useState } from 'react';
import { useRouter, Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider } from '../lib/ThemeContext';
import { useAuth } from '../lib/hooks/useAuth';
import { MagicLinkAuth } from '../components/auth/MagicLinkAuth';
import 'react-native-url-polyfill/auto';
import { Text, View } from 'react-native';
import LoadingScreen from '../components/LoadingScreen';
import * as Linking from 'expo-linking';
import * as QueryParams from 'expo-auth-session/build/QueryParams';

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

// Define deep linking configuration for Expo Router
export const linking = {
  prefixes: ['pkcoachbuddy://', 'https://pkcoachbuddy.com'],
  config: {
    initialRouteName: '/(tabs)',
    screens: {
      '/(tabs)': {
        screens: {
          index: 'home',
          sessions: 'sessions',
          journal: 'journal',
          knowledge: 'knowledge',
          settings: 'settings',
        }
      },
      '+not-found': '*',
    }
  },
};

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

// Root layout wrapper with providers
export default function RootLayout() {
  return (
    <ThemeProvider>
      <StatusBar style="auto" />
      <RootLayoutNav />
    </ThemeProvider>
  );
}

// Navigation component
function RootLayoutNav() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [initialRenderComplete, setInitialRenderComplete] = useState(false);
  
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
    'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
  });

  // Set up deep linking handler
  useEffect(() => {
    // Handle initial URL that opened the app
    const getInitialURL = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        console.log("App opened with URL:", url);
        const { params } = QueryParams.getQueryParams(url);
        if (params?.access_token) {
          // Handle magic link auth redirect
          router.replace('/(tabs)');
        }
      }
    };

    getInitialURL();

    // Listen for incoming links while the app is open
    const subscription = Linking.addEventListener('url', (event) => {
      console.log("Incoming link while app is open:", event.url);
      const { params } = QueryParams.getQueryParams(event.url);
      if (params?.access_token) {
        // Handle magic link auth redirect
        router.replace('/(tabs)');
      }
    });

    return () => {
      subscription.remove();
    };
  }, [router]);

  // Mark initial render as complete
  useEffect(() => {
    setInitialRenderComplete(true);
  }, []);

  // Handle font loading
  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned)
      SplashScreen.hideAsync();
    }
    
    // For web compatibility
    if (typeof window !== 'undefined' && window.frameworkReady) {
      window.frameworkReady();
    }
  }, [fontsLoaded, fontError]);

  // Show loading screen while fonts are loading or auth is being checked
  if ((!fontsLoaded && !fontError) || authLoading) {
    return <LoadingScreen message="Starting app..." />;
  }

  // Special handling for web platform to avoid hydration issues
  if (typeof window !== 'undefined' && !initialRenderComplete) {
    return <View style={{ flex: 1 }} />;
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return <MagicLinkAuth />;
  }

  // This Slot renders the current route when authenticated
  return <Slot />;
}

// A custom error boundary to catch any navigation errors
function ErrorBoundary(props: { children: React.ReactNode }) {
  const [hasError, setHasError] = useState(false);
  
  useEffect(() => {
    if (hasError) {
      console.error('Navigation error occurred, resetting...');
      // Reset the error state after a delay
      const timeout = setTimeout(() => {
        setHasError(false);
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [hasError]);
  
  if (hasError) {
    return <Text style={{ padding: 20 }}>Loading...</Text>;
  }
  
  return (
    <React.Fragment>
      {props.children}
    </React.Fragment>
  );
}