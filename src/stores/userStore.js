import {create} from 'zustand'
import AsyncStorage from '@react-native-async-storage/async-storage'

const useUserStore = create((set) => ({
  user: null,
  contacts: [],
  places: [],
  
  setUser: (userData) => set({ user: userData }),
  
  setContacts: (contacts) => set({ contacts }),
  
  setPlaces: (places) => set({ places }),

  addContact: (contact) => set((state) => ({ 
    contacts: [...state.contacts, contact] 
  })),

  addPlace: (place) => set((state) => ({
    places: [...state.places, place]
  })),
  
  removeContact: (id) => set((state) => ({
    contacts: state.contacts.filter(contact => contact.id !== id)
  })),

  remotePlace: (id) => set((state) => ({
    places: state.places.filter(place => place.id !== id)
  })),
//   updateContact: (updatedContact) => set((state) => ({
//     contacts: state.contacts.map(contact => 
//       contact.id === updatedContact.id ? updatedContact : contact
//     )
//   })),

  


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
      const { user, contacts } = useUserStore.getState()
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