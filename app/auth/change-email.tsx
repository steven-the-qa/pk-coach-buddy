import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../lib/ThemeContext';
import { ArrowLeft, Check, AlertTriangle } from 'lucide-react-native';

export default function ChangeEmailScreen() {
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
            
            // Update the user session based on the token
            const { error } = await supabase.auth.verifyOtp({
              token_hash: token,
              type: 'email_change',
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
        console.error('Error processing email change:', error);
        setErrorMessage(error.message || 'Failed to verify email change');
        setStatus('error');
      }
    };

    processDeepLink();
  }, []);

  const goToSettings = () => {
    router.replace('/(tabs)/settings');
  };

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <View style={styles.contentContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.message, { color: theme.text }]}>
              Verifying your new email address...
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
              Email Changed Successfully
            </Text>
            <Text style={[styles.message, { color: theme.secondaryText }]}>
              Your email address has been updated. You can now use your new email to sign in.
            </Text>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={goToSettings}
            >
              <Text style={styles.buttonText}>Continue to Settings</Text>
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
              {errorMessage || 'There was a problem verifying your new email address.'}
            </Text>
            <Text style={[styles.message, { color: theme.secondaryText, marginTop: 10 }]}>
              Please try again or contact support if the problem persists.
            </Text>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={goToSettings}
            >
              <Text style={styles.buttonText}>Go to Settings</Text>
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
        onPress={() => router.replace('/(tabs)')}
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