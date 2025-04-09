import React, { createContext, useState, useContext, useEffect } from 'react';
import { Appearance } from 'react-native';

// Theme definitions
const lightTheme = {
  primary: '#007AFF',
  background: '#FFFFFF',
  card: '#F2F2F7',
  text: '#000000',
  border: '#E5E5EA',
  accent: '#FF9500',
};

const darkTheme = {
  primary: '#0A84FF',
  background: '#1C1C1E',
  card: '#2C2C2E',
  text: '#FFFFFF',
  border: '#38383A',
  accent: '#FF9F0A',
};

// Create context
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Check device theme preference
  const deviceTheme = Appearance.getColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(deviceTheme === 'dark');
  const [theme, setTheme] = useState(isDarkMode ? darkTheme : lightTheme);

  // Listen for device theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkMode(colorScheme === 'dark');
      setTheme(colorScheme === 'dark' ? darkTheme : lightTheme);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    setTheme(isDarkMode ? lightTheme : darkTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 