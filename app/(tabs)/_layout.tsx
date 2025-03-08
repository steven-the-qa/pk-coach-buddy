import React, { useEffect, useState } from 'react';
import { Tabs, useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Chrome as Home, BookOpen, Calendar, Settings, FileText } from 'lucide-react-native';
import { useTheme } from '../../lib/ThemeContext';
import { useAuth } from '../../lib/AuthContext';
import LoadingScreen from '../../components/LoadingScreen';

export default function TabLayout() {
  const { theme, darkMode } = useTheme();
  const { loading, session } = useAuth();
  const router = useRouter();
  const [isScreenMounted, setIsScreenMounted] = useState(false);
  
  // Mark component as mounted
  useEffect(() => {
    setIsScreenMounted(true);
    return () => setIsScreenMounted(false);
  }, []);
  
  // Check authentication only after component is mounted
  useEffect(() => {
    if (isScreenMounted && !loading && !session) {
      // Small delay to ensure navigation is ready
      const timer = setTimeout(() => {
        router.replace('/auth');
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [isScreenMounted, loading, session, router]);
  
  // Show loading screen while checking auth
  if (loading) {
    return <LoadingScreen message="Loading your dashboard..." />;
  }
  
  // If not authenticated and still on this screen, show loading until redirect happens
  if (!session) {
    return <LoadingScreen message="Preparing your experience..." />;
  }
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: theme.secondaryText,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopWidth: 1,
          borderTopColor: theme.tabBarBorder,
          height: 80,
          paddingBottom: 14,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          tabBarIcon: ({ color, size }) => <FileText size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="sessions"
        options={{
          title: 'Sessions',
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="knowledge"
        options={{
          title: 'Knowledge',
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});