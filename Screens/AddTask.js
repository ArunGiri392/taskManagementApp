import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Formik } from 'formik'
import CustomText from '../components/CustomText'
import { object, string, number, date, InferType } from 'yup';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import { theme } from '../constants/theme';
import { collection, addDoc, doc, updateDoc, arrayUnion, serverTimestamp, setDoc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { db } from '../constants/firebaseConfig';
import { uuidv7 } from "uuidv7";
import { useNavigation, useRoute } from '@react-navigation/native';
import { updateTask } from '../features/crud';

const color = theme.colors.primaryColor
let userSchema = object({
  title: string().required('Title is required'),
  description: string().required('Description is required'),
});
const AddTask = ({route}) => {
  const {edit,item} = route.params;
  console.log(edit,item);
  const user = useSelector(state => state.user.userDetails)
  const uid = user.uid
  const [loading,setLoading] = useState(false);
  const navigation = useNavigation();
  
  
  const addTask = async (userId, task) => {
    setLoading(true)
    try {
      const taskId = uuidv7(); // Generate a unique ID for the task
      const taskWithId = { ...task, taskId,uid:uid,createdAt:new Date().toISOString()}; // Include the generated taskId
      const taskDoc = doc(db, 'tasks', taskId);
      await setDoc(taskDoc, taskWithId);
      setLoading(false);
      Alert.alert("Success",'Task Added Succesfully.')
      navigation.goBack();

      console.log("Document written with ID: ");
    } catch (e) {
      setLoading(false);
      Alert.alert("Error", e.message);
      console.error("Error adding document: ", e);
    }
  }

  const handleUpdate = async(taskId,updatedTask,previousTask)=>{
    setLoading(true);
    const update = {...previousTask, title:updatedTask.title,description:updatedTask.description, createdAt:new Date().toISOString()}
    const result = await updateTask(taskId,update);
    if(result){
        setLoading(false);
        navigation.goBack();
        Alert.alert("Success",'Task updated successfully');
    }
    else{
      setLoading(false);
        Alert.alert("Error",'Unable to update task at the moment, Please try again later.');
    }
  }

  {
   if(loading) return(
         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:'rgba(0,0,0,0.8)' }}>
             <ActivityIndicator size="large" color="#0000ff" />
             <Text>Loading...</Text>
         </View>
         );     
 
 }
 
  return (
    <View>
      <Text style={{ fontSize: responsiveFontSize(4), textAlign: 'center', marginVertical: responsiveHeight(3) }}>{edit && item?'Edit Task':'Add New Task'}</Text>
      <Formik
        initialValues={edit && item?{ title: item.title, description: item.description }:{ title:'', description:'' }}
        onSubmit={values => {edit && item? handleUpdate(item.taskId,values,item):addTask(uid,values)}}
        validationSchema={userSchema}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched }) => (
          <View style={{ width: '100%', alignItems: 'center' }}>
            <CustomText icon='title' placeholder='Enter title' value={values.title} onChangeText={handleChange('title')} secureTextEntry={false} onBlur={handleBlur('title')} />
            {touched.title && errors.title && <Text style={{ color: 'red', width: '85%' }} >{errors.title}</Text>}
            <CustomText icon='description' placeholder='Enter description' value={values.description} onChangeText={handleChange('description')} onBlur={handleBlur('description')} />
            {touched.description && errors.description && <Text style={{ color: 'red', width: '85%' }} >{errors.description}</Text>}
            {/* { isValid && <Button onPress={handleSubmit} title="Submit" />} */}
            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
              <Text style={styles.buttonText}>{edit && item?'Edit Task':'Add Task'}</Text>
            </TouchableOpacity>
          </View>

        )}

      </Formik>
      
    </View>
  )
}

export default AddTask

const styles = StyleSheet.create({
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