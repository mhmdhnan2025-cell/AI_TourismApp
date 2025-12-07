import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';

import { launchCamera } from 'react-native-image-picker';
// import { VISION_WEB_API_KEY } from '@env';
const VISION_WEB_API_KEY = "AIzaSyBlOR-zbZb6NDl5PUbFf69RnOKT3CWUyko";
const CameraScreen = ({ navigation }) => {
  const [cameraVisible, setCameraVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const takePicture = async () => {
    setLoading(true);

    try {
      const options = {
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: true,
        saveToPhotos: false,
      };

      const response = await launchCamera(options);

      if (response.didCancel) {
        setLoading(false);
        return;
      }

      if (response.errorCode || !response.assets || response.assets.length === 0) {
        throw new Error("ImagePicker error: " + response.errorCode);
      }

      const photo = response.assets[0];
      const filePath = photo.uri;
      const base64Image = photo.base64;

      if (!base64Image) throw new Error("Base64 not found!");

      // --------------------------
      //       GOOGLE LENS MODE
      // --------------------------
      const visionBody = {
        requests: [
          {
            image: {
              content: base64Image.trim(),
            },
            features: [
              { type: 'LABEL_DETECTION', maxResults: 10 },
              { type: 'WEB_DETECTION', maxResults: 10 },
            ],
          },
        ],
      };

      const visionRes = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${VISION_WEB_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(visionBody),
        }
      );

      const visionData = await visionRes.json();

      if (visionData.error) {
        console.log("Vision API Error:", visionData.error);
        throw new Error("Vision API failed: " + visionData.error.message);
      }

      const res = visionData.responses[0];

      // --------------------------
      // BEST GUESS (Google Lens)
      // --------------------------
      let bestGuess = "Unknown Object";
      if (res?.webDetection?.bestGuessLabels?.length > 0) {
        bestGuess = res.webDetection.bestGuessLabels[0].label;
      }

      // --------------------------
      // LABELS
      // --------------------------
      let labels = [];
      if (res?.labelAnnotations?.length > 0) {
        labels = res.labelAnnotations.map(item => item.description);
      }

      // --------------------------
      // SIMILAR IMAGES (Google Lens)
      // --------------------------
      let similarImages = [];
      if (res?.webDetection?.visuallySimilarImages?.length > 0) {
        similarImages = res.webDetection.visuallySimilarImages.map(img => img.url);
      }

      // --------------------------
      // PAGES WITH MATCHING IMAGES
      // --------------------------
      let pages = [];
      if (res?.webDetection?.pagesWithMatchingImages?.length > 0) {
        pages = res.webDetection.pagesWithMatchingImages.map(p => ({
          title: p.pageTitle,
          url: p.url
        }));
      }

      // --------------------------
      // Navigate with results
      // --------------------------
      navigation.navigate("DetailsScreen", {
        imageUri: filePath,
        result: {
          bestGuess,
          labels,
          similarImages,
          pages,
        }
      });

    } catch (err) {
      console.error("Camera/API Error:", err);
      Alert.alert("Error", err.message || "Failed to analyze the image.");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------
  // START SCREEN
  // --------------------------
  if (!cameraVisible) {
    return (
      <View style={styles.startContainer}>
        <Text style={styles.title}>Google Lens Style Scanner</Text>

        <TouchableOpacity
          style={styles.openBtn}
          onPress={() => setCameraVisible(true)}
        >
          <Text style={styles.btnText}>Open Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --------------------------
  // CAMERA SCREEN
  // --------------------------
  return (
    <View style={styles.center}>
      <Text style={styles.title}>Tap to Scan Object</Text>

      <TouchableOpacity
        style={[styles.captureButton, loading && styles.disabledButton]}
        disabled={loading}
        onPress={takePicture}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>SCAN</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setCameraVisible(false)}
        style={{ marginTop: 30 }}
      >
        <Text style={{ color: "#aaa" }}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  startContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000'
  },
  title: {
    fontSize: 28, color: '#fff', marginBottom: 40, fontWeight: 'bold'
  },
  openBtn: {
    backgroundColor: '#3498db', padding: 20, borderRadius: 10, width: 200, alignItems: 'center'
  },
  btnText: {
    color: 'white', fontSize: 18, fontWeight: 'bold'
  },
  center: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black'
  },
  captureButton: {
    backgroundColor: '#2ecc71', borderRadius: 50, padding: 20, width: 220, alignItems: 'center'
  },
  disabledButton: { backgroundColor: '#7f8c8d' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 }
});

export default CameraScreen;
