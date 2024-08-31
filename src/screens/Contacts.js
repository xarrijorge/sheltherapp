import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ContactCard from '../components/ContactCard';

const ContactsScreen = () => {
    const [contacts, setContacts] = useState([]);


   

    const getContacts = async () => {
        setIsLoading(true);
        try {
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                const parsedUserData = JSON.parse(userData);
                setContacts(parsedUserData.contacts || []);
                console.log('Contacts fetched from AsyncStorage:', parsedUserData.contacts);
                console.log('contacts', contacts);
            }
        } catch (error) {
            console.error('Failed to fetch contacts from AsyncStorage:', error);
        } finally {
            setIsLoading(false);
        }
    };

      useEffect(() => {
         getContacts();
      }, []);
    
      useEffect(() => {
        console.log('Contacts state updated:', contacts);
      }, [contacts]);

    useEffect(() => {
        console.log('contacts', contacts);
    }, [contacts]);

    const handleRemoveContact = (id) => {
        Alert.alert(
            'Remove Contact',
            'Are you sure you want to remove this contact?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'OK', onPress: async () => {
                    const updatedContacts = contacts.filter(contact => contact.id !== id);
                    setContacts(updatedContacts);
                    try {
                        const userData = await AsyncStorage.getItem('userData');
                        if (userData) {
                            const parsedUserData = JSON.parse(userData);
                            parsedUserData.contacts = updatedContacts;
                            await AsyncStorage.setItem('userData', JSON.stringify(parsedUserData));
                        }
                    } catch (error) {
                        console.error('Failed to update contacts in AsyncStorage:', error);
                    }
                }},
            ]
        );
    };

    const renderContactCard = ({ item }) => (
        <ContactCard contact={item} onRemove={() => handleRemoveContact(item.id)} />
    );

    const addContact = () => {
        // Placeholder for add contact functionality
        console.log('Add Contact button pressed');
        // Implement navigation or modal to add new contact
    };

    return (
        <View style={styles.screen}>
            <FlatList
                data={contacts}
                renderItem={renderContactCard}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
            />
            <TouchableOpacity style={styles.addButton} onPress={addContact}>
                <Text style={styles.addButtonText}>Add Contact</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 16,
    },
    listContainer: {
        flexGrow: 1,
    },
    addButton: {
        marginTop: 16,
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#007BFF',
        alignItems: 'center',
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ContactsScreen;