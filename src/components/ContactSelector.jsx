import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Modal, Alert } from 'react-native';
import { Text, Button, RadioButton } from 'react-native-paper';
import useUserStore from '../stores/userStore';
import { selectAndAddContact } from '../utils/contactUtils';

const ContactSelector = () => {
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState('');
  
  // Use Zustand store
  const { contacts, addContact, setContacts } = useUserStore();

  const handlePhoneNumberSelection = useCallback(() => {
    if (selectedContact && selectedPhoneNumber) {
      const newContact = {
        id: selectedContact.id,
        name: selectedContact.name,
        phone: selectedPhoneNumber,
      };
      addContact(newContact);
      setContactModalVisible(false);
    } else {
      Alert.alert('Error', 'No phone number selected.');
    }
  }, [selectedContact, selectedPhoneNumber, addContact]);

  const handleAddContact = useCallback(async () => {
    try {
      await selectAndAddContact(
        contacts,
        (newContacts) => {
          setContacts(newContacts);
        },
        (contact) => {
          console.log('Selected contact:', contact);
          if (contact?.phoneNumbers?.length === 1) {
            const newContact = {
              id: contact.id,
              name: contact.name,
              phone: contact.phoneNumbers[0].number,
            };
            addContact(newContact);
          } else if (contact?.phoneNumbers?.length > 1) {
            setSelectedContact(contact);
            setSelectedPhoneNumber(contact.phoneNumbers[0]?.number || '');
            setContactModalVisible(true);
          } else {
            Alert.alert('Error', 'No phone numbers available for this contact.');
          }
        },
        setSelectedPhoneNumber,
        setContactModalVisible
      );
    } catch (error) {
      console.error('Error handling contact addition:', error);
    }
  }, [contacts, addContact, setContacts]);

  console.log('Current contacts:', contacts);

  return (
    <View>
      <Button
        mode="contained"
        onPress={handleAddContact}
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
              {selectedContact?.phoneNumbers?.map((phone, index) => (
                <View key={index} style={styles.radioItem}>
                  <RadioButton value={phone.number} />
                  <Text>{phone.number}</Text>
                </View>
              ))}
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