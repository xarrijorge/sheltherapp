import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, Modal, FlatList } from 'react-native';
import { TextInput, Button, Text, IconButton, Avatar, RadioButton } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Contacts from 'expo-contacts';
import axios from '../utils/axiosConfig';

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

    const handleCompleteProfile = async () => {
        if (!name || !password || !photo || !address || contacts.length < 1 || places.length < 2) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        try {
            const response = await axios.post('/auth/complete-profile', {
                email: route.params.email, // Assuming email is passed from the previous screen
                password,
                name,
                photo,
                address,
                contacts,
                places
            });

            Alert.alert('Success', 'Profile completed successfully');
            navigation.navigate('Home');
        } catch (error) {
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
            <TextInput
                label="Address"
                value={address}
                onChangeText={setAddress}
                style={styles.input}
            />
            <Button mode="contained" onPress={handleCompleteProfile} style={styles.button}>
                Complete Profile
            </Button>
            <Button mode="contained" onPress={handleContactSelection} style={styles.button}>
                Select Contacts
            </Button>
            {/* Navigate to home page */}
            <Button mode="contained" onPress={() => navigation.navigate('Home')} style={styles.button}>
                Home
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
                        <Text style={styles.modalTitle}>Select WhatsApp Number</Text>
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