import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../lib/ThemeContext';
import { ArrowLeft, Check, AlertTriangle } from 'lucide-react-native';

export default function VerifyEmailScreen() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { theme, darkMode } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const processDeepLink = async () => {
      try {
        // Get the URL that opened the app
        const url = await Linking.getInitialURL();
        
        if (url) {
          console.log("App opened with URL:", url);
          const parsedUrl = Linking.parse(url);
          
          // Extract token from URL parameters
          if (parsedUrl.queryParams?.token) {
            const token = parsedUrl.queryParams.token as string;
            
            // For email verification, we just need to hit the Supabase auth endpoint
            // The token_hash will automatically be validated
            const { error } = await supabase.auth.verifyOtp({
              token_hash: token,
              type: 'email',
            });

            if (error) {
              throw error;
            }
            
            setStatus('success');
          } else {
            throw new Error('No token found in URL');
          }
        } else {
          throw new Error('No URL detected');
        }
      } catch (error: any) {
        console.error('Error verifying email:', error);
        setErrorMessage(error.message || 'Failed to verify your email');
        setStatus('error');
      }
    };

    processDeepLink();
  }, []);

  const goToLogin = () => {
    router.replace('/auth');
  };

  const goToApp = () => {
    router.replace('/(tabs)');
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <View style={styles.contentContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.message, { color: theme.text }]}>
              Verifying your email address...
            </Text>
          </View>
        );
      
      case 'success':
        return (
          <View style={styles.contentContainer}>
            <View style={[styles.iconContainer, { backgroundColor: theme.primary }]}>
              <Check size={40} color="#fff" />
            </View>
            <Text style={[styles.title, { color: theme.text }]}>
              Email Verified
            </Text>
            <Text style={[styles.message, { color: theme.secondaryText }]}>
              Your email has been successfully verified. You can now access all features of the app.
            </Text>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={goToApp}
            >
              <Text style={styles.buttonText}>Continue to App</Text>
            </TouchableOpacity>
          </View>
        );
      
      case 'error':
        return (
          <View style={styles.contentContainer}>
            <View style={[styles.iconContainer, { backgroundColor: theme.error }]}>
              <AlertTriangle size={40} color="#fff" />
            </View>
            <Text style={[styles.title, { color: theme.text }]}>
              Verification Failed
            </Text>
            <Text style={[styles.message, { color: theme.secondaryText }]}>
              {errorMessage || 'There was a problem verifying your email address.'}
            </Text>
            <Text style={[styles.message, { color: theme.secondaryText, marginTop: 10 }]}>
              The link may have expired or already been used. Please try signing in or request a new verification email.
            </Text>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={goToLogin}
            >
              <Text style={styles.buttonText}>Go to Login</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.replace('/auth')}
      >
        <ArrowLeft size={24} color={theme.text} />
      </TouchableOpacity>
      
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: '90%',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 