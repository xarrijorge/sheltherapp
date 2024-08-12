import * as Contacts from 'expo-contacts';
import { Alert } from 'react-native';

/**
 * Selects a contact from the user's contact list and adds it to the current contacts state.
 * If the selected contact has multiple phone numbers, a modal is displayed to choose one.
 * 
 * @param {Array} contacts - The current list of selected contacts.
 * @param {Function} setContacts - Function to update the contacts state.
 * @param {Function} setSelectedContact - Function to set the currently selected contact with multiple phone numbers.
 * @param {Function} setSelectedPhoneNumber - Function to set the selected phone number from the modal.
 * @param {Function} setModalVisible - Function to control the visibility of the modal.
 */
export const selectAndAddContact = async (contacts, setContacts, setSelectedContact, setSelectedPhoneNumber, setModalVisible) => {
    try {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission denied', 'Please enable contacts permission in settings');
            return;
        }

        const result = await Contacts.presentContactPickerAsync({
            fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
        });

        if (result && result.phoneNumbers) {
            if (result.phoneNumbers.length > 1) {
                setSelectedContact(result);
                setSelectedPhoneNumber(result.phoneNumbers[0].number); // Default selection
                setModalVisible(true); // Show modal if multiple phone numbers
            } else {
                addContactToList(result, result.phoneNumbers[0].number, contacts, setContacts);
            }
        }
    } catch (error) {
        console.error('Error selecting contact:', error);
    }
};

/**
 * Adds a contact to the contacts state.
 * 
 * @param {Object} contact - The selected contact object.
 * @param {String} phoneNumber - The selected phone number of the contact.
 * @param {Array} contacts - The current list of selected contacts.
 * @param {Function} setContacts - Function to update the contacts state.
 */
export const addContactToList = (contact, phoneNumber, contacts, setContacts) => {
    setContacts([...contacts, {
        id: contact.id,
        name: contact.name,
        phone: phoneNumber,
    }]);
};