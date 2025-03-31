import React, { useState } from 'react';
import { 
  View, TextInput, TouchableOpacity, Text, StyleSheet, Alert,
  KeyboardAvoidingView, Platform, SafeAreaView
} from 'react-native';
import { useTheme } from '../../lib/ThemeContext';
import { supabase } from '../../lib/supabase';
import { Mail } from 'lucide-react-native';

export function MagicLinkAuth() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme, darkMode } = useTheme();

  const handleMagicLinkLogin = async () => {
    if (!email) {
      Alert.alert('Please enter your email');
      return;
    }
    
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: 'com.boutchersj.pkcoachbuddy://',
        },
      });

      if (error) throw error;
      
      Alert.alert(
        'Check your email',
        'We sent you a magic link to sign in. Open the link on this device.'
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.text }]}>
            Welcome to PK Coach Buddy
          </Text>
          <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
            Sign in with your email to continue
          </Text>

          <View style={[styles.inputContainer, { 
            backgroundColor: theme.card,
            borderColor: theme.border
          }]}>
            <Mail size={20} color={theme.secondaryText} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Enter your email"
              placeholderTextColor={theme.secondaryText}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              editable={!loading}
              accessibilityLabel="Email input field"
              accessibilityHint="Enter your email address to receive a magic link"
            />
          </View>

          <TouchableOpacity
            style={[styles.button, { 
              backgroundColor: theme.primary,
              opacity: loading ? 0.7 : 1 
            }]}
            onPress={handleMagicLinkLogin}
            disabled={loading}
            accessibilityLabel="Send magic link button"
            accessibilityHint="Sends a magic link to your email for signing in"
          >
            <Text style={styles.buttonText}>
              {loading ? 'Sending...' : 'Send Magic Link'}
            </Text>
          </TouchableOpacity>

          <Text style={[styles.helpText, { color: theme.secondaryText }]}>
            We'll send you a secure link to sign in instantly
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  button: {
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  helpText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
}); 