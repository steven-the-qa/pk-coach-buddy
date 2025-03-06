import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Search, Filter, FileText, Brain } from 'lucide-react-native';
import { useTheme } from '../../lib/ThemeContext';

export default function JournalScreen() {
  const { theme, darkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  
  const journalEntries = [
    {
      id: '1',
      date: 'May 12, 2023',
      title: 'Youth Class Reflection',
      content: 'Today\'s youth class focused on balance drills. Many students struggled with the rail precision exercises. Need to develop more progressive drills for balance work.',
      isAiAnalyzed: true,
    },
    {
      id: '2',
      date: 'May 8, 2023',
      title: 'Advanced Group Session',
      content: 'The advanced group made excellent progress on the complex route I designed. Their teamwork was particularly impressive when tackling the challenging wall section.',
      isAiAnalyzed: false,
    },
    {
      id: '3',
      date: 'May 3, 2023',
      title: 'New Coaching Approach',
      content: 'Tried a new coaching approach today focusing more on student self-assessment. Asked them to analyze their own movement before offering my feedback. This seemed to improve retention.',
      isAiAnalyzed: true,
    },
  ];
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Coaching Journal</Text>
        <TouchableOpacity style={[styles.newButton, { backgroundColor: theme.primary }]}>
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Search size={20} color={theme.secondaryText} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search journal entries"
            placeholderTextColor={theme.secondaryText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={[styles.filterButton, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Filter size={20} color={theme.secondaryText} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.entriesContainer}>
        {journalEntries.map((entry) => (
          <TouchableOpacity key={entry.id} style={[styles.entryCard, { backgroundColor: theme.card }]}>
            <View style={styles.entryHeader}>
              <Text style={[styles.entryDate, { color: theme.secondaryText }]}>{entry.date}</Text>
              {entry.isAiAnalyzed && (
                <View style={[styles.aiTag, { backgroundColor: darkMode ? '#312E81' : '#F5F3FF' }]}>
                  <Brain size={14} color={darkMode ? '#A5B4FC' : '#8B5CF6'} style={styles.aiIcon} />
                  <Text style={[styles.aiText, { color: darkMode ? '#A5B4FC' : '#8B5CF6' }]}>AI Analyzed</Text>
                </View>
              )}
            </View>
            
            <Text style={[styles.entryTitle, { color: theme.text }]}>{entry.title}</Text>
            <Text style={[styles.entrySummary, { color: theme.secondaryText }]} numberOfLines={3}>
              {entry.content}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.fabContainer}>
        <TouchableOpacity style={[styles.fab, { backgroundColor: theme.primary }]}>
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
    width: 48,
    height: 48,
    borderRadius: 24,
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
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    paddingVertical: 4,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  entriesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  entryCard: {
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  aiTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
  },
  aiIcon: {
    marginRight: 4,
  },
  aiText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  entryTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 8,
  },
  entrySummary: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  fab: {
    flexDirection: 'row',
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