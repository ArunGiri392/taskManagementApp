import { Alert, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import CustomText from '../components/CustomText'
import { theme } from '../constants/theme'
import { useNavigation } from '@react-navigation/native'
import { Formik } from 'formik';
import { object, string, number, date, InferType, ref } from 'yup';
import { auth, db, firebase } from '../constants/firebaseConfig'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import LoadingOverlay from '../components/LoadingOverlay'

// our color theme
const color = theme.colors.primaryColor
// Validation schema for the form validation.
let userSchema = object({
    name: string().required('Name is required'),
    email: string().email().required('Email is required'),
    password: string().required('Password is required'),
    confirmPassword: string()
     .oneOf([ref('password'), null], 'Passwords must match')
  });

const SignUp = () => {
    const navigation = useNavigation();
    const [loading,setLoading] = useState(false);

    const handleSignUp = async(email,password,name) => {
        try {
          setLoading(true);
         await createUserWithEmailAndPassword(auth,email,password)
         const user = auth.currentUser;
         if(user){
            await setDoc(doc(db,'users',user.uid),{
                email:email,
                name:name,
                uid:user.uid,
                
            })
         }
         setTimeout(()=>{
           setLoading(false);
          },3000)

        } catch (error) {
          setLoading(false);
          Alert.alert('Error', error.message);
        }
      };

  return (
    <SafeAreaView style={[styles.AndroidSafeArea,styles.container]}>
            <Text style={{ color, fontSize: 35, fontWeight: 'bold', paddingBottom: '7%' }}>Create Account</Text>
            <Formik
     initialValues={{ email: '',name:'',password:'',confirmPassword:'' }}
     onSubmit={values => handleSignUp(values.email,values.password,values.name)}
     validationSchema={userSchema}
   >
     {({ handleChange, handleBlur, handleSubmit, values,errors,isValid,touched }) => (
       <View style={{width:'100%',alignItems:'center'}}>
         <CustomText icon='short-text' placeholder='Enter Name' value={values.name} onChangeText={handleChange('name')} onBlur={handleBlur('name')} />
            {touched.name && errors.name ? <Text style={{color:'red',width:'85%'}}>{errors.name}</Text> : ''}
            <CustomText icon='email' placeholder='Enter Email' onBlur={handleBlur('email')} value={values.email} onChangeText={handleChange('email')} keyboardType='email-address' />
            {touched.email && errors.email ? <Text style={{color:'red',width:'85%'}}>{errors.email}</Text> : ''}
            <CustomText icon='password' placeholder='Enter Password' value={values.password} onChangeText={handleChange('password')} secureTextEntry={true} />
            {touched.password && errors.password ? <Text style={{color:'red',width:'85%'}}>{errors.password}</Text> : ''}
            <CustomText icon='password' placeholder='Confirm Password' value={values.confirmPassword} onChangeText={handleChange('confirmPassword')} onBlur={handleBlur('confirmPassword')} secureTextEntry={true} />
            {touched.confirmPassword && errors.confirmPassword ? <Text style={{color:'red',width:'85%'}}>{errors.confirmPassword}</Text> : ''}
            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                <Text style={styles.buttonText}>SignUp</Text>
            </TouchableOpacity>
       </View>
     )}
   </Formik>
            
            <View style={{ flexDirection: 'row', marginTop: "12%" }}>
                <Text style={{ fontSize: 17, color: 'gray' }}>Already have an account? </Text>
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                    <Text style={{ fontSize: 17, color, textDecorationLine: 'underline' }}>Login</Text>
                </TouchableOpacity>

            </View>
            <LoadingOverlay loading={loading} message="Loading..." />
    </SafeAreaView>
  )
}

export default SignUp

const styles = StyleSheet.create({
    AndroidSafeArea: {
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: color,
        padding: '4%',
        width: "40%",
        marginVertical: "3%",
        alignItems: 'center',
        borderRadius: 20
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: "bold"
    }
})