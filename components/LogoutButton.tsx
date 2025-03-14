import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { logout } from '../lib/authUtils';
import { LogOut } from 'lucide-react-native';
import { useAuth } from '../lib/AuthContext';

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
  const { user } = useAuth();

  const handleLogout = async () => {
    // If already in loading state, prevent multiple clicks
    if (isLoggingOut) return;
    
    console.log("LogoutButton: Starting logout process");
    console.log(`LogoutButton: Current user: ${user?.email || 'Not logged in'}`);
    setIsLoggingOut(true);
    
    try {
      console.log("LogoutButton: Calling logout function");
      // Let the authUtils handle all routing - don't try to do it here
      const success = await logout({ 
        showConfirmation,
        // The logout utility will handle navigation after signOut
        redirectTo: '/auth',
        // Pass in our loading state handler
        setLoading: setIsLoggingOut
      });
      
      console.log("LogoutButton: Logout result:", success);
      
      // Only retry with force logout if there was a technical error, not if the user canceled
      // success will be false both when there's an error and when the user cancels
      // But in the cancellation case, the setIsLoggingOut is already reset by the logout function
      if (!success && isLoggingOut) {
        // If we're still in the logging out state, it indicates a technical failure rather than a user cancellation
        console.log("LogoutButton: First logout attempt failed due to technical issue, trying with force logout");
        
        // Give a small delay before retrying
        setTimeout(async () => {
          try {
            const forceSuccess = await logout({
              showConfirmation: false, // Skip confirmation on retry
              redirectTo: '/auth',
              setLoading: setIsLoggingOut,
              forceLogout: true // Use the force logout option
            });
            
            console.log("LogoutButton: Force logout result:", forceSuccess);
          } catch (forceError) {
            console.error("LogoutButton: Error during force logout:", forceError);
          }
        }, 500);
      }
      
      // Callback for component that used this button
      if (onLogoutComplete) {
        onLogoutComplete();
      }
    } catch (error) {
      console.error("LogoutButton: Error during logout:", error);
      
      // Only try force logout if we're still in the logging out state
      // (to avoid forcing logout after user cancellation)
      if (isLoggingOut) {
        try {
          console.log("LogoutButton: Trying force logout after error");
          await logout({
            showConfirmation: false,
            redirectTo: '/auth',
            setLoading: setIsLoggingOut,
            forceLogout: true
          });
        } catch (forceError) {
          console.error("LogoutButton: Force logout also failed:", forceError);
          // Reset loading state in case of error
          setIsLoggingOut(false);
        }
      } else {
        // If not in logging out state anymore, it was likely a user cancellation
        console.log("LogoutButton: Not attempting force logout, likely user canceled");
      }
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