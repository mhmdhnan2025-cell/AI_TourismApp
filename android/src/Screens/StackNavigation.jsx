import { View, Text } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Login';
import SignUp from './SignUp';
import Onboarding from '../Screens/Onboarding';
import CameraScreen from '../Screens/CameraScreen';
import DetailsScreen from '../Screens/DetailsScreen';
import BottomTabs from '../CustomComponents/BottomTabs';
const StackNavigation = () => {
    const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
    >
         <Stack.Screen name="Onboarding" component={Onboarding}/>
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="SignUp" component={SignUp}/>
        <Stack.Screen name="BottomTabs" component={BottomTabs}/>
        <Stack.Screen name='CameraScreen' component={CameraScreen}/>
        <Stack.Screen name='DetailsScreen' component={DetailsScreen}/>
    </Stack.Navigator>
  );
};

export default StackNavigation;