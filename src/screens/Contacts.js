import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ContactCard from '../components/ContactCard';
import useUserStore from '../stores/userStore';

const ContactsScreen = () => {
    const contacts = useUserStore(state => state.contacts)
    const removeContact = useUserStore(state => state.removeContact)
    const saveUserData = useUserStore(state => state.saveUserData)

    useEffect(() => {
        useUserStore.getState().loadUserData()
      }, []) 

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
                   removeContact(id) 
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
                keyExtractor={(item, index) => index}
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