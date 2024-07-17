import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
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
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../constants/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import LoadingOverlay from '../components/LoadingOverlay';

const color = theme.colors.primaryColor
let userSchema = object({
  title: string().required('Title is required'),
  description: string().required('Description is required'),
});
const AddTask = ({ route }) => {
  const { edit, item } = route.params;
  const user = useSelector(state => state.user.userDetails)
  const uid = user.uid
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [image, setImage] = useState(item?.imageUrl ? item.imageUrl : 'https://picsum.photos/200');

  const addTask = async (userId, task) => {
    setLoading(true)
    try {
      const taskId = uuidv7(); // Generate a unique ID for the task
      const taskWithId = { ...task, taskId, uid: uid, createdAt: new Date().toISOString(), isCompleted: false, imageUrl: image, name: user.name }; // Include the generated taskId
      const taskDoc = doc(db, 'tasks', taskId);
      await setDoc(taskDoc, taskWithId);
      setLoading(false);
      Alert.alert("Success", 'Task Added Succesfully.')
      navigation.goBack();
    }
      catch (e) {
      setLoading(false);
      Alert.alert("Error", e.message);
    }
  }

  const handleUpdate = async (taskId, updatedTask, previousTask) => {
    setLoading(true);
    const update = { ...previousTask, title: updatedTask.title, description: updatedTask.description, imageUrl: image, createdAt: new Date().toISOString() }
    const result = await updateTask(taskId, update);
    if (result) {
      setLoading(false);
      navigation.goBack();
      Alert.alert("Success", 'Task updated successfully');
    }
    else {
      setLoading(false);
      Alert.alert("Error", 'Unable to update task at the moment, Please try again later.');
    }
  }
  // Add Images to task
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      uploadImage(result.assets[0].uri)
    }
  };

  const uploadImage = async (uri) => {
    setLoading(true);
    const fileName = uri.split('/').pop();
    const storageRef = ref(storage, `images/${fileName}`);

    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      setLoading(false);
      setImage(downloadURL);
      // Alert.alert('Upload successful!', `Image URL: ${downloadURL}`);
    } catch (error) {
      setLoading(false);

      Alert.alert('Upload failed: ', error.message);
    }
  };

  return (
    <View>
      <Text style={{ fontSize: responsiveFontSize(4), textAlign: 'center', marginVertical: responsiveHeight(3) }}>{edit && item ? 'Edit Task' : 'Add New Task'}</Text>
      <Formik
        initialValues={edit && item ? { title: item.title, description: item.description } : { title: '', description: '' }}
        onSubmit={values => { edit && item ? handleUpdate(item.taskId, values, item) : addTask(uid, values) }}
        validationSchema={userSchema}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched }) => (
          <View style={{ width: '100%', alignItems: 'center' }}>
            <CustomText icon='title' placeholder='Enter title' value={values.title} onChangeText={handleChange('title')} secureTextEntry={false} onBlur={handleBlur('title')} />
            {touched.title && errors.title && <Text style={{ color: 'red', width: '85%' }} >{errors.title}</Text>}
            <CustomText icon='description' placeholder='Enter description' value={values.description} onChangeText={handleChange('description')} onBlur={handleBlur('description')} />
            {touched.description && errors.description && <Text style={{ color: 'red', width: '85%' }} >{errors.description}</Text>}
            {/* { isValid && <Button onPress={handleSubmit} title="Submit" />} */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%' }}>
              <Image style={{ width: responsiveHeight(6), height: responsiveHeight(6) }} source={{ uri: image }} />
              <TouchableOpacity onPress={pickImage} style={styles.button}>
                <Text style={styles.buttonText}>Add Image</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
              <Text style={styles.buttonText}>{edit && item ? 'Edit Task' : 'Add Task'}</Text>
            </TouchableOpacity>

          </View>

        )}

      </Formik>
      <LoadingOverlay loading={loading} message="Loading..." />
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