import React, { useEffect } from 'react';
import AppNavigator from './src/navigator/AppNavigator';
import { LoadingProvider, useLoading } from './src/utils/loadingContext';
import { setupAxiosInterceptors } from './src/utils/axiosConfig';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const App = () => {
  const { isLoading, setIsLoading } = useLoading();

  useEffect(() => {
    setupAxiosInterceptors(setIsLoading);
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