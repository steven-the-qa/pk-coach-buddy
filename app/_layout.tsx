import React, { useEffect, useState } from 'react';
import { Stack, Redirect, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { AuthProvider, useAuth } from '../lib/AuthContext';
import { ThemeProvider } from '../lib/ThemeContext';
import 'react-native-url-polyfill/auto';
import { Text, View } from 'react-native';

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

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

// This component wraps the app with the AuthProvider and implements route protection
function RootLayoutNav() {
  const [initialRenderComplete, setInitialRenderComplete] = useState(false);
  
  useEffect(() => {
    // This forces a re-render after mounting to ensure all components have loaded
    setInitialRenderComplete(true);
  }, []);
  
  const { isAuthenticated, isLoading } = useProtectedRoute();
  
  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
    'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide the splash screen after the fonts have loaded (or an error was returned)
      SplashScreen.hideAsync();
    }
    window.frameworkReady?.();
  }, [fontsLoaded, fontError]);

  // Prevent rendering until the font has loaded or an error was returned
  if (!fontsLoaded && !fontError) {
    return null;
  }

  // Special handling for web platform to avoid hydration issues
  if (typeof window !== 'undefined' && !initialRenderComplete) {
    return <View style={{ flex: 1 }} />;
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

// This is the root layout component that provides the auth context
export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ErrorBoundary>
          <RootLayoutNav />
        </ErrorBoundary>
      </ThemeProvider>
    </AuthProvider>
  );
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