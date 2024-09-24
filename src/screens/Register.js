// src/screens/RegisterScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, Alert, Image } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import axios from '../utils/axiosConfig';

const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [emailError, setEmailError] = useState('');
    const [whatsappError, setWhatsappError] = useState('');

    const validateInputs = () => {
        let isValid = true;

        // Email validation
        if (!email) {
            setEmailError('Email is required');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            setEmailError('Email is invalid');
            isValid = false;
        } else {
            setEmailError('');
        }

        // WhatsApp number validation
        if (!whatsapp) {
            setWhatsappError('WhatsApp number is required');
            isValid = false;
        } else if (!/^\d{9,15}$/.test(whatsapp)) {
            setWhatsappError('WhatsApp number is invalid');
            isValid = false;
        } else {
            setWhatsappError('');
        }

        return isValid;
    };

    const handleRegister = async () => {
        if (!validateInputs()) {
            return;
        }

        try {
            await axios.post('/auth/register', { email, whatsapp });
            Alert.alert('Success', 'Registration successful. Please verify OTP.', [
                { text: 'OK', onPress: () => navigation.navigate('VerifyOTP', { email }) },
            ]);
        } catch (error) {
            let errorMessage = 'Registration failed. Please try again.';
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                errorMessage = error.response.data.message || error.response.data;
            } else if (error.request) {
                // The request was made but no response was received
                errorMessage = 'No response from server. Please check your internet connection.';
            } else {
                // Something happened in setting up the request that triggered an Error
                errorMessage = error.message;
            }
            Alert.alert('Error', errorMessage);
            console.error('Registration error:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/sheltherTransparent.png')} style={{ width: 200, height: 150, alignSelf: 'center' }} />
            <Text style={styles.title}>Register</Text>
            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                autoCorrect={false}
                autoComplete="email"
                error={!!emailError}
            />
            <HelperText type="error" visible={!!emailError}>
                {emailError}
            </HelperText>
            <HelperText type="info" visible={true}>
                Enter country code without the + sign (e.g., 254 for Kenya)
            </HelperText>
            <TextInput
                label="WhatsApp Number"
                value={whatsapp}
                onChangeText={setWhatsapp}
                style={styles.input}
                keyboardType="numeric"
                error={!!whatsappError}
            />
            <HelperText type="error" visible={!!whatsappError}>
                {whatsappError}
            </HelperText>
            <Button mode="contained" onPress={handleRegister} style={styles.button}>
                Register
            </Button>
            <Button mode="text" onPress={() => navigation.navigate('Login')}>
                Already have an account? Login
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
        color: '#8C52FF',
    },
    input: {
        marginBottom: 12,
        backgroundColor: 'transparent',
    },
    button: {
        marginY: 12,
        backgroundColor: '#8C52FF',
    },
    textButton:{
       margin: 12,
       color: 'teal' 
    }
});

export default RegisterScreen;