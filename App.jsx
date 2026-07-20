import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigation from '../AR_VR/android/src/Screens/StackNavigation';
const App = () => {
  return (
    <NavigationContainer>
      <StackNavigation />
    </NavigationContainer>
  );
};

export default App;




// import React from "react";
// import { View, Text, StyleSheet, ImageBackground } from "react-native";
// import { BlurView } from "@react-native-community/blur";
// import { TouchableRipple } from "react-native-paper";

// export default function App() {
//   return (
//     <ImageBackground
//       source={{ uri: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" }}
//       style={styles.container}
//     >

//       <TouchableRipple onPress={() => console.log("Pressed")} rippleColor="rgba(255,255,255,0.3)">

//         <View style={styles.cardWrapper}>

//           <BlurView
//             style={styles.blurCard}
//             blurType="light"
//             blurAmount={20}
//             reducedTransparencyFallbackColor="white"
//           >
//             <Text style={styles.title}>Premium Tour</Text>
//             <Text style={styles.desc}>Explore beautiful places with luxury vibes ✨</Text>
//           </BlurView>

//         </View>

//       </TouchableRipple>

//     </ImageBackground>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   cardWrapper: {
//     borderRadius: 20,
//     overflow: "hidden", // IMPORTANT for blur edges
//   },

//   blurCard: {
//     width: 300,
//     height: 180,
//     padding: 20,
//     justifyContent: "center",
//     borderRadius: 20,

//     // glass effect
//     backgroundColor: "rgba(255,255,255,0.15)",
//   },

//   title: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#000",
//   },

//   desc: {
//     marginTop: 10,
//     color: "#333",
//   },
// });