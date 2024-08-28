import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
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

const CustomNavigationBar = ({ navigation, back, avataruri, name }) => {
    return (
        <Appbar.Header style={styles.header}>
            {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Avatar.Image 
                    source={{ uri: avataruri || 'https://via.placeholder.com/40' }} 
                    size={40}
                    style={styles.avatar}
                />
            </TouchableOpacity>
            <View style={styles.spacer} />
            <Appbar.Action icon="cog" onPress={() => navigation.navigate('Settings')} />
        </Appbar.Header>
    );
};

const AppNavigator = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [avataruri, setAvatarUri] = useState('');
    const [username, setUsername] = useState('');

    const fetchUser = async () => {
        try {
            const userData = await SecureStore.getItemAsync('userData');
            if (userData) {
                const { loggedIn, photo, name } = JSON.parse(userData);
                setLoggedIn(loggedIn ? true : false);
                setAvatarUri(photo);
                setUsername(name);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
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
                    options={({ navigation }) => ({
                        header: (props) => <CustomNavigationBar avataruri={avataruri} name={username} {...props} navigation={navigation} />
                    })}
                />
                <Stack.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={({ navigation }) => ({
                        header: (props) => <CustomNavigationBar avataruri={avataruri} name={username} {...props} navigation={navigation} />
                    })}
                />
                <Stack.Screen
                    name="Settings"
                    component={SettingsScreen}
                    options={({ navigation }) => ({
                        header: (props) => <CustomNavigationBar avataruri={avataruri} name={username} {...props} navigation={navigation} />
                    })}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    header: {
        justifyContent: 'space-between',
    },
    avatar: {
        marginLeft: 10,
    },
    spacer: {
        flex: 1,
    },
});

export default AppNavigator;