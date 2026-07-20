import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API = "http://192.168.100.178:5000";

const BookingsScreen = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            const res = await fetch(`${API}/bookings`);
            const data = await res.json();
            console.log("Bookings API response:", data); // 🔥 check this to confirm fields
            setBookings(data);
        } catch (err) {
            console.log(err);
            Alert.alert("Error", "Failed to load bookings");
        }
    };

    const renderBookingCard = ({ item }) => (
        <View style={styles.card}>
            {item.payment_proof && <Image source={{ uri: item.payment_proof }} style={styles.cardImage} />}
            <Text style={styles.tourTitle}>{item.tour_name || "No Title"}</Text>
            <Text style={styles.userName}>Booked by: {item.name || "Unknown"}</Text>
            <Text>Phone: {item.phone || "-"}</Text>
            <Text>Members: {item.members || 0}</Text>
            <Text>Price Paid: Rs {item.price || 0}</Text>
            <Text>Date: {item.date || "-"}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={bookings}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderBookingCard}
                contentContainerStyle={{ paddingBottom: 100 }}
            />
        </SafeAreaView>
    );
};

export default BookingsScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f4f4f4" },
    card: { backgroundColor: "white", margin: 10, padding: 15, borderRadius: 12, elevation: 3 },
    cardImage: { width: "100%", height: 150, borderRadius: 10, marginBottom: 8 },
    tourTitle: { fontSize: 18, fontWeight: "bold", color: '#000' },
    userName: { fontWeight: "600", color: "#555", marginBottom: 4 },
});