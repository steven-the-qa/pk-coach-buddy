import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, BookOpen, MessageSquare, Lightbulb, ChevronRight, X, Zap, Send, Plus } from 'lucide-react-native';
import { useTheme } from '../../lib/ThemeContext';

// Define interfaces for our data types
interface CategoryItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface ArticleItem {
  id: string;
  title: string;
  description: string;
  image: string;
}

// Input modes enum
enum InputMode {
  SEARCH = 'search',
  ASK = 'ask'
}

export default function KnowledgeScreen() {
  const [inputMode, setInputMode] = useState<InputMode>(InputMode.SEARCH);
  const [inputText, setInputText] = useState('');
  const { theme, darkMode } = useTheme();
  
  const categories: CategoryItem[] = [
    {
      id: '1',
      title: 'ADAPT Coaching Principles',
      description: 'Core methodologies and philosophies',
      icon: <BookOpen size={24} color="#3B82F6" />,
      color: darkMode ? '#1E3A8A' : '#EFF6FF',
    },
    {
      id: '2',
      title: 'Coaching Techniques',
      description: 'Effective teaching strategies',
      icon: <MessageSquare size={24} color={darkMode ? '#A5B4FC' : '#8B5CF6'} />,
      color: darkMode ? '#312E81' : '#F5F3FF',
    },
    {
      id: '3',
      title: 'Movement Progressions',
      description: 'Structured skill development',
      icon: <Lightbulb size={24} color={darkMode ? '#FDBA74' : '#F97316'} />,
      color: darkMode ? '#7C2D12' : '#FFF7ED',
    },
  ];
  
  const featuredArticles: ArticleItem[] = [
    {
      id: '1',
      title: 'Reflective Coaching Practice',
      description: 'How to use reflection to improve your coaching methodology',
      image: 'https://images.unsplash.com/photo-1569577976786-b530a0510682?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3',
    },
    {
      id: '2',
      title: 'Managing Fear in Students',
      description: 'Techniques to help students overcome fear barriers',
      image: 'https://images.unsplash.com/photo-1569577976786-b530a0510682?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3',
    },
    {
      id: '3',
      title: 'Designing Effective Progressions',
      description: 'Creating skill progressions that build confidence',
      image: 'https://images.unsplash.com/photo-1569577976786-b530a0510682?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3',
    },
  ];

  const recentSearches: string[] = [
    'Coaching youth classes',
    'Precision jump progressions',
    'ADAPT certification requirements',
  ];
  
  // Initialize filtered state with the full arrays
  const [filteredCategories, setFilteredCategories] = useState<CategoryItem[]>(categories);
  const [filteredArticles, setFilteredArticles] = useState<ArticleItem[]>(featuredArticles);
  const [filteredSearches, setFilteredSearches] = useState<string[]>(recentSearches);
  
  // Filter content based on search query
  useEffect(() => {
    if (inputMode !== InputMode.SEARCH) return;
    
    if (inputText.trim() === '') {
      // If search is empty, show all items
      setFilteredCategories(categories);
      setFilteredArticles(featuredArticles);
      setFilteredSearches(recentSearches);
    } else {
      const query = inputText.toLowerCase().trim();
      
      // Filter categories by title and description
      const matchedCategories = categories.filter(
        category => 
          category.title.toLowerCase().includes(query) || 
          category.description.toLowerCase().includes(query)
      );
      
      // Filter articles by title and description
      const matchedArticles = featuredArticles.filter(
        article => 
          article.title.toLowerCase().includes(query) || 
          article.description.toLowerCase().includes(query)
      );
      
      // Filter recent searches
      const matchedSearches = recentSearches.filter(
        search => search.toLowerCase().includes(query)
      );
      
      setFilteredCategories(matchedCategories);
      setFilteredArticles(matchedArticles);
      setFilteredSearches(matchedSearches);
    }
  }, [inputText, inputMode]);
  
  // Clear input
  const clearInput = () => setInputText('');
  
  // Function to handle mode changes
  const switchMode = (mode: InputMode) => {
    setInputMode(mode);
    setInputText('');
  };
  
  // Function to handle AI question submission
  const handleAskQuestion = () => {
    if (inputText.trim() === '' || inputMode !== InputMode.ASK) return;
    
    // In a real implementation, you would send this question to your AI service
    console.log('Question asked:', inputText);
    
    // For now, just clear the input
    setInputText('');
    
    // You could also show a toast or feedback message
    alert('Your question has been submitted to Buddy!');
  };
  
  const isSearching = inputMode === InputMode.SEARCH && inputText.trim() !== '';
  const hasResults = filteredCategories.length > 0 || filteredArticles.length > 0 || filteredSearches.length > 0;

  const handleAddArticle = () => {
    // Placeholder function for adding a new article
    alert("Add new article feature coming soon!");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.title, { color: theme.text }]}>Knowledge Base</Text>
          <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
            Reference materials and coaching resources
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: theme.primary }]} 
          onPress={handleAddArticle}
        >
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Combined input with mode tabs */}
      <View style={styles.inputContainer}>
        {/* Mode selector tabs */}
        <View style={styles.modeTabs}>
          <TouchableOpacity 
            style={[
              styles.modeTab, 
              inputMode === InputMode.SEARCH && styles.activeTab,
              { borderColor: theme.border }
            ]}
            onPress={() => switchMode(InputMode.SEARCH)}
          >
            <Search size={16} color={inputMode === InputMode.SEARCH ? theme.primary : theme.secondaryText} />
            <Text 
              style={[
                styles.modeTabText, 
                { color: inputMode === InputMode.SEARCH ? theme.primary : theme.secondaryText }
              ]}
            >
              Search
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.modeTab, 
              inputMode === InputMode.ASK && styles.activeTab,
              { borderColor: theme.border }
            ]}
            onPress={() => switchMode(InputMode.ASK)}
          >
            <Zap size={16} color={inputMode === InputMode.ASK ? theme.primary : theme.secondaryText} />
            <Text 
              style={[
                styles.modeTabText, 
                { color: inputMode === InputMode.ASK ? theme.primary : theme.secondaryText }
              ]}
            >
              Ask Buddy
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Input field */}
        <View style={[styles.inputField, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {inputMode === InputMode.SEARCH ? (
            <Search size={20} color={theme.secondaryText} style={styles.inputIcon} />
          ) : (
            <Zap size={20} color={theme.primary} style={styles.inputIcon} />
          )}
          
          <TextInput
            style={[styles.textInput, { color: theme.text }]}
            placeholder={
              inputMode === InputMode.SEARCH 
                ? "Search knowledge base..." 
                : "Ask Buddy a question..."
            }
            placeholderTextColor={theme.secondaryText}
            value={inputText}
            onChangeText={setInputText}
            multiline={inputMode === InputMode.ASK}
            numberOfLines={inputMode === InputMode.ASK ? 2 : 1}
            autoCapitalize="none"
          />
          
          {inputText.length > 0 && (
            <>
              <TouchableOpacity onPress={clearInput}>
                <X size={20} color={theme.secondaryText} style={styles.clearIcon} />
              </TouchableOpacity>
              
              {inputMode === InputMode.ASK && (
                <TouchableOpacity 
                  style={[styles.sendButton, { backgroundColor: theme.primary }]}
                  onPress={handleAskQuestion}
                >
                  <Send size={18} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>

      <ScrollView style={styles.contentContainer}>
        {/* No results message */}
        {isSearching && !hasResults && (
          <View style={styles.noResultsContainer}>
            <Text style={[styles.noResultsText, { color: theme.secondaryText }]}>
              No results found for "{inputText}"
            </Text>
            <Text style={[styles.noResultsSubtext, { color: theme.secondaryText }]}>
              Try different keywords or check your spelling
            </Text>
          </View>
        )}

        {/* AI explanation message when in ASK mode */}
        {inputMode === InputMode.ASK && !isSearching && (
          <View style={[styles.aiExplanationCard, { backgroundColor: theme.card }]}>
            <Zap size={24} color={theme.primary} style={styles.aiExplanationIcon} />
            <View style={styles.aiExplanationContent}>
              <Text style={[styles.aiExplanationTitle, { color: theme.text }]}>
                Buddy AI
              </Text>
              <Text style={[styles.aiExplanationText, { color: theme.secondaryText }]}>
                What can I help you with?
              </Text>
            </View>
          </View>
        )}

        {/* Conditionally render categories section */}
        {(inputMode === InputMode.SEARCH || !isSearching) && filteredCategories.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {isSearching ? 'Matching Categories' : 'Categories'}
            </Text>
            <View style={styles.categoriesContainer}>
              {filteredCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[styles.categoryCard, { backgroundColor: theme.card }]}
                >
                  <View style={[styles.categoryIconContainer, { backgroundColor: category.color }]}>
                    {category.icon}
                  </View>
                  <View style={styles.categoryContent}>
                    <Text style={[styles.categoryTitle, { color: theme.text }]}>{category.title}</Text>
                    <Text style={[styles.categoryDescription, { color: theme.secondaryText }]}>
                      {category.description}
                    </Text>
                  </View>
                  <ChevronRight size={20} color={theme.secondaryText} />
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Conditionally render articles section */}
        {(inputMode === InputMode.SEARCH || !isSearching) && filteredArticles.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {isSearching ? 'Matching Articles' : 'Featured Articles'}
            </Text>
            <View style={styles.articlesContainer}>
              {filteredArticles.map((article) => (
                <TouchableOpacity key={article.id} style={[styles.articleCard, { backgroundColor: theme.card }]}>
                  <Image
                    source={{ uri: article.image }}
                    style={styles.articleImage}
                  />
                  <View style={styles.articleContent}>
                    <Text style={[styles.articleTitle, { color: theme.text }]}>{article.title}</Text>
                    <Text style={[styles.articleDescription, { color: theme.secondaryText }]}>
                      {article.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Conditionally render recent searches section */}
        {inputMode === InputMode.SEARCH && filteredSearches.length > 0 && !isSearching && (
          <>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Searches</Text>
            <View style={[styles.recentSearchesContainer, { backgroundColor: theme.card }]}>
              {filteredSearches.map((search, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={[
                    styles.recentSearchItem, 
                    { borderBottomColor: theme.border },
                    index === filteredSearches.length - 1 ? { borderBottomWidth: 0 } : { borderBottomWidth: 1 }
                  ]}
                >
                  <Search size={18} color={theme.secondaryText} style={styles.recentSearchIcon} />
                  <Text style={[styles.recentSearchText, { color: theme.text }]}>{search}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  inputContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  modeTabs: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  modeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  activeTab: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.5)',
  },
  modeTabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    marginLeft: 6,
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#0F172A',
    paddingVertical: 12,
  },
  clearIcon: {
    marginLeft: 8,
  },
  sendButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    padding: 8,
    marginLeft: 8,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  // No results styles
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
  // AI Explanation Card
  aiExplanationCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  aiExplanationIcon: {
    marginRight: 16,
  },
  aiExplanationContent: {
    flex: 1,
  },
  aiExplanationTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    marginBottom: 8,
  },
  aiExplanationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  // Original styles
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#0F172A',
    marginBottom: 16,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryContent: {
    flex: 1,
  },
  categoryTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#0F172A',
    marginBottom: 4,
  },
  categoryDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  articlesContainer: {
    marginBottom: 24,
  },
  articleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  articleImage: {
    width: '100%',
    height: 160,
  },
  articleContent: {
    padding: 16,
  },
  articleTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#0F172A',
    marginBottom: 8,
  },
  articleDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  recentSearchesContainer: {
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
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  recentSearchIcon: {
    marginRight: 12,
  },
  recentSearchText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#334155',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
});