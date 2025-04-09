import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Switch,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

const SettingsScreen = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [offlineMode, setOfflineMode] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('settings');
      if (settings) {
        const parsedSettings = JSON.parse(settings);
        setDarkMode(parsedSettings.darkMode || false);
        setNotificationsEnabled(parsedSettings.notificationsEnabled || false);
        setOfflineMode(parsedSettings.offlineMode || false);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    try {
      const settings = {
        darkMode,
        notificationsEnabled,
        offlineMode,
      };
      await AsyncStorage.setItem('settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const toggleDarkMode = async () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    await saveSettings();
    // Implement theme change logic here
  };

  const toggleNotifications = async () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    
    if (newValue) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please enable notifications in your device settings');
        setNotificationsEnabled(false);
        return;
      }
    }
    
    await saveSettings();
  };

  const toggleOfflineMode = async () => {
    const newValue = !offlineMode;
    setOfflineMode(newValue);
    await saveSettings();
    // Implement offline mode logic here
  };

  const handleClearCache = async () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear all cached data?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert('Success', 'Cache cleared successfully');
            } catch {
              Alert.alert('Error', 'Failed to clear cache');
            }
          },
        },
      ]
    );
  };

  const SettingItem = ({ icon, title, description, children }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingIcon}>
        <Ionicons name={icon} size={24} color="#007AFF" />
      </View>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        {description && <Text style={styles.settingDescription}>{description}</Text>}
      </View>
      {children}
    </View>
  );

  return (
    <View style={styles.container}>
      <SettingItem
        icon="moon"
        title="Dark Mode"
        description="Switch between light and dark theme"
      >
        <Switch
          value={darkMode}
          onValueChange={toggleDarkMode}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={darkMode ? '#007AFF' : '#f4f3f4'}
        />
      </SettingItem>

      <SettingItem
        icon="notifications"
        title="Notifications"
        description="Receive campus updates and alerts"
      >
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={notificationsEnabled ? '#007AFF' : '#f4f3f4'}
        />
      </SettingItem>

      <SettingItem
        icon="cloud-offline"
        title="Offline Mode"
        description="Use the app without internet connection"
      >
        <Switch
          value={offlineMode}
          onValueChange={toggleOfflineMode}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={offlineMode ? '#007AFF' : '#f4f3f4'}
        />
      </SettingItem>

      <TouchableOpacity
        style={styles.clearCacheButton}
        onPress={handleClearCache}
      >
        <Ionicons name="trash" size={24} color="red" />
        <Text style={styles.clearCacheText}>Clear Cache</Text>
      </TouchableOpacity>

      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingIcon: {
    marginRight: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingDescription: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4,
  },
  clearCacheButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 32,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'red',
  },
  clearCacheText: {
    marginLeft: 8,
    color: 'red',
    fontSize: 16,
    fontWeight: '600',
  },
  versionContainer: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  versionText: {
    color: 'gray',
    fontSize: 12,
  },
});

export default SettingsScreen; 