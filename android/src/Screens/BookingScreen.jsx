import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Formik } from "formik";
import * as Yup from "yup";
import Custombutton from "../CustomComponents/Custombutton";
import Icon from "react-native-vector-icons/Ionicons";
const BookingScreen = ({ route, navigation }) => {
  const { location } = route.params;

  const [successModal, setSuccessModal] = useState(false);

  // -------------------- YUP VALIDATION --------------------
  const BookingSchema = Yup.object().shape({
    name: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Name must contain letters only")
      .required("Full name is required"),

    phone: Yup.string()
      .matches(/^[0-9]{11}$/, "Phone must be 11 digits")
      .required("Phone number is required"),

    members: Yup.number()
      .typeError("Members must be numeric")
      .positive("Members must be positive")
      .required("Members is required"),

    date: Yup.string()
      .matches(/^\d{2}-\d{2}-\d{4}$/, "Date must be DD-MM-YYYY format")
      .required("Date is required"),
  });

  return (
    <LinearGradient
      colors={["#0C0F1A", "#0A0C14", "#05060A"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Back */}
      <TouchableOpacity style={styles.backbutton} onPress={() => navigation.goBack()}>
        {/* <Text style={styles.backText}>← Go Back</Text> */}
           <Icon name="arrow-back" size={20} color="#FFFFFF" />
      </TouchableOpacity>

      <Text style={styles.title}>Book Your Visit</Text>
      <Text style={styles.location}>{location.name}</Text>

      {/* ----------- FORMIK FORM ----------- */}
      <Formik
        initialValues={{ name: "", phone: "", members: "", date: "" }}
        validationSchema={BookingSchema}
        onSubmit={(values) => {
          setSuccessModal(true);
        }}
      >
        {({ handleChange, handleSubmit, values, errors, touched }) => (
          <ScrollView style={{ width: "100%" }}>

            {/* Name */}
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#777"
              value={values.name}
              onChangeText={handleChange("name")}
            />
            {touched.name && errors.name && (
              <Text style={styles.error}>{errors.name}</Text>
            )}

            {/* Phone */}
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#777"
              keyboardType="numeric"
              value={values.phone}
              onChangeText={handleChange("phone")}
            />
            {touched.phone && errors.phone && (
              <Text style={styles.error}>{errors.phone}</Text>
            )}

            {/* Members */}
            <TextInput
              style={styles.input}
              placeholder="Total Members"
              placeholderTextColor="#777"
              keyboardType="numeric"
              value={values.members}
              onChangeText={handleChange("members")}
            />
            {touched.members && errors.members && (
              <Text style={styles.error}>{errors.members}</Text>
            )}

            {/* Date */}
            <TextInput
              style={styles.input}
              placeholder="Date (DD-MM-YYYY)"
              placeholderTextColor="#777"
              value={values.date}
              onChangeText={handleChange("date")}
            />
            {touched.date && errors.date && (
              <Text style={styles.error}>{errors.date}</Text>
            )}

            {/* Submit Button */}
                      <Custombutton
              title="Confirm Booking"
              onPress={handleSubmit}
              style={{marginTop:12}}
          />
              
          </ScrollView>
        )}
      </Formik>

      {/* ---------------- SUCCESS MODAL ---------------- */}
      <Modal visible={successModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Booking Successful 🎉</Text>
            <Text style={styles.modalText}>
              Your visit to {location.name} has been confirmed!
            </Text>

            <Pressable
              style={styles.closeBtn}
              onPress={() => {
                setSuccessModal(false);
                navigation.goBack();
              }}
            >
              <Text style={styles.closeBtnText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default BookingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    paddingTop: 40,
  },
  backbutton:{
    marginTop: 20,
    backgroundColor:'#999',
   
    height:34,
    width:34,
    borderRadius:17,
    justifyContent:'center',
    alignItems:'center',
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 50,
  },
  location: {
    color: "#6C5CE7",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 25,
  },
  input: {
    backgroundColor: "#11131B",
    color: "#fff",
    padding: 14,
    borderRadius: 14,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#1F2430",
  },
  error: {
    color: "#FF4F4F",
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
  },
 

  backText: {
    color: "#ccc",
    fontSize: 14,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#151720",
    width: "80%",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
  },
  modalTitle: {
    color: "#00E0FF",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 10,
  },
  modalText: {
    color: "#ddd",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 20,
  },
  closeBtn: {
    backgroundColor: "#E65100",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  closeBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
