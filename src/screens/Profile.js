import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Avatar, Divider, Icon } from 'react-native-paper';
import useUserStore from '../stores/userStore';

const ProfileScreen = ({ navigation }) => {
    const { user } = useUserStore();
    console.log(user);

    return (
        <ScrollView style={styles.container}>
            {/* Profile Header */}
            <View style={styles.profileHeader}>
                <Avatar.Image
                    source={user?.photo ? { uri: user.photo } : require('../../assets/genericPerson.png')}
                    size={80}
                />
                <Text style={styles.name}>{user?.name || 'Guest User'}</Text>

                {/* Address */}
                <View style={styles.infoContainer}>
                    <Icon source="map-marker" size={20} style={styles.icon} />
                    <Text style={styles.infoText}>{user?.address || 'No address set'}</Text>
                </View>

                {/* Email */}
                <View style={styles.infoContainer}>
                    <Icon source="email" size={20} style={styles.icon} />
                    <Text style={styles.infoText}>{user?.email || 'No email set'}</Text>
                </View>

                {/* Phone */}
                <View style={styles.infoContainer}>
                    <Icon source="phone" size={20} style={styles.icon} />
                    <Text style={styles.infoText}>{user?.whatsapp || 'No phone number'}</Text>
                </View>
            </View>

            <Divider style={styles.divider} />

            {/* Emergency Contacts Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Emergency Contacts</Text>
                {user?.contacts && user.contacts.length > 0 ? (
                    user.contacts.map((contact) => (
                        <View key={contact.id || contact.phone} style={styles.listItem}>
                            <Text style={styles.listItemText}>{contact.name}</Text>
                            <Text style={styles.listItemSubText}>{contact.phone}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyText}>No emergency contacts added.</Text>
                )}
            </View>

            <Divider style={styles.divider} />

            {/* Frequently Visited Places */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Frequently Visited Places</Text>
                {user?.places && user.places.length > 0 ? (
                    user.places.map((place) => (
                        <View key={place.id || place.name} style={styles.listItem}>
                            <Text style={styles.listItemText}>{place.name}</Text>
                            <Text style={styles.listItemSubText}>{place.address}</Text>
                        </View>
                    ))
                ) : (
                    <Text style={styles.emptyText}>No places added.</Text>
                )}
            </View>

            <Divider style={styles.divider} />

            {/* Small "Edit Profile" link at the bottom */}
            <View style={styles.footer}>
                <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                    <Text style={styles.editProfileText}>Edit Profile</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f7f7f7',
        padding: 16,
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 16,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 8,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    icon: {
        marginRight: 8,
    },
    infoText: {
        fontSize: 16,
        color: '#666',
    },
    divider: {
        marginVertical: 12,
    },
    section: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    listItem: {
        padding: 12,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 8,
        elevation: 2,
    },
    listItemText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    listItemSubText: {
        fontSize: 14,
        color: '#666',
    },
    emptyText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        marginTop: 8,
    },
    footer: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    editProfileText: {
        fontSize: 14,
        color: '#8C52FF',
        textDecorationLine: 'underline',
    },
});

export default ProfileScreen;