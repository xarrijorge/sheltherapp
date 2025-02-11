import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Alert } from 'react-native';
import { Gyroscope } from 'expo-sensors';
import React, { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import Voice from '@react-native-community/voice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SafeWordInput from '../components/SafeWordInput';

export default function Home() {
    const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });
    const [subscription, setSubscription] = useState(null);
    const shakes = useRef([]);
    const lastShakeTime = useRef(0);
    const lastZ = useRef(0);
    const [showSafeWordInput, setShowSafeWordInput] = useState(false);
    const [alertMode, setAlertMode] = useState('Standby');
    const [safeWord, setSafeWord] = useState('Help');
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const rippleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        (async () => {
            const storedWord = await AsyncStorage.getItem('safeWord');
            if (storedWord) {
                setSafeWord(storedWord.toLowerCase());
            } else {
                await AsyncStorage.setItem('safeWord', 'help');
            }
        })();

        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechError = onSpeechError;

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    const onSpeechResults = (event) => {
        if (alertMode === 'Panic' && event.value) {
            const detectedWord = event.value[0].toLowerCase();
            if (detectedWord.includes(safeWord)) {
                sendBroadCastMessage();
            }
        }
    };

    const onSpeechError = (error) => {
        console.error("Voice recognition error:", error);
    };

    const startListening = async () => {
        try {
            await Voice.start('en-US');
        } catch (error) {
            console.error(error);
        }
    };

    const stopListening = async () => {
        try {
            await Voice.stop();
        } catch (error) {
            console.error(error);
        }
    };

    async function sendBroadCastMessage() {
        const location = await getLocation();
        const locationMessage = location ? `Location: ${location.latitude}, ${location.longitude}` : 'Location data not available';
        Alert.alert('🚨 Emergency Alert Sent!', `Your emergency contacts have been notified.
        ${locationMessage}`);
    }

    async function getLocation() {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return null;
            const { coords } = await Location.getCurrentPositionAsync({});
            return { latitude: coords.latitude, longitude: coords.longitude };
        } catch (error) {
            console.error('Error getting location:', error);
            return null;
        }
    }

    const toggleAlertMode = () => {
        const newMode = alertMode === 'Standby' ? 'Panic' : 'Standby';
        setAlertMode(newMode);

        if (newMode === 'Panic') {
            startListening();
            Alert.alert(
                "Panic Mode Activated",
                `The app is now listening for the safe word "${safeWord}".
                You can change this in the Profile page.`
            );
        } else {
            stopListening();
        }
    };

    return (
        <View style={styles.container}>
            {alertMode === 'Panic' && (
                <Animated.View style={[styles.ripple, { transform: [{ scale: rippleAnim }], opacity: rippleAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }]} />
            )}
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity style={[styles.button, { backgroundColor: alertMode === 'Standby' ? 'yellow' : 'red' }]} onPress={sendBroadCastMessage} onLongPress={toggleAlertMode}>
                    <Text style={styles.buttonText}>{alertMode === 'Standby' ? 'Standby Mode' : 'Panic Mode'}</Text>
                </TouchableOpacity>
            </Animated.View>
            {showSafeWordInput && <SafeWordInput onSafeWordSaved={() => setShowSafeWordInput(false)} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    button: { width: 200, height: 200, borderRadius: 100, justifyContent: 'center', alignItems: 'center' },
    buttonText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
    ripple: { position: 'absolute', width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(255, 0, 0, 0.3)' }
});
