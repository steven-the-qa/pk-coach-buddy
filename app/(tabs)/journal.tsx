import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Search, Zap } from 'lucide-react-native';
import { useTheme } from '../../lib/ThemeContext';

// Define interface for journal entries
interface JournalEntry {
  id: string;
  date: string;
  title: string;
  content: string;
  isAiAnalyzed: boolean;
}

export default function JournalScreen() {
  const { theme, darkMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);
  const [showAiAnalyzedOnly, setShowAiAnalyzedOnly] = useState(false);

  // Add handler for new journal entry button
  const handleAddEntry = () => {
    // Placeholder function for adding a new journal entry
    alert("Add new journal entry feature coming soon!");
  };

  const journalEntries: JournalEntry[] = [
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

  // Toggle AI analyzed filter
  const toggleAiFilter = () => {
    setShowAiAnalyzedOnly(!showAiAnalyzedOnly);
  };

  // Filter entries based on search query and AI filter
  useEffect(() => {
    let filtered = [...journalEntries];

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(entry => 
        entry.title.toLowerCase().includes(query) || 
        entry.content.toLowerCase().includes(query)
      );
    }

    // Filter by AI-analyzed
    if (showAiAnalyzedOnly) {
      filtered = filtered.filter(entry => entry.isAiAnalyzed);
    }

    setFilteredEntries(filtered);
  }, [searchQuery, showAiAnalyzedOnly]);

  // Check if there are any search results
  const hasSearchResults = filteredEntries.length > 0;
  const isSearching = searchQuery.trim() !== '';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Coaching Journal</Text>
        <TouchableOpacity 
          style={[styles.newButton, { backgroundColor: theme.primary }]}
          onPress={handleAddEntry}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Search size={20} color={theme.secondaryText} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search journal entries..."
            placeholderTextColor={theme.secondaryText}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <View style={styles.clearButtonContainer}>
                <Text style={styles.clearButton}>✕</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity 
          style={[
            styles.filterButton, 
            { 
              backgroundColor: showAiAnalyzedOnly ? '#3B82F6' : theme.card,
              borderColor: showAiAnalyzedOnly ? '#3B82F6' : theme.border 
            }
          ]}
          onPress={toggleAiFilter}
        >
          <Zap size={20} color={showAiAnalyzedOnly ? '#FFFFFF' : theme.secondaryText} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.entriesContainer}>
        {isSearching && !hasSearchResults && (
          <View style={styles.noResultsContainer}>
            <Text style={[styles.noResultsText, { color: theme.secondaryText }]}>
              No entries found for "{searchQuery}"
            </Text>
            <Text style={[styles.noResultsSubtext, { color: theme.secondaryText }]}>
              Try different keywords or check your spelling
            </Text>
          </View>
        )}

        {!isSearching && showAiAnalyzedOnly && filteredEntries.length === 0 && (
          <View style={styles.noResultsContainer}>
            <Text style={[styles.noResultsText, { color: theme.secondaryText }]}>
              No AI analyzed entries found
            </Text>
            <Text style={[styles.noResultsSubtext, { color: theme.secondaryText }]}>
              Turn off the AI filter to see all entries
            </Text>
          </View>
        )}

        {filteredEntries.map((entry) => (
          <TouchableOpacity key={entry.id} style={[styles.entryCard, { backgroundColor: theme.card }]}>
            <View style={styles.entryHeader}>
              <Text style={[styles.entryDate, { color: theme.secondaryText }]}>{entry.date}</Text>
              {entry.isAiAnalyzed && (
                <View style={styles.aiTag}>
                  <Zap size={14} color="#FFFFFF" style={styles.aiIcon} />
                  <Text style={styles.aiText}>AI Analyzed</Text>
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
  clearButtonContainer: {
    padding: 4,
  },
  clearButton: {
    fontSize: 16,
    color: '#999',
    fontWeight: 'bold',
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
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  noResultsText: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  noResultsSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
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
    backgroundColor: '#3B82F6',
  },
  aiIcon: {
    marginRight: 4,
  },
  aiText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#FFFFFF',
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
});