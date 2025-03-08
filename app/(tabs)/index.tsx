import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Brain, Calendar, FileText, Lightbulb, User } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../lib/ThemeContext';
import { router, useFocusEffect } from 'expo-router';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabase';

// Default avatar URL
const DEFAULT_AVATAR_URL = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';

export default function HomeScreen() {
  const { theme, darkMode } = useTheme();
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);
  const [firstName, setFirstName] = useState('Coach');

  // Refresh user data when screen gains focus
  useFocusEffect(
    useCallback(() => {
      console.log("Home screen focused, refreshing user data");
      fetchUserData();
      return () => {
        // Cleanup function if needed
      };
    }, [])
  );

  // Get user profile image from metadata when component mounts or user changes
  useEffect(() => {
    console.log("Home screen mounted or user changed");
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    if (!user) {
      console.log("No user available, skipping data fetch");
      return;
    }
    
    try {
      // Force a refresh of the user object to get the latest metadata
      const { data, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error("Error refreshing user data:", error);
        return;
      }
      
      const refreshedUser = data?.user;
      
      // Extract and set the first name
      if (refreshedUser) {
        setFirstName(getFirstName(refreshedUser));
      }
      
      // Get profile image
      if (refreshedUser && refreshedUser.user_metadata && refreshedUser.user_metadata.avatar_url) {
        const avatarUrl = refreshedUser.user_metadata.avatar_url;
        console.log("Home: Setting profile image from metadata:", avatarUrl);
        
        // Add a timestamp query parameter for cache busting
        const imageUrlWithCacheBusting = `${avatarUrl}?t=${new Date().getTime()}`;
        console.log("Home: Using cache-busted URL:", imageUrlWithCacheBusting);
        
        setProfileImage(imageUrlWithCacheBusting);
        setImageError(false);
      } else {
        // Default profile image if none set
        console.log("Home: No avatar_url found in metadata, using default");
        setProfileImage(null); // Set to null to trigger gradient fallback
      }
      
      // Log the entire user metadata for debugging
      console.log("Current user metadata:", refreshedUser?.user_metadata);
    } catch (err) {
      console.error("Error in fetchUserData:", err);
    }
  };

  // Function to navigate to settings when profile image is clicked
  const navigateToSettings = () => {
    console.log("Navigating to settings screen");
    router.navigate('/settings');
  };

  // Extract first name from user data
  const getFirstName = (userData: any) => {
    // First check if we have a username in metadata
    if (userData?.user_metadata?.username) {
      // Split the username by spaces and get the first part (first name)
      const nameParts = userData.user_metadata.username.split(' ');
      return nameParts[0];
    }
    
    // If no username, try to use first part of email
    if (userData?.email) {
      const emailName = userData.email.split('@')[0];
      // If the email username has dots or underscores, split by them to get a name-like part
      if (emailName.includes('.') || emailName.includes('_')) {
        const namePart = emailName.split(/[._]/)[0];
        // Capitalize first letter
        return namePart.charAt(0).toUpperCase() + namePart.slice(1);
      }
      return emailName;
    }
    
    // Default fallback
    return 'Coach';
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.secondaryText }]}>Welcome back,</Text>
            <Text style={[styles.name, { color: theme.text }]}>{firstName}</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={navigateToSettings}>
            {profileImage && !imageError ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
                onError={() => {
                  console.log("Home: Profile image loading error, switching to fallback");
                  setImageError(true);
                }}
              />
            ) : (
              <View style={styles.fallbackProfileImage}>
                <LinearGradient
                  colors={darkMode ? ['#1E40AF', '#3B82F6'] : ['#DBEAFE', '#93C5FD']}
                  style={styles.gradientBackground}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <User size={24} color="#FFFFFF" />
                </LinearGradient>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.featuredCard}>
          <View style={styles.featuredContent}>
            <Text style={styles.featuredTitle}>AI-Powered Coaching</Text>
            <Text style={styles.featuredDescription}>
              Enhance your parkour coaching with AI-assisted reflections and session planning.
            </Text>
            <TouchableOpacity style={styles.featuredButton}>
              <Text style={styles.featuredButtonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80' }}
            style={styles.featuredImage}
          />
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={[styles.actionCard, { backgroundColor: theme.card }]}>
            <View style={[styles.actionIconContainer, { backgroundColor: darkMode ? '#1E3A8A' : '#EFF6FF' }]}>
              <FileText size={24} color={darkMode ? '#93C5FD' : '#3B82F6'} />
            </View>
            <Text style={[styles.actionTitle, { color: theme.text }]}>New Journal Entry</Text>
            <Text style={[styles.actionDescription, { color: theme.secondaryText }]}>
              Reflect on your coaching
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionCard, { backgroundColor: theme.card }]}>
            <View style={[styles.actionIconContainer, { backgroundColor: darkMode ? '#312E81' : '#F5F3FF' }]}>
              <Calendar size={24} color={darkMode ? '#A5B4FC' : '#8B5CF6'} />
            </View>
            <Text style={[styles.actionTitle, { color: theme.text }]}>Plan Session</Text>
            <Text style={[styles.actionDescription, { color: theme.secondaryText }]}>
              Create a new training plan
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionCard, { backgroundColor: theme.card }]}>
            <View style={[styles.actionIconContainer, { backgroundColor: darkMode ? '#7C2D12' : '#FFF7ED' }]}>
              <Brain size={24} color={darkMode ? '#FDBA74' : '#F97316'} />
            </View>
            <Text style={[styles.actionTitle, { color: theme.text }]}>AI Insights</Text>
            <Text style={[styles.actionDescription, { color: theme.secondaryText }]}>
              Get coaching suggestions
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionCard, { backgroundColor: theme.card }]}>
            <View style={[styles.actionIconContainer, { backgroundColor: darkMode ? '#14532D' : '#F0FDF4' }]}>
              <Lightbulb size={24} color={darkMode ? '#86EFAC' : '#22C55E'} />
            </View>
            <Text style={[styles.actionTitle, { color: theme.text }]}>Knowledge Base</Text>
            <Text style={[styles.actionDescription, { color: theme.secondaryText }]}>
              Explore ADAPT principles
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Activity</Text>
        <View style={[styles.recentActivityContainer, { backgroundColor: theme.card }]}>
          <TouchableOpacity style={[styles.activityItem, { borderBottomColor: theme.border }]}>
            <View style={[styles.activityIconContainer, { backgroundColor: darkMode ? '#1E3A8A' : '#F8FAFC' }]}>
              <FileText size={20} color={darkMode ? '#93C5FD' : '#3B82F6'} />
            </View>
            <View style={styles.activityContent}>
              <Text style={[styles.activityTitle, { color: theme.text }]}>Journal Entry: Beginner Class Reflection</Text>
              <Text style={[styles.activityTime, { color: theme.secondaryText }]}>Today, 2:30 PM</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.activityItem, { borderBottomColor: theme.border }]}>
            <View style={[styles.activityIconContainer, { backgroundColor: darkMode ? '#312E81' : '#F8FAFC' }]}>
              <Calendar size={20} color={darkMode ? '#A5B4FC' : '#8B5CF6'} />
            </View>
            <View style={styles.activityContent}>
              <Text style={[styles.activityTitle, { color: theme.text }]}>Session Plan: Advanced Vaults</Text>
              <Text style={[styles.activityTime, { color: theme.secondaryText }]}>Yesterday, 10:15 AM</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.activityItem}>
            <View style={[styles.activityIconContainer, { backgroundColor: darkMode ? '#7C2D12' : '#F8FAFC' }]}>
              <Brain size={20} color={darkMode ? '#FDBA74' : '#F97316'} />
            </View>
            <View style={styles.activityContent}>
              <Text style={[styles.activityTitle, { color: theme.text }]}>AI Insight: Progression Suggestions</Text>
              <Text style={[styles.activityTime, { color: theme.secondaryText }]}>2 days ago, 4:45 PM</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  name: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  featuredCard: {
    backgroundColor: '#3B82F6',
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    marginBottom: 24,
  },
  featuredContent: {
    flex: 1,
    padding: 20,
  },
  featuredTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  featuredDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#DBEAFE',
    marginBottom: 16,
  },
  featuredButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  featuredButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#3B82F6',
  },
  featuredImage: {
    width: 120,
    height: '100%',
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  actionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  recentActivityContainer: {
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
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  activityTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  fallbackProfileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientBackground: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});