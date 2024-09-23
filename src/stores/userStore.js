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
      const response = await axios.patch('/user/addcontact', contact);
      const newContact = response.data.contact;

      set((state) => ({ 
        contacts: [...state.contacts, newContact] 
      }));

      get().saveUserData();

      return newContact;
    } catch (error) {
      console.error('Failed to add contact:', error);
      throw error;
    }
  },

  addPlace: async (place) => {
    try {
      const response = await axios.patch('/user/addplace', place);
      const newPlace = response.data.place;

      set((state) => ({
        places: [...state.places, newPlace]
      }));

      get().saveUserData();

      return newPlace;

    } catch (error){
      console.error('Failed to add place:', error);
      throw error;
    }
  },
  
  removeContact: async (id) => {
    try {
      await axios.delete(`/user/remove/${id}`);

      set((state) => {
        const updatedContacts = state.contacts.filter(contact => contact._id !== id);
        return { contacts: updatedContacts };
      });

      get().saveUserData();

    } catch (error) {
      console.error('Failed to remove contact:', error);
      throw error;
    }
  },

  removePlace: (id) => set((state) => ({
    places: state.places.filter(place => place.id !== id)
  })),

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

  saveUserData: async () => {
    try {
      const { user, contacts } = get()
      const userData = { ...user, contacts }
      await AsyncStorage.setItem('userData', JSON.stringify(userData))
    } catch (error) {
      console.error('Failed to save user data:', error)
    }
  },

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