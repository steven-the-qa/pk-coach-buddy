import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Initialize Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Tells Supabase Auth to continuously refresh the session automatically
// if the app is in the foreground. When this is added, you will continue
// to receive `onAuthStateChange` events with the `TOKEN_REFRESHED` or
// `SIGNED_OUT` event if the user's session is terminated.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

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