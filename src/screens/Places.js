import React, { useState, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, StyleSheet } from 'react-native';
import MapView from '../components/MapView'; // Ensure this is the correct import
import ListView from '../components/ListView';
import useUserStore from '../stores/userStore';

const Tab = createMaterialTopTabNavigator();

const PlacesScreen = () => {
  const places = useUserStore(state => state.places);
  const removePlace = useUserStore(state => state.removePlace);

  useEffect(() => {
    useUserStore.getState().loadUserData();
  }, []);
  
  const PlacesList = () => {
    return (
      <View style={styles.container}>
        <ListView
          places={places}
          removePlace={removePlace}
        />
      </View>
    );
  };

  const PlacesMap = () => {
    return (
      <View style={styles.container}>
        <MapView style={styles.map} />
      </View>
    );
  };

  return (
    <Tab.Navigator>
      <Tab.Screen name="PlacesList" component={PlacesList} options={{ title: 'List' }} />
      <Tab.Screen name="PlacesMap" component={PlacesMap} options={{ title: 'Map' }} />
    </Tab.Navigator>
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

export default PlacesScreen;