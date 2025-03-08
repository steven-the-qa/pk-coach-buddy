import { Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { supabase } from './supabase';

/**
 * A reusable logout function that can be used anywhere in the app
 * @param options Configuration options for the logout process
 * @returns Promise<boolean> indicating success or failure
 */
export const logout = async (options?: {
  showConfirmation?: boolean;
  showSuccess?: boolean;
  redirectTo?: string;
  setLoading?: (loading: boolean) => void; // Add loading state setter
}): Promise<boolean> => {
  const {
    showConfirmation = true,
    showSuccess = false,
    redirectTo = '/auth',
    setLoading,
  } = options || {};

  console.log(`AuthUtils: Logout called with options on ${Platform.OS}:`, { showConfirmation, showSuccess, redirectTo });

  // Set loading state if provided
  if (setLoading) {
    setLoading(true);
  }

  // Default success handler - just log and return
  const handleSuccess = async () => {
    console.log(`AuthUtils: Logout successful on ${Platform.OS}`);
    if (showSuccess && Platform.OS !== 'web') {
      Alert.alert("Success", "You have been logged out successfully");
    }
    
    // Redirect after successful logout - type-safe with a delay
    // and with platform-specific navigation handling
    setTimeout(() => {
      try {
        if (redirectTo === '/auth' || redirectTo === '/(tabs)') {
          router.replace(redirectTo);
        } else {
          // For any other paths, default to auth
          router.replace('/auth');
        }
        console.log(`AuthUtils: Navigation completed to ${redirectTo}`);
      } catch (navError) {
        console.error(`AuthUtils: Navigation error on ${Platform.OS}:`, navError);
        // Fallback navigation attempt if the first one fails
        try {
          router.replace('/auth');
        } catch (fallbackError) {
          console.error(`AuthUtils: Fallback navigation also failed:`, fallbackError);
        }
      }
    }, 100); // Longer delay to ensure navigation container is ready
    
    // Reset loading state
    if (setLoading) {
      setLoading(false);
    }
    
    return true;
  };

  // Default error handler
  const handleError = (error: any) => {
    console.error(`AuthUtils: Logout error on ${Platform.OS}:`, error);
    
    // Check for AuthSessionMissingError, which means the user is already logged out
    // We should treat this as a successful logout
    if (error.message && error.message.includes('Auth session missing')) {
      console.log(`AuthUtils: User was already logged out (no session found)`);
      return handleSuccess(); // Proceed with navigation and success flow
    }
    
    if (Platform.OS !== 'web') {
      Alert.alert("Error", "There was a problem logging out. Please try again.");
    }
    
    // Reset loading state on error
    if (setLoading) {
      setLoading(false);
    }
    
    return false;
  };

  // Actual signOut function - common to all platforms to avoid code duplication
  const performSignOut = async (): Promise<boolean> => {
    try {
      console.log(`AuthUtils: Performing Supabase signOut on ${Platform.OS}`);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error(`AuthUtils: Supabase signOut error on ${Platform.OS}:`, error);
        return handleError(error);
      }
      console.log(`AuthUtils: Supabase signOut successful on ${Platform.OS}`);
      return await handleSuccess();
    } catch (error) {
      console.error(`AuthUtils: Error during signOut on ${Platform.OS}:`, error);
      return handleError(error);
    }
  };

  // For web platform, use window.confirm instead of Alert
  if (Platform.OS === 'web' && showConfirmation) {
    const confirmed = window.confirm("Are you sure you want to log out?");
    console.log(`AuthUtils: Web confirmation result on ${Platform.OS}:`, confirmed);
    
    if (!confirmed) {
      console.log(`AuthUtils: Logout cancelled by user on ${Platform.OS}`);
      if (setLoading) {
        setLoading(false);
      }
      return false;
    }
    
    // User confirmed logout on web
    return await performSignOut();
  } 
  // If we need to show confirmation on native platforms
  else if (showConfirmation && Platform.OS !== 'web') {
    return new Promise<boolean>((resolve) => {
      Alert.alert(
        "Log Out",
        "Are you sure you want to log out?",
        [
          {
            text: "Cancel",
            style: "cancel",
            onPress: () => {
              console.log(`AuthUtils: Logout cancelled by user on ${Platform.OS}`);
              if (setLoading) {
                setLoading(false);
              }
              resolve(false);
            }
          },
          {
            text: "Log Out",
            style: "destructive",
            onPress: async () => {
              const result = await performSignOut();
              resolve(result);
            }
          }
        ],
        { cancelable: false } // Prevent dismissing by tapping outside
      );
    });
  } else {
    // No confirmation needed, just logout
    return await performSignOut();
  }
}; 