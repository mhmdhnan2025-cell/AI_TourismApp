import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { launchImageLibrary } from "react-native-image-picker";
import GreenGradient from "../CustomComponents/GreenGradient";
import Icon from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");

export default function App({ route }) {
  const [imageUri, setImageUri] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedCards, setSavedCards] = useState([]);
  const [expandedCard, setExpandedCard] = useState(null);

  const location = route?.params?.location;

  useEffect(() => {
    loadSavedCards();
    if (location?.name) fetchFromAi(location.name);
  }, [location]);

  const fetchFromAi = async (placeName) => {
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("http://192.168.100.178:8002/text-process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `You are a tourist guide. Give short info or history about ${placeName}`,
        }),
      });

      const data = await res.json();
      setResult(data.result);
    } catch (error) {
      console.log("Error:", error);
      setResult("Network error");
    } finally {
      setLoading(false);
    }
  };

  const loadSavedCards = async () => {
    try {
      const data = await AsyncStorage.getItem("savedCards");
      if (data) setSavedCards(JSON.parse(data));
    } catch (err) {
      console.log(err);
    }
  };

  const saveCard = async () => {
    if (!result) return;
    const newCard = { id: Date.now(), imageUri, result };
    const updatedCards = [newCard, ...savedCards];
    setSavedCards(updatedCards);
    await AsyncStorage.setItem("savedCards", JSON.stringify(updatedCards));
    setImageUri(null);
    setResult("");
  };

  const removeCard = async (id) => {
    const updated = savedCards.filter((c) => c.id !== id);
    setSavedCards(updated);
    await AsyncStorage.setItem("savedCards", JSON.stringify(updated));
  };

  const clearAll = async () => {
    setSavedCards([]);
    await AsyncStorage.removeItem("savedCards");
  };

  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: "photo" });
    if (result.didCancel || !result.assets) return;

    const uri = result.assets[0].uri;
    setImageUri(uri);
    setLoading(true);

    const formData = new FormData();
    formData.append("image", {
      uri,
      type: result.assets[0].type || "image/jpeg",
      name: result.assets[0].fileName || "photo.jpg",
    });

    try {
      const res = await fetch("http://10.10.15.47:8002/process", {
        method: "POST",
        body: formData, // ✅ must be FormData
        headers: { "Content-Type": "multipart/form-data" }, // for Flask
      });

      const json = await res.json();
      setResult(json.result || json.error || "Unknown error");
    } catch (err) {
      setResult(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderSavedCard = ({ item }) => {
    const isExpanded = expandedCard === item.id;

    return (
      <TouchableOpacity
        style={[styles.savedCard, isExpanded && { paddingBottom: "50%" }]}
        onPress={() => setExpandedCard(isExpanded ? null : item.id)}
        activeOpacity={0.8}
      >
        {item.imageUri && (
          <Image source={{ uri: item.imageUri }} style={styles.savedCardImage} />
        )}
        <Text style={styles.savedCardText}>
          {isExpanded
            ? item.result
            : item.result.slice(0, 40) + (item.result.length > 40 ? "..." : "")}
        </Text>
        <TouchableOpacity
          style={styles.removeIcon}
          onPress={() => removeCard(item.id)}
        >
          <Icon name="close-circle" size={24} color="#ff4d4d" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <GreenGradient>
      <Text style={styles.title}>🌆 Landmark Scanner</Text>
      <Text style={styles.title}>
        {location ? `${location.name}` : "AR Explorer"}
      </Text>
      <TouchableOpacity style={styles.uploadButtonHuge} onPress={pickImage}>
        <Icon name="image-outline" size={80} color="#fff" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={{ justifyContent: "center", alignItems: "center" }}>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.imagePreview} />}
        {loading && <ActivityIndicator size="large" color="green" />}
        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.cardTitle}>Result:</Text>
            <Text style={styles.cardText}>{JSON.stringify(result)}</Text>
            <TouchableOpacity style={styles.saveButton} onPress={saveCard}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <Text style={styles.savedHeader}>Saved Scans</Text>
      <ScrollView contentContainerStyle={[styles.container, { paddingBottom: 140 }]} showsVerticalScrollIndicator={false}>
        {savedCards.length > 0 && (
          <>
            <FlatList
              data={savedCards}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 10 }}
              ItemSeparatorComponent={() => <View style={{ height: 15 }} />}
              renderItem={renderSavedCard}
            />
            <TouchableOpacity style={styles.clearAllButton} onPress={clearAll}>
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </GreenGradient>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "#fff", textAlign: "center" },
  uploadButtonHuge: { width: width * 0.8, height: height * 0.2, borderRadius: 20, backgroundColor: "#295b35", justifyContent: "center", alignSelf: "center", alignItems: "center", marginBottom: 20, elevation: 5 },
  imagePreview: { width: width - 70, height: width - 90, borderRadius: 15, marginBottom: 20 },
  resultCard: { width: width - 20, backgroundColor: "#fff8f0", padding: 20, borderRadius: 15, shadowColor: "#000", shadowOpacity: 0.15, shadowOffset: { width: 0, height: 5 }, shadowRadius: 10, elevation: 5, marginBottom: '100%' },
  cardTitle: { fontSize: 20, fontWeight: "bold", color: "#28a745", marginBottom: 10 },
  cardText: { fontSize: 16, color: "#333", marginBottom: 15 },
  saveButton: { backgroundColor: "#1a8f7a", paddingVertical: 12, borderRadius: 12 },
  saveText: { color: "#fff", fontWeight: "700", fontSize: 16, textAlign: "center" },
  savedHeader: { fontSize: 20, fontWeight: "bold", color: "#fff", alignSelf: "flex-start", marginVertical: 10, marginHorizontal: 20 },
  savedCard: { flexGrow: 1, width: "100%", minWidth: '100%', backgroundColor: "#fff", borderRadius: 12, padding: 10, shadowColor: "#000", shadowOpacity: 0.5, shadowOffset: { width: 0, height: 3 }, shadowRadius: 8, elevation: 5, position: "relative", alignItems: 'stretch' },
  savedCardImage: { width: "100%", minHeight: '40%', height: 80, borderRadius: 8, marginBottom: 10, resizeMode: 'cover' },
  savedCardText: { color: "#000", fontSize: 14, textAlign: "center", fontWeight: "bold" },
  removeIcon: { position: "absolute", top: 5, right: 5 },
  clearAllButton: { backgroundColor: "#ff4d4d", paddingVertical: 12, borderRadius: 12, marginTop: 20, width: "60%", alignSelf: "center", marginBottom: '100%' },
  clearAllText: { color: "#fff", fontWeight: "700", textAlign: "center", fontSize: 16 },
});
