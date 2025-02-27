import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Brain, Calendar, FileText, Lightbulb } from 'lucide-react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.name}>Coach</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80' }}
              style={styles.profileImage}
            />
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

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.actionIcon, { backgroundColor: '#EFF6FF' }]}>
              <FileText size={24} color="#3B82F6" />
            </View>
            <Text style={styles.actionTitle}>New Journal Entry</Text>
            <Text style={styles.actionDescription}>Reflect on your coaching</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.actionIcon, { backgroundColor: '#F0FDF4' }]}>
              <Calendar size={24} color="#22C55E" />
            </View>
            <Text style={styles.actionTitle}>Plan Session</Text>
            <Text style={styles.actionDescription}>Create a new training plan</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.actionIcon, { backgroundColor: '#FEF2F2' }]}>
              <Brain size={24} color="#EF4444" />
            </View>
            <Text style={styles.actionTitle}>AI Insights</Text>
            <Text style={styles.actionDescription}>Get coaching suggestions</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.actionIcon, { backgroundColor: '#FFF7ED' }]}>
              <Lightbulb size={24} color="#F97316" />
            </View>
            <Text style={styles.actionTitle}>Knowledge Base</Text>
            <Text style={styles.actionDescription}>Explore ADAPT principles</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.recentActivity}>
          <View style={styles.activityItem}>
            <View style={styles.activityIconContainer}>
              <FileText size={20} color="#3B82F6" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Journal Entry: Beginner Class Reflection</Text>
              <Text style={styles.activityTime}>Today, 2:30 PM</Text>
            </View>
          </View>

          <View style={styles.activityItem}>
            <View style={styles.activityIconContainer}>
              <Calendar size={20} color="#22C55E" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Session Plan: Advanced Vaults</Text>
              <Text style={styles.activityTime}>Yesterday, 10:15 AM</Text>
            </View>
          </View>

          <View style={styles.activityItem}>
            <View style={styles.activityIconContainer}>
              <Brain size={20} color="#EF4444" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>AI Insight: Progression Suggestions</Text>
              <Text style={styles.activityTime}>2 days ago, 4:45 PM</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
    color: '#64748B',
  },
  name: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#0F172A',
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
    color: '#0F172A',
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
  actionIcon: {
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
    color: '#0F172A',
    marginBottom: 4,
  },
  actionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748B',
  },
  recentActivity: {
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
    color: '#0F172A',
    marginBottom: 4,
  },
  activityTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#64748B',
  },
});