import { View, ActivityIndicator } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useTheme } from '../../lib/ThemeContext';
import { supabase } from '../../lib/supabase';

export default function AuthCallback() {
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    // With implicit flow, we just need to wait for the session
    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        // User is authenticated, go to home
        router.replace('/(tabs)');
      } else {
        // No session, go back to auth
        router.replace('/auth');
      }
      // Clean up listener
      authListener.data.subscription.unsubscribe();
    });

    return () => {
      // Clean up on unmount
      authListener.data.subscription.unsubscribe();
    };
  }, [router]);

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