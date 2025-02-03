import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import Voice from '@react-native-community/voice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SafeWordInput = ({ onSafeWordSaved }) => {
    const [safeWord, setSafeWord] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [confirmationText, setConfirmationText] = useState('');

    useEffect(() => {
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechError = onSpeechError;
        
        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    const onSpeechResults = (event) => {
        if (event.value && event.value.length > 0) {
            setConfirmationText(event.value[0].toLowerCase());
        }
    };

    const onSpeechError = (error) => {
        console.error("Voice recognition error:", error);
    };

    const startListening = async () => {
        try {
            setIsListening(true);
            await Voice.start('en-US');
        } catch (error) {
            console.error(error);
            setIsListening(false);
        }
    };

    const stopListening = async () => {
        try {
            await Voice.stop();
            setIsListening(false);
        } catch (error) {
            console.error(error);
        }
    };

    const saveSafeWord = async () => {
        if (safeWord.toLowerCase() === confirmationText) {
            await AsyncStorage.setItem('safeWord', safeWord.toLowerCase());
            Alert.alert("Safe Word Set", "Your safe word has been saved successfully!");
            onSafeWordSaved && onSafeWordSaved(safeWord.toLowerCase());
        } else {
            Alert.alert("Error", "The spoken safe word does not match the typed one. Try again.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Set Your Safe Word</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter safe word"
                value={safeWord}
                onChangeText={setSafeWord}
            />
            <Button title={isListening ? "Listening..." : "Confirm via Voice"} onPress={startListening} />
            {confirmationText ? <Text style={styles.confirmation}>You said: {confirmationText}</Text> : null}
            <Button title="Save Safe Word" onPress={saveSafeWord} disabled={!confirmationText} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20 },
    label: { fontSize: 18, marginBottom: 10 },
    input: { borderWidth: 1, padding: 10, borderRadius: 5, marginBottom: 10 },
    confirmation: { marginTop: 10, fontSize: 16, color: "green" },
});

export default SafeWordInput;