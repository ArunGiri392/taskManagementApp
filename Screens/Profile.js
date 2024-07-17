import { Button, Image, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { auth } from '../constants/firebaseConfig';
import { signOut } from 'firebase/auth';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { theme } from '../constants/theme';
import CustomText from '../components/CustomText';
import { useSelector } from 'react-redux';


const defaultImage = theme.image.defaultImage;
const secondaryColor = theme.colors.secondaryColor;
const primaryColor = theme.colors.primaryColor;
const Profile = () => {
  const user = useSelector(state=>state.user.userDetails);
  const signOutUser = async () => {
    try {
      await signOut(auth);
      Alert.alert("Signout",'User signed out successfully');
      // Perform any additional actions like navigating to the login screen
    } catch (error) {
      Alert.alert("Error", error.messge);
    }
  };

  return (
    <View>
      <View>
        <View style={{ backgroundColor: primaryColor }}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Profile</Text>
            <TouchableOpacity disabled={true} onPress={''} style={styles.rightButton}>
              <Text style={{ padding: 8, fontSize: responsiveFontSize(2) }}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={{ alignSelf: 'center', alignItems:'center', justifyContent:'center',gap:15}}>
            <View>
            <Image style={styles.profileIcon} source={{ uri: defaultImage }} />
            </View>
            <TouchableOpacity style={styles.button}>
              <Text style={{ padding: 8, fontSize: responsiveFontSize(2) }}>Edit Image</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{alignItems:'center',marginVertical:responsiveHeight(3)}}>
      <Text style={{fontSize:responsiveFontSize(4),fontWeight:'bold'}}>User Details</Text>
      <CustomText icon='short-text' value={user.name} editable={false} />
      <CustomText icon='email' value={user.email} editable={false} />
      <CustomText icon='password' value="PASSWORD." secureTextEntry={true} editable={false} />
      <View style={{flexDirection:'row',gap:20,marginVertical:20}}>
        <TouchableOpacity disabled={true} style={[styles.button, {backgroundColor:'gray',opacity:0.5} ]} >
          <Text style={{ padding: 8, fontSize: responsiveFontSize(2) }} >Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>signOutUser()} style={[styles.button, { backgroundColor:primaryColor }]} >
          <Text style={{ color:'white', padding: 8, fontSize: responsiveFontSize(2) }} >SignOut</Text>
        </TouchableOpacity>
      </View>
      </View>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  profileIcon: {
    height: responsiveHeight(10),
    width: responsiveHeight(10),
    borderRadius: responsiveHeight(10) / 2,
    borderWidth: 2,
    // borderColor:secondaryColor,
  },
  button: {
    backgroundColor: secondaryColor,
    borderRadius: 12,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:20
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    backgroundColor: primaryColor, 
    paddingHorizontal: responsiveWidth(4), 
    paddingVertical: responsiveHeight(2) 
  },
  headerText:{
    fontSize: responsiveFontSize(4), 
    color: 'white', 
    fontWeight: 'bold' 
  },
  rightButton:{ 
    opacity: 0.6, 
    backgroundColor: 'white', 
    padding: 8, 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderRadius: 10 
  }
})