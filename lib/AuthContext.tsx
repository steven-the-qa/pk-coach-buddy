import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from './supabase';
import { Session } from '@supabase/supabase-js';
import { makeRedirectUri } from 'expo-auth-session';

// Define a consistent redirect URL for all auth flows
const AUTH_REDIRECT_URL = 'pkcoachbuddy://auth/callback';

type AuthContextType = {
  session: Session | null;
  user: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  signInWithMagicLink: (email: string) => Promise<{ error: any }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Generate dynamic redirect URI using expo-auth-session
  const redirectUri = makeRedirectUri();
  console.log('AuthContext redirectUri:', redirectUri);
  
  useEffect(() => {
    // Get session from storage and set state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes to auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    loading,
    signIn: async (email: string, password: string) => {
      return supabase.auth.signInWithPassword({ email, password });
    },
    signUp: async (email: string, password: string) => {
      return supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUri
        }
      });
    },
    signOut: async () => {
      console.log("AuthContext: signOut method called");
      try {
        // Clear local state first
        setUser(null);
        setSession(null);
        
        // Then call Supabase auth signOut
        const { error } = await supabase.auth.signOut();
        
        if (error) {
          // Special handling for AuthSessionMissingError
          if (error.message && error.message.includes('Auth session missing')) {
            // User is already signed out, which is what we wanted
            console.log("AuthContext: User was already signed out");
            return { error: null };
          }
          
          console.error("AuthContext: Error during signOut:", error);
          return { error };
        }
        
        console.log("AuthContext: signOut successful");
        return { error: null };
      } catch (err) {
        console.error("AuthContext: Exception during signOut:", err);
        return { error: err };
      }
    },
    signInWithMagicLink: async (email: string) => {
      return supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUri,
          shouldCreateUser: false
        }
      });
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 