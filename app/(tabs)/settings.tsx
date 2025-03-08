import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Bell, Moon, Shield, CircleHelp as HelpCircle, ChevronRight } from 'lucide-react-native';
import { useAuth } from '../../lib/AuthContext';
import { useTheme } from '../../lib/ThemeContext';
import { supabase } from '../../lib/supabase';
import LogoutButton from '../../components/LogoutButton';
import ProfileImagePicker from '../../components/ProfileImagePicker';
import ProfileEditForm from '../../components/ProfileEditForm';

export default function SettingsScreen() {
  const [notifications, setNotifications] = React.useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const { user } = useAuth();
  
  // Use the shared theme context
  const { darkMode, setDarkMode, theme } = useTheme();
  
  // Load user data when component mounts
  useEffect(() => {
    console.log("Settings Screen Mounted, Auth User:", user?.email);
    
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

  // Handle profile updates from the edit form
  const handleProfileUpdate = (newUsername: string, newEmail: string) => {
    setUsername(newUsername);
    setEmail(newEmail);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
      </View>

      <ScrollView style={styles.contentContainer}>
        <View style={[styles.profileSection, { backgroundColor: theme.card }]}>
          <ProfileImagePicker 
            userId={user?.id}
            profileImage={profileImage}
            imageError={imageError}
            darkMode={darkMode}
            onImageChange={setProfileImage}
            onErrorChange={setImageError}
            containerStyle={styles.profileImageContainer}
            fallbackImageStyle={styles.fallbackProfileImage}
            gradientStyle={styles.gradientBackground}
          />
          
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
                <View style={[styles.iconContainer, { backgroundColor: darkMode ? '#1E3A8A' : '#EFF6FF' }]}>
                  <HelpCircle size={20} color={darkMode ? '#93C5FD' : '#3B82F6'} />
                </View>
                <Text style={[styles.settingsItemText, { color: theme.text }]}>Help & Support</Text>
              </View>
              <ChevronRight size={20} color={theme.secondaryText} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.logoutContainer}>
          <LogoutButton 
            variant="contained"
            color={darkMode ? '#4B5563' : '#E5E7EB'}
            label="Log Out"
            onLogoutComplete={() => console.log("Logged out from settings")} 
          />
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={editModalVisible}
          onRequestClose={() => setEditModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <ProfileEditForm
              username={username}
              email={email}
              user={user}
              darkMode={darkMode}
              theme={theme}
              onClose={() => setEditModalVisible(false)}
              onUpdateProfile={handleProfileUpdate}
            />
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
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    // backgroundColor is now applied dynamically
  },
  settingsItemText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    // color is now applied dynamically
  },
  logoutContainer: {
    marginTop: 8,
    marginBottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  gradientBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
});