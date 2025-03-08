import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Calendar, FileText, User, Zap, Target, Award, Clock, 
  ClipboardList, Compass, Sparkles, ChartBar
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../lib/ThemeContext';
import { router, useFocusEffect } from 'expo-router';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabase';

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

  // Handle "feature coming soon" alerts
  const handleComingSoonFeature = (featureName: string) => {
    alert(`${featureName} feature coming soon!`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.secondaryText }]}>Hello,</Text>
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

        {/* AI Assistant Card */}
        <View style={[styles.assistantCard, { backgroundColor: theme.primary }]}>
          <LinearGradient
            colors={darkMode ? ['#1E40AF', '#3B82F6'] : ['#3B82F6', '#60A5FA']}
            style={styles.assistantCardGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.assistantContent}>
              <View style={styles.assistantHeader}>
                <Zap size={24} color="#FFFFFF" style={styles.assistantIcon} />
                <Text style={styles.assistantTitle}>Buddy</Text>
              </View>
              <Text style={styles.assistantMessage}>
                I've analyzed your recent sessions. What would you like help with today?
              </Text>
              <View style={styles.assistantOptions}>
                <TouchableOpacity 
                  style={styles.assistantOption}
                  onPress={() => alert("AI-Generated Session feature coming soon!")}
                >
                  <Text style={styles.assistantOptionText}>Create a session plan</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.assistantOption}
                  onPress={() => handleComingSoonFeature("Coaching insights")}
                >
                  <Text style={styles.assistantOptionText}>Get coaching insights</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.sectionTitleContainer}>
          <Zap size={20} color={theme.primary} />
          <Text style={[styles.sectionTitleText, { color: theme.text, marginLeft: 8 }]}>
            AI Insights
          </Text>
        </View>
        
        <View style={styles.insightsContainer}>
          <TouchableOpacity 
            style={[styles.insightCard, { backgroundColor: theme.card }]}
            onPress={() => handleComingSoonFeature("Pattern recognition")}
          >
            <View style={[styles.insightIconContainer, { backgroundColor: darkMode ? '#312E81' : '#F5F3FF' }]}>
              <Compass size={24} color={darkMode ? '#A5B4FC' : '#8B5CF6'} />
            </View>
            <Text style={[styles.insightTitle, { color: theme.text }]}>
              Teaching Pattern Detected
            </Text>
            <Text style={[styles.insightDescription, { color: theme.secondaryText }]}>
              You focus more on technical precision than flow in your recent sessions
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.insightCard, { backgroundColor: theme.card }]}
            onPress={() => handleComingSoonFeature("Journal insights")}
          >
            <View style={[styles.insightIconContainer, { backgroundColor: darkMode ? '#7C2D12' : '#FFF7ED' }]}>
              <ClipboardList size={24} color={darkMode ? '#FDBA74' : '#F97316'} />
            </View>
            <Text style={[styles.insightTitle, { color: theme.text }]}>
              Journal Analysis
            </Text>
            <Text style={[styles.insightDescription, { color: theme.secondaryText }]}>
              Your reflection notes show progress in student engagement techniques
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionTitleContainer}>
          <Calendar size={20} color={theme.primary} />
          <Text style={[styles.sectionTitleText, { color: theme.text, marginLeft: 8 }]}>
            Session Builder
          </Text>
        </View>
        
        <View style={[styles.sessionBuilderCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.sessionBuilderTitle, { color: theme.text }]}>
            Suggested Session Plans
          </Text>
          
          <TouchableOpacity 
            style={[styles.sessionTemplate, { borderBottomColor: theme.border }]}
            onPress={() => alert("AI-Generated Session feature coming soon!")}
          >
            <View style={[styles.templateIconContainer, { backgroundColor: darkMode ? '#1E3A8A' : '#EFF6FF' }]}>
              <Target size={20} color={darkMode ? '#93C5FD' : '#3B82F6'} />
            </View>
            <View style={styles.templateContent}>
              <Text style={[styles.templateTitle, { color: theme.text }]}>Beginner Vault Progressions</Text>
              <Text style={[styles.templateDetails, { color: theme.secondaryText }]}>60 min · 8-10 students · Indoors</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.sessionTemplate}
            onPress={() => alert("AI-Generated Session feature coming soon!")}
          >
            <View style={[styles.templateIconContainer, { backgroundColor: darkMode ? '#14532D' : '#F0FDF4' }]}>
              <Target size={20} color={darkMode ? '#86EFAC' : '#22C55E'} />
            </View>
            <View style={styles.templateContent}>
              <Text style={[styles.templateTitle, { color: theme.text }]}>Advanced Balance Workshop</Text>
              <Text style={[styles.templateDetails, { color: theme.secondaryText }]}>90 min · 5-6 students · Outdoors</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionTitleContainer}>
          <Award size={20} color={theme.primary} />
          <Text style={[styles.sectionTitleText, { color: theme.text, marginLeft: 8 }]}>
            Coaching Challenge
          </Text>
        </View>

        <View style={[styles.challengeCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.challengeDescription, { color: theme.text }]}>
            This week: Incorporate partner feedback exercises in your next session
          </Text>
          <Text style={[styles.challengeSubtext, { color: theme.secondaryText }]}>
            Help students learn from watching each other's movements
          </Text>
          <TouchableOpacity 
            style={[styles.challengeButton, { backgroundColor: theme.primary }]}
            onPress={() => handleComingSoonFeature("Weekly challenge")}
          >
            <Zap size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.challengeButtonText}>Get Ideas</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionTitleContainer}>
          <Clock size={20} color={theme.primary} />
          <Text style={[styles.sectionTitleText, { color: theme.text, marginLeft: 8 }]}>
            Upcoming Sessions
          </Text>
        </View>
        
        <View style={[styles.upcomingSessionsCard, { backgroundColor: theme.card }]}>
          <TouchableOpacity 
            style={[styles.sessionItem, { borderBottomColor: theme.border }]}
            onPress={() => router.navigate('/sessions')}
          >
            <View style={styles.sessionTimeContainer}>
              <Text style={[styles.sessionDay, { color: theme.primary }]}>Today</Text>
              <Text style={[styles.sessionTime, { color: theme.secondaryText }]}>5:30 PM</Text>
            </View>
            <View style={styles.sessionContent}>
              <Text style={[styles.sessionTitle, { color: theme.text }]}>Beginner Parkour Fundamentals</Text>
              <Text style={[styles.sessionDetails, { color: theme.secondaryText }]}>60 min · 8 students</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.sessionItem}
            onPress={() => router.navigate('/sessions')}
          >
            <View style={styles.sessionTimeContainer}>
              <Text style={[styles.sessionDay, { color: theme.primary }]}>Tomorrow</Text>
              <Text style={[styles.sessionTime, { color: theme.secondaryText }]}>4:00 PM</Text>
            </View>
            <View style={styles.sessionContent}>
              <Text style={[styles.sessionTitle, { color: theme.text }]}>Advanced Vaults & Precision</Text>
              <Text style={[styles.sessionDetails, { color: theme.secondaryText }]}>90 min · 6 students</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.viewAllButton}
            onPress={() => router.navigate('/sessions')}
          >
            <Text style={[styles.viewAllText, { color: theme.primary }]}>View all sessions</Text>
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
    marginBottom: 20,
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
  // AI Assistant Card
  assistantCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  assistantCardGradient: {
    borderRadius: 16,
    padding: 20,
  },
  assistantContent: {
    width: '100%',
  },
  assistantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  assistantIcon: {
    marginRight: 8,
  },
  assistantTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  assistantMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
    lineHeight: 22,
  },
  assistantOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  assistantOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 10,
    marginBottom: 8,
  },
  assistantOptionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  // AI Insights Section
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
  },
  insightsContainer: {
    marginBottom: 24,
  },
  insightCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  insightIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 8,
  },
  insightDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  // Session Builder
  sessionBuilderCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sessionBuilderTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 16,
  },
  sessionTemplate: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  templateIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  templateContent: {
    flex: 1,
  },
  templateTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    marginBottom: 4,
  },
  templateDetails: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
  },
  // Weekly Challenge Card
  challengeCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  challengeDescription: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    marginBottom: 8,
    lineHeight: 22,
  },
  challengeSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    marginBottom: 16,
  },
  challengeButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  challengeButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  // Upcoming Sessions
  upcomingSessionsCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sessionItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  sessionTimeContainer: {
    marginRight: 16,
    alignItems: 'center',
    minWidth: 70,
  },
  sessionDay: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    marginBottom: 4,
  },
  sessionTime: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
  },
  sessionContent: {
    flex: 1,
  },
  sessionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    marginBottom: 4,
  },
  sessionDetails: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
  },
  viewAllButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  viewAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
});