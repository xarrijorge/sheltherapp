import React, { useState } from 'react';
import { View, StyleSheet, Modal, TextInput, Alert, TouchableWithoutFeedback } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
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
    try {
      setLoading(true);
      const { coords } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const newPlace = {
        name: `${name} | ${address}`,
        latitude: coords.latitude,
        longitude: coords.longitude,
      };
      await addPlace(newPlace);
      
      // Only clear form after successful add
      setName('');
      setAddress('');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to get location.');
      console.error('Error getting location:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleCancel}
    >
      <View style={[styles.modalContainer, loading && styles.modalContainerDarker]}>
        <TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add current location to saved places</Text>
            <TextInput
              placeholder="Enter place name"
              value={name}
              onChangeText={setName}
              style={styles.input}
              editable={!loading}
            />
            <TextInput
              placeholder="Enter address"
              value={address}
              onChangeText={setAddress}
              style={styles.input}
              editable={!loading}
            />
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0066cc" />
                <Text style={styles.loadingText}>Getting location...</Text>
              </View>
            ) : (
              <View style={styles.buttonContainer}>
                <Button
                  style={styles.cancelButton}
                  mode="outlined"
                  onPress={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  style={styles.addButton}
                  mode="contained"
                  onPress={handleAddPlace}
                >
                  Add Place
                </Button>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainerDarker: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
    marginBottom: 25,
    textTransform: 'capitalize'
  },
  input: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
    paddingVertical: 10,
  },
  loadingText: {
    marginTop: 12,
    color: '#0066cc',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  addButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default AddPlaceModal;