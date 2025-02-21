import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Text, Avatar, IconButton, HelperText } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import useUserStore from '../stores/userStore';

const SettingsScreen = () => {
    const { user, updateUser, changePassword, updateProfilePhoto } = useUserStore();
    const [name, setName] = useState(user?.name || '');
    const [address, setAddress] = useState(user?.address || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            await updateProfilePhoto(result.assets[0].uri);
        }
    };

    const handleUpdateProfile = async () => {
        if (!name || !address) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        try {
            await updateUser({ name, address });
            Alert.alert('Success', 'Profile updated successfully');
        } catch (error) {
            Alert.alert('Error', 'Failed to update profile');
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        try {
            const message = await changePassword(currentPassword, newPassword);
            Alert.alert('Success', message);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            Alert.alert('Error', error.response?.data?.error || 'Failed to change password');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.profileSection}>
                <Avatar.Image
                    source={user?.photo ? { uri: user.photo } : require('../../assets/genericPerson.png')}
                    size={80}
                />
                <IconButton icon="camera" size={24} onPress={pickImage} />
            </View>

            <TextInput
                label="Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />

            <TextInput
                label="Home Address"
                value={address}
                onChangeText={setAddress}
                style={styles.input}
            />

            <Button mode="contained" onPress={handleUpdateProfile} style={styles.button}>
                Save Profile
            </Button>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Change Password</Text>
                <TextInput
                    label="Current Password"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    secureTextEntry={!showPassword}
                    style={styles.input}
                    right={
                        <TextInput.Icon
                            icon={showPassword ? "eye-off" : "eye"}
                            onPress={() => setShowPassword(!showPassword)}
                        />
                    }
                />
                <TextInput
                    label="New Password"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                    style={styles.input}
                />
                <TextInput
                    label="Confirm New Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    style={styles.input}
                />
                <Button mode="contained" onPress={handleChangePassword} style={styles.button}>
                    Change Password
                </Button>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 20, justifyContent: 'center' },
    profileSection: { alignItems: 'center', marginBottom: 20 },
    input: { marginBottom: 10 },
    button: { marginTop: 10 },
    section: { marginTop: 20 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
});

export default SettingsScreen;