import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Avatar, Text, IconButton, Card } from 'react-native-paper'

const ContactCard = ({ contact, onRemove }) => {
  const { name, phone } = contact

  // Generate a random color for the avatar background
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF'
    let color = '#'
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)]
    }
    return color
  }

  // Use the first letter of the contact's name as avatar content
  const avatarContent = name.charAt(0).toUpperCase()
  const avatarColor = getRandomColor() // Generate random color

  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        <Avatar.Text
          size={48}
          label={avatarContent}
          style={[styles.avatar, { backgroundColor: avatarColor }]} // Use the random color here
        />
        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.phone}>{phone}</Text>
        </View>
        <IconButton icon='delete' size={24} onPress={onRemove} />
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
    elevation: 3, // Adds a subtle shadow
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  avatar: {
    backgroundColor: '#6200ee', // Fallback color, but usually overwritten by random color
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  phone: {
    fontSize: 14,
    color: '#555', // Slightly muted color for phone number
  },
})

export default ContactCard
