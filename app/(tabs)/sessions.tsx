import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Search, Filter, Clock, Users, Brain, Bot, Zap } from 'lucide-react-native';
import { useTheme } from '../../lib/ThemeContext';

// Define the Session type
interface Session {
  id: string;
  title: string;
  date: string;
  duration: string;
  participants: string;
  isAiGenerated: boolean;
}

export default function SessionsScreen() {
  const { theme, darkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showAiGeneratedOnly, setShowAiGeneratedOnly] = useState(false);
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([]);
  
  const upcomingSessions = [
    {
      id: '1',
      title: 'Beginner Parkour Fundamentals',
      date: 'Today, 5:30 PM',
      duration: '60 min',
      participants: '8 students',
      isAiGenerated: true,
    },
    {
      id: '2',
      title: 'Advanced Vaults & Precision',
      date: 'Tomorrow, 4:00 PM',
      duration: '90 min',
      participants: '6 students',
      isAiGenerated: false,
    },
    {
      id: '3',
      title: 'Youth Parkour Games',
      date: 'Wed, Jun 12, 3:30 PM',
      duration: '60 min',
      participants: '12 students',
      isAiGenerated: true,
    },
  ];
  
  const pastSessions = [
    {
      id: '4',
      title: 'Intermediate Flow Training',
      date: 'Yesterday, 6:00 PM',
      duration: '75 min',
      participants: '5 students',
      isAiGenerated: false,
    },
    {
      id: '5',
      title: 'Private Coaching: Fear Management',
      date: 'Mon, Jun 10, 2:00 PM',
      duration: '60 min',
      participants: '1 student',
      isAiGenerated: true,
    },
    {
      id: '6',
      title: 'Outdoor Urban Movement',
      date: 'Sat, Jun 8, 10:00 AM',
      duration: '120 min',
      participants: '8 students',
      isAiGenerated: false,
    },
  ];

  // Filter sessions based on search query and AI filter
  useEffect(() => {
    const sessions = activeTab === 'upcoming' ? upcomingSessions : pastSessions;
    
    let filtered = sessions;
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(session => 
        session.title.toLowerCase().includes(query) ||
        session.date.toLowerCase().includes(query) ||
        session.participants.toLowerCase().includes(query)
      );
    }
    
    // Filter by AI-generated
    if (showAiGeneratedOnly) {
      filtered = filtered.filter(session => session.isAiGenerated);
    }
    
    setFilteredSessions(filtered);
  }, [searchQuery, activeTab, showAiGeneratedOnly]);

  // Add handler for new session button
  const handleAddSession = () => {
    // Placeholder function for adding a new session
    alert("Add new session feature coming soon!");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Coaching Sessions</Text>
        <TouchableOpacity 
          style={styles.newButton}
          onPress={handleAddSession}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.card }]}>
          <Search size={20} color={theme.secondaryText} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search sessions"
            placeholderTextColor={theme.tertiaryText || "#94A3B8"}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity 
          style={[
            styles.filterButton, 
            { backgroundColor: theme.card },
            showAiGeneratedOnly && { backgroundColor: theme.primary }
          ]}
          onPress={() => setShowAiGeneratedOnly(!showAiGeneratedOnly)}
        >
          <Zap 
            size={20} 
            color={showAiGeneratedOnly ? "#FFFFFF" : theme.secondaryText} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'upcoming' && styles.activeTabText,
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'past' && styles.activeTab]}
          onPress={() => setActiveTab('past')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'past' && styles.activeTabText,
            ]}
          >
            Past
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.sessionsContainer}>
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <TouchableOpacity key={session.id} style={[styles.sessionCard, { backgroundColor: theme.card }]}>
              <View style={styles.sessionHeader}>
                <Text style={[styles.sessionDate, { color: theme.secondaryText }]}>{session.date}</Text>
                {session.isAiGenerated && (
                  <View style={[styles.aiGeneratedTag, { backgroundColor: darkMode ? '#1E3A8A' : '#EFF6FF' }]}>
                    <Zap size={14} color={darkMode ? '#93C5FD' : '#3B82F6'} style={styles.aiIcon} />
                    <Text style={[styles.aiGeneratedText, { color: darkMode ? '#93C5FD' : '#3B82F6' }]}>AI Generated</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.sessionTitle, { color: theme.text }]}>{session.title}</Text>
              <View style={styles.sessionDetails}>
                <View style={[styles.detailItem, { borderColor: theme.border }]}>
                  <Clock size={16} color={theme.secondaryText} style={styles.detailIcon} />
                  <Text style={[styles.detailText, { color: theme.secondaryText }]}>{session.duration}</Text>
                </View>
                <View style={[styles.detailItem, { borderColor: theme.border }]}>
                  <Users size={16} color={theme.secondaryText} style={styles.detailIcon} />
                  <Text style={[styles.detailText, { color: theme.secondaryText }]}>{session.participants}</Text>
                </View>
              </View>
              {activeTab === 'upcoming' ? (
                <View style={[styles.actionButtons, { borderColor: theme.border }]}>
                  <TouchableOpacity style={[styles.editButton, { borderColor: theme.border }]}>
                    <Text style={[styles.editButtonText, { color: theme.secondaryText }]}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.startButton, { backgroundColor: theme.primary }]}>
                    <Text style={[styles.startButtonText, { color: "#FFFFFF" }]}>Start Session</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={[styles.viewButton, { borderColor: theme.border }]}>
                  <Text style={[styles.viewButtonText, { color: theme.secondaryText }]}>View Details</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={[styles.emptyStateText, { color: theme.secondaryText }]}>
              {showAiGeneratedOnly 
                ? "No AI-generated sessions found" 
                : "No sessions match your search"}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
  },
  newButton: {
    backgroundColor: '#3B82F6',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#0F172A',
    paddingVertical: 12,
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#E2E8F0',
  },
  activeTab: {
    borderBottomColor: '#3B82F6',
  },
  tabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#64748B',
  },
  activeTabText: {
    color: '#3B82F6',
  },
  sessionsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sessionCard: {
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
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionDate: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  aiGeneratedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  aiIcon: {
    marginRight: 4,
  },
  aiGeneratedText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#8B5CF6',
  },
  sessionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#0F172A',
    marginBottom: 12,
  },
  sessionDetails: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailIcon: {
    marginRight: 6,
  },
  detailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  editButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    marginRight: 8,
  },
  editButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  startButton: {
    flex: 2,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 8,
  },
  startButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#FFFFFF',
  },
  viewButton: {
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
  },
  viewButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  emptyStateContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    textAlign: 'center',
  },
});