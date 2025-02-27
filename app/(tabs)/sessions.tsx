import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Search, Filter, Calendar, Clock, Users, Brain } from 'lucide-react-native';

export default function SessionsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
  
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

  const sessions = activeTab === 'upcoming' ? upcomingSessions : pastSessions;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Training Sessions</Text>
        <TouchableOpacity style={styles.newButton}>
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#64748B" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search sessions"
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#64748B" />
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
        {sessions.map((session) => (
          <TouchableOpacity key={session.id} style={styles.sessionCard}>
            <View style={styles.sessionHeader}>
              <Text style={styles.sessionDate}>{session.date}</Text>
              {session.isAiGenerated && (
                <View style={styles.aiGeneratedTag}>
                  <Brain size={14} color="#8B5CF6" style={styles.aiIcon} />
                  <Text style={styles.aiGeneratedText}>AI Generated</Text>
                </View>
              )}
            </View>
            <Text style={styles.sessionTitle}>{session.title}</Text>
            <View style={styles.sessionDetails}>
              <View style={styles.detailItem}>
                <Clock size={16} color="#64748B" style={styles.detailIcon} />
                <Text style={styles.detailText}>{session.duration}</Text>
              </View>
              <View style={styles.detailItem}>
                <Users size={16} color="#64748B" style={styles.detailIcon} />
                <Text style={styles.detailText}>{session.participants}</Text>
              </View>
            </View>
            {activeTab === 'upcoming' ? (
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.editButton}>
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.startButton}>
                  <Text style={styles.startButtonText}>Start Session</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.viewButton}>
                <Text style={styles.viewButtonText}>View Details</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab}>
          <Plus size={24} color="#FFFFFF" />
          <Text style={styles.fabText}>New Session</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
    color: '#0F172A',
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
    color: '#64748B',
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
  },
  detailIcon: {
    marginRight: 6,
  },
  detailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  actionButtons: {
    flexDirection: 'row',
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
    color: '#64748B',
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
    color: '#64748B',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  fab: {
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  fabText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 8,
  },
});