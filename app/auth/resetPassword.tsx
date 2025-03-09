import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../lib/ThemeContext';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import { supabase } from '../../lib/supabase';
import LoadingScreen from '../../components/LoadingScreen';
import * as Linking from 'expo-linking';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { theme, darkMode } = useTheme();
  const params = useLocalSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  // Try to get token from URL params or deep link
  useEffect(() => {
    const getTokenFromURL = async () => {
      try {
        // Try to get token from params
        if (params.token) {
          console.log("Token found in params:", params.token);
          setToken(params.token as string);
          return;
        }

        // If not in params, try to get from the initial URL
        const url = await Linking.getInitialURL();
        if (url) {
          const parsedUrl = Linking.parse(url);
          if (parsedUrl.queryParams?.token) {
            console.log("Token found in deep link:", parsedUrl.queryParams.token);
            setToken(parsedUrl.queryParams.token as string);
          }
        }
      } catch (error) {
        console.error("Error getting token:", error);
      }
    };

    getTokenFromURL();
  }, [params]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleResetPassword = async () => {
    Keyboard.dismiss();
    
    // Validate inputs
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please enter and confirm your new password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return;
    }

    if (!token) {
      Alert.alert('Error', 'Reset token not found. Please request a new password reset link.');
      return;
    }

    setLoading(true);

    try {
      // Update the user's password using the recovery token
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        throw error;
      }

      Alert.alert(
        'Success', 
        'Your password has been reset successfully.',
        [
          { 
            text: 'Sign In', 
            onPress: () => router.replace('/auth') 
          }
        ]
      );
    } catch (error: any) {
      console.error('Error resetting password:', error);
      Alert.alert(
        'Error', 
        error.message || 'Failed to reset password. Please try again or request a new link.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Resetting password..." />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen options={{ 
        headerShown: false
      }} />
      
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={theme.text} />
          </TouchableOpacity>
          
          <Text style={[styles.title, { color: theme.primary }]}>
            Reset Your Password
          </Text>
          
          <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
            Enter your new password below
          </Text>
          
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.passwordInput, { 
                backgroundColor: darkMode ? '#374151' : '#f5f5f5',
                color: theme.text
              }]}
              placeholder="New Password"
              placeholderTextColor={theme.secondaryText}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showPassword}
              returnKeyType="next"
              onSubmitEditing={() => confirmPasswordRef.current?.focus()}
            />
            <TouchableOpacity 
              style={styles.eyeIconContainer} 
              onPress={togglePasswordVisibility}
            >
              {showPassword ? 
                <EyeOff size={20} color={theme.secondaryText} /> : 
                <Eye size={20} color={theme.secondaryText} />
              }
            </TouchableOpacity>
          </View>
          
          <View style={styles.passwordContainer}>
            <TextInput
              ref={confirmPasswordRef}
              style={[styles.passwordInput, { 
                backgroundColor: darkMode ? '#374151' : '#f5f5f5',
                color: theme.text
              }]}
              placeholder="Confirm Password"
              placeholderTextColor={theme.secondaryText}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              returnKeyType="done"
              onSubmitEditing={handleResetPassword}
            />
            <TouchableOpacity 
              style={styles.eyeIconContainer} 
              onPress={togglePasswordVisibility}
            >
              {showPassword ? 
                <EyeOff size={20} color={theme.secondaryText} /> : 
                <Eye size={20} color={theme.secondaryText} />
              }
            </TouchableOpacity>
          </View>
          
          {!token && (
            <Text style={[styles.warning, { color: theme.error || '#ff5252' }]}>
              No reset token found. Please ensure you clicked the link from your email.
            </Text>
          )}
          
          <TouchableOpacity 
            style={[styles.button, { 
              backgroundColor: token ? theme.primary : theme.secondaryText,
              opacity: token ? 1 : 0.6
            }]}
            onPress={handleResetPassword}
            disabled={!token || loading}
          >
            <Text style={styles.buttonText}>
              Reset Password
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
    position: 'relative',
  },
  passwordInput: {
    flex: 1,
    borderRadius: 5,
    padding: 15,
    fontSize: 16,
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 15,
    height: '100%',
    justifyContent: 'center',
  },
  warning: {
    marginTop: 5,
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 