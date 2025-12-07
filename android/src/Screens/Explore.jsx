// import React, { useEffect, useState } from "react";
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Dimensions } from "react-native";
// import { WebView } from "react-native-webview";
// import LinearGradient from "react-native-linear-gradient";
// import { SafeAreaView } from "react-native-safe-area-context";

// const API_KEY = "AIzaSyBlOR-zbZb6NDl5PUbFf69RnOKT3CWUyko";

// const LOCATIONS = [
//   { id: "1", name: "Badshahi Masjid, Lahore", lat: 31.5886, lng: 74.3090 },
//   { id: "2", name: "Faisal Mosque, Islamabad", lat: 33.7294, lng: 73.0370 },
//   { id: "3", name: "Mazar-e-Quaid, Karachi", lat: 24.8739, lng: 67.0441 },
//   { id: "4", name: "Minar-e-Pakistan, Lahore", lat: 31.5925, lng: 74.3095 },
//   { id: "5", name: "Lahore Fort", lat: 31.5889, lng: 74.3105 },
//   { id: "6", name: "Shalimar Gardens, Lahore", lat: 31.6015, lng: 74.3265 },
//   { id: "7", name: "Mohatta Palace, Karachi", lat: 24.8316, lng: 67.0342 },
//   { id: "8", name: "Derawar Fort, Bahawalpur", lat: 28.3892, lng: 70.2580 },
// ];

// const { width } = Dimensions.get("window");
// const CARD_WIDTH = (width - 36) / 2;

// export default function Explore({ navigation }) {
//   const [selected, setSelected] = useState(null);
//   const [loadedImages, setLoadedImages] = useState({});

//   useEffect(() => {
//     LOCATIONS.forEach(fetchImage);
//   }, []);

//   const fetchImage = async (loc) => {
//     try {
//       const geoRes = await fetch(
//         `https://maps.googleapis.com/maps/api/geocode/json?latlng=${loc.lat},${loc.lng}&key=${API_KEY}`
//       );
//       const geoJson = await geoRes.json();
//       const placeId = geoJson.results[0]?.place_id;

//       if (!placeId) {
//         setLoadedImages((prev) => ({ ...prev, [loc.id]: "NO_IMAGE" }));
//         return;
//       }

//       const detailsRes = await fetch(
//         `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${API_KEY}`
//       );
//       const detailsJson = await detailsRes.json();

//       const photoRef = detailsJson.result.photos?.[0]?.photo_reference;

//       const imgUrl = photoRef
//         ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${API_KEY}`
//         : `https://maps.googleapis.com/maps/api/staticmap?center=${loc.lat},${loc.lng}&zoom=16&size=400x200&maptype=roadmap&key=${API_KEY}`;

//       setLoadedImages((prev) => ({ ...prev, [loc.id]: imgUrl }));
//     } catch (err) {
//       console.log(err);
//       setLoadedImages((prev) => ({ ...prev, [loc.id]: "NO_IMAGE" }));
//     }
//   };

//   const generateHTML = (lat, lng) => `
//     <!DOCTYPE html><html><head>
//       <meta name="viewport" content="width=device-width, initial-scale=1"/>
//       <style>html,body{margin:0;padding:0;height:100%}#pano{width:100vw;height:100vh}</style>
//       <script src="https://maps.googleapis.com/maps/api/js?key=${API_KEY}&v=weekly"></script>
//       <script>
//         function load(){
//           new google.maps.StreetViewPanorama(document.getElementById('pano'),{
//             position:{lat:${lat},lng:${lng}},
//             pov:{heading:10,pitch:5},zoom:1
//           });
//         } window.onload = load;
//       </script>
//     </head><body><div id="pano"></div></body></html>
//   `;

//   if (selected) {
//     return (
//       <SafeAreaView style={{ flex: 1 }}>
//         <TouchableOpacity style={styles.back} onPress={() => setSelected(null)}>
//           <Text style={{ color: "#fff", fontSize: 16 }}>⬅ Back</Text>
//         </TouchableOpacity>

//         <WebView source={{ html: generateHTML(selected.lat, selected.lng) }} style={{ flex: 1 }} />
//       </SafeAreaView>
//     );
//   }

//   return (
//         <LinearGradient
//   colors={["#0C0F1A", "#0A0C14", "#05060A"]}
//   start={{ x: 0, y: 0 }}
//   end={{ x: 1, y: 1 }}
//   style={{
//     flex: 1,
//   }}
// >
//       <Text style={styles.header}>Pakistan VR Explorer 🇵🇰</Text>

