import React, { useEffect, useState } from "react";
import {
  FlatList,
  View,
  Image,
  TouchableOpacity,
  Text,
  Modal,
  TextInput,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";

// Cloudinary config
const CLOUD_NAME = "dgzykpihs";
const UPLOAD_PRESET = "tourImage"; // unsigned preset
const API = "http://192.168.100.178:5000"; // your backend
const AdminDashboard = () => {
  const [tours, setTours] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [editingTourId, setEditingTourId] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => { loadTours(); }, []);

  const loadTours = async () => {
    try {
      const res = await fetch(`${API}/tours`);
      const data = await res.json();
      setTours(data);
    } catch (err) { console.log(err); Alert.alert("Error", "Failed to load tours"); }
  };

  const pickImage = () => {
    launchImageLibrary({ mediaType: "photo", quality: 1 }, (response) => {
      if (response.didCancel) return;

      if (response.assets) {
        setImage(response.assets[0].uri);
      }
    });
  };

  const uploadImageToCloudinary = async (uri) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", { uri, type: "image/jpeg", name: "upload.jpg" });
      formData.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      setUploading(false);
      return data.secure_url;
    } catch (err) { setUploading(false); console.log(err); return null; }
  };

  const saveTour = async () => {
    if (!title || !location || !price) {
      Alert.alert("Validation", "Please fill all required fields");
      return;
    }

    let imageUrl = image;
    if (image && !image.startsWith("http")) {
      const uploadedUrl = await uploadImageToCloudinary(image);
      if (!uploadedUrl) return Alert.alert("Error", "Failed to upload image");
      imageUrl = uploadedUrl;
    }

    try {
      const method = editingTourId ? "PUT" : "POST";
      const endpoint = editingTourId
        ? `${API}/update-tour/${editingTourId}`
        : `${API}/add-tour`;

      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, location, price: parseFloat(price), description, image: imageUrl
        }),
      });
      const data = await response.json();
      Alert.alert("Success", data.msg || "Tour saved");
      loadTours();
      resetModal();
    } catch (err) { console.log(err); Alert.alert("Error", "Failed to save tour"); }
  };

  const editTour = (tour) => {
    setEditingTourId(tour.id);
    setTitle(tour.title);
    setLocation(tour.location);
    setPrice(tour.price.toString());
    setDescription(tour.description);
    setImage(tour.image);
    setModalVisible(true);
  };

  const deleteTour = async (id) => {
    try {
      const res = await fetch(`${API}/delete-tour/${id}`, { method: "DELETE" });
      const data = await res.json();
      Alert.alert("Deleted", data.msg || "Tour deleted");
      loadTours();
    } catch (err) { console.log(err); Alert.alert("Error", "Failed to delete tour"); }
  };

  const resetModal = () => {
    setModalVisible(false);
    setEditingTourId(null);
    setTitle(""); setLocation(""); setPrice(""); setDescription(""); setImage(null);
  };

  const renderTourCard = ({ item }) => (
    <View style={styles.card}>
      {item.image && <Image source={{ uri: item.image }} style={styles.cardImage} />}
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.location}>{item.location}</Text>
      <Text>{item.description}</Text>
      <Text style={styles.price}>Rs {item.price}</Text>

      <View style={{ flexDirection: "row", marginTop: 10 }}>
        <TouchableOpacity style={styles.editBtn} onPress={() => editTour(item)}>
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteTour(item.id)}>
          <Text style={styles.btnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={tours}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTourCard}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addText}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalBox}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>{editingTourId ? "Edit Tour" : "Add Tour"}</Text>

              <Text style={styles.label}>Title</Text>
              <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Tour title" />

              <Text style={styles.label}>Location</Text>
              <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="Tour location" />

              <Text style={styles.label}>Price</Text>
              <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="Tour price" />

              <Text style={styles.label}>Description</Text>
              <TextInput style={[styles.input, { height: 80 }]} value={description} onChangeText={setDescription} multiline placeholder="Tour description" />

              <Pressable style={styles.imageButton} onPress={pickImage}>
                <Text style={{ color: "white" }}>{uploading ? "Uploading..." : "Select Image"}</Text>
              </Pressable>
              {image && <Image source={{ uri: image }} style={styles.preview} />}

              <Pressable style={styles.submitButton} onPress={saveTour}>
                <Text style={{ color: "white" }}>{editingTourId ? "Update Tour" : "Add Tour"}</Text>
              </Pressable>
              <Pressable style={styles.closeButton} onPress={resetModal}>
                <Text>Close</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f4" },
  card: { backgroundColor: "white", marginHorizontal: 10, marginVertical: 20, padding: 15, borderRadius: 12, elevation: 4 },
  cardImage: { width: "100%", height: 150, borderRadius: 10, marginBottom: 8 },
  cardTitle: { fontSize: 18, fontWeight: "bold" },
  location: { color: "#555" },
  price: { marginTop: 5, fontWeight: "bold", color: "green" },
  editBtn: { backgroundColor: "#007bff", paddingVertical: 6, paddingHorizontal: 14, borderRadius: 6, marginRight: 10 },
  deleteBtn: { backgroundColor: "#dc3545", paddingVertical: 6, paddingHorizontal: 14, borderRadius: 6 },
  btnText: { color: "white", fontWeight: "bold" },
  addButton: { position: "absolute", bottom: 30, right: 30, backgroundColor: "#ff6b00", width: 60, height: 60, borderRadius: 30, justifyContent: "center", alignItems: "center", elevation: 5 },
  addText: { fontSize: 28, color: "white" },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalBox: { backgroundColor: "white", width: "90%", borderRadius: 12, padding: 20, maxHeight: "85%" },
  modalTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  label: { fontWeight: "600", marginBottom: 5, marginTop: 10 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 8, backgroundColor: "#fafafa" },
  imageButton: { backgroundColor: "#0077ff", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 10 },
  preview: { width: "100%", height: 120, borderRadius: 8, marginTop: 10 },
  submitButton: { backgroundColor: "#28a745", padding: 12, borderRadius: 8, alignItems: "center", marginTop: 15 },
  closeButton: { alignItems: "center", padding: 10, marginTop: 10 },
});