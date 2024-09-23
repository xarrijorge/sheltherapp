// src/components/AddPlaceModal.js
import React, { useState } from 'react';
import { View, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import { Text, Button } from 'react-native-paper';
import * as Location from 'expo-location';
import useUserStore from '../stores/userStore';

const AddPlaceModal = ({ visible, onClose }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const { addPlace } = useUserStore(state => state);

  const handleAddPlace = async () => {
    if (!name) {
      Alert.alert('Error', 'Please enter a name for the place.');
      return;
    }

    setLoading(true);

    try {
      const { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const newPlace = {
        name: `${name} | ${address}`,
        latitude: coords.latitude,
        longitude: coords.longitude,
      };
      await addPlace(newPlace);
      onClose(); // Close the modal after successful addition
    } catch (error) {
      Alert.alert('Error', 'Failed to get location.');
      console.error('Error getting location:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Add current location your saved places</Text>
          <TextInput
            placeholder="Enter place name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="Enter address"
            value={address}
            onChangeText={setAddress}
            style={styles.input}
            />
          <Button style={styles.button} mode="contained"  onPress={handleAddPlace} disabled={loading}>
            Add Place
            </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
    button: {
        marginTop: 10,
    },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default AddPlaceModal;