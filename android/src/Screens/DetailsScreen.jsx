import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  Linking
} from "react-native";

const DetailsScreen = ({ route }) => {
  const { imageUri, result } = route.params;
  const { width } = Dimensions.get("window");

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: imageUri }}
        style={[styles.capturedImage, { width: width - 20, height: width - 20 }]}
      />

      <View style={styles.card}>
        <Text style={styles.title}>Best Guess:</Text>
        <Text style={styles.mainLabel}>{result.bestGuess}</Text>

        {result.labels.length > 0 && (
          <>
            <Text style={styles.section}>Labels:</Text>
            {result.labels.map((lbl, i) => (
              <Text key={i} style={styles.item}>{lbl}</Text>
            ))}
          </>
        )}

        {result.similarImages.length > 0 && (
          <>
            <Text style={styles.section}>Similar Images:</Text>
            {result.similarImages.map((url, i) => (
              <Image
                key={i}
                source={{ uri: url }}
                style={styles.similarImg}
                resizeMode="cover"
              />
            ))}
          </>
        )}

        {result.pages.length > 0 && (
          <>
            <Text style={styles.section}>Pages with Matching Images:</Text>
            {result.pages.map((p, i) => (
              <Text
                key={i}
                style={styles.link}
                onPress={() => Linking.openURL(p.url)}
              >
                {p.title || p.url}
              </Text>
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#f5f5f5" },
  capturedImage: {
    alignSelf: "center",
    borderRadius: 8,
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    elevation: 3,
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  mainLabel: { fontSize: 18, color: "#444", marginBottom: 10 },

  section: { marginTop: 20, fontSize: 18, fontWeight: "bold" },
  item: { fontSize: 16, color: "#555", paddingVertical: 3 },

  similarImg: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginVertical: 6
  },

  link: {
    color: "#0066ff",
    textDecorationLine: "underline",
    paddingVertical: 4
  }
});

export default DetailsScreen;
