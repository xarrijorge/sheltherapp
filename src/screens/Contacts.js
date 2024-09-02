import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import ContactCard from '../components/ContactCard';
import useUserStore from '../stores/userStore';
import ContactSelector from '../components/ContactSelector';

const ContactsScreen = () => {
  const { contacts, removeContact, loadUserData } = useUserStore(state => ({
    contacts: state.contacts,
    removeContact: state.removeContact,
    loadUserData: state.loadUserData
  }));

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleRemoveContact = useCallback((id) => {
    Alert.alert(
      'Remove Contact',
      'Are you sure you want to remove this contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'OK', 
          onPress: async () => {
            try {
              await removeContact(id);
            } catch (error) {
              console.error('Error removing contact:', error);
              Alert.alert('Error', 'Failed to remove contact. Please try again.');
            }
          }
        },
      ]
    );
  }, [removeContact]);

  const renderContactCard = useCallback(({ item }) => (
    <ContactCard contact={item} onRemove={() => handleRemoveContact(item._id)} />
  ), [handleRemoveContact]);


  return (
    <View style={styles.screen}>
      <FlatList
        data={contacts}
        renderItem={renderContactCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        extraData={contacts}
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
});

export default ContactsScreen;