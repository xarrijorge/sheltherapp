import React, { useEffect } from 'react';
import AppNavigator from './src/navigator/AppNavigator';
import { LoadingProvider, useLoading } from './src/utils/loadingContext';
import { setupAxiosInterceptors } from './src/utils/axiosConfig';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';

const App = () => {
  const { isLoading, setIsLoading } = useLoading();

  const SHELTER_DIRECTORY = `${FileSystem.documentDirectory}shelter/`; // Hidden directory

  useEffect(() => {
    setupAxiosInterceptors(setIsLoading);

    const createShelterDirectory = async () => {
      try {
        // Check if the directory already exists
        const dirInfo = await FileSystem.getInfoAsync(SHELTER_DIRECTORY);
        
        if (!dirInfo.exists) {
          // If the directory doesn't exist, create it
          await FileSystem.makeDirectoryAsync(SHELTER_DIRECTORY, { intermediates: true });
          console.log('Shelter directory created');
        } else {
          console.log('Shelter directory already exists');
        }
      } catch (error) {
        console.error('Error creating shelter directory:', error);
      }
    };

    createShelterDirectory();
  }, [setIsLoading]);

  return (
    <View style={styles.container}>
      <AppNavigator />
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// Wrap the App component with LoadingProvider
const AppWrapper = () => (
  <LoadingProvider>
    <App />
  </LoadingProvider>
);

export default AppWrapper;