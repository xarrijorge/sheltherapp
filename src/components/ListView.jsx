import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import { FAB } from 'react-native-paper'; // Import the FAB component from react-native-paper
import PlaceCard from './PlaceCard'; // Ensure PlaceCard component exists
import AddPlaceModal from '../components/AddPlaceModal'; // Ensure AddPlaceModal component exists
import useUserStore from '../stores/userStore';

const ListView = ({ places }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const removePlace = useUserStore(state => state.removePlace);

  const renderPlaceCard = ({ item }) => (
    <PlaceCard place={item} onRemove={() => removePlace(item._id)} />
  );

  useEffect(() => {
    useUserStore.getState().loadUserData();
  }, []);

  return (
    <View style={styles.container}>
      {places.length > 0 ? (
        <FlatList
          data={places}
          renderItem={renderPlaceCard}
          keyExtractor={item => item._id} // Use _id if it's unique
          key={item => item._id}
          contentContainerStyle={styles.listContainer}
          extraData={places}
        />
      ) : (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>Add places you visit often</Text>
        </View>
      )}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setModalVisible(true)}
      />
      <AddPlaceModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    // backgroundColor: '#007BFF',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center', // Centers vertically
    alignItems: 'center',     // Centers horizontally
  },
  placeholderText: {
    fontSize: 16,
    color: '#999', // Optional: You can style the color as desired
  },
});

export default ListView;
