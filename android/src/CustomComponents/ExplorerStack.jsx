import { View, Text } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Explore from '../Screens/Explore';
import BookingScreen from '../Screens/BookingScreen';
const ExplorerStack = () => {
    const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
    >
         <Stack.Screen name="Explore" component={Explore}/>
        <Stack.Screen name="BookingScreen" component={BookingScreen}/>
       
    </Stack.Navigator>
  );
};

export default ExplorerStack;