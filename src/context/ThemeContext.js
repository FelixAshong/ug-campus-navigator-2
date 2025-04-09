import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const settings = await AsyncStorage.getItem('settings');
      if (settings) {
        const { darkMode } = JSON.parse(settings);
        setIsDarkMode(darkMode);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    try {
      const settings = await AsyncStorage.getItem('settings');
      const parsedSettings = settings ? JSON.parse(settings) : {};
      await AsyncStorage.setItem(
        'settings',
        JSON.stringify({ ...parsedSettings, darkMode: newTheme })
      );
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: {
      primary: '#007AFF',
      background: isDarkMode ? '#121212' : '#FFFFFF',
      card: isDarkMode ? '#1E1E1E' : '#FFFFFF',
      text: isDarkMode ? '#FFFFFF' : '#000000',
      border: isDarkMode ? '#2C2C2C' : '#E5E5E5',
      notification: '#FF3B30',
      placeholder: isDarkMode ? '#8E8E93' : '#8E8E93',
    },
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
}; 