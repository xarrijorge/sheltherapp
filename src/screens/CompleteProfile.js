import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, Modal } from 'react-native';
import { Text, TextInput, Button, IconButton, Avatar, RadioButton, HelperText } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';
import * as ImagePicker from 'expo-image-picker';
import axios from '../utils/axiosConfig';
import ContactCard from '../components/ContactCard';
import { selectAndAddContact, addContactToList } from '../utils/contactUtils';

/**
 * The CompleteProfileScreen component allows users to complete their profile by
 * providing personal information, selecting contacts, and choosing places.
 * 
 * @param {Object} route - The navigation route object, contains parameters passed to this screen.
 * @param {Object} navigation - The navigation object used for navigating between screens.
 * @returns {JSX.Element} The rendered component.
 */
const CompleteProfileScreen = ({ route, navigation }) => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [photo, setPhoto] = useState(null);
    const [address, setAddress] = useState('');
    const [contacts, setContacts] = useState([]);
    const [places, setPlaces] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [selectedPhoneNumber, setSelectedPhoneNumber] = useState('');

    const email = route.params.email;

    const completion = name && password && confirmPassword && photo && address && contacts.length > 0 

    /**
     * Opens the image picker for the user to select a profile photo.
     * Sets the selected photo to the state.
     */
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

    /**
     * Submits the completed profile to the backend server.
     * Validates the inputs and alerts the user if any required fields are missing.
     */
    // function to check that passwords match and that they meet a minimum requirement
    /**
     * Validates the password and confirms that it meets the required criteria.
     * 
     * @returns {boolean} Returns true if the password is valid, otherwise false.
     */
    function checkPassword() {
        let pass = password.trim();
        let confirm = confirmPassword.trim();

        // check that password is at least 8 characters long and that it contains at least one number and one letter and one special character and that it is not the same as the email and that it is not the same as the name and that it is not the same as the address and that it is not the same as the phone number
        // check against a RegExp

        // check that password and confirm password match
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
        if (pass=== email) {
            Alert.alert('Error', 'Password cannot be the same as the email');
            throw new Error('Password cannot be the same as the email');
        }
    }

    /**
     * Handles the completion of user profile.
     * 
     * @async
     * @function handleCompleteProfile
     * @returns {Promise<void>}
     */
    const handleCompleteProfile = async () => {
        if (!name || !password || !photo || !address || contacts.length < 1) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        checkPassword()
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
            console.log(error)
            Alert.alert('Error', error.response?.data?.error || 'Failed to complete profile');
        }
        // const data = {
        //     contacts,
        //     name,
        //     password,
        //     address,
        //     photo,
        //     places: [...places],
        //     email
        // }
        // Alert.alert('Success', JSON.stringify(data));

    };

    /**
     * Removes a contact from the contacts state.
     * 
     * @param {String} id - The ID of the contact to be removed.
     */
    const removeContact = (id) => {
        setContacts(contacts.filter(contact => contact.id !== id));
    };

    /**
     * Clears the selected profile photo from the state.
     */
    const removePhoto = () => {
        setPhoto(null);
    };

    /**
     * Handles the selection of a phone number from the modal and adds the contact to the list.
     * Closes the modal after the phone number is selected.
     */
    const handlePhoneNumberSelection = () => {
        if (selectedPhoneNumber) {
            addContactToList(selectedContact, selectedPhoneNumber, contacts, setContacts);
            setModalVisible(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={{ marginBottom: 20 }}>
                {/* Image Section */}
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
            {(confirmPassword !== "" && password !== confirmPassword) && <HelperText type='error' >Password does not match.</HelperText>}
            <TextInput
                label="Address"
                value={address}
                onChangeText={setAddress}
                style={styles.input}
            />
            
            {contacts.length < 5 && (
                <Button
                    mode="contained"
                    onPress={() => selectAndAddContact(contacts, setContacts, setSelectedContact, setSelectedPhoneNumber, setModalVisible)}
                    style={styles.button}
                >
                    Add Contacts
                </Button>
            )}

            {/* Contacts List */}
            {contacts.length > 0 && (
                <View style={styles.contactsContainer}>
                    <Text style={styles.contactsTitle}>Selected Contacts:</Text>
                    {contacts.map((contact, index) => (
                        <ContactCard key={index} contact={contact} onRemove={() => removeContact(contact.id)} />
                    ))}
                </View>
            )}
            <Button disabled={!completion} mode="contained" onPress={handleCompleteProfile} style={styles.button}>
                Complete Profile
            </Button>

            {/* Modal for selecting phone number */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
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
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "80%",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    radioItem: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
});

export default CompleteProfileScreen;