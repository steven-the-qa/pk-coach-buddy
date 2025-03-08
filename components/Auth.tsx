import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../lib/AuthContext';
import { useTheme } from '../lib/ThemeContext';
import { logout } from '../lib/authUtils';
import LoadingScreen from './LoadingScreen';

type AuthProps = {
  onLogin?: () => void;
  mode?: 'login' | 'signup' | 'logout';
};

const Auth: React.FC<AuthProps> = ({ onLogin, mode = 'login' }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(mode === 'signup');
  const { theme, darkMode } = useTheme();

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

  const handleLogout = async () => {
    // Use the updated logout function with setLoading handler
    await logout({
      showConfirmation: true,
      showSuccess: true,
      setLoading: setLoading
    });
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
      />
      
      <TextInput
        style={[styles.input, { 
          backgroundColor: darkMode ? '#374151' : '#f5f5f5',
          color: theme.text
        }]}
        placeholder="Password"
        placeholderTextColor={theme.secondaryText}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
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
});

export default Auth; 