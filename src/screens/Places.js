import React, { useState, useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, StyleSheet, Alert } from 'react-native';
import MapView from '../components/MapView'; // Ensure this is the correct import
import ListView from '../components/ListView';
import useUserStore from '../stores/userStore';

const Tab = createMaterialTopTabNavigator();

 const handleRemovePlace = (id) => {
    Alert.alert(
      'Remove Place',
      'Are you sure you want to remove this place?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: async () => { removePlace(id); } },
      ]
    );
  };

const PlacesList = ({ navigation }) => {
  const places = useUserStore(state => state.places);
  const removePlace = useUserStore(state => state.removePlace);
  
  return (
    <View style={styles.container}>
      <ListView
        places={places}
        removePlace={handleRemovePlace}
        setModalVisible={(visible) => navigation.navigate('AddPlace', { modalVisible: visible })}
      />
    </View>
  );
};

const PlacesMap = () => {
  return (
      <MapView style={styles.map} />
  );
};

const PlacesScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const places = useUserStore(state => state.places);
  const removePlace = useUserStore(state => state.removePlace);

  useEffect(() => {
    useUserStore.getState().loadUserData();
  }, []);
  
 

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
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default PlacesScreen;
