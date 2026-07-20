import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';
import LinearGradient from 'react-native-linear-gradient';

const ProfileScreen = ({ route }) => {
  const { user } = route.params; // user from login
  const [photo, setPhoto] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleCamera = () => {
    launchCamera({ mediaType: 'photo' }, response => {
      if (response.assets && response.assets.length > 0) {
        setPhoto({ uri: response.assets[0].uri });
      }
    });
    setModalVisible(false);
  };

  const handleGallery = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      if (response.assets && response.assets.length > 0) {
        setPhoto({ uri: response.assets[0].uri });
      }
    });
    setModalVisible(false);
  };

  return (
    <LinearGradient
      colors={['#0C0F1A', '#0A0C14', '#05060A']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Text style={styles.profileText}>Profile Settings</Text>

      {/* Avatar */}
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View style={styles.avatarContainer}>
            {photo ? (
              <Image source={photo} style={styles.avatarImage} />
            ) : (
              <Ionicons
                name="person-circle-sharp"
                size={wp('40%')}
                color="#C7B6FC"
              />
            )}

            <View style={styles.editIcon}>
              <Ionicons name="pencil" size={RFValue(20)} color="#fff" />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      {/* User Info */}
      <View style={{ marginTop: hp('5%'), alignItems: 'center' }}>
        <Text style={styles.label}>Username</Text>
        <Text style={styles.value}>{user.username}</Text>

        <Text style={[styles.label, { marginTop: hp('2%') }]}>Email</Text>
        <Text style={styles.value}>{user.email}</Text>
      </View>

      {/* Modal for photo */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Upload Photo</Text>
            <Pressable style={styles.modalBtn} onPress={handleCamera}>
              <Text style={styles.modalBtnText}>📷 Camera</Text>
            </Pressable>
            <Pressable style={styles.modalBtn} onPress={handleGallery}>
              <Text style={styles.modalBtnText}>🖼️ Gallery</Text>
            </Pressable>
            <Pressable
              style={[styles.modalBtn, { backgroundColor: '#F87171' }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalBtnText}>❌ Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    paddingTop: 60,
  },
  profileText: {
    textAlign: 'center',
    fontWeight: '700',
    fontSize: RFValue(14),
    color: '#FFFFFF',
  },
  avatarContainer: {
    justifyContent: 'center',
    marginTop: hp('1.5%'),
  },
  avatarImage: {
    width: wp('40%'),
    height: wp('40%'),
    borderRadius: wp('20%'),
  },
  editIcon: {
    position: 'absolute',
    bottom: hp('2%'),
    right: wp('3.5%'),
    backgroundColor: '#A78BFA',
    borderRadius: 999,
    padding: wp('1.5%'),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: wp('75%'),
    borderRadius: wp('5%'),
    paddingVertical: hp('3%'),
    paddingHorizontal: wp('5%'),
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: RFValue(16),
    fontWeight: '700',
    marginBottom: hp('2%'),
    color: '#333',
  },
  modalBtn: {
    backgroundColor: '#A78BFA',
    width: '100%',
    paddingVertical: hp('1.5%'),
    borderRadius: wp('3%'),
    marginTop: hp('1.2%'),
  },
  modalBtnText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
    fontSize: RFValue(13),
  },
  label: {
    fontSize: RFValue(14),
    color: '#fff',
    fontWeight: '700',
  },
  value: {
    fontSize: RFValue(16),
    color: '#C7B6FC',
    marginTop: 5,
  },
});
