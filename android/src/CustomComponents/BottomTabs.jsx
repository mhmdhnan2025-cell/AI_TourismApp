
import { View, Text } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import AR from '../Screens/AR';
import Explore from '../Screens/Explore';
import MapScreen from '../Screens/MapScreen';
import ExplorerStack from '../CustomComponents/ExplorerStack';
import BookTour from '../Screens/BookTour'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Tab = createBottomTabNavigator();

const getTabBarIcon = (routeName, focused, color, size) => {
    let iconName;

    if (routeName === 'Explorer') iconName = focused ? 'compass' : 'compass-outline';
    else if (routeName === 'Book') iconName = focused ? 'cart' : 'cart-outline';
    else if (routeName === 'Map') iconName = focused ? 'map' : 'map-outline';
    else if (routeName === 'AR') iconName = focused ? 'scan-circle' : 'scan-circle-outline';
    else if (routeName === 'Profile') iconName = focused ? 'person' : 'person-outline';

    return <Icon name={iconName} size={size} color={color} />;
};

const BottomTabs = ({ route }) => {
    const user = route?.params?.user;
    return (
        <Tab.Navigator
            screenOptions={({ route }) => {
                const routeName = getFocusedRouteNameFromRoute(route) ?? route.name;

                let hideTab = false;

                // 🔹 Hide tab in all HomeStack screens except main Home
                if (route.name === 'Explore' && routeName !== 'Explore') {
                    hideTab = true;
                }



                // 🔹 Hide tab on MapScreen
                if (routeName === 'Map') {
                    hideTab = true;
                }

                return {
                    headerShown: false,
                    tabBarIcon: ({ focused, color, size }) =>
                        getTabBarIcon(route.name, focused, color, size),
                    tabBarActiveTintColor: '#0B6B3A',
                    tabBarInactiveTintColor: 'gray',
                    tabBarStyle: hideTab
                        ? { display: 'none' }
                        : {
                            backgroundColor: '#FFFFFF',
                            paddingBottom: hp('3%'),
                            height: hp('8%'),
                        },
                };
            }}
        >
            <Tab.Screen name='Explorer' component={ExplorerStack} />
            <Tab.Screen name="Book" component={BookTour} />
            <Tab.Screen name='Map' component={MapScreen} />
            <Tab.Screen name='AR' component={AR} />
            {/* <Tab.Screen name='Profile' component={ProfileScreen} initialParams={{ user }} /> */}
        </Tab.Navigator>
    );
};

export default BottomTabs;
