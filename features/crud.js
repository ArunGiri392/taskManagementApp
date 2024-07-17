import { Alert } from 'react-native';
import { doc, updateDoc, deleteDoc, setDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../constants/firebaseConfig';
import { uuidv7 } from 'uuidv7';
import { useDispatch } from 'react-redux';
import { updateTasks } from './taskSlice';


export const updateTask = async (taskId, updatedTask) => {
    const taskDoc = doc(db, 'tasks', taskId);
    try {
        await updateDoc(taskDoc, updatedTask);
        return true;
    } catch (error) {
        Alert.alert("Error",'Error while updating task, please try later.')
        return false
    }
};

// export const deleteTask = async (taskId) => {
//     const taskDoc = doc(db, 'tasks', taskId);
//     await deleteDoc(taskDoc);
// };

export const deleteTask = async (taskId) => {
    const taskDoc = doc(db, 'tasks', taskId);
    try {
        await deleteDoc(taskDoc);
    } catch (error) {
        Alert.alert("Error",'Error while deleting task, please try later.')
    }
};

export const addTask = async (userId, task) => {
    try {
        const taskId = uuidv7(); // Generate a unique ID for the task
        const taskWithId = { ...task, taskId, userId: userId, createdAt: new Date().toISOString() }; // Include the generated taskId
        const taskDoc = doc(db, 'tasks', taskId);
        await setDoc(taskDoc, taskWithId);
        return true;

    } catch (e) {
        Alert.alert("Error adding document: ", e.message);
        return false;
    }
}

export const fetchTasks = async (userId) => {
    return new Promise((resolve, reject) => {
        try {
            const tasksCollection = collection(db, 'tasks');
            const q = query(tasksCollection, where('uid', '==', userId));
            onSnapshot(q, (querySnapshot) => {
                const tasks = [];
                querySnapshot.forEach((doc) => {
                    tasks.push({ ...doc.data(), id: doc.id });
                });
                resolve(tasks);
            });
        } catch (error) {
            Alert.alert("Error", error.message);
            reject(null);
        }
    }
    )
};