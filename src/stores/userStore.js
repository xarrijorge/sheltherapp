import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../utils/axiosConfig';
import * as FileSystem from 'expo-file-system';

const SHELTER_DIRECTORY = `${FileSystem.documentDirectory}shelter/`;
const PROFILE_PHOTO_FILENAME = 'profile_photo.jpg';

const useUserStore = create((set, get) => ({
  user: null,
  contacts: [],
  places: [],

  setUser: (userData) => set({ user: userData }),

  setContacts: (contacts) => set({ contacts }),

  setPlaces: (places) => set({ places }),

  loadUserData: async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedUserData = JSON.parse(userData);

        // Check if local profile picture exists
        const photoUri = `${SHELTER_DIRECTORY}${PROFILE_PHOTO_FILENAME}`;
        const fileInfo = await FileSystem.getInfoAsync(photoUri);
        if (fileInfo.exists) {
          parsedUserData.photo = photoUri;
        }

        set({ user: parsedUserData, contacts: parsedUserData.contacts || [], places: parsedUserData.places || [] });
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  },

  saveUserData: async () => {
    try {
      const { user, contacts, places } = get();
      const userData = { ...user, contacts, places };
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  },

  updateUser: async (updates) => {
    try {
      const updatedUser = { ...get().user, ...updates };
      set({ user: updatedUser });
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Failed to update user:', error);
      throw error;
    }
  },

  addContact: async (contact) => {
    try {
      const response = await axios.patch('/user/addcontact', contact);
      console.log("Response:", response); // Log response
      const newContact = response.data.contact;

      set((state) => ({ contacts: [...state.contacts, newContact] }));
      get().saveUserData();
      return newContact;
    } catch (error) {
      console.error('Failed to add contact:', error?.response?.data || error.message);
      throw error;
    }
  }, 

  removeContact: async (id) => {
    try {
      await axios.delete(`/user/remove/${id}`);

      set((state) => ({
        contacts: state.contacts.filter(contact => contact._id !== id),
      }));

      get().saveUserData();
    } catch (error) {
      console.error('Failed to remove contact:', error);
      throw error;
    }
  },

  addPlace: async (place) => {
    try {
      const response = await axios.patch('/user/addplace', place);
      const newPlace = response.data.place;
      
      // Make sure the place has an ID - if not, generate one
      if (!newPlace._id && !newPlace.id) {
        newPlace._id = Date.now().toString(); // Use timestamp as fallback ID
      }

      set((state) => ({
        places: [...state.places, newPlace],
      }));

      get().saveUserData();

      return newPlace;
    } catch (error) {
      console.error('Failed to add place:', error);
      throw error;
    }
  },

  removePlace: (id) => {
    if (!id) return; // Don't attempt to remove if ID is undefined
    
    set((state) => ({
      // Try to match by either _id or id
      places: state.places.filter(place => 
        (place._id !== id && place.id !== id)
      ),
    }));

    get().saveUserData();
  }, 

  removePlace: (id) => {
    set((state) => ({
      places: state.places.filter(place => place._id !== id),
    }));

    get().saveUserData(); 
  },

  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await axios.post('/auth/change', { currentPassword, newPassword });
      return response.data.message;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  },

  updateProfilePhoto: async (uri) => {
    try {
      // Ensure the directory exists
      const dirInfo = await FileSystem.getInfoAsync(SHELTER_DIRECTORY);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(SHELTER_DIRECTORY, { intermediates: true });
      }

      const newUri = `${SHELTER_DIRECTORY}${PROFILE_PHOTO_FILENAME}`;

      // Remove the existing photo if it exists
      const fileInfo = await FileSystem.getInfoAsync(newUri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(newUri);
      }

      // Move the new photo
      await FileSystem.moveAsync({
        from: uri,
        to: newUri,
      });

      // Update store
      set((state) => ({ user: { ...state.user, photo: newUri } }));
      await AsyncStorage.setItem('userData', JSON.stringify(get().user));
    } catch (error) {
      console.error('Failed to update profile photo:', error);
      throw error;
    }
  },

  clearUserData: async () => {
    try {
      await AsyncStorage.removeItem('userData');
      set({ user: null, contacts: [], places: [] });
    } catch (error) {
      console.error('Failed to clear user data:', error);
    }
  },
}));

export default useUserStore;