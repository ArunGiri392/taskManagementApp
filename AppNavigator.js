import 'react-native-gesture-handler';
import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from './Screens/Login';
import SignUp from './Screens/SignUp';
const AppNavigator = () => {
    const Stack = createStackNavigator();
  return (
    <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen
                name='Login'
                component={Login}
                options={{
                    headerShown:false
                }}
            >
            </Stack.Screen>

            <Stack.Screen
                name='SignUp'
                component={SignUp}
                options={{
                    headerShown:false
                }}
            >
            </Stack.Screen>
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator