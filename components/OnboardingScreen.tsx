import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronRight } from 'lucide-react-native';

interface OnboardingScreenProps {
  onComplete: () => void;
}

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    {
      title: 'Welcome to AI-Powered Parkour Coaching',
      description: 'An assistant designed specifically for ADAPT-trained parkour coaches to enhance your coaching practice.',
      image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Reflective Coaching Practice',
      description: 'Journal your coaching experiences and receive AI-assisted insights to improve your teaching methods.',
      image: 'https://images.unsplash.com/photo-1517438984742-1262db08379e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'AI-Generated Session Plans',
      description: 'Create structured training sessions based on ADAPT methodologies with the help of AI suggestions.',
      image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Parkour Knowledge Base',
      description: 'Access a comprehensive library of parkour coaching resources aligned with ADAPT principles.',
      image: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={{ uri: steps[currentStep].image }}
          style={styles.image}
        />
        
        <View style={styles.content}>
          <Text style={styles.title}>{steps[currentStep].title}</Text>
          <Text style={styles.description}>{steps[currentStep].description}</Text>
          
          <View style={styles.indicators}>
            {steps.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  currentStep === index && styles.activeIndicator,
                ]}
              />
            ))}
          </View>
          
          <View style={styles.buttonContainer}>
            {currentStep < steps.length - 1 ? (
              <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                <Text style={styles.skipButtonText}>Skip</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ flex: 1 }} />
            )}
            
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>
                {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
              </Text>
              <ChevronRight size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
  },
  image: {
    width: '100%',
    height: 400,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#0F172A',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748B',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 48,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#3B82F6',
    width: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skipButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#64748B',
  },
  nextButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    marginRight: 8,
  },
});