import { Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { theme } from '../constants/theme'
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

// Imports the theme colors
const primaryColor = theme.colors.primaryColor
const secondaryColor = theme.colors.secondaryColor

const Home = () => {
    return (
        <SafeAreaView>
            <StatusBar backgroundColor={primaryColor} />
            <View style={styles.topContainer}>
                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between',padding:10}}>
                    <View style={{flexDirection:'row',alignItems:'center',marginVertical:responsiveHeight(0.4)}}>
                    <View style={styles.imageRing}>
                        <Image style={styles.profileIcon} source={{ uri: 'https://picsum.photos/200' }} />
                    </View>
                    <View>
                        <Text style={{color:'#EDEADE',fontSize:responsiveFontSize(1.9),fontWeight:'500'}}>Welcome</Text>
                        <Text style={{color:secondaryColor,fontSize:responsiveFontSize(2.2), fontWeight:'bold'}}>UserName</Text>
                    </View>
                    </View>
                    <TouchableOpacity style={{backgroundColor:'rgba(255,255,255,0.4)',marginHorizontal:responsiveWidth(3),borderRadius:8}}>
                        <MaterialIcon name='add' size={responsiveFontSize(5)} color={secondaryColor} />
                    </TouchableOpacity>
                </View>

                <Text style={{fontSize:responsiveFontSize(5), color:secondaryColor, alignSelf:'center', marginTop:responsiveHeight(2), fontWeight:'bold'}}>Tasks</Text>
                <Text style={{fontSize:responsiveFontSize(6), color:secondaryColor, alignSelf:'center'}} >10/30</Text>
            </View>

            <View>

            </View>
        </SafeAreaView>
    )
}

export default Home

const styles = StyleSheet.create({
    topContainer: {
        // height:responsiveHeight(50),
        backgroundColor: primaryColor
    },
    profileIcon: {
        height: responsiveHeight(5),
        width: responsiveHeight(5),
        borderRadius: responsiveHeight(7) / 2,
        borderWidth: 2,
        // borderColor:secondaryColor,
    },
    imageRing: {
        height: responsiveHeight(6),
        width: responsiveHeight(6),
        borderRadius: responsiveHeight(8) / 2,
        borderColor: secondaryColor,
        borderWidth:3,
        alignItems:'center',
        justifyContent:'center',
        marginHorizontal:responsiveHeight(1)
    }
})