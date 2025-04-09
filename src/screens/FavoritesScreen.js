import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import { CAMPUS_LOCATIONS } from '../constants/locations';

const FavoritesScreen = () => {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem('favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch {
      Alert.alert('Error', 'Failed to load favorites');
    }
  };

  const removeFavorite = async (locationId) => {
    try {
      const updatedFavorites = favorites.filter(id => id !== locationId);
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      setFavorites(updatedFavorites);
    } catch {
      Alert.alert('Error', 'Failed to remove favorite');
    }
  };

  const handleLocationPress = (location) => {
    navigation.navigate('Map', {
      screen: 'Map',
      params: {
        selectedLocation: location.coordinates,
      },
    });
  };

  const renderItem = ({ item }) => {
    const location = CAMPUS_LOCATIONS.find(loc => loc.id === item);
    if (!location) return null;

    return (
      <TouchableOpacity
        style={styles.locationItem}
        onPress={() => handleLocationPress(location)}
      >
        <View style={styles.locationInfo}>
          <Ionicons
            name={location.type === 'academic' ? 'school' : 'location'}
            size={24}
            color="#007AFF"
          />
          <View style={styles.textContainer}>
            <Text style={styles.locationName}>{location.name}</Text>
            <Text style={styles.locationType}>{location.type}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => removeFavorite(location.id)}
          style={styles.removeButton}
        >
          <Ionicons name="heart-dislike" size={24} color="red" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="heart" size={64} color="#ccc" />
          <Text style={styles.emptyStateText}>No favorite locations yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Add locations to your favorites to access them quickly
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    padding: 16,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
  },
  locationType: {
    fontSize: 14,
    color: 'gray',
    marginTop: 4,
  },
  removeButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default FavoritesScreen; 