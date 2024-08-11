// src/screens/LoginScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import axios from '../utils/axiosConfig';
import * as SecureStore from 'expo-secure-store';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const validateInputs = () => {
        let isValid = true;

        if (!email) {
            setEmailError('Email is required');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Email is invalid');
            isValid = false;
        } else {
            setEmailError('');
        }

        if (!password) {
            setPasswordError('Password is required');
            isValid = false;
        } else if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            isValid = false;
        } else {
            setPasswordError('');
        }

        return isValid;
    };

    const handleLogin = async () => {
        if (!validateInputs()) {
            return;
        }

        try {
            const response = await axios.post('/auth/login', { email, password });
            const { user, tokens } = await response.data;

            // Store the token in AsyncStorage
            await SecureStore.setItemAsync('authToken', tokens.accessToken);
            await SecureStore.setItemAsync('refreshToken', tokens.refreshToken);
            // store user data
            const newUser = { ...user, loggedIn: true }
            await SecureStore.setItemAsync('userData', JSON.stringify(newUser));

            // Navigate to Home screen
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
        } catch (error) {
            let errorMessage = 'Login failed. Please try again.';
            if (error.response) {
                errorMessage = error.response.data.message || error.response.data.error || errorMessage;
            }
            Alert.alert('Error', errorMessage);
            console.error('Login error:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                error={!!emailError}
            />
            <HelperText type="error" visible={!!emailError}>
                {emailError}
            </HelperText>
            <TextInput
                label="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                error={!!passwordError}
            />
            <HelperText type="error" visible={!!passwordError}>
                {passwordError}
            </HelperText>
            <Button mode="contained" onPress={handleLogin} style={styles.button}>
                Login
            </Button>
            <Button mode="text" onPress={() => navigation.navigate('Register')} style={styles.button}>
                Don't have an account? Register
            </Button>
            {/* add link to completeProfile pickImage */}
            <Button mode="text" onPress={() => navigation.navigate('CompleteProfile')} style={styles.button}>
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
        marginBottom: 8,
    },
    button: {
        marginTop: 16,
    },
});

export default LoginScreen;