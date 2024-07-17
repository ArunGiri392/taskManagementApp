import { Alert, Button, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import CustomText from '../components/CustomText';
import { theme } from '../constants/theme';
import { object, string, number, date, InferType } from 'yup';
import { Formik } from 'formik';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../constants/firebaseConfig';
import LoadingOverlay from '../components/LoadingOverlay';

const color = theme.colors.primaryColor
let userSchema = object({
    email: string().email().required('Email is required'),
    password: string().required('Password is required'),
});
const Login = () => {
    const navigation = useNavigation();
    const [loading,setLoading] = useState(false);

    const handleLogin = async(email,password) =>{
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth,email,password)
            Alert.alert('Success','logged in successfully');
            setTimeout(()=>{
                setLoading(false);
            },3000)  
        } catch (error) {
            setLoading(false);
            Alert.alert('Error',error.message)
        }
        
    }
    return (

        <SafeAreaView style={[styles.AndroidSafeArea, styles.container]}>
            <Text style={{ color, fontSize: 40, fontWeight: 'bold', paddingBottom: '7%' }}>Task Manager</Text>
            <Formik
                initialValues={{ email: '', password: '' }}
                onSubmit={values => handleLogin(values.email,values.password)}
                validationSchema={userSchema}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched }) => (
                    <View style={{width:'100%',alignItems:'center'}}>
                        <CustomText icon='email' placeholder='Enter Email' value={values.email} onChangeText={handleChange('email')} secureTextEntry={false} onBlur={handleBlur('email')} keyboardType='email-address' />
                        {touched.email && errors.email && <Text style={{color:'red',width:'85%'}} >{errors.email}</Text>}
                        <CustomText icon='password' placeholder='Enter Password' value={values.password} onChangeText={handleChange('password')} secureTextEntry={true} onBlur={handleBlur('password')} />
                        {touched.password && errors.password && <Text style={{color:'red',width:'85%'}} >{errors.password}</Text>}
                        {/* { isValid && <Button onPress={handleSubmit} title="Submit" />} */}
                        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>
                    </View>

                )}

            </Formik>


            <View style={{ flexDirection: 'row', marginTop: "12%" }}>
                <Text style={{ fontSize: 17, color: 'gray' }}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <Text style={{ fontSize: 17, color, textDecorationLine: 'underline' }}>SignUp</Text>
                </TouchableOpacity>

            </View>
            <LoadingOverlay loading={loading} message="Loading..." />
        </SafeAreaView>

    )
}

export default Login

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