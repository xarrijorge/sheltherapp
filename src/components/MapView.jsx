// src/components/MapView.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const MapComponent = () => {
  const [region, setRegion] = useState(null); // State to hold the map's region
  const [userLocation, setUserLocation] = useState(null); // State to hold the user's location

  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        // Request location permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Location permission is required to use this feature.');
          return;
        }

        // Get the current location
        const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        const { latitude, longitude } = location.coords;

        // Update state with the user's location and map region
        setUserLocation({ latitude, longitude });
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to get user location.');
        console.error('Error getting location:', error);
      }
    };

    fetchUserLocation();
  }, []);

  if (!region) {
    // Render a loading view while the region is being set
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region} // Set the map's center and zoom level
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {userLocation && (
          <Marker
            coordinate={userLocation} // Place a marker at the user's location
            title="You are here"
            description="This is your current location"
          />
        )}
      </MapView>
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
});

export default MapComponent;