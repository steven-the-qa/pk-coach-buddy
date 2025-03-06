import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Get Supabase URL and key from Constants with fallbacks
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl as string || 
  "https://ovmsheguhtvhomizosbs.supabase.co";
const supabaseKey = Constants.expoConfig?.extra?.supabaseKey as string || 
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92bXNoZWd1aHR2aG9taXpvc2JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NjU0MjQsImV4cCI6MjA1NjM0MTQyNH0.h88UsrQTJSdA1RMwb2i6xt_4vWVktbQ12V261TQFbVc";

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