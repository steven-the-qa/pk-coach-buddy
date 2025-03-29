import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define theme colors
export const lightTheme = {
  background: '#F8FAFC',
  card: '#FFFFFF',
  text: '#0F172A',
  secondaryText: '#64748B',
  tertiaryText: '#94A3B8',
  border: '#F1F5F9',
  buttonBorder: '#E2E8F0',
  tabBar: '#FFFFFF',
  tabBarBorder: '#E2E8F0',
  primary: '#3B82F6',
  error: '#EF4444',
};

export const darkTheme = {
  background: '#111827',
  card: '#1F2937',
  text: '#F9FAFB',
  secondaryText: '#D1D5DB',
  tertiaryText: '#9CA3AF',
  border: '#374151',
  buttonBorder: '#4B5563',
  tabBar: '#1F2937',
  tabBarBorder: '#374151',
  primary: '#3B82F6',
  error: '#EF4444',
};

// Create the context
type ThemeContextType = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  theme: typeof lightTheme;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  setDarkMode: () => {},
  theme: lightTheme,
  toggleDarkMode: () => {},
});

// Storage key for persisting theme preference
const DARK_MODE_STORAGE_KEY = 'darkMode';

interface ThemeProviderProps {
  children: ReactNode;
}

// Provider component
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [darkMode, setDarkMode] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load saved theme preference
    async function loadThemePreference() {
      try {
        const savedValue = await AsyncStorage.getItem(DARK_MODE_STORAGE_KEY);
        if (savedValue !== null) {
          setDarkMode(savedValue === 'true');
        }
      } catch (error) {
        console.log('Error loading theme preference:', error);
      } finally {
        setIsLoaded(true);
      }
    }

    loadThemePreference();
  }, []);

  useEffect(() => {
    // Save theme preference when it changes
    if (isLoaded) {
      AsyncStorage.setItem(DARK_MODE_STORAGE_KEY, String(darkMode)).catch((error: Error) => {
        console.log('Error saving theme preference:', error);
      });
    }
  }, [darkMode, isLoaded]);

  const theme = darkMode ? darkTheme : lightTheme;

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, theme, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook for using the theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 