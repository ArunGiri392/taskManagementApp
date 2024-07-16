import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { auth } from '../constants/firebaseConfig';
import { signOut } from 'firebase/auth';
const Profile = () => {

  const signOutUser = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
      // Perform any additional actions like navigating to the login screen
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <View>
      <Text>Profile</Text>
      <Button title='LogOut' onPress={()=>signOutUser()} />
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({})