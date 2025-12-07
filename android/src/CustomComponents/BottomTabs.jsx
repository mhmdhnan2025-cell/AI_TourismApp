import { View, Text } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
 import AR from '../Screens/AR';
 import VR from '../Screens/Explore';
 import MapScreen from '../Screens/MapScreen';
 import ProfileScreen from '../Screens/ProfileScreen';
 import ExplorerStack from '../CustomComponents/ExplorerStack';
const Tab = createBottomTabNavigator();

const getTabBarIcon = (routeName, focused, color, size) => {
    let iconName;
    
    // --- ICON MAPPING FOR NEW TABS ---
    if (routeName === 'Explore') {
        iconName = focused ? 'compass' : 'compass-outline';
    } else if (routeName === 'Map') {
        iconName = focused ? 'map' : 'map-outline';
    } else if (routeName === 'AR') {
        iconName = focused ? 'scan-circle' : 'scan-circle-outline'; // Using scan-circle for 'AR with scan'
    } else if (routeName === 'Profile') {
        iconName = focused ? 'person' : 'person-outline';
    }
    
    return <Icon name={iconName} size={size} color={color} />;
};

const BottomTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) =>
                    getTabBarIcon(route.name, focused, color, size),
                tabBarActiveTintColor: '#E65100',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    backgroundColor: '#FFFFFF',
                    paddingBottom: hp('3%'),
                    height: hp('8%'),
                },
            })}
        >
            {/* --- SCREEN DEFINITIONS FOR NEW TABS --- */}
            <Tab.Screen name='Explore' component={ExplorerStack} />
            <Tab.Screen name='Map' component={MapScreen} />
            <Tab.Screen name='AR' component={AR} />
            <Tab.Screen name='Profile' component={ProfileScreen} />
        </Tab.Navigator>
    );
};

export default BottomTabs;