import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';

export const SelectPlace = () => {
    const [country, setCountry] = useState('ke');
    const [location, setLocation] = useState(null);
    const ref = useRef();

    useEffect(() => {
        ref.current?.setAddressText('Some Text');
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission to access location was denied');
                return;
            }
        })();
    }, []);

    return (
        <View style={styles.container}>
            <GooglePlacesAutocomplete
                ref={ref}
                onPress={(data, details = null) => {
                    console.log('pressed', data, details);
                    setLocation(details);
                }}
                query={{
                    key: 'AIzaSyC6R4F4bmF_mh5xyuuWvDGKVB4B6j23Xks',
                    language: 'en',
                    components: `country:${country}`,
                }}
                placeholder='Enter Location'
                minLength={2}
                autoFocus={false}
                returnKeyType={'default'}
                fetchDetails={true}
                enablePoweredByContainer={false}
                styles={{
                    container: {
                        flex: 0,
                    },
                    textInputContainer: {
                        backgroundColor: 'grey',
                    },
                    textInput: {
                        height: 38,
                        color: '#5d5d5d',
                        fontSize: 16,
                    },
                    predefinedPlacesDescription: {
                        color: '#1faadb',
                    },
                    listView: {
                        position: 'absolute',
                        top: 38,
                        left: 0,
                        right: 0,
                        backgroundColor: 'white',
                        borderTopWidth: 0,
                        zIndex: 1000,
                    },
                }}
                onFail={(error) => console.error(error)}
                nearbyPlacesAPI='GooglePlacesSearch'
                GooglePlacesSearchQuery={{
                    rankby: 'distance',
                }}
                listViewDisplayed={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        zIndex: 1,
    },
});