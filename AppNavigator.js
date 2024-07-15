import 'react-native-gesture-handler';
import { View, Text, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from './Screens/Login';
import SignUp from './Screens/SignUp';
import { auth } from './constants/firebaseConfig';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './Screens/Home';
import LeaderBoard from './Screens/LeaderBoard';
import Profile from './Screens/Profile';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
const AppNavigator = () => {
    const Stack = createStackNavigator();
    const Tab = createBottomTabNavigator();

    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                setUser(user);
                setLoading(false);
            } else {
                setUser();
                setLoading(false);
                Alert.alert("Error","Error while logging you in, Please try later.")
            }
            return () => unsubscribe();
        });

        // return () => unsubscribe();
    }, []);

    const LoggedInTabs = () => {
        return (
            <Tab.Navigator
            screenOptions={{
                tabBarLabelStyle:{
                    fontSize:15,
                    margin:0
                },
                tabBarStyle:{
                    height:'8%',
                },
                tabBarItemStyle:{
                    margin:6
                },
                headerShown:false
                
            }}
            >
                <Tab.Screen
                    name='Home'
                    component={Home}
                    options={{
                        tabBarIcon:({color,size})=>(
                            <MaterialIcon name='home' color={color} size={30} />
                        ),
                    }}
                >
                </Tab.Screen>
                <Tab.Screen
                    name='LeaderBoard'
                    component={LeaderBoard}
                    options={{
                        tabBarIcon:({color,size})=>(
                            <MaterialIcon name='leaderboard' color={color} size={30} />
                        ),
                        tabBarLabel:'Leaderboard'
                    }}
                >
                </Tab.Screen>
                <Tab.Screen
                    name='Profile'
                    component={Profile}
                    options={{
                        tabBarIcon:({color,size})=>(
                            <MaterialIcon name='settings' color={color} size={30} />
                        ),
                        tabBarLabel:'Settings'
                    }}
                >
                </Tab.Screen>
            </Tab.Navigator>
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
            {user && !loading? <LoggedInTabs /> : <LoggedOutStack />}

        </NavigationContainer>
    )
}

export default AppNavigator