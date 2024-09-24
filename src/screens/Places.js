import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView from '../components/MapView';
import ListView from '../components/ListView';
import useUserStore from '../stores/userStore';

const Tab = createBottomTabNavigator();

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
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'PlacesList') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'PlacesMap') {
            iconName = focused ? 'map' : 'map-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="PlacesList" 
        component={PlacesList} 
        options={{ title: 'List' }} 
      />
      <Tab.Screen 
        name="PlacesMap" 
        component={PlacesMap} 
        options={{ title: 'Map' }} 
      />
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