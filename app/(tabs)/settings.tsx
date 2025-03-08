import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Image, Alert, ActivityIndicator, Platform, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Bell, Moon, Shield, CircleHelp as HelpCircle, ChevronRight, LogOut, X, Camera } from 'lucide-react-native';
import { useAuth } from '../../lib/AuthContext';
import { useTheme } from '../../lib/ThemeContext';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { logout } from '../../lib/authUtils';
import LogoutButton from '../../components/LogoutButton';

// Default avatar URL
const DEFAULT_AVATAR_URL = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

export default function SettingsScreen() {
  const [notifications, setNotifications] = React.useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
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
        setProfileImage(user.user_metadata.avatar_url);
      } else {
        setProfileImage(DEFAULT_AVATAR_URL);
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
    // Just navigate to current settings page for now
    console.log("Profile image pressed");
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
          >
            {profileImage && !imageError ? (
              <>
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profileImage}
                  onError={() => setImageError(true)}
                />
                <View style={styles.cameraIconOverlay}>
                  <Camera size={16} color="#fff" />
                </View>
              </>
            ) : (
              <View style={[styles.fallbackProfileImage, { backgroundColor: darkMode ? '#374151' : '#E5E7EB' }]}>
                <User size={32} color={darkMode ? '#9CA3AF' : '#6B7280'} />
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
  cameraIconOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0284c7',
    borderRadius: 12,
    width: 24,
    height: 24,
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
});