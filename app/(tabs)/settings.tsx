import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Moon, Shield, User, LogOut, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../lib/ThemeContext';
import { useAuth } from '../../lib/hooks/useAuth';

export default function SettingsScreen() {  
  const { darkMode, setDarkMode, theme } = useTheme();
  const { signOut } = useAuth();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
      </View>

      <ScrollView style={styles.contentContainer}>
        <View style={[styles.profileSection, { backgroundColor: theme.card }]}>
          <View style={styles.profileImageContainer}>
            <View style={[styles.fallbackProfileImage, { backgroundColor: theme.primary }]}>
              <User size={40} color="#FFFFFF" />
            </View>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.text }]}>
              Guest User
            </Text>
            <Text style={[styles.profileEmail, { color: theme.secondaryText }]}>
              Sign in to access your profile
            </Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Preferences</Text>
          <View style={[styles.settingsCard, { backgroundColor: theme.card }]}>
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
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Account</Text>
          <View style={[styles.settingsCard, { backgroundColor: theme.card }]}>
            <TouchableOpacity 
              style={[styles.settingsItem, { borderBottomWidth: 0 }]}
              onPress={signOut}
            >
              <View style={styles.settingsItemLeft}>
                <View style={[styles.iconContainer, { backgroundColor: darkMode ? '#7F1D1D' : '#FEE2E2' }]}>
                  <LogOut size={20} color={darkMode ? '#FCA5A5' : '#EF4444'} />
                </View>
                <Text style={[styles.settingsItemText, { color: theme.text }]}>Sign Out</Text>
              </View>
              <ChevronRight size={20} color={theme.secondaryText} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileSection: {
    flexDirection: 'column',
    alignItems: 'center',
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
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 8,
  },
  settingsCard: {
    borderRadius: 12,
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
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingsItemText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});