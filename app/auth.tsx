import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import Auth from '../components/Auth';
import { useTheme } from '../lib/ThemeContext';
import { useAuth } from '../lib/AuthContext';
import LoadingScreen from '../components/LoadingScreen';

export default function AuthScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { loading, session } = useAuth();
  const [isScreenMounted, setIsScreenMounted] = useState(false);
  
  // Mark component as mounted
  useEffect(() => {
    setIsScreenMounted(true);
    return () => setIsScreenMounted(false);
  }, []);
  
  // If already authenticated, redirect to tabs - but only after component is mounted
  useEffect(() => {
    if (isScreenMounted && !loading && session) {
      // Small delay to ensure navigation is ready
      const timer = setTimeout(() => {
        router.replace('/(tabs)');
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [isScreenMounted, session, loading, router]);
  
  const handleLogin = () => {
    // Small delay to ensure navigation system is ready
    setTimeout(() => {
      router.replace('/(tabs)');
    }, 50);
  };
  
  // Show loading screen while checking auth
  if (loading) {
    return <LoadingScreen message="Checking login status..." />;
  }
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80' }} 
            style={styles.logo}
          />
          <Text style={[styles.appName, { color: theme.text }]}>PK Coach Buddy</Text>
          <Text style={[styles.tagline, { color: theme.secondaryText }]}>AI-Powered Parkour Coaching</Text>
        </View>
        
        <Auth onLogin={handleLogin} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor applied dynamically
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    // color applied dynamically
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    // color applied dynamically
    marginBottom: 20,
  },
}); 