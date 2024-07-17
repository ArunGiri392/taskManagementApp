import { Alert, Button, FlatList, Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { theme } from '../constants/theme'
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../constants/firebaseConfig';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { deleteTask, updateTask } from '../features/crud';
import { updateTasks } from '../features/taskSlice';

import { checkAndScheduleNotification, requestPermissions } from '../features/NotificationHandler';

// Imports the theme colors and default Image
const primaryColor = theme.colors.primaryColor
const secondaryColor = theme.colors.secondaryColor
const defaultImage = theme.image.defaultImage

const Home = () => {
    // Selectors
    const user = useSelector(state => state.user.userDetails);
    const isLoggedIn = useSelector(state => state.user.isLoggedIn);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const tasks = useSelector(state => state.task.tasks);
    const completedTasks = tasks.filter(task => task.isCompleted).length;
    const totalTasks = tasks.length;
    // States
    const [refresh,setRefresh] = useState(true) ;


    // Call the initial Data
    useEffect(() => {
        if (!user) {
            return;
        }

    const fetchTasks = (userId) => {
            try {
                const tasksCollection = collection(db, 'tasks');
                const q = query(tasksCollection, where('uid', '==', userId));

                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const tasks = [];
                    querySnapshot.forEach((doc) => {
                        tasks.push({ ...doc.data(), id: doc.id });
                    });
                    dispatch(updateTasks(tasks));
                });
    return unsubscribe; // Return the unsubscribe function to clean up the listener when necessary
            } catch (error) {
                Alert.alert("Error", error.message);
            }
        };

        const unsubscribe = fetchTasks(user.uid);

        // Cleanup the listener on component unmount
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [user, dispatch, refresh]);

    // handle notification scheduling  
    useEffect(() => {
        requestPermissions();
        checkAndScheduleNotification();
    }, []);

    // format timestamp to human readable date
    const format = (timeStamp) => {
        var ts = new Date(timeStamp);
        return ts.toLocaleString()
    }

    // task item to render
    const items = ({ item }) => (
        <View style={{ marginBottom: 15, width: '90%', backgroundColor: 'white', alignSelf: 'center', marginVertical: responsiveHeight(1), borderWidth: 1.5, borderColor: primaryColor, borderRadius: 15, padding: responsiveHeight(1), overflow: 'hidden' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: responsiveHeight(1) }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={[styles.profileIcon, { width: responsiveHeight(6), height: responsiveHeight(6) }]} source={{ uri: item.imageUrl ? item.imageUrl : defaultImage }} />
                    <View style={{ width: '70%', paddingHorizontal: responsiveWidth(2) }}>
                        <Text style={[{ fontSize: responsiveFontSize(2), color: 'black', fontWeight: 'bold' }, item.isCompleted && { textDecorationLine: 'line-through' }]}>{item.title}</Text>
                        <Text style={{ color: 'gray' }}>{format(item.createdAt)}</Text>
                    </View>
                </View>
                <View>
                    <BouncyCheckbox onPress={(isChecked) => (updateTask(item.taskId, { ...item, isCompleted: isChecked }))} bounceEffect={1} fillColor="green" isChecked={item?.isCompleted} />
                </View>

            </View>
            <View>
                <Text style={{ fontSize: responsiveFontSize(1.9), margin: 3, marginHorizontal: 8, color: 'rgba(0,0,0,50)', fontWeight: 'semibold' }}>{item.description}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.navigate('AddTask', { edit: true, item: item })} style={{ flexDirection: "row", alignItems: 'center', gap: 5 }}>
                    <MaterialIcon name='edit' color={primaryColor} size={responsiveFontSize(3)} />
                    <Text style={{ fontSize: responsiveFontSize(2.8), color: primaryColor }}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteTask(item.taskId)} style={{ flexDirection: "row", alignItems: 'center', gap: 5 }}>
                    <MaterialIcon name='delete' color={'red'} size={responsiveFontSize(3)} />
                    <Text style={{ fontSize: responsiveFontSize(2.8), color: 'red' }}>Delete</Text>
                </TouchableOpacity>
            </View>
        </View>

    )
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar backgroundColor={primaryColor} />
            <View style={styles.topContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: responsiveHeight(0.4) }}>
                        <View style={styles.imageRing}>
                            <Image style={styles.profileIcon} source={{ uri: defaultImage }} />
                        </View>
                        <View>
                            <Text style={{ color: '#EDEADE', fontSize: responsiveFontSize(1.9), fontWeight: '500' }}>Welcome</Text>
                            <Text style={{ color: secondaryColor, fontSize: responsiveFontSize(2.2), fontWeight: 'bold' }}>{isLoggedIn ? user.name : 'Loading...'}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:'row'}}>
                    <TouchableOpacity onPress={() => navigation.navigate('AddTask', { edit: false, item: null })} style={{ backgroundColor: 'rgba(255,255,255,0.4)', marginHorizontal: responsiveWidth(3), borderRadius: 8 }}>
                        <MaterialIcon name='add' size={responsiveFontSize(5)} color={secondaryColor} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setRefresh(!refresh)} style={{ backgroundColor: 'rgba(255,255,255,0.4)', marginHorizontal: responsiveWidth(3), borderRadius: 8 }}>
                        <MaterialIcon name='refresh' size={responsiveFontSize(5)} color={secondaryColor} />
                    </TouchableOpacity>
                    </View>
                </View>
                <Text style={{ fontSize: responsiveFontSize(5), color: secondaryColor, alignSelf: 'center', marginTop: responsiveHeight(2), fontWeight: 'bold' }}>Tasks</Text>
                <Text style={{ fontSize: responsiveFontSize(6), color: secondaryColor, alignSelf: 'center' }} >{`${completedTasks}/${totalTasks}`}</Text>
            </View>

            <View style={{marginBottom:'50%'}}>
                <FlatList
                    data={tasks}
                    keyExtractor={(item) => item.taskId}
                    renderItem={items}
                    contentContainerStyle={{ paddingVertical: 20, paddingBottom: '20%' }}
                >

                </FlatList>

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
        borderWidth: 3,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: responsiveHeight(1)
    }
})