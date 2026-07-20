import {Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Custombutton = ({ title, style, TextStyle, onPress, children }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      {children ? children : <Text style={[styles.text, TextStyle]}>{title}</Text>}
    </TouchableOpacity>
  );
};

export default Custombutton;

const styles = StyleSheet.create({
  button: {
    width: wp('90%'),
    height: hp('6%'),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e5f5e8',
    borderRadius: wp('8%'),
  },
  text: {
    fontSize: RFValue(16),
    fontWeight: '600',
    color: '#000',
  },
});