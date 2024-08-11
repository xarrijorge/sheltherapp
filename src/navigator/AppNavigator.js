import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/Login';
import RegisterScreen from '../screens/Register';
import VerifyOTPScreen from '../screens/VerifyOTP';
import CompleteProfileScreen from '../screens/CompleteProfile';
import BottomTabNavigator from './BottomNavigator';
import ProfileScreen from '../screens/Profile';
import SettingsScreen from '../screens/Settings';
import { Appbar, Avatar } from 'react-native-paper';
import * as SecureStore from 'expo-secure-store';

const Stack = createStackNavigator();

const CustomNavigationBar = ({ navigation, previous }) => {
    return (
        <Appbar.Header>
            {previous ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
            <Appbar.Content title="Shelther" />
            <Avatar.Image size={40} source={{ uri: 'https://via.placeholder.com/150' }} onPress={() => navigation.navigate('Profile')} />
            <Appbar.Action icon="cog" onPress={() => navigation.navigate('Settings')} />
        </Appbar.Header>
    );
};

const AppNavigator = () => {
    const [loggedIn, setLoggedIn] = useState(false);

    const fetchUser = async () => {
        const userData = await SecureStore.getItemAsync('userData');
        const { loggedIn } = JSON.parse(userData);
        setLoggedIn(loggedIn ? true : false);
    };

    useEffect(() => {
        fetchUser();
    }, []);


    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={loggedIn ? 'Home' : 'Login'}>
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                <Stack.Screen name="VerifyOTP" component={VerifyOTPScreen} options={{ headerShown: false }} />
                <Stack.Screen name="CompleteProfile" component={CompleteProfileScreen} options={{ headerShown: false }} />
                <Stack.Screen
                    name="Home"
                    component={BottomTabNavigator}
                    options={{ header: (props) => <CustomNavigationBar {...props} /> }}
                />
                <Stack.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{ header: (props) => <CustomNavigationBar {...props} /> }}
                />
                <Stack.Screen
                    name="Settings"
                    component={SettingsScreen}
                    options={{ header: (props) => <CustomNavigationBar {...props} /> }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;