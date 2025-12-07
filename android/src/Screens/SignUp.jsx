import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Feather from 'react-native-vector-icons/Feather';
import { RFValue } from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Custombutton from '../CustomComponents/Custombutton';
const SignupSchema = Yup.object().shape({
  username: Yup.string().matches(/^[A-Za-z ]+$/, ' Contain only letters').required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
    .min(8, 'Passsword must be at least 8 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm your password'),
});

const SignUp = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
     
     <View style={styles.container}>
     <StatusBar  
        barStyle={'dark-content'}
     />
      <View style={styles.card}>
        <Text style={styles.title}>Sign Up</Text>

        <Formik
          initialValues={{ username: '', email: '', password: '', confirmPassword: '' }}
          validationSchema={SignupSchema}
          onSubmit={(values) => console.log(values)}
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
              {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

              {/* Password */}
              
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

              {/* Confirm Password */}
        
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
                    style={ styles.eyeicon }
                  />
                </TouchableOpacity>
             
              {touched.confirmPassword && errors.confirmPassword && (
                <Text style={styles.error}>{errors.confirmPassword}</Text>
              )}

           
                <View style={{justifyContent:'center',alignItems:'center'}}>
            <Custombutton title="SignUp" 
                style={{marginTop:hp('2%')}}
                onPress={handleSubmit}
            />


               <View style={{flexDirection:'row',marginTop:hp('2%')}}>
              <Text style={styles.switchText}>
                Don’t have an account?</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={{ color: '#E65100',marginLeft:wp('1.5%') ,fontSize:RFValue(13),fontWeight:'semibold'}}>Login</Text>
             
            </TouchableOpacity>
            </View>
            </View>
            </>
          )}
        </Formik>
      </View>
     </View>     
 

  );
};
  export default SignUp;
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center',backgroundColor:'#FFFFFF' },

  title: {
    fontSize: RFValue(26),
    color: '#E65100',
    fontWeight: '700',
    marginBottom: hp('2%'),
    textAlign: 'center',
  },
  input: {
    // backgroundColor: 'rgba(255,255,255,0.15)',
        backgroundColor:'#F3F3F4',
    borderRadius: wp('3%'),
    padding: hp('2.2%'),
    color: '#000',
    marginTop: hp('2%'),
     marginHorizontal: wp('4%'),
  },

  button: {
    marginTop: hp('2.5%'),
    backgroundColor: '#A78BFA',
    paddingVertical: hp('1.8%'),
    borderRadius: wp('3%'),
  },
  buttonText: {
    color: '#fff',
    fontSize: RFValue(16),
    textAlign: 'center',
    fontWeight: 'bold',
  },
  eyeicon:{
    position:'absolute',
    right:wp('8%'),
    bottom:hp('2%'),
  },
  error: { color: '#F87171', fontSize: RFValue(11), marginTop: hp('0.5%'),marginLeft:wp('5%') },
  switchText: { color: '#999', textAlign: 'center', fontSize: RFValue(13),fontWeight:'semibold' },
});


