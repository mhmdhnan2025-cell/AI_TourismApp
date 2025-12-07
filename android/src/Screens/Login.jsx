import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Feather from 'react-native-vector-icons/Feather';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Custombutton from '../CustomComponents/Custombutton';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Min 6 characters')
    .required('Password is required'),
});

const Login = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    
       <View style={styles.container}> 
       <StatusBar barStyle={'dark-content'}/>
      <Text style={styles.title}>Login</Text>

      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={(values,{resetForm})=>{
           resetForm();
           navigation.replace('BottomTabs');
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
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
              style={[styles.input]}
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
                style={{
                  position: 'absolute',
                  right: wp('8%'),
                  bottom: hp('2%'),
                }}
              />
            </TouchableOpacity>

            {touched.password && errors.password && (
              <Text style={styles.error}>{errors.password}</Text>
            )}

            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
            <View style={{justifyContent:'center',alignItems:'center'}}>
            <Custombutton title="Login" 
                onPress={handleSubmit}
                style={{marginTop:hp('2%')}}
            />


               <View style={{flexDirection:'row',marginTop:hp('2%')}}>
              <Text style={styles.switchText}>
                Don’t have an account?</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                <Text style={{ color: '#E65100',marginLeft:wp('1.5%') ,fontSize:RFValue(14),fontWeight:'semibold'}}>Sign up</Text>
             
            </TouchableOpacity>
            </View>
            </View>
          </>
        )}
      </Formik>
    
    </View>
      
  );
  
};
export default Login;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' ,backgroundColor:'#FFFFFF'},

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
  forgotBtn: { marginTop: hp('1%'), marginRight: wp('6%') },
  forgotText: { color: '#999', textAlign: 'right', fontSize: RFValue(12.5) ,fontWeight:'semibold'},
  error: { color: '#F87171', fontSize: RFValue(11), marginTop: hp('0.5%'),marginLeft:wp('5%') },
  switchText: {
    color: '#999',
    textAlign: 'center',
    // marginTop: hp('2%'),
    fontSize: RFValue(13),
    fontWeight:'semibold',
  },
});
