// src/components/ListView.js
import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { FAB } from 'react-native-paper'; // Import the FAB component from react-native-paper
import PlaceCard from './PlaceCard'; // Make sure PlaceCard component exists or adjust accordingly

const ListView = ({ places, removePlace, setModalVisible }) => {

  const renderPlaceCard = ({ item }) => (
    <PlaceCard place={item} onRemove={() => removePlace(item.id)} />
  );
  
  return (
    <View style={styles.container}>
      <FlatList
        data={places}
        renderItem={renderPlaceCard}
        keyExtractor={item => item.id.toString()} // Ensure the key is a string
        contentContainerStyle={styles.listContainer}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setModalVisible(true)}
      />
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
    right: 0,
    bottom: 16,
    backgroundColor: '#007BFF',
  },
});

export default ListView;
