// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import AsyncStorage, {ReactNativeAsyncStorage} from '@react-native-async-storage/async-storage'
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyDvomoEd6SuTzO_jrOADy7yb5V9ihGOQ94",
  authDomain: "taskmanagerapp-ab26c.firebaseapp.com",
  projectId: "taskmanagerapp-ab26c",
  storageBucket: "taskmanagerapp-ab26c.appspot.com",
  messagingSenderId: "200734488443",
  appId: "1:200734488443:web:f12281b65d54cf1ca56fde"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {persistence: getReactNativePersistence(AsyncStorage)});
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app