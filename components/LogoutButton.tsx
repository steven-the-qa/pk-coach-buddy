import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { logout } from '../lib/authUtils';
import { LogOut } from 'lucide-react-native';
import { router } from 'expo-router';

type LogoutButtonProps = {
  variant?: 'text' | 'icon' | 'contained';
  color?: string;
  label?: string;
  size?: number;
  showConfirmation?: boolean;
  onLogoutComplete?: () => void;
  style?: any;
};

const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = 'contained',
  color = '#F97316',
  label = 'Log Out',
  size = 20,
  showConfirmation = true,
  onLogoutComplete,
  style
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    // If already in loading state, prevent multiple clicks
    if (isLoggingOut) return;
    
    console.log("LogoutButton: Starting logout process");
    setIsLoggingOut(true);
    
    try {
      console.log("LogoutButton: Calling logout function");
      const success = await logout({ 
        showConfirmation,
        // We'll handle redirection here directly instead of in the util
        redirectTo: '/auth' 
      });
      
      console.log("LogoutButton: Logout result:", success);
      
      if (success) {
        // If successful, manually redirect
        console.log("LogoutButton: Manual redirect to /auth");
        if (typeof window !== 'undefined') {
          window.location.href = '/auth';
        } else {
          router.replace('/auth');
        }
        
        // Call the completion handler if provided
        if (onLogoutComplete) {
          onLogoutComplete();
        }
      }
    } catch (error) {
      console.error("LogoutButton: Error during logout:", error);
    } finally {
      console.log("LogoutButton: Resetting loading state");
      // Always reset the loading state, even if there was an error
      setIsLoggingOut(false);
    }
  };

  // Icon-only variant
  if (variant === 'icon') {
    return (
      <TouchableOpacity
        onPress={handleLogout}
        disabled={isLoggingOut}
        style={[styles.iconButton, style]}
      >
        {isLoggingOut ? (
          <ActivityIndicator size="small" color={color} />
        ) : (
          <LogOut size={size} color={color} />
        )}
      </TouchableOpacity>
    );
  }

  // Text-only variant
  if (variant === 'text') {
    return (
      <TouchableOpacity
        onPress={handleLogout}
        disabled={isLoggingOut}
        style={[styles.textButton, style]}
      >
        <Text style={[styles.textButtonLabel, { color }]}>
          {isLoggingOut ? 'Logging out...' : label}
        </Text>
      </TouchableOpacity>
    );
  }

  // Default: contained button
  return (
    <TouchableOpacity
      onPress={handleLogout}
      disabled={isLoggingOut}
      style={[styles.containedButton, { backgroundColor: color }, style]}
    >
      {isLoggingOut ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <>
          <LogOut size={size - 4} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    padding: 8,
  },
  textButton: {
    padding: 8,
  },
  textButtonLabel: {
    fontWeight: '500',
  },
  containedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default LogoutButton; 