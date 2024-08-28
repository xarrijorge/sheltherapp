// src/screens/PlacesScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PlacesScreen = () => {
    return (
        <View style={styles.container}>
            <Text>Places Screen</Text>
              {/* Modal for selecting places */}
          {/* Modal for selecting places */}
            {/* <Modal
                visible={placeModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setPlaceModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <Button onPress={() => setPlaceModalVisible(false)}> 
                        <Text style={styles.modalTitle}>Close</Text> </Button>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Search for a Place</Text>
                        <SelectPlace/>
                    </View>
                </View>
            </Modal>  */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default PlacesScreen;