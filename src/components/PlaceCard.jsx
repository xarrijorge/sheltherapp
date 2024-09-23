import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Text, IconButton, Card } from 'react-native-paper';

const PlaceCard = ({ place, onRemove }) => {
    const { name: data } = place;

    const [name, address] = data.split(' | ');

    return (
        <Card style={styles.card}>
            <View style={styles.container}>
                <Avatar.Icon size={48} icon="map-marker" style={styles.avatar} />
                <View style={styles.detailsContainer}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.address}>{address}</Text>
                </View>
                <IconButton icon="delete" iconColor="#A90704" size={24} onPress={onRemove} />
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginVertical: 5,
        elevation: 3,
        borderRadius: 8, // Optional: Adds rounded corners
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    avatar: {
        backgroundColor: '#6200ee', // Fallback color
    },
    detailsContainer: {
        flex: 1,
        marginLeft: 10,
        justifyContent: 'center', // Centers text vertically
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    address: {
        fontSize: 14,
        color: '#555',
    },
});

export default PlaceCard;
