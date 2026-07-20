import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Dimensions, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const BookTour = () => {
  const [tours, setTours] = useState([]);
  const [payLoadingId, setPayLoadingId] = useState(null);
  const navigation = useNavigation();
  useEffect(() => {
    loadTours();
  }, []);

  const loadTours = () => {
    fetch("http://192.168.100.178:5000/tours")
      .then(res => res.json())
      .then(data => setTours(data))
      .catch(err => console.log(err));
  }
  return (
    <LinearGradient colors={['#01411C', '#0B6B3A', '#FFFFFF']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, }}>
        <StatusBar barStyle={"light-content"} />
        <FlatList
          data={tours}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 12 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {item.image && (
                <Image
                  source={{ uri: item.image }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
              )}

              <View style={styles.cardContent}>
                <Text>{item.location}</Text>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.price}>Rs {item.price}</Text>
                <Text style={styles.description}>{item.description}</Text>

                <LinearGradient
                  colors={['#28a745', '#b4e197']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.buttonWrapper}
                >
                  <TouchableOpacity
                    onPress={() => navigation.navigate('BookingScreen', { tour: item })}
                    style={styles.button}
                    disabled={payLoadingId === item.id} // 🔥 disable while loading
                  >
                    <Text style={styles.buttonText}>
                      {payLoadingId === item.id ? "Processing..." : "Book Ride"}
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </View>
          )}
        />
      </SafeAreaView>
    </LinearGradient>
  )
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: width * 0.5,
  },
  cardContent: {
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#155724',
    marginBottom: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#28a745',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#155724',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  buttonWrapper: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 25,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center'
  }
});
export default BookTour;