//       <FlatList
//         data={LOCATIONS}
//         keyExtractor={(item) => item.id}
//         numColumns={2}
//         contentContainerStyle={{ padding: 12 }}
//         columnWrapperStyle={{ justifyContent: "space-between" }}
//         renderItem={({ item }) => (
//           <View style={{ marginBottom: 16 }}>
//             <View style={styles.card}>
//               {loadedImages[item.id] ? (
//                 <Image source={{ uri: loadedImages[item.id] }} style={styles.img} />
//               ) : (
//                 <ActivityIndicator size="large" color="#fff" style={{ height: 150 }} />
//               )}

//               <View style={styles.info}>
//                 <Text style={styles.name}>{item.name}</Text>
//                   <View>
//                 <TouchableOpacity onPress={() => setSelected(item)}>
//                   <LinearGradient
//                     colors={["#6C5CE7", "#6C63FF"]}
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 0 }}
//                     style={styles.button}
//                   >
//                     <Text style={styles.buttonText}>View in VR</Text>
//                   </LinearGradient>
//                 </TouchableOpacity>

//                 {/* ⭐ New Book Now Button */}
//                 <TouchableOpacity
//                   onPress={() => navigation.navigate("BookingScreen", { location: item })}
//                   style={{ marginTop: 10 }}
//                 >
//                   <LinearGradient
//                     colors={["#ff7b00", "#ff3c00"]}
//                     start={{ x: 0, y: 0 }}
//                     end={{ x: 1, y: 0 }}
//                     style={styles.button}
//                   >
//                     <Text style={styles.buttonText}>Book Now</Text>
//                   </LinearGradient>
//                 </TouchableOpacity>
//                  </View>
//               </View>
//             </View>
//           </View>
//         )}
//       />

//      </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   // container: { flex: 1, backgroundColor: "#0d0d0d" },
//   header: { color: "#fff", fontSize: 26, fontWeight: "800", textAlign: "center", marginVertical: 20,marginTop:60 },
//   card: {
//     width: CARD_WIDTH,
//     backgroundColor: "#1a1a1a",
//     borderRadius: 15,
//     overflow: "hidden",
//     elevation: 5
//   },
//   img: { width: "100%", height: 150 },
//   info: { padding: 10, alignItems: "center" },
//   name: { color: "#fff", fontSize: 16, fontWeight: "600", textAlign: "center" },
//   button: { paddingVertical: 7, paddingHorizontal: 20, borderRadius: 25, marginTop: 5 },
//   buttonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
//   back: { backgroundColor: "#1a1a1a", padding: 12, alignItems: "center" },
// });


import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator, TextInput, Dimensions, StatusBar } from "react-native";
import { WebView } from "react-native-webview";
import LinearGradient from "react-native-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
const API_KEY = "AIzaSyBlOR-zbZb6NDl5PUbFf69RnOKT3CWUyko";

const LOCATIONS = [
  { id: "1", name: "Badshahi Masjid, Lahore", lat: 31.5886, lng: 74.3090 },
  { id: "2", name: "Faisal Mosque, Islamabad", lat: 33.7294, lng: 73.0370 },
  { id: "3", name: "Mazar-e-Quaid, Karachi", lat: 24.8739, lng: 67.0441 },
  { id: "4", name: "Minar-e-Pakistan, Lahore", lat: 31.5925, lng: 74.3095 },
  { id: "5", name: "Lahore Fort", lat: 31.5889, lng: 74.3105 },
  { id: "6", name: "Shalimar Gardens, Lahore", lat: 31.6015, lng: 74.3265 },
  { id: "7", name: "Mohatta Palace, Karachi", lat: 24.8316, lng: 67.0342 },
  { id: "8", name: "Derawar Fort, Bahawalpur", lat: 28.3892, lng: 70.2580 },
];

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 36) / 2;

