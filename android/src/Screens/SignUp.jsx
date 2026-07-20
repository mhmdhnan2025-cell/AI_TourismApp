
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Feather from 'react-native-vector-icons/Feather';
import { RFValue } from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Custombutton from '../CustomComponents/Custombutton';
import GradientComponent from '../CustomComponents/Background';

const SignupSchema = Yup.object().shape({
  username: Yup.string().matches(/^[A-Za-z ]+$/, 'Contain only letters').required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm your password'),
});

const SignUp = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, Setloading] = useState(false)

  return (
    <GradientComponent style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <View style={styles.card}>
        <Text style={styles.title}>Sign Up</Text>

        <Formik
          initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}
          validationSchema={SignupSchema}
          onSubmit={async (values, { resetForm }) => {
            Setloading(true)
            try {
              const response = await fetch("http://192.168.100.44:5001/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  username: values.username,
                  email: values.email,
                  password: values.password
                }),
              });

              const data = await response.json();

              if (response.ok) {
                alert("SignUp successful 🎉");
                resetForm();
                navigation.navigate("Login"); // move to Login screen                                                                 
              } else {
                alert(data.msg); // e.g., user exists
              }

            } catch (err) {
              alert("Server error 😭");
            } finally {
              Setloading(false)
            }
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <>
              <TextInput
                placeholder="Username"
                placeholderTextColor="#999"
                style={styles.input}
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                value={values.username}
              />
              {touched.username && errors.username && (
                <Text style={styles.error}>{errors.username}</Text>
              )}

              <TextInput
                placeholder="Email"
                placeholderTextColor="#999"
                style={styles.input}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
              />
              {touched.email && errors.email && (
                <Text style={styles.error}>{errors.email}</Text>
              )}

              <TextInput
                placeholder="Password"
                placeholderTextColor="#999"
                style={styles.input}
                secureTextEntry={!showPassword}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Feather
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={RFValue(20)}
                  color="#ccc"
                  style={styles.eyeicon}
                />
              </TouchableOpacity>
              {touched.password && errors.password && (
                <Text style={styles.error}>{errors.password}</Text>
              )}

              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="#999"
                style={styles.input}
                secureTextEntry={!showConfirm}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                value={values.confirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                <Feather
                  name={showConfirm ? 'eye-off' : 'eye'}
                  size={RFValue(20)}
                  color="#ccc"
                  style={styles.eyeicon}
                />
              </TouchableOpacity>
              {touched.confirmPassword && errors.confirmPassword && (
                <Text style={styles.error}>{errors.confirmPassword}</Text>
              )}

              <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Custombutton
                  title={loading ? '' : 'SignUp'}
                  style={{ marginTop: hp('2%') }}
                  onPress={handleSubmit}
                >
                  {loading && <ActivityIndicator color='Green' size='small' />}
                </Custombutton>

                <View style={{ flexDirection: 'row', marginTop: hp('2%') }}>
                  <Text style={styles.switchText}>Already have an account?</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={{ color: '#fff', marginLeft: wp('1.5%'), fontSize: RFValue(13), fontWeight: '600' }}>Login</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </Formik>
      </View>
    </GradientComponent>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#FFFFFF' },
  card: { marginHorizontal: wp('4%') },
  title: { fontSize: RFValue(26), color: '#fff', fontWeight: '700', marginBottom: hp('2%'), textAlign: 'center' },
  input: { backgroundColor: '#F3F3F4', borderRadius: wp('3%'), padding: hp('2.2%'), color: '#000', marginTop: hp('2%') },
  eyeicon: { position: 'absolute', right: wp('8%'), bottom: hp('2%') },
  error: { color: '#fff', fontSize: RFValue(11), marginTop: hp('0.5%') },
  switchText: { color: '#999', textAlign: 'center', fontSize: RFValue(13), fontWeight: '600' },
});
