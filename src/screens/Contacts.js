import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import ContactCard from '../components/ContactCard';
import useUserStore from '../stores/userStore';
import ContactSelector from '../components/ContactSelector';

const ContactsScreen = () => {
  const contacts = useUserStore(state => state.contacts)
  const removeContact = useUserStore(state => state.removeContact)
    
    useEffect(() => {
        useUserStore.getState().loadUserData()
      }, []) 

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

    return (
        <View style={styles.screen}>
            <FlatList
                data={contacts}
                renderItem={renderContactCard}
                keyExtractor={(item, index) => index}
                contentContainerStyle={styles.listContainer}
            />
            <ContactSelector />
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