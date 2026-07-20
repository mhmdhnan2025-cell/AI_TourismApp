import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Login';
import SignUp from './SignUp';
import Onboarding from '../Screens/Onboarding';
import BottomTabs from '../CustomComponents/BottomTabs';
import AdminNavigation from "../Screens/AdminNavigation"
import ProfileScreen from './ProfileScreen';
import App from './AR';
import BookingScreen from './BookingScreen';
const StackNavigation = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="BottomTabs" component={BottomTabs} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="AdminNavigation" component={AdminNavigation} />
      <Stack.Screen name='AR' component={App} />
      <Stack.Screen name='BookingScreen' component={BookingScreen} />
    </Stack.Navigator>
  );
};

export default StackNavigation;