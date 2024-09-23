import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, Modal, } from 'react-native';
import { TextInput, Button, Text, IconButton, Avatar, RadioButton, HelperText } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Contacts from 'expo-contacts';
import axios from '../utils/axiosConfig';
import ContactCard from '../components/ContactCard';
import * as AsyncStorage from  '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';


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

    const completion = name && password && confirmPassword && photo && address && contacts.length > 0;

    const moveImageToShelter = async (uri) => {
        try {
            // Define the shelter directory and file path
            const SHELTER_DIRECTORY = `${FileSystem.documentDirectory}shelter/`;
            const PROFILE_PHOTO_FILENAME = 'profile_photo.jpg';
            const newUri = `${SHELTER_DIRECTORY}${PROFILE_PHOTO_FILENAME}`;
    
            // Check if the shelter directory exists
            const dirInfo = await FileSystem.getInfoAsync(SHELTER_DIRECTORY);
            if (!dirInfo.exists) {
                // If the directory doesn't exist, create it
                await FileSystem.makeDirectoryAsync(SHELTER_DIRECTORY, { intermediates: true });
                console.log('Shelter directory created:', SHELTER_DIRECTORY);
            }
    
            // Check if the file already exists at the destination
            const fileInfo = await FileSystem.getInfoAsync(newUri);
            if (fileInfo.exists) {
                // If the file exists, delete it to avoid duplicates or overwrite
                await FileSystem.deleteAsync(newUri);
            }
    
            // Move the image from the original URI to the new URI in the "shelter" directory
            await FileSystem.moveAsync({
                from: uri,
                to: newUri,
            });
    
            console.log('Image moved to:', newUri);
            return newUri; // Return the new path of the moved image
        } catch (error) {
            console.error('Error moving image:', error);
            throw error; // If there's an error, log it and rethrow the error
        }
    }; 

    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
            });
    
            console.log('ImagePicker result:', result);
    
            if (!result.canceled) {
                if (result.assets && result.assets.length > 0) {
                    const uri = result.assets[0].uri;
                    setPhoto(uri); // Update the state with the selected image URI
    
                    // Move the image to the shelter directory
                    const newUri = await moveImageToShelter(uri);
                    console.log('Image moved to shelter directory:', newUri);
                } else {
                    console.log('No assets found in the result');
                }
            } else {
                console.log('Image picking was canceled');
            }
        } catch (error) {
            console.error('Error picking image:', error);
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
    
        try {
            checkPassword();
    
            const data = {
                email,
                password,
                name,
                photo,
                address,
                contacts,
            };
    
            console.log('Sending data:', data);
    
            const response = await axios.post('/auth/complete', data);
    
            if (response.status === 200) {
                Alert.alert('Success', 'Profile completed successfully');
                await AsyncStorage.setItem('userData', JSON.stringify({ loggedIn: true, photo, name, email, address, contacts }));
                // Store the token in AsyncStorage
                await SecureStore.setItemAsync('authToken', response.token.accessToken);
                await SecureStore.setItemAsync('refreshToken', response.token.refreshToken);

                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                });
            } else {
                Alert.alert('Error', 'Unexpected response from server');
            }
        } catch (error) {
            console.error('Error in handleCompleteProfile:', error);
            if (error.response) {
                console.log('Error response:', error.response.data);
                console.log('Error status:', error.response.status);
            }
            Alert.alert('Error', error.response?.data?.error || 'Failed to complete profile');
        }
    };  

    const removeContact = (id) => {
        setContacts(contacts.filter(contact => contact.id !== id));
    };

    const removePhoto = () => {
        setPhoto(null);
    };

    const handleContactSelection = async () => {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === 'granted') {
            const result = await Contacts.presentContactPickerAsync({
                fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
            });

            if (result && result.phoneNumbers) {
                if (result.phoneNumbers.length > 1) {
                    setSelectedContact(result);
                    setSelectedPhoneNumber(result.phoneNumbers[0].number); // Default selection
                    setModalVisible(true); // Show modal if multiple phone numbers
                } else {
                    addContact(result, result.phoneNumbers[0].number);
                }
            }
        }
    };

    const addContact = (contact, phoneNumber) => {
        setContacts([...contacts, {
            id: contact.id,
            name: contact.name,
            phone: phoneNumber,
        }]);
        setModalVisible(false);
    };

    const handlePhoneNumberSelection = () => {
        if (selectedPhoneNumber) {
            addContact(selectedContact, selectedPhoneNumber);
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
          {(confirmPassword !== "" && password !== confirmPassword) && <HelperText type='error'>Password does not match.</HelperText>}
            <TextInput
                label="Home Address"
                value={address}
                onChangeText={setAddress}
                style={styles.input}
            /> 

            {contacts.length < 5 && <Button mode="contained" onPress={handleContactSelection} style={styles.button}>
                Add Contacts
            </Button>}

            {/* Contacts List */}
            {contacts.length > 0 && (
                <View style={styles.contactsContainer}>
                    <Text style={styles.contactsTitle}>Selected Contacts:</Text>
                    {
                        contacts.map((contact, index) =>
                            <ContactCard key={index} contact={contact} onRemove={() => removeContact(contact.id)} />
                        )
                    }
                </View>
            )}
            <Button mode="contained" onPress={handleCompleteProfile} style={styles.button}>
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
        justifyContent: 'center',
    },
    input: {
        marginBottom: 10,
    },
    button: {
        marginTop: 10,
    },
    selectedItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        justifyContent: 'space-between',
    },
    contactsContainer: {
        marginTop: 20,
    },
    contactsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    contactText: {
        flex: 1,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
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
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
});

export default CompleteProfileScreen;