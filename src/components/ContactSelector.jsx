import React, { useState } from 'react';
import { View, StyleSheet, Modal, Alert } from 'react-native';
import { Text, Button, RadioButton } from 'react-native-paper';
import useUserStore from '../stores/userStore';
import { selectAndAddContact } from '../utils/contactUtils';

const ContactSelector = () => {
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState('');
  const addContact = useUserStore(state => state.addContact);
  const [contacts, setContacts] = useState([]);

  const handlePhoneNumberSelection = () => {
    if (selectedContact && selectedPhoneNumber) {
      addContact({
        id: selectedContact.id,
        name: selectedContact.name,
        phone: selectedPhoneNumber,
      });
      setContacts([...contacts, {
        id: selectedContact.id,
        name: selectedContact.name,
        phone: selectedPhoneNumber,
      }]);
      setContactModalVisible(false); // Close the contacts modal
      console.log('Selected contact:', selectedContact);
    } else {
      Alert.alert('Error', 'No phone number selected.');
    }
  };

  return (
    <View>
      <Button
        mode="contained"
        onPress={() => selectAndAddContact(
          contacts,
          setContacts,
          setSelectedContact,
          setSelectedPhoneNumber,
          setContactModalVisible
        )}
        style={styles.button}
      >
        Add Contacts
      </Button>

      <Modal
        visible={contactModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setContactModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Phone Number</Text>
            <RadioButton.Group
              onValueChange={newValue => setSelectedPhoneNumber(newValue)}
              value={selectedPhoneNumber}
            >
              {selectedContact?.phoneNumbers?.length > 0 ? (
                selectedContact.phoneNumbers.map((phone, index) => (
                  <View key={index} style={styles.radioItem}>
                    <RadioButton value={phone.number} />
                    <Text>{phone.number}</Text>
                  </View>
                ))
              ) : (
                <Text>No phone numbers available</Text>
              )}
            </RadioButton.Group>
            <Button mode="contained" onPress={handlePhoneNumberSelection} style={styles.button}>
              Select
            </Button>
          </View>
        </View>
      </Modal>
    </View>
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
    width: '90%',
    minHeight: 100,
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
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
});

export default ContactSelector;
