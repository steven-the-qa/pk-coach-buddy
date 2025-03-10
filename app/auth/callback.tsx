import { View, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../lib/ThemeContext';
import { supabase } from '../../lib/supabase';

export default function AuthCallback() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    async function handleAuthCallback() {
      const token = params?.token;
      const type = params?.type;

      try {
        const tokenValue = Array.isArray(params?.token) ? params.token[0] : params?.token;
        if (!tokenValue) throw new Error('No token provided');

        // Verify the token regardless of type
        const { error } = await supabase.auth.verifyOtp({
          token: tokenValue,
          type: type as any,
          email: Array.isArray(params?.email) ? params.email[0] : params?.email || '',
        });

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