import React, { useEffect, useState } from 'react';
import { Stack, Redirect, useRouter, useSegments, Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider, useAuth } from '../lib/AuthContext';
import { ThemeProvider } from '../lib/ThemeContext';
import 'react-native-url-polyfill/auto';
import { Text, View } from 'react-native';
import LoadingScreen from '../components/LoadingScreen';
import * as Linking from 'expo-linking';

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
      'auth': {
        path: 'auth',
        screens: {
          resetPassword: 'reset-password',
          verifyEmail: 'verify-email',
        }
      },
      '+not-found': '*',
    }
  },
};

// Handle deep linking for password reset
const handlePasswordResetDeepLink = (url: string) => {
  const parsedUrl = Linking.parse(url);
  
  console.log("Deep link received:", parsedUrl);
  
  // Check if this is a password reset link from Supabase
  if (parsedUrl.queryParams && 
      (parsedUrl.queryParams.type === 'recovery' || 
       url.includes('type=recovery'))) {
    
    // Extract token and other parameters
    const token = parsedUrl.queryParams.token || '';
    const redirectTo = '/auth/resetPassword';
    
    console.log("Password reset link detected, navigating to:", redirectTo);
    
    // Navigate to password reset screen
    return redirectTo;
  }
  
  return null;
};

declare global {
  interface Window {
    frameworkReady?: () => void;
  }
}

// This function protects routes from unauthorized access
const useProtectedRoute = () => {
  const { user, loading: isLoading } = useAuth();
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const segment = useSegments();
  const router = useRouter();
  const currentSegment = segment[0];
  
  // Check if we're on an auth screen - needs to be done safely with string comparison
  const onAuthScreen = currentSegment === 'auth';
  const onProtectedScreen = currentSegment === '(tabs)';
  
  // Debug state
  useEffect(() => {
    console.log("Auth state in useProtectedRoute:", {
      isAuthenticated: !!user,
      isLoading,
      currentSegment,
      isNavigationReady
    });
  }, [user, isLoading, currentSegment, isNavigationReady]);

  // Set navigation ready after initial render
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsNavigationReady(true);
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  // Handle navigation redirects
  useEffect(() => {
    if (!isNavigationReady) {
      return; // Don't redirect until navigation is ready
    }

    const hasUser = !!user;

    // For debugging
    console.log("Handling navigation redirection:", {
      hasUser,
      onAuthScreen,
      onProtectedScreen,
      currentSegment
    });

    // Case 1: User is not signed in and is not on auth screen
    if (!hasUser && !onAuthScreen) {
      console.log("⚠️ User not authenticated but trying to access protected route. Redirecting to auth...");
      try {
        // Safe navigation that works on all platforms
        router.replace("/auth");
      } catch (error) {
        console.error("Error during navigation protection:", error);
      }
    }

    // Case 2: User is signed in and is on auth screen
    if (hasUser && onAuthScreen) {
      console.log("✅ User is authenticated but on auth screen. Redirecting to home...");
      try {
        // Safe navigation that works on all platforms
        router.replace("/(tabs)");
      } catch (error) {
        console.error("Error during navigation protection:", error);
      }
    }
  }, [user, isNavigationReady, currentSegment, router]);

  return {
    isAuthenticated: !!user,
    isLoading
  };
};

// Root layout wrapper with providers
export default function RootLayout() {
  return (
    <ThemeProvider>
      <StatusBar style="auto" />
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </ThemeProvider>
  );
}

// Navigation component that handles authentication state
function RootLayoutNav() {
  const router = useRouter();
  const { loading: authLoading, session } = useAuth();
  const [initialRenderComplete, setInitialRenderComplete] = useState(false);
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  
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
        const redirectPath = handlePasswordResetDeepLink(url);
        if (redirectPath) {
          router.replace(redirectPath);
        }
      }
    };

    getInitialURL();

    // Listen for incoming links while the app is open
    const subscription = Linking.addEventListener('url', (event) => {
      console.log("Incoming link while app is open:", event.url);
      const redirectPath = handlePasswordResetDeepLink(event.url);
      if (redirectPath) {
        router.replace(redirectPath);
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

  // Mark navigation as ready after initial render and when the Slot is mounted
  useEffect(() => {
    if (initialRenderComplete) {
      // Set a small delay to ensure navigation container is ready
      const timer = setTimeout(() => {
        setIsNavigationReady(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [initialRenderComplete]);

  // Handle authentication redirects only after navigation is ready
  useEffect(() => {
    // Only redirect if navigation is ready, auth check is complete, and fonts are loaded
    if (isNavigationReady && !authLoading && (fontsLoaded || fontError)) {
      if (session) {
        // User is logged in
        router.replace('/(tabs)');
      } else {
        // User is not logged in
        router.replace('/auth');
      }
    }
  }, [isNavigationReady, authLoading, session, router, fontsLoaded, fontError]);

  // Show loading screen while fonts are loading or auth is being checked
  if ((!fontsLoaded && !fontError) || authLoading) {
    return <LoadingScreen message="Starting app..." />;
  }

  // Special handling for web platform to avoid hydration issues
  if (typeof window !== 'undefined' && !initialRenderComplete) {
    return <View style={{ flex: 1 }} />;
  }

  // This Slot renders the current route
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