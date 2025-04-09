import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

const MapScreen = () => {
  const navigation = useNavigation();
  const [userLocation, setUserLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 5.6502,
    longitude: -0.1962, // UG coordinates
    latitudeDelta: 0.01,
    longitudeDelta: 0.01
  });

  useEffect(() => {
    // Request location permission and get user's location
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Location permission is required to show your position on the map.');
          return;
        }
        
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        
        setUserLocation({ latitude, longitude });
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        });
      } catch (error) {
        console.log('Error getting location:', error);
        Alert.alert('Error', 'Failed to get your current location.');
      }
    })();
  }, []);

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    console.log('Map pressed at:', coordinate);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        onPress={handleMapPress}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={true}
        showsScale={true}
      >
        {/* Campus locations */}
        <Marker
          coordinate={{
            latitude: 5.6502,
            longitude: -0.1962
          }}
          title="Balme Library"
          description="University of Ghana's main library"
        />
      </MapView>

      <TouchableOpacity
        style={styles.searchButton}
        onPress={() => navigation.navigate('Search')}
      >
        <Ionicons name="search" size={24} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.locationButton}
        onPress={() => {
          if (userLocation) {
            setRegion({
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01
            });
          }
        }}
      >
        <Ionicons name="locate" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  searchButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 30,
    elevation: 5,
  },
  locationButton: {
    position: 'absolute',
    top: 120,
    left: 20,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 30,
    elevation: 5,
  },
});

export default MapScreen; 