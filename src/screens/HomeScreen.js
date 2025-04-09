import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Switch, Image, Linking, Dimensions, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { useTheme } from '../context/ThemeContext';
import { CAMPUS_LOCATIONS } from '../constants/locations';

const { width } = Dimensions.get('window');

// Sample data for announcements with placeholder images for development
const announcementImage = { uri: '../../assets/splash-icon.png' }; // Use uri for local assets
const announcements = [
  {
    id: '1',
    title: 'Welcome to University of Ghana',
    image: announcementImage, 
    description: 'Discover the premier educational institution in Ghana',
  },
  {
    id: '2',
    title: 'New Library Hours',
    image: announcementImage,
    description: 'The Balme Library is now open 24/7 for students during exam period',
  },
  {
    id: '3',
    title: 'Campus Shuttle Service',
    image: announcementImage,
    description: 'New shuttle routes available across campus',
  },
  {
    id: '4',
    title: 'Night Market',
    image: announcementImage,
    description: 'Experience the vibrant night market where students gather for food, shopping and socializing',
  },
  {
    id: '5',
    title: 'Great Hall',
    image: announcementImage,
    description: 'The iconic Great Hall hosts major university events',
  },
];

// Mock data for events
const events = [
  {
    id: '1',
    title: 'Career Fair 2024',
    date: '2024-04-15',
    location: 'Great Hall',
    description: 'Annual career fair featuring top companies',
  },
  {
    id: '2',
    title: 'Sports Day',
    date: '2024-04-20',
    location: 'Sports Complex',
    description: 'Annual inter-faculty sports competition',
  },
  {
    id: '3',
    title: 'Technology Workshop',
    date: '2024-04-25',
    location: 'Computer Science Department',
    description: 'Learn about the latest technologies from industry experts',
  },
];

// Quick actions
const quickActions = [
  {
    id: 'emergency',
    name: 'Emergency',
    icon: 'warning',
    action: () => Linking.openURL('tel:112'),
  },
  {
    id: 'shuttle',
    name: 'Shuttle',
    icon: 'bus',
    action: () => {},
  },
  {
    id: 'library',
    name: 'Library',
    icon: 'library',
    action: () => {},
  },
  {
    id: 'cafeteria',
    name: 'Dining',
    icon: 'restaurant',
    action: () => {},
  },
  {
    id: 'timetable',
    name: 'Timetable',
    icon: 'calendar',
    action: () => {},
  },
  {
    id: 'wifi',
    name: 'WiFi',
    icon: 'wifi',
    action: () => {},
  },
  {
    id: 'news',
    name: 'News',
    icon: 'newspaper',
    action: () => {},
  },
  {
    id: 'map',
    name: 'Full Map',
    icon: 'map',
    action: (navigation) => navigation.navigate('Map'),
  },
];

// Categories
const categories = [
  { id: 'academic', name: 'Academic', icon: 'school-outline' },
  { id: 'residence', name: 'Residence', icon: 'home-outline' },
  { id: 'administrative', name: 'Admin', icon: 'business-outline' },
  { id: 'sports', name: 'Sports', icon: 'basketball-outline' },
  { id: 'dining', name: 'Dining', icon: 'restaurant-outline' },
  { id: 'health', name: 'Health', icon: 'medkit-outline' },
  { id: 'other', name: 'Other', icon: 'grid-outline' },
];

const HomeScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    // Get user location
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      const _location = await Location.getCurrentPositionAsync({});
      // No need to set location if we're not using it
    })();

    // Auto-scroll slideshow
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => 
        prevIndex === announcements.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [announcements.length]);

  // Monitor slide changes
  useEffect(() => {
    if (scrollX) {
      const listener = scrollX.addListener(({ value }) => {
        const index = Math.round(value / width);
        if (index !== currentImageIndex) {
          setCurrentImageIndex(index);
        }
      });
      
      return () => {
        scrollX.removeListener(listener);
      };
    }
  }, [scrollX, currentImageIndex, width]);

  const filteredLocations = selectedCategory
    ? CAMPUS_LOCATIONS.filter((location) => location.category === selectedCategory)
    : CAMPUS_LOCATIONS;

  const handleLocationPress = (location) => {
    navigation.navigate('Map', {
      screen: 'LocationDetails',
      params: {
        location: location,
      },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <Text style={[styles.headerTitle, { color: theme.background }]}>
          UG Campus Navigator
        </Text>
        <View style={styles.themeSwitchContainer}>
          <Ionicons name="sunny" size={20} color={theme.background} style={styles.themeIcon} />
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: '#f4f3f4', true: theme.accent + '80' }}
            thumbColor={isDarkMode ? theme.accent : '#f4f3f4'}
          />
          <Ionicons name="moon" size={20} color={theme.background} style={styles.themeIcon} />
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Slideshow Section */}
        <View style={styles.slideshowContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
          >
            {announcements.map((item) => (
              <View key={item.id} style={[styles.slide, { width }]}>
                <Image
                  source={item.image}
                  style={styles.slideImage}
                  resizeMode="cover"
                />
                <View style={[styles.slideTextContainer, { backgroundColor: theme.primary + 'D9' }]}>
                  <Text style={styles.slideTitle}>{item.title}</Text>
                  <Text style={styles.slideDescription}>{item.description}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
          
          {/* Pagination dots */}
          <View style={styles.paginationContainer}>
            {announcements.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  { backgroundColor: index === currentImageIndex ? theme.primary : theme.background + '80' }
                ]}
              />
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.quickActionButton, { backgroundColor: theme.background }]}
                onPress={() => action.action(navigation)}
              >
                <Ionicons name={action.icon} size={24} color={theme.primary} />
                <Text style={[styles.quickActionText, { color: theme.text }]}>{action.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Categories */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  {
                    backgroundColor:
                      selectedCategory === category.id
                        ? theme.primary
                        : theme.background,
                    borderColor: theme.border,
                  },
                ]}
                onPress={() =>
                  setSelectedCategory(
                    selectedCategory === category.id ? null : category.id
                  )
                }
              >
                <Ionicons
                  name={category.icon}
                  size={24}
                  color={
                    selectedCategory === category.id
                      ? theme.background
                      : theme.text
                  }
                />
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color:
                        selectedCategory === category.id
                          ? theme.background
                          : theme.text,
                    },
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Locations */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Featured Locations
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
              <Text style={{ color: theme.primary }}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filteredLocations.slice(0, 5).map((location) => (
              <TouchableOpacity
                key={location.id}
                style={[styles.locationCard, { backgroundColor: theme.background, borderColor: theme.border }]}
                onPress={() => handleLocationPress(location)}
              >
                <Ionicons name="location" size={24} color={theme.primary} />
                <Text style={[styles.locationName, { color: theme.text }]}>
                  {location.name}
                </Text>
                <Text style={[styles.locationDesc, { color: theme.text + 'CC' }]}>
                  {location.description.length > 60 
                    ? location.description.substring(0, 60) + '...'
                    : location.description}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Campus Events */}
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Upcoming Events</Text>
            <TouchableOpacity>
              <Text style={{ color: theme.primary }}>View All</Text>
            </TouchableOpacity>
          </View>
          {events.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={[styles.eventCard, { backgroundColor: theme.background, borderColor: theme.border }]}
            >
              <View style={styles.eventHeader}>
                <Ionicons name="calendar" size={20} color={theme.primary} />
                <Text style={[styles.eventDate, { color: theme.text }]}>{event.date}</Text>
              </View>
              <Text style={[styles.eventTitle, { color: theme.text }]}>{event.title}</Text>
              <Text style={[styles.eventLocation, { color: theme.text + 'CC' }]}>
                <Ionicons name="location" size={16} color={theme.text + 'CC'} /> {event.location}
              </Text>
              <Text style={[styles.eventDescription, { color: theme.text + 'CC' }]}>
                {event.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  themeSwitchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeIcon: {
    marginHorizontal: 5,
  },
  slideshowContainer: {
    height: 220,
    position: 'relative',
    width: '100%',
    marginBottom: 10,
  },
  slide: {
    height: 220,
    position: 'relative',
    overflow: 'hidden',
  },
  slideImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  slideTextContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  slideTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  slideDescription: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  section: {
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    width: '23%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  quickActionText: {
    marginTop: 4,
    fontSize: 12,
    textAlign: 'center',
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginRight: 8,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  locationCard: {
    width: 200,
    padding: 16,
    marginRight: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  locationName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  },
  locationDesc: {
    fontSize: 14,
    marginTop: 4,
  },
  eventCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventDate: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    marginBottom: 4,
  },
  eventDescription: {
    fontSize: 14,
  },
});

export default HomeScreen;