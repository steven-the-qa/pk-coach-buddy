import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../lib/AuthContext';
import { logout } from '../lib/authUtils';

type AuthProps = {
  onLogin?: () => void;
  mode?: 'login' | 'signup' | 'logout';
};

const Auth: React.FC<AuthProps> = ({ onLogin, mode = 'login' }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(mode === 'signup');

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
        onLogin?.();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout({
      showConfirmation: true,
      showSuccess: true
    });
  };

  // If in logout mode, just show the logout button
  if (mode === 'logout') {
    return (
      <View style={styles.logoutContainer}>
        {user && (
          <Text style={styles.userInfo}>
            Logged in as: {user.email}
          </Text>
        )}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Logging out...' : 'Log Out'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isSignUp ? 'Create an account' : 'Sign in to your account'}
      </Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity 
        style={styles.button}
        onPress={handleAuth}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => setIsSignUp(!isSignUp)}
        style={styles.switchButton}
      >
        <Text style={styles.switchText}>
          {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
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
    color: '#6200ee',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#6200ee',
    borderRadius: 5,
    padding: 12,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#f44336',
    borderRadius: 5,
    padding: 12,
    alignItems: 'center',
    minWidth: 150,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  switchText: {
    color: '#6200ee',
  },
  userInfo: {
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
});

export default Auth; 