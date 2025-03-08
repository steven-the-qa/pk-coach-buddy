import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Image, Alert, ActivityIndicator, Platform, Modal, TextInput, ActionSheetIOS } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Bell, Moon, Shield, CircleHelp as HelpCircle, ChevronRight, LogOut, X, Camera } from 'lucide-react-native';
import { useAuth } from '../../lib/AuthContext';
import { useTheme } from '../../lib/ThemeContext';
import { supabase } from '../../lib/supabase';
import LogoutButton from '../../components/LogoutButton';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';

// Default avatar URL
const DEFAULT_AVATAR_URL = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

export default function SettingsScreen() {
  const [notifications, setNotifications] = React.useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for image operations
  const { user, signOut } = useAuth();
  
  // Use the shared theme context
  const { darkMode, setDarkMode, theme } = useTheme();
  
  // Load user data when component mounts
  useEffect(() => {
    console.log("Settings Screen Mounted, Auth User:", user?.email);
    console.log("Auth Context signOut available:", typeof signOut === 'function');
    
    if (user) {
      // Set initial values
      setEmail(user.email || '');
      setUsername(user.user_metadata?.username || '');
      
      // Set profile image
      if (user.user_metadata?.avatar_url) {
        // Add cache-busting parameter
        const imageUrl = `${user.user_metadata.avatar_url}?t=${new Date().getTime()}`;
        setProfileImage(imageUrl);
        setImageError(false);
      } else {
        setProfileImage(null); // Set to null to trigger gradient fallback
      }
    }
  }, [user]);

  // Handle opening the edit modal
  const handleEditPress = () => {
    setEditModalVisible(true);
  };
  
  // Handle saving user profile changes
  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    
    try {
      // Update user data in Supabase
      const { error } = await supabase.auth.updateUser({
        email: email !== user.email ? email : undefined,
        data: { username }
      });
      
      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Success', 'Profile updated successfully!');
        setEditModalVisible(false);
        
        // Refresh user data
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          // Update local state if needed
          setUsername(data.user.user_metadata?.username || '');
          setEmail(data.user.email || '');
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  // Navigate to the profile image picker in settings
  const handleProfileImagePress = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Take Photo', 'Choose from Library', 'Remove Photo'],
          cancelButtonIndex: 0,
          destructiveButtonIndex: 3,
        },
        async (buttonIndex: number) => {
          if (buttonIndex === 1) {
            await takePhoto();
          } else if (buttonIndex === 2) {
            await pickImage();
          } else if (buttonIndex === 3) {
            await removeProfileImage();
          }
        }
      );
    } else {
      // For Android, use Alert
      Alert.alert(
        'Profile Picture',
        'Choose an option',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Take Photo', onPress: takePhoto },
          { text: 'Choose from Library', onPress: pickImage },
          { text: 'Remove Photo', onPress: removeProfileImage, style: 'destructive' },
        ]
      );
    }
  };

  const pickImage = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to your photo library to select a profile picture.');
        return;
      }
      
      // Launch image picker with correct media type syntax
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images', // Use string literal instead of enum
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      
      if (!result.canceled && result.assets?.[0]) {
        // Check file size (5MB limit)
        if (result.assets[0].fileSize && result.assets[0].fileSize > 5 * 1024 * 1024) {
          Alert.alert("File too large", "Please select an image under 5MB");
          return;
        }
        
        await processAndUploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const takePhoto = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to your camera to take a profile picture.');
        return;
      }
      
      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      
      if (!result.canceled && result.assets?.[0]) {
        await processAndUploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const processAndUploadImage = async (uri: string) => {
    if (!user?.id) return;
    
    try {
      // Show loading indicator
      setLoading(true);
      
      console.log('Starting image processing for URI:', uri);
      
      // Get original file info
      const originalInfo = await FileSystem.getInfoAsync(uri);
      console.log('Original image size:', originalInfo.exists ? (originalInfo as any).size : 'unknown', 'bytes');
      
      // Resize and compress the image more aggressively to reduce size
      const processedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 400, height: 400 } }], // Smaller size (400x400)
        { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG } // More compression (50%)
      );
      
      // Check processed file info
      const processedInfo = await FileSystem.getInfoAsync(processedImage.uri);
      console.log('Processed image size:', processedInfo.exists ? (processedInfo as any).size : 'unknown', 'bytes');
      console.log('Processed image URI:', processedImage.uri);
      
      // Generate the file path in Supabase storage
      const filePath = `profiles/${user.id}/profile-image`;
      console.log('Target storage path:', filePath);
      
      // First, ensure we have a valid session
      console.log('Refreshing auth session before upload...');
      const { error: sessionError } = await supabase.auth.refreshSession();
      if (sessionError) {
        console.error('Session refresh error:', sessionError);
        // Continue anyway, it might still work
      }
      
      try {
        // Use fetch with binary data instead of base64 (more efficient)
        console.log('Creating binary data for upload...');
        
        // Read the file as binary data
        const fileUri = processedImage.uri;
        
        // Create a form data object
        const formData = new FormData();
        formData.append('file', {
          uri: fileUri,
          name: 'profile-image.jpg',
          type: 'image/jpeg'
        } as any);
        
        // Get bucket info to make sure it exists
        console.log('Checking bucket existence...');
        try {
          const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('avatars');
          if (bucketError) {
            console.log('Bucket error (may need to create it):', bucketError);
          } else {
            console.log('Bucket exists:', bucketData?.name);
          }
        } catch (bucketCheckError) {
          console.error('Error checking bucket:', bucketCheckError);
        }
        
        // Try direct upload using fetch API
        console.log('Uploading using fetch API...');
        
        // Get auth headers from Supabase
        const authHeaders = await getAuthHeaders();
        console.log('Auth headers obtained for direct upload');
        
        // Construct URL (without hostname from the client)
        const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
        
        if (!supabaseUrl) {
          throw new Error('Supabase URL not configured');
        }
        
        const uploadUrl = `${supabaseUrl}/storage/v1/object/avatars/${filePath}`;
        console.log('Upload URL:', uploadUrl);
        
        const uploadResponse = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            ...authHeaders,
            'x-upsert': 'true'
          },
          body: formData
        });
        
        const responseText = await uploadResponse.text();
        
        if (!uploadResponse.ok) {
          console.error('Fetch upload failed:', uploadResponse.status, responseText);
          throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
        }
        
        console.log('Upload successful, response:', responseText);
        
      } catch (uploadError) {
        console.error('Error in primary upload method:', uploadError);
        
        // Final fallback: use the Supabase SDK directly with the smallest possible image
        try {
          console.log('Trying last resort upload method...');
          
          // Create an even smaller image
          const tinyImage = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 200, height: 200 } }], // Very small size
            { compress: 0.3, format: ImageManipulator.SaveFormat.JPEG } // Heavy compression
          );
          
          // Get as blob
          const fetchResponse = await fetch(tinyImage.uri);
          const blob = await fetchResponse.blob();
          console.log('Created tiny image blob, size:', blob.size);
          
          // Upload using the Supabase SDK
          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, blob, {
              contentType: 'image/jpeg',
              upsert: true
            });
          
          if (uploadError) {
            console.error('Final upload attempt error:', uploadError);
            throw uploadError;
          }
          
          console.log('Final upload attempt successful');
        } catch (finalError) {
          console.error('All upload methods failed:', finalError);
          throw new Error('All upload methods failed. Please try again.');
        }
      }
      
      // Get the public URL
      const timestamp = new Date().getTime();
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      if (!urlData) {
        throw new Error('Failed to get public URL');
      }
      
      // Create a URL with cache busting
      const imageUrl = `${urlData.publicUrl}?t=${timestamp}`;
      console.log('Image public URL:', urlData.publicUrl);
      console.log('Image URL with cache busting:', imageUrl);
      
      // Update user metadata with the public URL (WITHOUT the timestamp)
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: urlData.publicUrl }
      });
      
      if (updateError) {
        console.error('Failed to update user metadata:', updateError);
      } else {
        console.log('User metadata updated with new avatar_url');
      }
      
      // Update local state
      setProfileImage(imageUrl);
      setImageError(false);
      
      // Force a small delay to ensure storage processing completes
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Verify the upload
      const isVerified = await verifyProfileImage(filePath);
      console.log('Profile image verified:', isVerified);

      if (!isVerified) {
        console.warn('Image was uploaded but verification failed. The image might not be properly stored.');
      }
      
      Alert.alert('Success', 'Profile picture updated successfully! It may take a moment to appear on all screens.');
    } catch (error: any) {
      console.error('Error processing/uploading image:', error);
      Alert.alert('Error', 'Failed to update profile picture. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get auth headers from the Supabase client
  const getAuthHeaders = async () => {
    // Refresh session to ensure we have the latest token
    await supabase.auth.refreshSession();
    
    // Get the current session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('No access token available');
    }
    
    return {
      'Authorization': `Bearer ${session.access_token}`
    };
  };

  const removeProfileImage = async () => {
    if (!user?.id) return;
    
    try {
      // Show loading indicator
      setLoading(true);
      
      // Refresh auth session first
      console.log('Refreshing auth session before deletion...');
      await supabase.auth.refreshSession();
      
      console.log('Removing profile image from storage...');
      // Delete the image from Supabase
      const { error } = await supabase.storage
        .from('avatars')
        .remove([`profiles/${user.id}/profile-image`]);
        
      if (error) {
        console.error('Error deleting storage file:', error);
        
        // Check if it's an auth error
        if (error.message && error.message.includes('Auth')) {
          console.log('Auth error detected, refreshing session and trying again...');
          
          // Force session refresh
          const { error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError) {
            console.error('Session refresh failed:', refreshError);
            throw refreshError;
          }
          
          // Try deletion again
          const { error: secondError } = await supabase.storage
            .from('avatars')
            .remove([`profiles/${user.id}/profile-image`]);
            
          if (secondError) {
            console.error('Second deletion attempt failed:', secondError);
            throw secondError;
          }
        } else {
          throw error;
        }
      }
      
      console.log('File deleted successfully, updating user metadata...');
      
      // Update user metadata to remove avatar_url
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: null }
      });
      
      if (updateError) {
        console.error('Error updating user metadata:', updateError);
        // Continue anyway to update the UI
      } else {
        console.log('User metadata updated successfully');
      }
      
      // Reset the image to default
      setProfileImage(null); // Set to null to trigger gradient fallback
      setImageError(false);
      
      Alert.alert('Success', 'Profile picture removed successfully');
    } catch (error: any) {
      console.error('Error removing profile image:', error);
      
      // Special handling for AuthSessionMissingError
      if (error.message && error.message.includes('Auth session missing')) {
        // This is a common error, and we can handle it gracefully
        console.log('Auth session missing error detected');
        
        // Still update the UI to show no profile image
        setProfileImage(null); // Set to null to trigger gradient fallback
        setImageError(false);
        
        Alert.alert('Note', 'Your profile picture has been removed, but there was an authentication issue. Try logging out and back in if you see any strange behavior.');
      } else {
        Alert.alert('Error', 'Failed to remove profile picture. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Helper function to verify if a profile image was properly uploaded
  const verifyProfileImage = async (filePath: string): Promise<boolean> => {
    try {
      console.log('Verifying uploaded profile image:', filePath);
      
      // Check if the file exists in Supabase storage
      const { data, error } = await supabase.storage
        .from('avatars')
        .list(`profiles/${user?.id}`);
      
      if (error) {
        console.error('Error verifying image:', error);
        return false;
      }
      
      const fileExists = data?.some(file => 
        file.name === 'profile-image'
      );
      
      console.log('File exists in storage:', fileExists);
      
      if (fileExists) {
        // Check if file has a non-zero size
        const { data: fileInfo } = await supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
        
        console.log('File public URL is valid:', !!fileInfo?.publicUrl);
        
        return !!fileInfo?.publicUrl;
      }
      
      return false;
    } catch (err) {
      console.error('Error in verifyProfileImage:', err);
      return false;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
      </View>

      <ScrollView style={styles.contentContainer}>
        <View style={[styles.profileSection, { backgroundColor: theme.card }]}>
          <TouchableOpacity
            style={styles.profileImageContainer}
            onPress={handleProfileImagePress}
            disabled={loading}
          >
            {loading ? (
              <View style={styles.fallbackProfileImage}>
                <LinearGradient
                  colors={darkMode ? ['#1E40AF', '#3B82F6'] : ['#DBEAFE', '#93C5FD']}
                  style={styles.gradientBackground}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <ActivityIndicator color="#FFFFFF" />
                </LinearGradient>
              </View>
            ) : profileImage && !imageError ? (
              <>
                <Image
                  source={{ 
                    uri: `${profileImage}${profileImage.includes('?') ? '&' : '?'}t=${new Date().getTime()}` 
                  }}
                  style={styles.profileImage}
                  onError={(e) => {
                    console.error('Settings: Profile image loading error:', e.nativeEvent.error);
                    console.log('Settings: Failed to load image URL:', profileImage);
                    setImageError(true);
                  }}
                />
              </>
            ) : (
              <View style={styles.fallbackProfileImage}>
                <LinearGradient
                  colors={darkMode ? ['#1E40AF', '#3B82F6'] : ['#DBEAFE', '#93C5FD']}
                  style={styles.gradientBackground}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <User size={32} color="#FFFFFF" />
                </LinearGradient>
              </View>
            )}
          </TouchableOpacity>
          
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.text }]}>
              {user?.user_metadata?.username || (user?.email ? user.email.split('@')[0] : 'User')}
            </Text>
            <Text style={[styles.profileEmail, { color: theme.secondaryText }]}>
              {user?.email || 'user@example.com'}
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.editButton, { borderColor: theme.buttonBorder }]}
            onPress={handleEditPress}
          >
            <Text style={[styles.editButtonText, { color: theme.secondaryText }]}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Account</Text>
          <View style={[styles.settingsCard, { backgroundColor: theme.card }]}>
            <TouchableOpacity style={[styles.settingsItem, { borderBottomColor: theme.border }]}>
              <View style={styles.settingsItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: darkMode ? '#1E3A8A' : '#EFF6FF' }]}>
                  <User size={20} color={darkMode ? '#93C5FD' : '#3B82F6'} />
                </View>
                <Text style={[styles.settingsItemText, { color: theme.text }]}>Profile Information</Text>
              </View>
              <ChevronRight size={20} color={theme.secondaryText} />
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.settingsItem, { borderBottomColor: theme.border }]}>
              <View style={styles.settingsItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: darkMode ? '#14532D' : '#F0FDF4' }]}>
                  <Shield size={20} color={darkMode ? '#86EFAC' : '#22C55E'} />
                </View>
                <Text style={[styles.settingsItemText, { color: theme.text }]}>Privacy & Security</Text>
              </View>
              <ChevronRight size={20} color={theme.secondaryText} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Preferences</Text>
          <View style={[styles.settingsCard, { backgroundColor: theme.card }]}>
            <View style={[styles.settingsItem, { borderBottomColor: theme.border }]}>
              <View style={styles.settingsItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: darkMode ? '#7F1D1D' : '#FEF2F2' }]}>
                  <Bell size={20} color={darkMode ? '#FCA5A5' : '#EF4444'} />
                </View>
                <Text style={[styles.settingsItemText, { color: theme.text }]}>Notifications</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: darkMode ? '#4B5563' : '#E2E8F0', true: '#BFDBFE' }}
                thumbColor={notifications ? '#3B82F6' : darkMode ? '#6B7280' : '#F1F5F9'}
              />
            </View>
            
            <View style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: darkMode ? '#312E81' : '#F8FAFC' }]}>
                  <Moon size={20} color={darkMode ? '#A5B4FC' : '#64748B'} />
                </View>
                <Text style={[styles.settingsItemText, { color: theme.text }]}>Dark Mode</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
                thumbColor={darkMode ? '#3B82F6' : '#F1F5F9'}
              />
            </View>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Support</Text>
          <View style={[styles.settingsCard, { backgroundColor: theme.card }]}>
            <TouchableOpacity style={[styles.settingsItem, { borderBottomColor: theme.border }]}>
              <View style={styles.settingsItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: darkMode ? '#0C4A6E' : '#F0F9FF' }]}>
                  <HelpCircle size={20} color={darkMode ? '#7DD3FC' : '#0EA5E9'} />
                </View>
                <Text style={[styles.settingsItemText, { color: theme.text }]}>Help & Support</Text>
              </View>
              <ChevronRight size={20} color={theme.secondaryText} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ marginBottom: 24 }}>
          <LogoutButton 
            color={darkMode ? '#3B82F6' : '#3B82F6'} 
          />
        </View>
        
        <View style={styles.aboutSection}>
          <Text style={[styles.appVersion, { color: theme.secondaryText }]}>PK Coach Buddy v1.0.0</Text>
          <Text style={[styles.appCopyright, { color: theme.tertiaryText }]}>© 2025 ADAPT Parkour</Text>
        </View>

        {/* Edit Profile Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={editModalVisible}
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: theme.text }]}>Edit Profile</Text>
                <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                  <X size={24} color={theme.text} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: theme.secondaryText }]}>Name</Text>
                <TextInput
                  style={[styles.input, { 
                    color: theme.text,
                    backgroundColor: darkMode ? '#1F2937' : '#F9FAFB',
                    borderColor: theme.border
                  }]}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Your name"
                  placeholderTextColor={theme.tertiaryText}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: theme.secondaryText }]}>Email</Text>
                <TextInput
                  style={[styles.input, { 
                    color: theme.text,
                    backgroundColor: darkMode ? '#1F2937' : '#F9FAFB',
                    borderColor: theme.border
                  }]}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Your email"
                  placeholderTextColor={theme.tertiaryText}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              
              <TouchableOpacity 
                style={[styles.saveButton, { backgroundColor: isUpdating ? '#60A5FA' : '#3B82F6' }]}
                onPress={handleSaveProfile}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor is now applied dynamically
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    // color is now applied dynamically
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileSection: {
    flexDirection: 'column',
    alignItems: 'center',
    // backgroundColor is now applied dynamically
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  fallbackProfileImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  profileName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    // color is now applied dynamically
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    // color is now applied dynamically
  },
  editButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    // borderColor is now applied dynamically
  },
  editButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    // color is now applied dynamically
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    // color is now applied dynamically
    marginBottom: 12,
  },
  settingsCard: {
    // backgroundColor is now applied dynamically
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    // borderBottomColor is now applied dynamically
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    // backgroundColor is now applied dynamically per icon
  },
  settingsItemText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    // color is now applied dynamically
  },
  aboutSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  appVersion: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    // color is now applied dynamically
    marginBottom: 4,
  },
  appCopyright: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    // color is now applied dynamically
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    fontFamily: 'Inter-Regular',
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  saveButton: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    fontSize: 16,
  },
  gradientBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
});