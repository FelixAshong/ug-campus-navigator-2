import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';

const LocationDetailsScreen = () => {
  const route = useRoute();
  const { location } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);

  const checkIfFavorite = useCallback(async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      if (favorites) {
        const favoritesList = JSON.parse(favorites);
        setIsFavorite(favoritesList.includes(location.id));
      }
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  }, [location.id]);

  useEffect(() => {
    checkIfFavorite();
  }, [checkIfFavorite]);

  const toggleFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem('favorites');
      let favoritesList = favorites ? JSON.parse(favorites) : [];

      if (isFavorite) {
        favoritesList = favoritesList.filter(id => id !== location.id);
      } else {
        favoritesList.push(location.id);
      }

      await AsyncStorage.setItem('favorites', JSON.stringify(favoritesList));
      setIsFavorite(!isFavorite);

      Alert.alert(
        isFavorite ? 'Removed from Favorites' : 'Added to Favorites',
        isFavorite
          ? 'Location removed from your favorites'
          : 'Location added to your favorites'
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{location.name}</Text>
          <Text style={styles.type}>{location.type}</Text>
        </View>
        <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={28}
            color={isFavorite ? '#FF3B30' : '#007AFF'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{location.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <Text style={styles.coordinates}>
          Latitude: {location.coordinates[1]}
          {'\n'}
          Longitude: {location.coordinates[0]}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="navigate" size={24} color="#007AFF" />
            <Text style={styles.actionText}>Navigate</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share" size={24} color="#007AFF" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="information-circle" size={24} color="#007AFF" />
            <Text style={styles.actionText}>More Info</Text>
          </TouchableOpacity>
        </View>
      </View>

      {location.type === 'academic' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Academic Information</Text>
          <Text style={styles.academicInfo}>
            • Faculty/Department information{'\n'}
            • Available facilities{'\n'}
            • Contact information{'\n'}
            • Opening hours
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  type: {
    fontSize: 16,
    color: 'gray',
    marginTop: 4,
  },
  favoriteButton: {
    padding: 8,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  coordinates: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  actionButton: {
    alignItems: 'center',
    padding: 12,
  },
  actionText: {
    marginTop: 4,
    fontSize: 14,
    color: '#007AFF',
  },
  academicInfo: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});

export default LocationDetailsScreen; 