import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Modal } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Formik } from "formik";
import * as Yup from "yup";
import Icon from "react-native-vector-icons/Ionicons";
import { launchImageLibrary } from "react-native-image-picker";

const API = "http://192.168.100.178:5000"; // Flask backend IP

const BookingScreen = ({ route, navigation }) => {
  const { tour } = route.params;
  const [paymentImage, setPaymentImage] = useState(null);
  const [success, setSuccess] = useState(false);
  const pricePerPerson = tour?.price || 0;

  const pickImage = () => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (!response.didCancel && response.assets) setPaymentImage(response.assets[0].uri);
    });
  };

  const uploadToCloudinary = async () => {
    const data = new FormData();
    data.append("file", { uri: paymentImage, type: "image/jpeg", name: "payment.jpg" });
    data.append("upload_preset", "tourImage");
    data.append("cloud_name", "dgzykpihs");
    try {
      const res = await fetch("https://api.cloudinary.com/v1_1/dgzykpihs/image/upload", { method: "POST", body: data });
      const result = await res.json();
      return result.secure_url;
    } catch (err) { console.log(err); return null; }
  };

  const BookingSchema = Yup.object().shape({
    name: Yup.string().required("Full name required"),
    phone: Yup.string().required("Phone required"),
    members: Yup.string().required("Members required"),
    date: Yup.string().required("Date required"),
  });

  // colors = { ['#01411C', '#0B6B3A', '#FFFFFF']}
  return (
    <LinearGradient colors={['#E8F5E9', '#A5D6A7']} style={{ flex: 1, padding: 18, paddingTop: 40 }}>
      <TouchableOpacity style={styles.backbutton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={20} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>Book Your Visit</Text>
      <TextInput style={styles.input} value={tour?.title} editable={false} />
      <Formik
        initialValues={{ name: "", phone: "", members: "", date: "" }}
        validationSchema={BookingSchema}
        onSubmit={async (values) => {
          if (!paymentImage) return alert("Upload payment screenshot");
          const imageUrl = await uploadToCloudinary();
          if (!imageUrl) return alert("Image upload failed");

          const totalPrice = Number(values.members) * pricePerPerson;

          try {
            await fetch(`${API}/bookings`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...values, tourName: tour.title, price: totalPrice, paymentProof: imageUrl })
            });
            setSuccess(true);
          } catch (err) { console.log(err); alert("Booking failed"); }
        }}
      >
        {({ handleChange, handleSubmit, values, errors, touched }) => (
          <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 10 }}>
            <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#555" value={values.name} onChangeText={handleChange("name")} />
            {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}

            <TextInput style={styles.input} placeholder="Phone" placeholderTextColor="#555" keyboardType="numeric" value={values.phone} onChangeText={handleChange("phone")} />
            {touched.phone && errors.phone && <Text style={styles.error}>{errors.phone}</Text>}

            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }}>
              <TextInput style={[styles.input, { flex: 1 }]} placeholder="Members" keyboardType="numeric" value={values.members} onChangeText={handleChange("members")} />
              <View style={styles.priceBox}>
                <Text>Rs {values.members ? Number(values.members) * pricePerPerson : 0}</Text>
              </View>
            </View>

            <TextInput style={styles.input} placeholder="Date (DD-MM-YYYY)" value={values.date} onChangeText={handleChange("date")} />
            {touched.date && errors.date && <Text style={styles.error}>{errors.date}</Text>}

            <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
              <Text style={{ color: "#fff" }}>Upload Payment Screenshot</Text>
            </TouchableOpacity>
            {paymentImage && <Image source={{ uri: paymentImage }} style={styles.preview} />}

            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={{ color: "#fff", fontWeight: "700" }}>Confirm Booking</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </Formik>

      {/* SUCCESS MODAL */}
      <Modal visible={success} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Booking Successful 🎉</Text>
            <Text style={styles.modalText}>
              Your visit has been confirmed! We will contact you shortly.
            </Text>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => {
                setSuccess(false);
                navigation.goBack();
              }}
            >
              <Text style={styles.closeBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  backbutton: { marginTop: 20, backgroundColor: "#1B5E20", height: 34, width: 34, borderRadius: 17, justifyContent: "center", alignItems: "center" },
  title: { color: "#1B5E20", fontSize: 26, fontWeight: "700", textAlign: "center", marginTop: 10, marginBottom: 15 },
  input: { backgroundColor: "#C8E6C9", color: "#1B5E20", padding: 14, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: "#A5D6A7" },
  error: { color: "#d32f2f", fontSize: 12, marginBottom: 8, marginLeft: 5 },
  priceBox: { backgroundColor: "#A5D6A7", padding: 12, marginLeft: 8, borderRadius: 12 },
  uploadBtn: { backgroundColor: "#1B5E20", padding: 12, borderRadius: 12, alignItems: "center", marginBottom: 10 },
  preview: { width: "100%", height: 180, borderRadius: 12, marginBottom: 15 },
  submitBtn: { backgroundColor: "#2E7D32", padding: 14, borderRadius: 12, alignItems: "center", marginTop: 10 },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
  modalBox: {
    width: "80%",
    backgroundColor: "#E8F5E9",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  modalTitle: { fontSize: 22, fontWeight: "700", color: "#1B5E20", marginBottom: 10, textAlign: "center" },
  modalText: { fontSize: 16, color: "#2E7D32", textAlign: "center", marginBottom: 20 },
  closeBtn: { backgroundColor: "#1B5E20", paddingVertical: 10, paddingHorizontal: 25, borderRadius: 15 },
  closeBtnText: { color: "#fff", fontWeight: "700", fontSize: 16, textAlign: "center" },
});

export default BookingScreen;