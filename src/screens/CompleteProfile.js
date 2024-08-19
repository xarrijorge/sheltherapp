import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, Modal } from 'react-native';
import { Text, TextInput, Button, IconButton, Avatar, RadioButton, HelperText } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import axios from '../utils/axiosConfig';
import ContactCard from '../components/ContactCard';
import { selectAndAddContact, addContactToList } from '../utils/contactUtils';
import PlaceCard from '../components/PlaceCard';
import { SelectPlace } from '../utils/placesUtils';

const CompleteProfileScreen = ({ route, navigation }) => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [photo, setPhoto] = useState(null);
    const [address, setAddress] = useState('');
    const [contacts, setContacts] = useState([]);
    const [places, setPlaces] = useState([]);
    const [contactModalVisible, setContactModalVisible] = useState(false); // Separate modal state for contacts
    const [placeModalVisible, setPlaceModalVisible] = useState(false); // Separate modal state for places
    const [selectedContact, setSelectedContact] = useState(null);
    const [selectedPhoneNumber, setSelectedPhoneNumber] = useState('');

    const email = route.params.email;

    const completion = name && password && confirmPassword && photo && address && contacts.length > 0;

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setPhoto(result.assets[0].uri);
        }
    };

    const checkPassword = () => {
        let pass = password.trim();
        let confirm = confirmPassword.trim();

        if (pass !== confirm) {
            Alert.alert('Error', 'Passwords do not match');
            throw new Error('Passwords do not match');
        }

        pass = pass.replace(/\s+/g, '');
        if (pass.length < 8) {
            Alert.alert('Error', 'Password must be at least 8 characters long');
            throw new Error('Password must be at least 8 characters long');
        }
        if (!pass.match(/[a-z]/i)) {
            Alert.alert('Error', 'Password must contain at least one letter');
            throw new Error('Password must contain at least one letter');
        }
        if (!pass.match(/\d/)) {
            Alert.alert('Error', 'Password must contain at least one number');
            throw new Error('Password must contain at least one number');
        }
        if (!pass.match(/[^a-z\d]/i)) {
            Alert.alert('Error', 'Password must contain at least one special character');
            throw new Error('Password must contain at least one special character');
        }
        if (pass === email) {
            Alert.alert('Error', 'Password cannot be the same as the email');
            throw new Error('Password cannot be the same as the email');
        }
    };

    const handleCompleteProfile = async () => {
        if (!name || !password || !photo || !address || contacts.length < 1) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        checkPassword();
        try {
            const response = await axios.post('/auth/complete', {
                email,
                password,
                name,
                photo,
                address,
                contacts,
                places
            });

            Alert.alert('Success', 'Profile completed successfully', response);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
        } catch (error) {
            console.log(error);
            Alert.alert('Error', error.response?.data?.error || 'Failed to complete profile');
        }
    };

    const removeContact = (id) => {
        setContacts(contacts.filter(contact => contact.id !== id));
    };

    const removePhoto = () => {
        setPhoto(null);
    };

    const handlePhoneNumberSelection = () => {
        if (selectedPhoneNumber) {
            addContactToList(selectedContact, selectedPhoneNumber, contacts, setContacts);
            setContactModalVisible(false); // Close the contacts modal
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={{ marginBottom: 20 }}>
                {!photo && (
                    <Button mode="contained" onPress={pickImage} style={styles.button}>
                        {photo ? 'Change Image' : 'Pick an Image'}
                    </Button>
                )}
                {photo && (
                    <View style={styles.selectedItem}>
                        <Avatar.Image source={{ uri: photo }} />
                        <IconButton icon="delete" size={20} onPress={removePhoto} />
                    </View>
                )}
            </View>
            <TextInput
                label="Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />
            <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            <TextInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                style={styles.input}
            />
            {(confirmPassword !== "" && password !== confirmPassword) && <HelperText type='error'>Password does not match.</HelperText>}
            <TextInput
                label="Address"
                value={address}
                onChangeText={setAddress}
                style={styles.input}
            />
            
            {contacts.length < 5 && (
                <Button
                    mode="contained"
                    onPress={() => selectAndAddContact(contacts, setContacts, setSelectedContact, setSelectedPhoneNumber, setContactModalVisible)}
                    style={styles.button}
                >
                    Add Contacts
                </Button>
            )}

            {contacts.length > 0 && (
                <View style={styles.contactsContainer}>
                    <Text style={styles.contactsTitle}>Selected Contacts:</Text>
                    {contacts.map((contact, index) => (
                        <ContactCard key={index} contact={contact} onRemove={() => removeContact(contact.id)} />
                    ))}
                </View>
            )}

            {places.length < 5 && (
                <Button mode="contained" onPress={() => setPlaceModalVisible(true)} style={styles.button}>
                    Add Places
                </Button>
            )}

            {places.length > 0 && (
                <View style={styles.placesContainer}>
                    <Text style={styles.placesTitle}>Selected Places:</Text>
                    {places.map((place, index) => (
                        <PlaceCard key={index} place={place} onRemove={() => setPlaces(places.filter(p => p.id !== place.id))} />
                    ))}
                </View>
            )}

            <Button disabled={!completion} mode="contained" onPress={handleCompleteProfile} style={styles.button}>
                Complete Profile
            </Button>
          {/* Modal for selecting places */}
           
          <Modal
            visible={placeModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setPlaceModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
                        <SelectPlace />
                    </ScrollView>
                </View>
            </View>
        </Modal>

            {/* Modal for selecting phone number */}
            <Modal
                visible={contactModalVisible} // Use the contact modal state
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
                            {selectedContact?.phoneNumbers.map((phone, index) => (
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
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        justifyContent: "center",
    },
    input: {
        marginBottom: 10,
    },
    button: {
        marginTop: 10,
    },
    selectedItem: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
        justifyContent: "space-between",
    },
    contactsContainer: {
        marginTop: 20,
    },
    contactsTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
    },
    placesContainer: {
        marginTop: 20,
    },
    placesTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(10, 10, 10, 0.5)',
    },
    modalContent: {
        width: '90%',
        height: 'auto',
        backgroundColor: 'white',
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

export default CompleteProfileScreen;