import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, BookOpen, MessageSquare, Lightbulb, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../lib/ThemeContext';

export default function KnowledgeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, darkMode } = useTheme();
  
  const categories = [
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
  
  const featuredArticles = [
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

  const recentSearches = [
    'Coaching youth classes',
    'Precision jump progressions',
    'ADAPT certification requirements',
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Knowledge Base</Text>
        <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
          Reference materials and coaching resources
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Search size={20} color={theme.secondaryText} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search knowledge base..."
            placeholderTextColor={theme.secondaryText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView style={styles.contentContainer}>
        <View style={styles.aiAssistantCard}>
          <View style={styles.aiAssistantContent}>
            <Text style={styles.aiAssistantTitle}>AI Coaching Assistant</Text>
            <Text style={styles.aiAssistantDescription}>
              Ask questions about parkour coaching, ADAPT principles, or get help with specific coaching challenges.
            </Text>
            <TouchableOpacity style={styles.aiAssistantButton}>
              <Text style={styles.aiAssistantButtonText}>Ask a Question</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Categories</Text>
        <View style={styles.categoriesContainer}>
          {categories.map((category) => (
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

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Featured Articles</Text>
        <View style={styles.articlesContainer}>
          {featuredArticles.map((article) => (
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

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Searches</Text>
        <View style={[styles.recentSearchesContainer, { backgroundColor: theme.card }]}>
          {recentSearches.map((search, index) => (
            <TouchableOpacity 
              key={index} 
              style={[
                styles.recentSearchItem, 
                { borderBottomColor: theme.border },
                index === recentSearches.length - 1 ? { borderBottomWidth: 0 } : {}
              ]}
            >
              <Search size={18} color={theme.secondaryText} style={styles.recentSearchIcon} />
              <Text style={[styles.recentSearchText, { color: theme.text }]}>{search}</Text>
            </TouchableOpacity>
          ))}
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
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
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
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  aiAssistantCard: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
  },
  aiAssistantContent: {
    flex: 1,
  },
  aiAssistantTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  aiAssistantDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#DBEAFE',
    marginBottom: 16,
  },
  aiAssistantButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  aiAssistantButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#3B82F6',
  },
  aiAssistantIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
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
});