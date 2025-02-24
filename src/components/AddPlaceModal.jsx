import React, { useState } from 'react';
import { View, StyleSheet, Modal, TextInput, Alert, TouchableWithoutFeedback } from 'react-native';
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
      onClose(); // ✅ Ensure modal closes after adding a place
    } catch (error) {
      Alert.alert('Error', 'Failed to get location.');
      console.error('Error getting location:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible} // ✅ Ensure modal listens to the visible prop
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add current location to saved places</Text>
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
              <Button
                style={styles.button}
                mode="contained"
                onPress={handleAddPlace}
                disabled={loading}
              >
                Add Place
              </Button>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
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
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 35,
    textTransform: 'capitalize'
  },
  input: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default AddPlaceModal;