import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  Modal,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { CAMPUS_LOCATIONS } from '../constants/locations';

// Simple mock services for demonstration
const LocationService = {
  searchLocations: (query) => {
    const lowerQuery = query.toLowerCase();
    return CAMPUS_LOCATIONS.filter(
      location => 
        location.name.toLowerCase().includes(lowerQuery) || 
        location.description.toLowerCase().includes(lowerQuery) ||
        location.type.toLowerCase().includes(lowerQuery)
    );
  },
  
  getFavoriteLocations: async () => {
    // In a real app, this would retrieve from AsyncStorage
    return ['1', '3', '9']; // Mock favorite location IDs
  },
  
  isFavorite: async (id) => {
    // Mock implementation
    const favorites = await LocationService.getFavoriteLocations();
    return favorites.includes(id);
  },
  
  addToFavorites: async (id) => {
    // Mock implementation
    console.log(`Adding location ${id} to favorites`);
    return true;
  },
  
  removeFromFavorites: async (id) => {
    // Mock implementation
    console.log(`Removing location ${id} from favorites`);
    return true;
  }
};

const SearchHistoryService = {
  getSearchHistory: async () => {
    // In a real app, this would retrieve from AsyncStorage
    return [
      { query: 'library', timestamp: Date.now() - 100000 },
      { query: 'hall', timestamp: Date.now() - 200000 },
      { query: 'sports', timestamp: Date.now() - 300000 },
    ];
  },
  
  addSearchToHistory: async (query) => {
    // Mock implementation
    console.log(`Adding "${query}" to search history`);
    return true;
  }
};

// Basic MapNavigation component
const MapNavigation = ({ destination, onClose }) => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.mapNavigationContainer, { backgroundColor: theme.background }]}>
      <View style={styles.mapNavHeader}>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={28} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.mapNavTitle, { color: theme.text }]}>Navigate to {destination.name}</Text>
      </View>
      
      <View style={styles.mapPlaceholder}>
        <Ionicons name="map-outline" size={100} color={theme.text + '40'} />
        <Text style={[styles.mapPlaceholderText, { color: theme.text }]}>Map navigation would display here</Text>
      </View>
      
      <TouchableOpacity 
        style={[styles.startNavigationButton, { backgroundColor: theme.primary }]}
        onPress={onClose}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Start Navigation</Text>
      </TouchableOpacity>
    </View>
  );
};

const SearchScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const { theme } = useTheme();

  // Load recent searches and favorites on mount
  useEffect(() => {
    loadRecentSearches();
    loadFavorites();
  }, []);

  // Update search results when searchText changes
  useEffect(() => {
    if (searchText.trim()) {
      searchLocations(searchText);
    } else {
      setFilteredLocations([]);
    }
  }, [searchText]);

  const loadRecentSearches = async () => {
    try {
      const history = await SearchHistoryService.getSearchHistory();
      // Extract just the search queries
      const searches = history.map(item => item.query).slice(0, 5);
      setRecentSearches(searches);
    } catch (error) {
      console.error('Error loading recent searches:', error);
    }
  };

  const loadFavorites = async () => {
    try {
      const favs = await LocationService.getFavoriteLocations();
      setFavorites(favs);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const searchLocations = async (query) => {
    setLoading(true);
    try {
      // Search locations
      const results = LocationService.searchLocations(query);
      setFilteredLocations(results);
      
      // Add to search history if not empty query
      if (query.trim()) {
        await SearchHistoryService.addSearchToHistory(query);
        loadRecentSearches();
      }
    } catch (error) {
      console.error('Error searching locations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = () => {
    if (searchText.trim()) {
      searchLocations(searchText);
    }
  };

  const handleRecentSearchPress = (query) => {
    setSearchText(query);
    searchLocations(query);
  };

  const toggleFavorite = async (location) => {
    try {
      const isFav = await LocationService.isFavorite(location.id);
      
      if (isFav) {
        // Remove from favorites
        const success = await LocationService.removeFromFavorites(location.id);
        if (success) {
          setFavorites(favorites.filter(id => id !== location.id));
        }
      } else {
        // Add to favorites
        const success = await LocationService.addToFavorites(location.id);
        if (success) {
          setFavorites([...favorites, location.id]);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Could not update favorites');
    }
  };

  const isLocationFavorite = (locationId) => {
    return favorites.includes(locationId);
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleCloseMap = () => {
    setSelectedLocation(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Search</Text>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: theme.card }]}>
        <Ionicons name="search" size={24} color={theme.text} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search for locations..."
          placeholderTextColor={theme.text + '80'}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
          autoCorrect={false}
        />
        {searchText ? (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Ionicons name="close-circle" size={24} color={theme.text} />
          </TouchableOpacity>
        ) : null}
      </View>

      {!searchText && recentSearches.length > 0 && (
        <View style={styles.recentSearchesContainer}>
          <Text style={[styles.recentSearchesTitle, { color: theme.text }]}>
            Recent Searches
          </Text>
          <View style={styles.recentSearchItems}>
            {recentSearches.map((search, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.recentSearchItem, { backgroundColor: theme.card }]}
                onPress={() => handleRecentSearchPress(search)}
              >
                <Ionicons name="time-outline" size={16} color={theme.text} style={styles.recentSearchIcon} />
                <Text style={[styles.recentSearchText, { color: theme.text }]} numberOfLines={1}>
                  {search}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredLocations}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.resultItem, { backgroundColor: theme.card }]}
              onPress={() => handleLocationSelect(item)}
            >
              <View style={styles.resultContent}>
                <Text style={[styles.resultName, { color: theme.text }]}>
                  {item.name}
                </Text>
                <Text style={[styles.resultCategory, { color: theme.primary }]}>
                  {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                </Text>
                <Text
                  style={[styles.resultDescription, { color: theme.text + 'CC' }]}
                  numberOfLines={2}
                >
                  {item.description}
                </Text>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.favoriteButton}
                  onPress={() => toggleFavorite(item)}
                >
                  <Ionicons 
                    name={isLocationFavorite(item.id) ? "heart" : "heart-outline"} 
                    size={24} 
                    color={isLocationFavorite(item.id) ? "#FF3B30" : theme.text + '80'} 
                  />
                </TouchableOpacity>
                <Ionicons name="chevron-forward" size={24} color={theme.primary} />
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              {searchText ? (
                <>
                  <Ionicons
                    name="search-outline"
                    size={64}
                    color={theme.text + '40'}
                  />
                  <Text style={[styles.emptyText, { color: theme.text + '80' }]}>
                    No locations found
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons
                    name="search-outline"
                    size={64}
                    color={theme.text + '40'}
                  />
                  <Text style={[styles.emptyText, { color: theme.text + '80' }]}>
                    Start typing to search
                  </Text>
                </>
              )}
            </View>
          )}
        />
      )}
      
      <Modal
        visible={!!selectedLocation}
        animationType="slide"
        onRequestClose={handleCloseMap}
      >
        {selectedLocation && (
          <MapNavigation
            destination={selectedLocation}
            onClose={handleCloseMap}
          />
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    padding: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  recentSearchesContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  recentSearchesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  recentSearchItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  recentSearchIcon: {
    marginRight: 4,
  },
  recentSearchText: {
    fontSize: 14,
    maxWidth: 120,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80, // Extra padding for TabBar
  },
  resultItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  resultContent: {
    flex: 1,
  },
  resultName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultCategory: {
    fontSize: 14,
    marginVertical: 4,
  },
  resultDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  operatingHours: {
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteButton: {
    marginRight: 16,
    padding: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
  mapNavigationContainer: {
    flex: 1,
    padding: 16,
  },
  mapNavHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  mapNavTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    marginTop: 16,
    fontSize: 16,
  },
  startNavigationButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
  }
});

export default SearchScreen; 