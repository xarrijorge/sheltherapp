// src/screens/CompleteProfileScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import axios from '../utils/axiosConfig';

const CompleteProfileScreen = ({ route, navigation }) => {
    const { email } = route.params;
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [photo, setPhoto] = useState('');
    const [address, setAddress] = useState('');
    const [contacts, setContacts] = useState('');
    const [places, setPlaces] = useState('');

    const handleCompleteProfile = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        const userProfileData = {
            "email": email,
            "password": password,
            "name": name,
            "photo": photo,
            "address": address,
            "contacts": [
                {
                    "id": "contact3",
                    "name": "Robert Brown",
                    "phone": "+1123456789",
                    "email": "robert.brown@example.com"
                }
            ],
            "locations": [],
            "places": [
                {
                    "id": "place1",
                    "name": "Home",
                    "latitude": 37.7749,
                    "longitude": -122.4194
                },
                {
                    "id": "place2",
                    "name": "Work",
                    "latitude": 37.7749,
                    "longitude": -122.4194
                }
            ]
        }



        try {
            const response = await axios.post('/auth/complete', userProfileData);
            Alert.alert('Success', 'Profile completed successfully.', [
                { text: 'OK', onPress: () => navigation.navigate('Home') },
            ]);
        } catch (error) {
            Alert.alert('Error', error.response?.data?.error || 'Profile completion failed');
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Complete Profile</Text>
            <TextInput
                label="Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />
            <TextInput
                label="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
            />
            <TextInput
                label="Confirm Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.input}
            />
            <TextInput
                label="Photo URL"
                value={photo}
                onChangeText={setPhoto}
                style={styles.input}
            />
            <TextInput
                label="Address"
                value={address}
                onChangeText={setAddress}
                style={styles.input}
            />
            <TextInput
                label="Contacts (comma separated)"
                value={contacts}
                onChangeText={setContacts}
                style={styles.input}
            />
            <TextInput
                label="Places (comma separated)"
                value={places}
                onChangeText={setPlaces}
                style={styles.input}
            />
            <Button mode="contained" onPress={handleCompleteProfile} style={styles.button}>
                Complete Profile
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        marginBottom: 12,
    },
    button: {
        marginTop: 12,
    },
});

export default CompleteProfileScreen;