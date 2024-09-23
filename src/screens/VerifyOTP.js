// src/screens/VerifyOtpScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import axios from '../utils/axiosConfig';

const VerifyOtpScreen = ({ route, navigation }) => {
    const { email } = route.params;
    const [otp, setOtp] = useState('');

    const handleVerifyOtp = async () => {
        if (otp.length !== 6) {
            Alert.alert('Error', 'OTP must be exactly 6 characters long');
            return;
        }

        try {
            const response = await axios.post('/auth/verify', { email, otp });
            Alert.alert('Success', 'OTP verified successfully.', [
                { text: 'OK', onPress: () => navigation.navigate('CompleteProfile', { email }) },
            ]);
        } catch (error) {
            Alert.alert('Error', error.response?.data?.error || 'OTP verification failed');
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Verify OTP</Text>
            <TextInput
                label="OTP"
                value={otp}
                onChangeText={setOtp}
                style={styles.input}
                minLength={6}
                maxLength={6}
            />
            <HelperText type="info" visible={true}>
                Enter the 6-digit OTP sent to your email
            </HelperText>
            <Button
                mode="contained"
                onPress={handleVerifyOtp}
                style={styles.button}
                disabled={otp.length !== 6}
            >
                Verify OTP
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

export default VerifyOtpScreen;