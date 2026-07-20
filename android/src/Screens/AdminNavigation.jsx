import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";


import AdminDashboard from './AdminDashboard'
import AdminBookings from './AdminBookings'

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="AddTours" component={AdminDashboard} />
            <Tab.Screen name="Bookings" component={AdminBookings} />
        </Tab.Navigator>
    );
}