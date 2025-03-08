import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../lib/AuthContext';
import { useTheme } from '../lib/ThemeContext';
import { logout } from '../lib/authUtils';
import LoadingScreen from './LoadingScreen';
import { Eye, EyeOff } from 'lucide-react-native';
import { supabase } from '../lib/supabase';

type AuthProps = {
  onLogin?: () => void;
  mode?: 'login' | 'signup' | 'logout';
};

const Auth: React.FC<AuthProps> = ({ onLogin, mode = 'login' }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(mode === 'signup');
  const { theme, darkMode } = useTheme();
  const passwordInputRef = useRef<TextInput>(null);

  const { signIn, signUp, user } = useAuth();

  const handleAuth = async () => {
    setLoading(true);
    
    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) throw error;
        Alert.alert('Success', 'Check your email for the confirmation link!');
      } else {
        const { error } = await signIn(email, password);
        if (error) throw error;
        
        // Small delay before calling onLogin to ensure navigation is ready
        setTimeout(() => {
          onLogin?.();
        }, 50);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Email Required', 'Please enter your email address to reset your password.');
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) throw error;
      
      Alert.alert(
        'Password Reset Email Sent',
        'Check your email for a link to reset your password. If it doesn\'t appear within a few minutes, check your spam folder.'
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    // Use the updated logout function with setLoading handler
    await logout({
      showConfirmation: true,
      showSuccess: true,
      setLoading: setLoading
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // If loading, show the loading screen
  if (loading) {
    return <LoadingScreen message={
      mode === 'logout' 
        ? "Logging out..." 
        : isSignUp 
          ? "Creating account..." 
          : "Signing in..."
    } />;
  }

  // If in logout mode, just show the logout button
  if (mode === 'logout') {
    return (
      <View style={[styles.logoutContainer, { backgroundColor: theme.card }]}>
        {user && (
          <Text style={[styles.userInfo, { color: theme.text }]}>
            Logged in as: {user.email}
          </Text>
        )}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <Text style={[styles.title, { color: theme.primary }]}>
        {isSignUp ? 'Create an account' : 'Sign in to your account'}
      </Text>
      
      <TextInput
        style={[styles.input, { 
          backgroundColor: darkMode ? '#374151' : '#f5f5f5',
          color: theme.text
        }]}
        placeholder="Email"
        placeholderTextColor={theme.secondaryText}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        returnKeyType="next"
        onSubmitEditing={() => passwordInputRef.current?.focus()}
        blurOnSubmit={false}
      />
      
      <View style={styles.passwordContainer}>
        <TextInput
          ref={passwordInputRef}
          style={[styles.passwordInput, { 
            backgroundColor: darkMode ? '#374151' : '#f5f5f5',
            color: theme.text
          }]}
          placeholder="Password"
          placeholderTextColor={theme.secondaryText}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          returnKeyType="done"
          onSubmitEditing={handleAuth}
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
      
      {!isSignUp && (
        <TouchableOpacity
          onPress={handleForgotPassword}
          style={styles.forgotPasswordButton}
        >
          <Text style={[styles.forgotPasswordText, { color: theme.primary }]}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={handleAuth}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {isSignUp ? 'Sign Up' : 'Sign In'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => setIsSignUp(!isSignUp)}
        style={styles.switchButton}
      >
        <Text style={[styles.switchText, { color: theme.primary }]}>
          {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutContainer: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    borderRadius: 5,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
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
  button: {
    width: '100%',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    width: '100%',
    maxWidth: 200,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  switchButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  switchText: {
    fontSize: 14,
  },
  userInfo: {
    marginBottom: 15,
    fontSize: 16,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 15,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
});

export default Auth; 