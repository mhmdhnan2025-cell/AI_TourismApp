import { View, Text } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Onboarding from '../AR_VR/android/src/Screens/Onboarding';
import StackNavigation from '../AR_VR/android/src/Screens/StackNavigation';
const App = () => {
  return (
     <NavigationContainer>
    {/* <View style={{flex:1}}> */}
       <StackNavigation/>
    {/* </View> */}
    </NavigationContainer>
  );
};

export default App;