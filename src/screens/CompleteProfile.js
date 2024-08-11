import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView, Image, FlatList, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, IconButton, FAB, Avatar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as Contacts from 'expo-contacts';
import * as Location from 'expo-location';
import axios from '../utils/axiosConfig';

const CompleteProfileScreen = ({ route, navigation }) => {
    const [mediaStatus, requestMediaPermission] = ImagePicker.useMediaLibraryPermissions();
    const [camStatus, requestCamPermission] = ImagePicker.useCameraPermissions();

    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [photo, setPhoto] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [address, setAddress] = useState('');
    const [contacts, setContacts] = useState([]);
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        requestMediaPermission();
        requestCamPermission();
    }, []);

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
        console.log(result);
    };

    // const getContacts = async () => {
    //     const { status } = await Contacts.requestPermissionsAsync();
    //     if (status === 'granted') {
    //         const { data } = await Contacts.getContactsAsync({
    //             fields: [Contacts.Fields.PhoneNumbers],
    //         });

    //         if (data.length > 0) {
    //             setContacts(data.slice(0, 5).map(contact => ({
    //                 id: contact.id,
    //                 name: contact.name,
    //                 number: contact.phoneNumbers && contact.phoneNumbers[0] ? contact.phoneNumbers[0].number : ''
    //             })));
    //         }
    //     }
    // };

    // const getPlace = async () => {
    //     let { status } = await Location.requestForegroundPermissionsAsync();
    //     if (status !== 'granted') {
    //         Alert.alert('Permission to access location was denied');
    //         return;
    //     }

    //     let location = await Location.getCurrentPositionAsync({});
    //     setPlaces([...places, {
    //         id: Date.now().toString(),
    //         name: `Place ${places.length + 1}`,
    //         latitude: location.coords.latitude,
    //         longitude: location.coords.longitude
    //     }]);
    // };

    const handleCompleteProfile = async () => {
        if (!name || !password || !photo || !address || contacts.length < 1 || places.length < 2) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        try {
            const response = await axios.post('/auth/complete-profile', {
                email: route.params.email, // Assuming email is passed from previous screen
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

    const removePlace = (id) => {
        setPlaces(places.filter(place => place.id !== id));
    };

    const removePhoto = () => {
        setPhoto(null);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={{ marginBottom: 20 }}>
                {/* Image Section */}
                {!photo && <Button mode="contained" onPress={pickImage} style={styles.button}>
                    {photo ? 'Change Image' : 'Pick an Image'}
                </Button>}
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
            {/* // navigate to home page */}
            <Button mode="contained" onPress={() => navigation.navigate('Home')} style={styles.button}>Home</Button>
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
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 10,
    },
});

export default CompleteProfileScreen;