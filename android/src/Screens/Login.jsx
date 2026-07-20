import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { RFValue } from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Custombutton from '../CustomComponents/Custombutton';
import GradientComponent from '../CustomComponents/Background'
// Validation
const LoginSchema = Yup.object().shape({
  login: Yup.string().required('Email or Username is required'),
  password: Yup.string().min(6, 'Min 6 characters').required('Password is required'),
});

const Login = ({ navigation }) => {

  const [loading, setLoading] = useState(false);

  const BACKEND_URL = 'http://192.168.100.178:5001/login';

  return (
    <GradientComponent>
      <StatusBar barStyle={'light-content'} />
      <Text style={styles.title}>Login</Text>

      <Formik
        initialValues={{ login: '', password: '' }}
        validationSchema={LoginSchema}

        onSubmit={async (values, { resetForm }) => {

          setLoading(true);

          try {

            const response = await fetch(BACKEND_URL, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                login: values.login,
                password: values.password,
              }),
            });

            const data = await response.json();

            if (response.ok) {

              const userData = data.user;

              // check admin
              if (userData.is_admin) {
                navigation.replace('AdminNavigation');
              } else {
                navigation.replace('BottomTabs', { user: userData });
              }

              resetForm();

            } else {

              alert(data.msg || 'Login failed');
            }

          } catch (err) {

            alert('Server error');

          } finally {

            setLoading(false);

          }

        }}

      >

        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (

          <>

            <TextInput
              placeholder="Email or Username"
              placeholderTextColor="#999"
              style={styles.input}
              onChangeText={handleChange('login')}
              onBlur={handleBlur('login')}
              value={values.login}
            />

            {touched.login && errors.login && (
              <Text style={styles.error}>{errors.login}</Text>
            )}

            <TextInput
              placeholder="Password"
              placeholderTextColor="#999"
              style={styles.input}
              secureTextEntry={true}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />

            {touched.password && errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}

            <Custombutton title={loading ? '' : 'Login'} onPress={handleSubmit} style={{ marginTop: 10, alignSelf: "center" }}>
              {loading && <ActivityIndicator size="small" color="Green" />}
            </Custombutton>

            <View style={{ flexDirection: 'row', marginTop: hp('2%'), justifyContent: "center" }}>
              <Text style={styles.switchText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={{ color: '#fff', marginLeft: wp('1.5%'), fontSize: RFValue(13), fontWeight: '600' }}>SignUp</Text>
              </TouchableOpacity>
            </View>
          </>

        )}

      </Formik>
    </GradientComponent >
  );
};

export default Login;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', backgroundColor: '#FFFFFF' },

  title: {
    fontSize: RFValue(26),
    color: '#fff',
    fontWeight: '700',
    marginBottom: hp('2%'),
    textAlign: 'center'
  },

  input: {
    backgroundColor: '#F3F3F4',
    borderRadius: wp('3%'),
    padding: hp('2.2%'),
    color: '#000',
    marginTop: hp('2%'),
    marginHorizontal: wp('4%'),
  },

  error: {
    color: '#fff',
    fontSize: RFValue(11),
    marginTop: hp('0.5%'),
    marginLeft: wp('5%')
  },
  switchText: { color: '#999', textAlign: 'center', fontSize: RFValue(13), fontWeight: '600' },


});