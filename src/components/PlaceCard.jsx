import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Text, IconButton, Card } from 'react-native-paper';

const PlaceCard = ({ place, onRemove }) => {
    const { name, address } = place;

    return (
        <Card style={styles.card}>
            <View style={styles.container}>
                <Avatar.Icon size={48} icon="map-marker" style={styles.avatar} />
                <View style={styles.detailsContainer}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.address}>{address}</Text>
                </View>
                <IconButton
                    icon="delete"
                    size={24}
                    onPress={onRemove}
                />
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginVertical: 5,
        elevation: 3, // Adds a subtle shadow
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    avatar: {
        backgroundColor: '#6200ee', // Primary color for the icon background
    },
    detailsContainer: {
        flex: 1,
        marginLeft: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    address: {
        fontSize: 14,
        color: '#555', // Slightly muted color for the address
    },
});

export default PlaceCard;