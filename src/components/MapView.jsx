import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

const INITIAL_REGION = {
  latitude: 0,
  longitude: 0,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

const MapComponent = React.memo(() => {
  const [region, setRegion] = useState(INITIAL_REGION);
  const [userLocation, setUserLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to use this feature.');
        setIsLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = location.coords;

      setUserLocation({ latitude, longitude });
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get user location. Using default location.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserLocation();
  }, [fetchUserLocation]);

  const mapView = useMemo(() => (
    <MapView
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      initialRegion={INITIAL_REGION}
      region={region}
      showsUserLocation={true}
      showsMyLocationButton={true}
      onMapReady={() => setIsLoading(false)}
    >
      {userLocation && (
        <Marker
          coordinate={userLocation}
          title="You are here"
          description="This is your current location"
        />
      )}
    </MapView>
  ), [region, userLocation]);

  return (
    <View style={styles.container}>
      {mapView}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MapComponent;