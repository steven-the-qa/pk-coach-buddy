import React, { useEffect, useState } from 'react';
import { Stack, Redirect, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { AuthProvider, useAuth } from '../lib/AuthContext';
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
function useProtectedRoute() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  const isWeb = typeof window !== 'undefined' && 'navigator' in window;

  // For debugging purposes
  useEffect(() => {
    console.log("Auth state in useProtectedRoute:", { 
      isAuthenticated: !!user, 
      isLoading: loading,
      currentSegment: segments?.[0],
      isNavigationReady
    });
  }, [user, loading, segments, isNavigationReady]);

  // Set navigation as ready after the first render
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsNavigationReady(true);
    }, 300); // Longer delay to ensure layout is fully mounted
    
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (loading || !isNavigationReady || !segments || segments.length === 0) return;

    const inAuthGroup = segments[0] === '(tabs)';
    const onAuthScreen = segments[0] === 'auth';
    
    try {
      console.log("Handling navigation redirection:", { inAuthGroup, onAuthScreen, hasUser: !!user });
      
      // If no user and trying to access protected routes
      if (!user && inAuthGroup) {
        console.log("⚠️ User not authenticated but trying to access protected route. Redirecting to auth...");
        if (isWeb) {
          window.location.href = '/auth';
        } else {
          router.replace('/auth');
        }
      } 
      // If user is authenticated but on auth screen, redirect to home
      else if (user && onAuthScreen) {
        console.log("✅ User is authenticated but on auth screen. Redirecting to home...");
        if (isWeb) {
          window.location.href = '/';
        } else {
          router.replace('/');
        }
      }
    } catch (error) {
      console.error("Error during navigation protection:", error);
    }
  }, [user, segments, isNavigationReady, loading, router, isWeb]);
}

// This component wraps the app with the AuthProvider and implements route protection
function RootLayoutNav() {
  const [initialRenderComplete, setInitialRenderComplete] = useState(false);
  
  useEffect(() => {
    // This forces a re-render after mounting to ensure all components have loaded
    setInitialRenderComplete(true);
  }, []);
  
  useProtectedRoute();
  
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
      <ErrorBoundary>
        <RootLayoutNav />
      </ErrorBoundary>
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