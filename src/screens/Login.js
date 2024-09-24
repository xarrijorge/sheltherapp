// src/screens/LoginScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import axios from '../utils/axiosConfig';
import * as SecureStore from 'expo-secure-store';
import useUserStore from '../stores/userStore';
const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const setUser = useUserStore(state => state.setUser)
    const setContacts = useUserStore(state => state.setContacts)
    const setPlaces = useUserStore(state => state.setPlaces)
    const saveUserData = useUserStore(state => state.saveUserData)
    const [showPassword, setShowPassword] = useState(false);

    /**
     * Validates the inputs for the login form.
     * 
     * @returns {boolean} Returns true if all inputs are valid, otherwise false.
     */
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

    /**
     * Handles the login functionality.
     * 
     * @async
     * @function handleLogin
     * @returns {Promise<void>} - A promise that resolves when the login process is completed.
     */
    const handleLogin = async () => {
        if (!validateInputs()) {
            return;
        }

        try {
            const cleanEmail = email.trim().toLowerCase();
            const response = await axios.post('/auth/login', { email: cleanEmail, password })
            const { user, tokens } = response.data
      
            // Store the token in SecureStore
            await SecureStore.setItemAsync('authToken', tokens.accessToken)
            await SecureStore.setItemAsync('refreshToken', tokens.refreshToken)
      
            // Update the store
            setUser(user)
            setContacts(user.contacts)
            setPlaces(user.places)
            await saveUserData()
      
            // Navigate to Home screen
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            })
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
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                error={!!passwordError}
                right={
                    <TextInput.Icon
                        icon={showPassword ? "eye-off" : "eye"}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
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
            <Button mode="text" onPress={() => navigation.navigate('Home')} style={styles.button}>Home</Button>
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