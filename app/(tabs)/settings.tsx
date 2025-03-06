import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Image, Alert, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Bell, Moon, Shield, CircleHelp as HelpCircle, ChevronRight, LogOut } from 'lucide-react-native';
import { useAuth } from '../../lib/AuthContext';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { logout } from '../../lib/authUtils';
import LogoutButton from '../../components/LogoutButton';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = React.useState(true);
  const [notifications, setNotifications] = React.useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, signOut } = useAuth();
  
  // Verify we have the auth context on mount
  useEffect(() => {
    console.log("Settings Screen Mounted, Auth User:", user?.email);
    console.log("Auth Context signOut available:", typeof signOut === 'function');
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.contentContainer}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80' }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.email ? user.email.split('@')[0] : 'User'}</Text>
            <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#EFF6FF' }]}>
                  <User size={20} color="#3B82F6" />
                </View>
                <Text style={styles.settingsItemText}>Profile Information</Text>
              </View>
              <ChevronRight size={20} color="#64748B" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#F0FDF4' }]}>
                  <Shield size={20} color="#22C55E" />
                </View>
                <Text style={styles.settingsItemText}>Privacy & Security</Text>
              </View>
              <ChevronRight size={20} color="#64748B" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.settingsCard}>
            <View style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#FEF2F2' }]}>
                  <Bell size={20} color="#EF4444" />
                </View>
                <Text style={styles.settingsItemText}>Notifications</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#E2E8F0', true: '#BFDBFE' }}
                thumbColor={notifications ? '#3B82F6' : '#F1F5F9'}
              />
            </View>
            
            <View style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#F8FAFC' }]}>
                  <Moon size={20} color="#64748B" />
                </View>
                <Text style={styles.settingsItemText}>Dark Mode</Text>
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
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#F0F9FF' }]}>
                  <HelpCircle size={20} color="#0EA5E9" />
                </View>
                <Text style={styles.settingsItemText}>Help & Support</Text>
              </View>
              <ChevronRight size={20} color="#64748B" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.settingsItem}
              accessible={true}
              accessibilityLabel="Log out"
              accessibilityHint="Double tap to log out from your account"
              onPress={async () => {
                // Prevent multiple clicks
                if (isLoggingOut) return;
                
                console.log(`Settings: Logout button pressed on ${Platform.OS}`);
                setIsLoggingOut(true);
                
                // Safety timeout to reset the loading state after 5 seconds
                const safetyTimeout = setTimeout(() => {
                  console.log(`Settings: Safety timeout triggered to reset loading state on ${Platform.OS}`);
                  setIsLoggingOut(false);
                }, 5000);
                
                try {
                  console.log(`Settings: Calling logout function on ${Platform.OS}`);
                  const success = await logout({ showConfirmation: true });
                  console.log(`Settings: Logout result on ${Platform.OS}:`, success);
                  
                  if (success) {
                    console.log(`Settings: Logout successful on ${Platform.OS}, preparing to navigate`);
                    // Clear the safety timeout since we're handling completion
                    clearTimeout(safetyTimeout);
                    
                    try {
                      // Reset loading state before navigation
                      setIsLoggingOut(false);
                      
                      // Small delay to ensure state is updated before navigation
                      setTimeout(() => {
                        try {
                          console.log(`Settings: Navigating to auth screen on ${Platform.OS}`);
                          router.replace('/auth');
                        } catch (navError) {
                          console.error(`Settings: Navigation error on ${Platform.OS}:`, navError);
                        }
                      }, 100);
                    } catch (navError) {
                      console.error(`Settings: Navigation error on ${Platform.OS}:`, navError);
                      setIsLoggingOut(false);
                    }
                  } else {
                    // User canceled logout
                    console.log(`Settings: User canceled logout on ${Platform.OS}`);
                    clearTimeout(safetyTimeout);
                    setIsLoggingOut(false);
                  }
                } catch (error) {
                  clearTimeout(safetyTimeout);
                  console.error(`Settings: Error during logout on ${Platform.OS}:`, error);
                  if (Platform.OS !== 'web') {
                    Alert.alert("Error", "Failed to log out. Please try again.");
                  }
                  setIsLoggingOut(false);
                }
              }}
            >
              <View style={styles.settingsItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: '#FFF7ED' }]}>
                  <LogOut size={20} color="#F97316" />
                </View>
                <Text style={styles.settingsItemText}>Log Out</Text>
              </View>
              {isLoggingOut ? (
                <ActivityIndicator size="small" color="#F97316" />
              ) : (
                <ChevronRight size={20} color="#64748B" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.aboutSection}>
          <Text style={styles.appVersion}>AI-Powered Parkour Coaching App v1.0.0</Text>
          <Text style={styles.appCopyright}>© 2025 ADAPT Parkour</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#0F172A',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#0F172A',
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  editButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#64748B',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#0F172A',
    marginBottom: 12,
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
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
    borderBottomColor: '#F1F5F9',
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
  },
  settingsItemText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#0F172A',
  },
  aboutSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  appVersion: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  appCopyright: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#94A3B8',
  },
});