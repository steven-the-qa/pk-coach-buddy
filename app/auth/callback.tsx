import { View, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../lib/ThemeContext';
import { supabase } from '../../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AuthCallback() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    async function handleAuthCallback() {
      const tokenValue = Array.isArray(params?.token) ? params.token[0] : params?.token;
      const type = Array.isArray(params?.type) ? params.type[0] : params?.type;

      try {
        if (!tokenValue) throw new Error('No token provided');
        
        // Get the stored email
        const email = await AsyncStorage.getItem('pendingAuthEmail');
        if (!email) throw new Error('No email found for verification');

        const { error } = await supabase.auth.verifyOtp({
          token: tokenValue,
          type: type as any,
          email,
        });

        // Clear the stored email after verification
        await AsyncStorage.removeItem('pendingAuthEmail');

        if (error) throw error;

        // After successful verification, wait for session
        const authListener = supabase.auth.onAuthStateChange((event, session) => {
          if (session) {
            // Always redirect to the home tab after successful auth
            router.replace('/(tabs)');
          } else {
            // Only redirect to auth if we don't get a session
            router.replace('/auth');
          }
          // Clean up listener
          authListener.data.subscription.unsubscribe();
        });
      } catch (error: any) {
        console.error('Error in auth callback:', error.message);
        router.replace('/auth');
      }
    }

    handleAuthCallback();
  }, [router, params]);

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: theme.background 
    }}>
      <ActivityIndicator size="large" color={theme.primary} />
    </View>
  );
} 