import * as Contacts from 'expo-contacts';
import { Alert } from 'react-native';

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

export const addContactToList = (contact, phoneNumber, contacts, setContacts) => {
    setContacts([...contacts, {
        id: contact.id,
        name: contact.name,
        phone: phoneNumber,
    }]);
};