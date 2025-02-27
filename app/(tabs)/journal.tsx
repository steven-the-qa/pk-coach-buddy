import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Search, Filter, FileText, Brain } from 'lucide-react-native';

export default function JournalScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const journalEntries = [
    {
      id: '1',
      title: 'Beginner Class Reflection',
      date: 'Today, 2:30 PM',
      summary: 'Students struggled with basic vaults. Need to develop more progressive drills.',
      hasAiInsight: true,
    },
    {
      id: '2',
      title: 'Advanced Group Progress',
      date: 'Yesterday, 10:15 AM',
      summary: 'Great progress on precision jumps. Consider adding rail balance challenges next week.',
      hasAiInsight: true,
    },
    {
      id: '3',
      title: 'Youth Class Challenges',
      date: '2 days ago, 4:45 PM',
      summary: 'Attention spans varied widely. Need to incorporate more games into the warm-up.',
      hasAiInsight: false,
    },
    {
      id: '4',
      title: 'Private Coaching Session',
      date: '1 week ago, 3:00 PM',
      summary: 'Client has fear issues with height. Developed gradual progression plan.',
      hasAiInsight: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Coaching Journal</Text>
        <TouchableOpacity style={styles.newButton}>
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#64748B" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search journal entries"
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.entriesContainer}>
        {journalEntries.map((entry) => (
          <TouchableOpacity key={entry.id} style={styles.entryCard}>
            <View style={styles.entryHeader}>
              <View style={styles.entryIconContainer}>
                <FileText size={20} color="#3B82F6" />
              </View>
              <Text style={styles.entryDate}>{entry.date}</Text>
            </View>
            <Text style={styles.entryTitle}>{entry.title}</Text>
            <Text style={styles.entrySummary}>{entry.summary}</Text>
            {entry.hasAiInsight && (
              <View style={styles.insightContainer}>
                <Brain size={16} color="#8B5CF6" style={styles.insightIcon} />
                <Text style={styles.insightText}>AI Insight Available</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fab}>
          <Plus size={24} color="#FFFFFF" />
          <Text style={styles.fabText}>New Entry</Text>
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
  entriesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  entryCard: {
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
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  entryIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  entryDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  entryTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#0F172A',
    marginBottom: 8,
  },
  entrySummary: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#334155',
    marginBottom: 12,
  },
  insightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  insightIcon: {
    marginRight: 6,
  },
  insightText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#8B5CF6',
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