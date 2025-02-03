import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing, Alert } from 'react-native';
import { Gyroscope } from 'expo-sensors';
import React, { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import SafeWordInput from '../components/SafeWordInput';


export default function Home() {
    const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });
    const [subscription, setSubscription] = useState(null);
    const shakes = useRef([]);
    const lastShakeTime = useRef(0);
    const lastZ = useRef(0);
    const [showSafeWordInput, setShowSafeWordInput] = useState(false);


    const [alertMode, setAlertMode] = useState('Standby'); // 'Standby' or 'Panic'
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const rippleAnim = useRef(new Animated.Value(0)).current;

    const _subscribe = () => {
        if (!subscription) {
            const newSubscription = Gyroscope.addListener(gyroscopeData => {
                setData(gyroscopeData);
                checkVerticalShake(gyroscopeData);
            });
            setSubscription(newSubscription);
        }
    };

    const _unsubscribe = () => {
        if (subscription) {
            subscription.remove();
            setSubscription(null);
        }
    };

    async function getLocation() {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Location permission not granted');
                return null;
            }
    
            const { coords } = await Location.getCurrentPositionAsync({});
            return {
                latitude: coords.latitude,
                longitude: coords.longitude,
            };
        } catch (error) {
            console.error('Error getting location:', error);
            return null;
        }
    }
    
    async function sendBroadCastMessage() {
        const location = await getLocation();
    
        const locationMessage = location
            ? `Location: ${location.latitude}, ${location.longitude}`
            : 'Location data not available';
    
        if (alertMode === 'Standby') {
            Alert.alert(
                'Confirm Emergency',
                `Are you sure you want to send the emergency alert?\n${locationMessage}`,
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'Yes',
                        onPress: () => {
                            Alert.alert('Emergency Sent', `The emergency alert has been sent!\n${locationMessage}`);
                        },
                    },
                ]
            );
        } else if (alertMode === 'Panic') {
            Alert.alert('Emergency Sent', `The emergency alert has been sent!\n${locationMessage}`);
        }
    }

    const checkVerticalShake = (data) => {
        if (alertMode !== 'Panic') return;

        const { z } = data;
        const currentTime = new Date().getTime();
        const SHAKE_THRESHOLD = 3.0; // Adjust based on testing
        const TIME_THRESHOLD = 2000; // 2 seconds
        const SHAKE_COUNT_THRESHOLD = 3;

        // Calculate change in z-axis rotation
        const deltaZ = Math.abs(z - lastZ.current);
        lastZ.current = z;

        if (deltaZ > SHAKE_THRESHOLD) {
            const timeDiff = currentTime - lastShakeTime.current;
            if (timeDiff > 250) { // Minimum time between shakes (250ms)
                shakes.current.push(currentTime);
                lastShakeTime.current = currentTime;

                // Remove shakes older than 2 seconds
                shakes.current = shakes.current.filter(shakeTime => currentTime - shakeTime <= TIME_THRESHOLD);

                if (shakes.current.length >= SHAKE_COUNT_THRESHOLD) {
                    sendBroadCastMessage();
                    shakes.current = []; // Reset after triggering
                }
            }
        }
    };

    useEffect(() => {
        if (alertMode === 'Panic') {
            _subscribe();
            startPulseAnimation();
        } else {
            _unsubscribe();
            stopPulseAnimation();
        }

        return () => _unsubscribe(); // Cleanup on unmount or alert mode change
    }, [alertMode]);

    const startPulseAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.2,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(rippleAnim, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(rippleAnim, {
                    toValue: 0,
                    duration: 0, // Reset immediately
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    const stopPulseAnimation = () => {
        scaleAnim.stopAnimation(() => {
            scaleAnim.setValue(1); // Reset to original scale
        });
        rippleAnim.stopAnimation(() => {
            rippleAnim.setValue(0); // Reset the ripple
        });
    };

    const toggleAlertMode = () => {
        setAlertMode(prevMode => (prevMode === 'Standby' ? 'Panic' : 'Standby'));
    };

    const yellow = '#f1c40f';
    const red = '#c0392b';

    return (
        <View style={styles.container}>
            {alertMode === 'Panic' && (
                <Animated.View
                    style={[
                        styles.ripple,
                        {
                            transform: [{ scale: rippleAnim }],
                            opacity: rippleAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 0],
                            }),
                        },
                    ]}
                />
            )}

            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: alertMode === 'Standby' ? yellow : red }]}
                    onPress={sendBroadCastMessage}
                    onLongPress={toggleAlertMode}
                >
                    <Text style={styles.buttonText}>{alertMode === 'Standby' ? 'Standby Mode' : 'Panic Mode'}</Text>
                </TouchableOpacity>
            </Animated.View>

            {/* Legend at the bottom */}
            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <View style={[styles.colorBox, { backgroundColor: yellow }]} />
                    <Text style={styles.legendText}>Standby: Tap to send an alert. No shake detection.</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.colorBox, { backgroundColor: red }]} />
                    <Text style={styles.legendText}>Panic: Tap or shake to send an alert. Pulse animation active.</Text>
                </View>
                <Text style={[styles.legendText, styles.currentModeText]}>Current Mode: {alertMode} Mode</Text>
                <Text style={styles.instructions}>Long press the button to switch between modes.</Text>
            </View>
            <View style={styles.container}>
            {showSafeWordInput ? (
                <SafeWordInput onSafeWordSaved={() => setShowSafeWordInput(false)} />
            ) : (
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => setShowSafeWordInput(true)}
                >
                    <Text style={styles.buttonText}>Set Safe Word</Text>
                </TouchableOpacity>
            )}
        </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 60, // Space for the legend
    },
    button: {
        width: 200,
        height: 200,
        padding: 10,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    ripple: {
        position: 'absolute',
        width: 300, // Make it larger than the button
        height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(255, 0, 0, 0.3)', // Slightly transparent red for the ripple
    },
    legend: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        alignItems: 'flex-start', // Align to the left
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    colorBox: {
        width: 20,
        height: 20,
        marginRight: 10,
        borderRadius: 3,
    },
    legendText: {
        color: '#333',
        fontSize: 16,
        textAlign: 'left',
    },
    currentModeText: {
        marginTop: 10,
        fontWeight: 'bold',
    },
    instructions: {
        marginTop: 10,
        color: '#555',
        fontStyle: 'italic',
    },
});