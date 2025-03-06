import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Function to safely access nested properties
const getExpoConstant = (path: string[], defaultValue: string = ''): string => {
  let current: any = Constants;
  for (const segment of path) {
    if (current === undefined || current === null) return defaultValue;
    current = current[segment];
  }
  return current || defaultValue;
};

// Get Supabase credentials
const supabaseUrl = getExpoConstant(['expoConfig', 'extra', 'supabaseUrl']);
const supabaseKey = getExpoConstant(['expoConfig', 'extra', 'supabaseKey']);

// Validate credentials
if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials are missing. Check your environment configuration.');
}

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types
export type CoachProfile = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  bio: string | null;
  experience_level: string | null;
  adapt_certified: boolean;
};

export type CoachingSession = {
  id: string;
  created_at: string;
  coach_id: string;
  session_date: string;
  session_title: string;
  duration_minutes: number | null;
  student_count: number | null;
  location: string | null;
  goals: string | null;
  completed: boolean;
};

export type CoachReflection = {
  id: string;
  created_at: string;
  coach_id: string;
  session_id: string | null;
  reflection_text: string;
  challenges: string | null;
  successes: string | null;
  ai_insights: string | null;
};

export type SessionPlan = {
  id: string;
  created_at: string;
  coach_id: string;
  title: string;
  description: string | null;
  target_skills: string[] | null;
  drills: any | null;
  is_template: boolean;
};

export type KnowledgeBaseEntry = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  content: string;
  category: string;
  tags: string[] | null;
}; 