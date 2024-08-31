import { create } from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from '../utils/axiosConfig'

const useUserStore = create((set, get) => ({
  user: null,
  contacts: [],
  places: [],
  
  setUser: (userData) => set({ user: userData }),
  
  setContacts: (contacts) => set({ contacts }),
  
  setPlaces: (places) => set({ places }),

  addContact: async (contact) => {
    try {
      // Make API call to add contact
      const response = await axios.post('/contacts', contact);
      const newContact = response.data; // Assuming the API returns the newly created contact

      set((state) => ({ 
        contacts: [...state.contacts, newContact] 
      }));

      // Save updated data to AsyncStorage
      get().saveUserData();

      return newContact;
    } catch (error) {
      console.error('Failed to add contact:', error);
      throw error;
    }
  },

  addPlace: (place) => set((state) => ({
    places: [...state.places, place]
  })),
  
  removeContact: async (id) => {
    try {
      // Make API call to remove contact
      await axios.delete(`/contacts/${id}`);

      set((state) => ({
        contacts: state.contacts.filter(contact => contact.id !== id)
      }));

      // Save updated data to AsyncStorage
      get().saveUserData();
    } catch (error) {
      console.error('Failed to remove contact:', error);
      throw error;
    }
  },

  removePlace: (id) => set((state) => ({
    places: state.places.filter(place => place.id !== id)
  })),

  // Load user data from AsyncStorage
  loadUserData: async () => {
    try {
      const userData = await AsyncStorage.getItem('userData')
      if (userData) {
        const parsedUserData = JSON.parse(userData)
        set({ 
          user: parsedUserData,
          contacts: parsedUserData.contacts || []
        })
      }
    } catch (error) {
      console.error('Failed to load user data:', error)
    }
  },

  // Save user data to AsyncStorage
  saveUserData: async () => {
    try {
      const { user, contacts } = get()
      const userData = { ...user, contacts }
      await AsyncStorage.setItem('userData', JSON.stringify(userData))
    } catch (error) {
      console.error('Failed to save user data:', error)
    }
  },

  // Clear user data (for logout)
  clearUserData: async () => {
    try {
      await AsyncStorage.removeItem('userData')
      set({ user: null, contacts: [] })
    } catch (error) {
      console.error('Failed to clear user data:', error)
    }
  }
}))

export default useUserStore