import { View, Text, TouchableOpacity,StyleSheet } from 'react-native';
import React from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from "react-native-linear-gradient";
const Custombutton= ({title,style,TextStyle,onPress}) => {
  return (
       
      <TouchableOpacity onPress={onPress} style={[styles.button,style]}>
        <Text style={[styles.text,TextStyle]}>{title}</Text>
      </TouchableOpacity>
      
      
   
  );
};

export default Custombutton;
const styles = StyleSheet.create({
      button:{
         width:wp('90%'),
         height:hp('6%'),
         justifyContent:'center',
         alignItems:'center',
         backgroundColor:'#E65100',
         borderRadius:wp('8%'),
      },
      text:{
         fontSize:RFValue(16),
         fontWeight:'semibold',
         color:'#FFFFFF',
      },
})