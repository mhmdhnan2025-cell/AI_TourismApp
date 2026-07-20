import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import React, { useRef, useState } from 'react';
import Swiper from 'react-native-swiper';
import { RFValue } from 'react-native-responsive-fontsize';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import Custombutton from '../CustomComponents/Custombutton';
const img1 = require('../assets/onboardingimg/onboarding1.png');
const img2 = require('../assets/onboardingimg/onboarding2.png');
const img3 = require('../assets/onboardingimg/onboarding3.png');
const Onboarding = ({ navigation }) => {
  const swiperRef = useRef(null);
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    if (index === 2) {
      navigation.navigate('Login');
    } else {
      swiperRef.current.scrollBy(1);
    }
  };

  const renderProgressiveDots = () => (
    <View style={[styles.customPagination,

    ]}>
      {[0, 1, 2].map(dotIndex => (
        <View
          key={dotIndex}
          style={[styles.dot, dotIndex <= index && styles.activeDot]}
        />
      ))}
    </View>
  );
  return (

    <View style={{ flex: 1 }}>
      {/* <Text>Abdullah</Text> */}
      <Swiper
        ref={swiperRef}
        loop={false}
        showsPagination={false}
        onIndexChanged={i => setIndex(i)}
        showsButtons={false}
        scrollEnabled
      // removeClippedSubviews={false}
      >
        {/* Slide 1 */}
        <LinearGradient
          // colors={['#C2185B', '#E91E63', '#FF9800']}
          colors={["#01411C", "#2E8B57"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={styles.slide}
        >

          <Image
            source={img1}
            style={styles.img1}
            resizeMode='contain'

          />
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text style={[styles.title, { marginTop: hp('10%') }]} >Travel Beyond</Text>
            <Text style={styles.title}>Boundaries</Text>
            <Text style={[styles.description, { marginTop: hp('2%') }]}> Experience the world's wonders in a whole </Text>
            <Text style={styles.description}>new way with augmented and virtual</Text>
            <Text style={styles.description}> reality.
              Explore stunning destinations from</Text>
            <Text style={styles.description}> the comfort of your home.</Text>
          </View>
          {renderProgressiveDots()}
          <Custombutton
            title="Next"
            onPress={handleNext}
            style={{ marginTop: hp('6%') }}
          />

        </LinearGradient>
        {/* Slide2 */}
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          // colors={['#1A0E03', '#3B1C05']}
          colors={["#01411C", "#2E8B57"]}

          style={styles.slide}
        >

          <Image
            source={img2}
            style={styles.img2}
            resizeMode='contain'

          />
          <Text style={[styles.title, { marginTop: hp('10%') }]}>Arrive in Style</Text>
          <Text style={[styles.description, { marginTop: hp('2%') }]}>Explore breathtaking destinations in AR/VR, </Text>
          <Text style={styles.description}>and when you're ready,book a ride to</Text>
          <Text style={styles.description}>experience them in person.Seamless travel at</Text>
          <Text style={styles.description}>your fingertips.</Text>
          {renderProgressiveDots()}
          <Custombutton
            title="Begin Your Adventure"
            onPress={handleNext}
            style={{ marginTop: hp('10.5%') }}
          />

        </LinearGradient>
        {/* Slide3 */}

        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          // colors={['#1A0E03', '#3B1C05']}
          colors={["#01411C", "#2E8B57"]}
          style={styles.slide}
        >

          <Image
            source={img3}
            style={styles.img3}
            resizeMode='contain'

          />

          <Text style={[styles.title, { marginTop: hp('10%') }]} >Explore Like Never</Text>
          <Text style={styles.title} >Before</Text>
          <Text style={[styles.description, { marginTop: hp('2%') }]}>Watch Videos, browse breathtaking </Text>
          <Text style={styles.description}>photo galleries, and interact with 3D</Text>
          <Text style={styles.description}>models of landmarks from the comfort </Text>
          <Text style={styles.description}> of home.</Text>
          {renderProgressiveDots()}
          <Custombutton
            title="Begin Your Adventure"
            onPress={handleNext}
            style={{ marginTop: hp('6%') }}
          />
        </LinearGradient>
      </Swiper>
    </View>

  );
};

export default Onboarding;
const styles = StyleSheet.create({
  slide: {
    flex: 1,
    // justifyContent:'center',
    alignItems: 'center',
  },
  img1: {
    width: wp('100%'),
    height: hp('45%'),
  },
  img2: {
    width: wp('100%'),
    height: hp('45%'),
  },
  img3: {
    width: wp('100%'),
    height: hp('45%'),
    //  borderRadius:wp('10%'),
  },
  title: {
    fontSize: RFValue(26),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  description: {
    fontSize: RFValue(14),
    color: '#D3D3D3',
    fontWeight: '600',
  },
  customPagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('5%'),
  },
  dot: {
    backgroundColor: '#ccc',
    width: wp('3%'),
    height: wp('3%'),
    borderRadius: wp('1.5%'),
    marginHorizontal: wp('1%'),
  },
  activeDot: {
    backgroundColor: '#fff',

  },


});
