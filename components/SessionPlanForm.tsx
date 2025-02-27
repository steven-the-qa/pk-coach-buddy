import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Brain, X, Plus, Trash2 } from 'lucide-react-native';

interface SessionPlanFormProps {
  onClose: () => void;
  onSave: (session: {
    title: string;
    date: string;
    duration: string;
    participants: string;
    objectives: string;
    warmup: string;
    mainActivities: Array<{ title: string; description: string }>;
    cooldown: string;
    notes: string;
  }) => void;
}

export default function SessionPlanForm({ onClose, onSave }: SessionPlanFormProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState('');
  const [participants, setParticipants] = useState('');
  const [objectives, setObjectives] = useState('');
  const [warmup, setWarmup] = useState('');
  const [mainActivities, setMainActivities] = useState([
    { title: '', description: '' },
  ]);
  const [cooldown, setCooldown] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddActivity = () => {
    setMainActivities([...mainActivities, { title: '', description: '' }]);
  };

  const handleRemoveActivity = (index: number) => {
    const updatedActivities = [...mainActivities];
    updatedActivities.splice(index, 1);
    setMainActivities(updatedActivities);
  };

  const handleActivityChange = (index: number, field: 'title' | 'description', value: string) => {
    const updatedActivities = [...mainActivities];
    updatedActivities[index][field] = value;
    setMainActivities(updatedActivities);
  };

  const handleSave = () => {
    onSave({
      title,
      date,
      duration,
      participants,
      objectives,
      warmup,
      mainActivities,
      cooldown,
      notes,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>New Session Plan</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color="#64748B" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.formContainer}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Session Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter a title for your session"
            placeholderTextColor="#94A3B8"
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Date & Time</Text>
            <TextInput
              style={styles.input}
              value={date}
              onChangeText={setDate}
              placeholder="e.g., Jun 15, 5:30 PM"
              placeholderTextColor="#94A3B8"
            />
          </View>
          <View style={[styles.formGroup, { flex: 1 }]}>
            <Text style={styles.label}>Duration</Text>
            <TextInput
              style={styles.input}
              value={duration}
              onChangeText={setDuration}
              placeholder="e.g., 60 min"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Participants</Text>
          <TextInput
            style={styles.input}
            value={participants}
            onChangeText={setParticipants}
            placeholder="e.g., Beginner class, 8 students"
            placeholderTextColor="#94A3B8"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Session Objectives</Text>
          <TextInput
            style={styles.textArea}
            value={objectives}
            onChangeText={setObjectives}
            placeholder="What are the main goals for this session?"
            placeholderTextColor="#94A3B8"
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Warm-up (10-15 min)</Text>
          <TextInput
            style={styles.textArea}
            value={warmup}
            onChangeText={setWarmup}
            placeholder="Describe your warm-up activities..."
            placeholderTextColor="#94A3B8"
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.formGroup}>
          <View style={styles.sectionHeader}>
            <Text style={styles.label}>Main Activities</Text>
            <TouchableOpacity onPress={handleAddActivity} style={styles.addButton}>
              <Plus size={20} color="#3B82F6" />
              <Text style={styles.addButtonText}>Add Activity</Text>
            </TouchableOpacity>
          </View>
          
          {mainActivities.map((activity, index) => (
            <View key={index} style={styles.activityContainer}>
              <View style={styles.activityHeader}>
                <Text style={styles.activityNumber}>Activity {index + 1}</Text>
                {mainActivities.length > 1 && (
                  <TouchableOpacity 
                    onPress={() => handleRemoveActivity(index)}
                    style={styles.removeButton}
                  >
                    <Trash2 size={18} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
              
              <TextInput
                style={styles.input}
                value={activity.title}
                onChangeText={(value) => handleActivityChange(index, 'title', value)}
                placeholder="Activity title"
                placeholderTextColor="#94A3B8"
                marginBottom={8}
              />
              
              <TextInput
                style={styles.textArea}
                value={activity.description}
                onChangeText={(value) => handleActivityChange(index, 'description', value)}
                placeholder="Describe the activity, progressions, and coaching cues..."
                placeholderTextColor="#94A3B8"
                multiline
                textAlignVertical="top"
              />
            </View>
          ))}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Cool-down (5-10 min)</Text>
          <TextInput
            style={styles.textArea}
            value={cooldown}
            onChangeText={setCooldown}
            placeholder="Describe your cool-down activities..."
            placeholderTextColor="#94A3B8"
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Additional Notes</Text>
          <TextInput
            style={styles.textArea}
            value={notes}
            onChangeText={setNotes}
            placeholder="Any other notes or reminders for this session..."
            placeholderTextColor="#94A3B8"
            multiline
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity style={styles.aiInsightButton}>
          <Brain size={20} color="#8B5CF6" style={styles.aiIcon} />
          <Text style={styles.aiInsightText}>Generate AI Session Plan</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Plan</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#0F172A',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#0F172A',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  textArea: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 120,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#3B82F6',
    marginLeft: 4,
  },
  activityContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityNumber: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#3B82F6',
  },
  removeButton: {
    padding: 4,
  },
  aiInsightButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F3FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  aiIcon: {
    marginRight: 8,
  },
  aiInsightText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#8B5CF6',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#64748B',
  },
  saveButton: {
    flex: 2,
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFFFFF',
  },
});