import React, { useState } from 'react';
import { View, TouchableOpacity, Alert, ActivityIndicator, Image, Platform, ActionSheetIOS } from 'react-native';
import { User } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';
import { supabase } from '../lib/supabase';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

interface ProfileImagePickerProps {
  userId: string | undefined;
  profileImage: string | null;
  imageError: boolean;
  darkMode: boolean;
  onImageChange: (imageUrl: string | null) => void;
  onErrorChange: (hasError: boolean) => void;
  containerStyle: any;
  fallbackImageStyle: any;
  gradientStyle: any;
}

export default function ProfileImagePicker({
  userId,
  profileImage,
  imageError,
  darkMode,
  onImageChange,
  onErrorChange,
  containerStyle,
  fallbackImageStyle,
  gradientStyle
}: ProfileImagePickerProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
      
      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
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

  const getAuthHeaders = async () => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    
    if (!token) {
      throw new Error('No access token available');
    }
    
    return {
      'Authorization': `Bearer ${token}`,
      'apikey': Constants.expoConfig?.extra?.supabaseAnonKey || '',
    };
  };

  const processAndUploadImage = async (uri: string) => {
    if (!userId) return;
    
    try {
      // Show loading indicator
      setLoading(true);
      
      console.log('Starting image processing for URI:', uri);
      
      // Get original file info
      const originalInfo = await FileSystem.getInfoAsync(uri);
      console.log('Original image size:', originalInfo.exists ? (originalInfo as any).size : 'unknown', 'bytes');
      
      // Resize and compress the image
      const processedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 400, height: 400 } }],
        { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
      );
      
      // Generate the file path in Supabase storage
      const filePath = `profiles/${userId}/profile-image`;
      console.log('Target storage path:', filePath);
      
      try {
        // Read the file as binary data
        const fileUri = processedImage.uri;
        
        // Create a form data object
        const formData = new FormData();
        formData.append('file', {
          uri: fileUri,
          name: 'profile-image.jpg',
          type: 'image/jpeg'
        } as any);
        
        // Get auth headers from Supabase
        const authHeaders = await getAuthHeaders();
        
        // Construct URL
        const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
        
        if (!supabaseUrl) {
          throw new Error('Supabase URL not configured');
        }
        
        const uploadUrl = `${supabaseUrl}/storage/v1/object/avatars/${filePath}`;
        
        const uploadResponse = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            ...authHeaders,
            'x-upsert': 'true'
          },
          body: formData
        });
        
        if (!uploadResponse.ok) {
          throw new Error(`Upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
        }
        
      } catch (uploadError) {
        console.error('Error in upload:', uploadError);
        
        // Fallback: use the Supabase SDK directly
        try {
          const tinyImage = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 200, height: 200 } }],
            { compress: 0.3, format: ImageManipulator.SaveFormat.JPEG }
          );
          
          const fetchResponse = await fetch(tinyImage.uri);
          const blob = await fetchResponse.blob();
          
          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, blob, {
              contentType: 'image/jpeg',
              upsert: true
            });
          
          if (uploadError) throw uploadError;
          
        } catch (finalError) {
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
      
      // Update user metadata with the public URL (WITHOUT the timestamp)
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: urlData.publicUrl }
      });
      
      if (updateError) {
        console.error('Failed to update user metadata:', updateError);
      }
      
      // Update parent component
      onImageChange(imageUrl);
      onErrorChange(false);
      
      Alert.alert('Success', 'Profile picture updated successfully!');
      
      // Stay on settings tab after update
      setTimeout(() => {
        router.replace('/settings');
      }, 100);
    } catch (error: any) {
      console.error('Error processing/uploading image:', error);
      Alert.alert('Error', 'Failed to update profile picture. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const removeProfileImage = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      
      // Delete the image from storage
      const { error: deleteError } = await supabase.storage
        .from('avatars')
        .remove([`profiles/${userId}/profile-image`]);
      
      if (deleteError) {
        console.error('Error deleting profile image:', deleteError);
      }
      
      // Update user metadata to remove the avatar_url
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: null }
      });
      
      if (!updateError) {
        // Update local state
        onImageChange(null);
        onErrorChange(false);
        Alert.alert('Success', 'Profile picture removed successfully!');
        
        // Stay on settings tab after update
        setTimeout(() => {
          router.replace('/settings');
        }, 100);
      } else {
        Alert.alert('Error', 'Failed to remove profile picture. Please try again.');
      }
    } catch (error) {
      console.error('Error removing profile image:', error);
      Alert.alert('Error', 'Failed to remove profile picture. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={containerStyle}
      onPress={handleProfileImagePress}
      disabled={loading}
    >
      {loading ? (
        <View style={fallbackImageStyle}>
          <LinearGradient
            colors={darkMode ? ['#1E40AF', '#3B82F6'] : ['#DBEAFE', '#93C5FD']}
            style={gradientStyle}
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
            style={{ width: '100%', height: '100%' }}
            onError={() => {
              console.error('Profile image loading error');
              onErrorChange(true);
            }}
          />
        </>
      ) : (
        <View style={fallbackImageStyle}>
          <LinearGradient
            colors={darkMode ? ['#1E40AF', '#3B82F6'] : ['#DBEAFE', '#93C5FD']}
            style={gradientStyle}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <User size={32} color="#FFFFFF" />
          </LinearGradient>
        </View>
      )}
    </TouchableOpacity>
  );
} 