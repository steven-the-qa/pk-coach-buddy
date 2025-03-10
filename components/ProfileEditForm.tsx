import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { X } from 'lucide-react-native';
import { supabase } from '../lib/supabase';
import { useRouter } from 'expo-router';

// Use a consistent redirect URL for all auth flows
const AUTH_REDIRECT_URL = 'pkcoachbuddy://auth/callback';

interface ProfileEditFormProps {
  username: string;
  email: string;
  user: any;
  darkMode: boolean;
  theme: any;
  onClose: () => void;
  onUpdateProfile: (newUsername: string, newEmail: string) => void;
}

export default function ProfileEditForm({
  username: initialUsername,
  email: initialEmail,
  user,
  darkMode,
  theme,
  onClose,
  onUpdateProfile
}: ProfileEditFormProps) {
  const [username, setUsername] = useState(initialUsername);
  const [email, setEmail] = useState(initialEmail);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsUpdating(true);
    
    try {
      // Update user data in Supabase with email redirect
      // Note: emailRedirectTo has to be passed in a different way for updateUser
      const { error } = await supabase.auth.updateUser({
        email: email !== user.email ? email : undefined,
        data: { username },
      }, {
        emailRedirectTo: AUTH_REDIRECT_URL
      });
      
      if (error) {
        console.error("Failed to update profile:", error);
        Alert.alert('Error', error.message);
      } else {
        // For email changes, Supabase will send a confirmation email
        if (email !== user.email) {
          Alert.alert(
            'Email Update', 
            'If you changed your email, a confirmation link has been sent to the new address. Please check your inbox to complete the change.'
          );
        } else {
          Alert.alert('Success', 'Profile updated successfully!');
        }
        
        onClose();
        
        // Update the parent component
        onUpdateProfile(username, email);
        
        // Stay on settings tab after update
        setTimeout(() => {
          router.replace('/settings');
        }, 100);
      }
    } catch (error: any) {
      console.error("Error in handleSaveProfile:", error);
      Alert.alert('Error', error.message || 'An error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Edit Profile</Text>
        <TouchableOpacity onPress={onClose}>
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
        style={[
          styles.saveButton,
          { backgroundColor: theme.primary },
          isUpdating && { opacity: 0.7 }
        ]}
        onPress={handleSaveProfile}
        disabled={isUpdating}
      >
        <Text style={styles.saveButtonText}>
          {isUpdating ? 'Saving...' : 'Save Changes'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 12,
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
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
}); 