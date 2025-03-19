import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, FAB } from 'react-native-paper';
import PlaceCard from './PlaceCard';
import AddPlaceModal from '../components/AddPlaceModal';
import useUserStore from '../stores/userStore';

const ListView = ({ places }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const removePlace = useUserStore(state => state.removePlace);

  const renderPlaceCard = ({ item }) => (
    <PlaceCard place={item} onRemove={() => removePlace(item._id)} />
  );

  // Safe key extractor that handles undefined/null IDs
  const keyExtractor = (item) => {
    // First try to use _id
    if (item._id) return item._id.toString();
    // Fall back to id if _id is not available
    if (item.id) return item.id.toString();
    // Last resort, use some combination of properties or just index
    return `place-${item.name}-${item.latitude}-${item.longitude}`;
  };

  return (
    <View style={styles.container}>
      {places && places.length > 0 ? (
        <FlatList
          data={places}
          renderItem={renderPlaceCard}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContainer}
          extraData={places}
        />
      ) : (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>Add places you visit often</Text>
        </View>
      )}
      {/* FAB Button for Add Place */}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => {
          setModalVisible(true);
        }}
      />
      {/* Ensure modal state updates */}
      <AddPlaceModal visible={modalVisible} onClose={() => {
        setModalVisible(false);
      }} />
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
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
});

export default ListView;