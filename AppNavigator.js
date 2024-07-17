import 'react-native-gesture-handler';
import { View, Text, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from './Screens/Login';
import SignUp from './Screens/SignUp';
import { auth, db } from './constants/firebaseConfig';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Screens/Home';
import LeaderBoard from './Screens/LeaderBoard';
import Profile from './Screens/Profile';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { useDispatch } from 'react-redux';
import { userLogin, userLogout } from './features/userSlice';
import { doc, getDoc } from 'firebase/firestore';
import AddTask from './Screens/AddTask';
const AppNavigator = () => {
    const Stack = createStackNavigator();
    const Tab = createBottomTabNavigator();
    const dispatch = useDispatch();
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        dispatch(userLogin(data));
                        setUser(data);
                        setLoading(false);
                    } else {
                        Alert.alert("Error",'User not found on the server');
                    }
                } catch (error) {
                    Alert.alert("Error",error.message);
                }
            } else {
                setUser(null);
                setLoading(false);
                dispatch(userLogout());
            }
        });

        return () => unsubscribe();
    }, [dispatch]);

    const LoggedInTabs = () => {
        return (
            <>
            
                <Tab.Navigator
                    screenOptions={{
                        tabBarLabelStyle: {
                            fontSize: 15,
                            margin: 0
                        },
                        tabBarStyle: {
                            height: '8%',
                        },
                        tabBarItemStyle: {
                            margin: 6
                        },
                        headerShown: false

                    }}
                >
                    
                    <Tab.Screen
                        name='Home'
                        component={Home}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <MaterialIcon name='home' color={color} size={30} />
                            ),
                        }}
                    >
                    </Tab.Screen>
                    <Tab.Screen
                        name='LeaderBoard'
                        component={LeaderBoard}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <MaterialIcon name='leaderboard' color={color} size={30} />
                            ),
                            tabBarLabel: 'Leaderboard'
                        }}
                    >
                    </Tab.Screen>
                    <Tab.Screen
                        name='Profile'
                        component={Profile}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <MaterialIcon name='settings' color={color} size={30} />
                            ),
                            tabBarLabel: 'Settings'
                        }}
                    >
                    </Tab.Screen>

                </Tab.Navigator>

                
            </>
        )
    }

    const LoggedOutStack = () => {
        return (

            <Stack.Navigator>
                <Stack.Screen
                    name='Login'
                    component={Login}
                    options={{
                        headerShown: false
                    }}
                >
                </Stack.Screen>

                <Stack.Screen
                    name='SignUp'
                    component={SignUp}
                    options={{
                        headerShown: false
                    }}
                >
                </Stack.Screen>

            </Stack.Navigator>

        )
    }

    const ExtraStack = ()=>{
        return(
            <Stack.Navigator screenOptions={{headerShown:false}}>
                <Stack.Screen name='LoggedInTabs' component={LoggedInTabs} ></Stack.Screen>
                <Stack.Screen name='AddTask' component={AddTask} options={{
                    presentation:'modal',gestureEnabled:true,
                    ...TransitionPresets.ModalSlideFromBottomIOS,
                    
                }} ></Stack.Screen>
            </Stack.Navigator>
        )
    }

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <NavigationContainer>
            {user && !loading ? <ExtraStack /> : <LoggedOutStack />}

        </NavigationContainer>
    )
}

export default AppNavigator