import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useTheme } from '../../lib/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const { theme } = useTheme();
  const passwordInputRef = useRef<TextInput | null>(null);

  const handlePasswordLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // On success, user will be automatically redirected by the auth state listener
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async (email: string) => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: 'pkcoachbuddy://auth/callback',
        },
      });

      if (error) throw error;
      
      Alert.alert(
        'Check your email',
        'We sent you a magic link to sign in.',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'pkcoachbuddy://auth/callback',
      });

      if (error) throw error;

      Alert.alert(
        'Check your email',
        'We sent you a password reset link.',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'pkcoachbuddy://auth/callback',
        }
      });

      if (error) throw error;
      
      Alert.alert(
        'Check your email',
        'We sent you a confirmation link to complete your registration.',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Stack.Screen options={{ headerShown: false }} />
        
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.formContainer}>
            <View style={[
              styles.logoContainer,
              Platform.OS === 'ios' && { flex: 1, justifyContent: 'center' }
            ]}>
              <View style={styles.logoBackground}>
                <Image 
                  source={require('../../assets/images/login_logo.jpg')} 
                  style={styles.logo}
                />
              </View>
              <Text style={[styles.appName, { color: theme.text }]}>PK Coach Buddy</Text>
              <Text style={[styles.tagline, { color: theme.secondaryText }]}>
                Overcome Coaching Obstacles
              </Text>
            </View>
            
            <View style={[styles.formBox, { backgroundColor: '#1E293B' }]}>
              <View style={styles.tabContainer}>
                <TouchableOpacity 
                  style={[
                    styles.tab,
                    activeTab === 'signin' && styles.activeTab
                  ]}
                  onPress={() => setActiveTab('signin')}
                >
                  <Text style={[
                    styles.tabText,
                    { color: activeTab === 'signin' ? '#3B82F6' : theme.secondaryText }
                  ]}>
                    Sign In
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[
                    styles.tab,
                    activeTab === 'signup' && styles.activeTab
                  ]}
                  onPress={() => setActiveTab('signup')}
                >
                  <Text style={[
                    styles.tabText,
                    { color: activeTab === 'signup' ? '#3B82F6' : theme.secondaryText }
                  ]}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.formContent}>
                <TextInput
                  style={[styles.input, { backgroundColor: '#0F172A', color: theme.text }]}
                  placeholder="Email"
                  placeholderTextColor={theme.secondaryText}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    passwordInputRef.current?.focus();
                  }}
                  blurOnSubmit={false}
                />
                
                <View style={styles.passwordContainer}>
                  <TextInput
                    ref={passwordInputRef}
                    style={[styles.passwordInput, { backgroundColor: '#0F172A', color: theme.text }]}
                    placeholder="Password"
                    placeholderTextColor={theme.secondaryText}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    returnKeyType="done"
                    onSubmitEditing={activeTab === 'signin' ? handlePasswordLogin : handleSignUp}
                  />
                  <TouchableOpacity 
                    style={styles.passwordToggle}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons 
                      name={showPassword ? 'eye-off' : 'eye'} 
                      size={24} 
                      color={theme.secondaryText}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.variableContent}>
                  {activeTab === 'signin' ? (
                    <View style={styles.forgotPasswordContainer}>
                      <TouchableOpacity
                        onPress={handleForgotPassword}
                        disabled={loading}
                      >
                        <Text style={[styles.linkText, { color: '#3B82F6' }]}>
                          Forgot Password?
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.forgotPasswordContainer} />
                  )}
                </View>

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: '#3B82F6' }]}
                  onPress={activeTab === 'signin' ? handlePasswordLogin : handleSignUp}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.buttonText}>
                      {activeTab === 'signin' ? 'Sign In' : 'Sign Up'}
                    </Text>
                  )}
                </TouchableOpacity>

                <View style={styles.variableContent}>
                  {activeTab === 'signin' && (
                    <View style={styles.linkContainer}>
                      <TouchableOpacity
                        style={styles.linkButton}
                        onPress={() => handleMagicLink(email)}
                        disabled={loading}
                      >
                        <Text style={[styles.linkText, { color: '#3B82F6' }]}>
                          Sign in with Magic Link
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoBackground: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#2B8D99',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
  },
  formBox: {
    padding: 24,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  passwordInput: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    paddingRight: 50,
  },
  passwordToggle: {
    position: 'absolute',
    right: 12,
    height: 48,
    justifyContent: 'center',
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkContainer: {
    marginTop: 24,
    gap: 16,
  },
  linkButton: {
    alignItems: 'center',
  },
  linkText: {
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 8,
    backgroundColor: '#0F172A',
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#1E293B',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  formContent: {
    minHeight: 320,
  },
  variableContent: {
    height: 40,
  },
}); 