export default function Explore({ navigation }) {
  const [selected, setSelected] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    LOCATIONS.forEach(fetchImage);
  }, []);

  const fetchImage = async (loc) => {
    try {
      const geoRes = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${loc.lat},${loc.lng}&key=${API_KEY}`
      );
      const geoJson = await geoRes.json();
      const placeId = geoJson.results[0]?.place_id;

      if (!placeId) {
        setLoadedImages((prev) => ({ ...prev, [loc.id]: "NO_IMAGE" }));
        return;
      }

      const detailsRes = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${API_KEY}`
      );
      const detailsJson = await detailsRes.json();

      const photoRef = detailsJson.result.photos?.[0]?.photo_reference;

      const imgUrl = photoRef
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${API_KEY}`
        : `https://maps.googleapis.com/maps/api/staticmap?center=${loc.lat},${loc.lng}&zoom=16&size=400x200&maptype=roadmap&key=${API_KEY}`;

      setLoadedImages((prev) => ({ ...prev, [loc.id]: imgUrl }));
    } catch (err) {
      console.log(err);
      setLoadedImages((prev) => ({ ...prev, [loc.id]: "NO_IMAGE" }));
    }
  };

  const generateHTML = (lat, lng) => `
    <!DOCTYPE html><html><head>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <style>html,body{margin:0;padding:0;height:100%}#pano{width:100vw;height:100vh}</style>
      <script src="https://maps.googleapis.com/maps/api/js?key=${API_KEY}&v=weekly"></script>
      <script>
        function load(){
          new google.maps.StreetViewPanorama(document.getElementById('pano'),{
            position:{lat:${lat},lng:${lng}},
            pov:{heading:10,pitch:5},zoom:1
          });
        } window.onload = load;
      </script>
    </head><body><div id="pano"></div></body></html>
  `;

  if (selected) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity style={styles.back} onPress={() => setSelected(null)}>
          <Text style={{ color: "#fff", fontSize: 16 }}> Back</Text>
            {/* <Icon name="arrow-back" size={20} color="#FFFFFF" /> */}
        </TouchableOpacity>
        <WebView source={{ html: generateHTML(selected.lat, selected.lng) }} style={{ flex: 1 }} />
      </SafeAreaView>
    );
  }

  // Filter locations based on search text and show exact matches first
  const filteredLocations = LOCATIONS.filter((loc) =>
    loc.name.toLowerCase().includes(searchText.toLowerCase())
  ).sort((a, b) => {
    if (a.name.toLowerCase() === searchText.toLowerCase()) return -1;
    if (b.name.toLowerCase() === searchText.toLowerCase()) return 1;
    return 0;
  });

  return (
    <LinearGradient
      colors={["#0C0F1A", "#0A0C14", "#05060A"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <Text style={styles.header}>Pakistan VR Explorer 🇵🇰</Text>

      {/* -------- Search Bar -------- */}
      <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          placeholder="Search locations..."
          placeholderTextColor="#aaa"
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={filteredLocations}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ padding: 12 }}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 16 }}>
            <View style={styles.card}>
              {loadedImages[item.id] ? (
                <Image source={{ uri: loadedImages[item.id] }} style={styles.img} />
              ) : (
                <ActivityIndicator size="large" color="#fff" style={{ height: 150 }} />
              )}

              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <View>
                  <TouchableOpacity onPress={() => setSelected(item)}>
                    <LinearGradient
                      colors={["#6C5CE7", "#6C63FF"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.button}
                    >
                      <Text style={styles.buttonText}>View in VR</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => navigation.navigate("BookingScreen", { location: item })}
                    style={{ marginTop: 10 }}
                  >
                    <LinearGradient
                      colors={["#ff7b00", "#ff3c00"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.button}
                    >
                      <Text style={styles.buttonText}>Book Now</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: { color: "#fff", fontSize: 26, fontWeight: "800", textAlign: "center", marginVertical: 20, marginTop: 60 },
  searchContainer: {
  flexDirection: "row",
  alignItems: "center",
  paddingHorizontal: 12,
  marginBottom: 10,
  backgroundColor: "#11131B",
  borderRadius: 30,
  borderWidth: 1.5,
  borderColor: "#1F2430",
  marginHorizontal:10,
},
searchIcon: {
  marginRight: 8,
},
searchInput: {
  flex: 1,
  color: "#fff",
  paddingVertical: 12,
},
  card: { width: CARD_WIDTH, backgroundColor: "#1a1a1a", borderRadius: 15, overflow: "hidden", elevation: 5 },
  img: { width: "100%", height: 150 },
  info: { padding: 10, alignItems: "center" },
  name: { color: "#fff", fontSize: 16, fontWeight: "600", textAlign: "center" },
  button: { paddingVertical: 7, paddingHorizontal: 20, borderRadius: 25, marginTop: 5 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  back: { backgroundColor: "#1a1a1a", padding: 12, alignItems: "center" },
   backbutton:{
    marginTop: 20,
    backgroundColor:'#999',
   
    height:34,
    width:34,
    borderRadius:17,
    justifyContent:'center',
    alignItems:'center',
  },
});
