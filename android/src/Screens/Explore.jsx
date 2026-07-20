import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  TextInput,
  Dimensions,
  Modal,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import WebView from "react-native-webview"
const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 36) / 2;
const API_KEY = 'AIzaSyBlOR-zbZb6NDl5PUbFf69RnOKT3CWUyko';

const LOCATIONS = [
  { id: '1', name: 'Badshahi Masjid, Lahore', lat: 31.5886, lng: 74.309 },
  { id: '2', name: 'Faisal Mosque, Islamabad', lat: 33.7294, lng: 73.037 },
  { id: '3', name: 'Mazar-e-Quaid, Karachi', lat: 24.8739, lng: 67.0441 },
  { id: '4', name: 'Minar-e-Pakistan, Lahore', lat: 31.5925, lng: 74.3095 },
  { id: '5', name: 'Lahore Fort', lat: 31.5889, lng: 74.3105 },

  { id: '6', name: 'Mohatta Palace, Karachi', lat: 24.8316, lng: 67.0342 },

  { id: '7', name: 'Mall Road, Murree', lat: 33.9069, lng: 73.3941 },
  { id: '8', name: 'Centaurus Mall, Islamabad', lat: 33.7078, lng: 73.0499 },
  {
    id: '9',
    name: 'Daman-e-Koh',
    lat: 33.73848146761944,
    lng: 73.05659389697456,
  },
  {
    id: '10',
    name: 'Shakarparian National Park',
    lat: 33.69009189651279,
    lng: 73.09379964115332,
  },
  {
    id: '11',
    name: 'Rawal Lake Park',
    lat: 33.693176381457185,
    lng: 73.1220415120602,
  },

  {
    id: '12',
    name: 'Kashmir Point',
    lat: 33.9139738559702,
    lng: 73.40430374946781,
  },
  {
    id: '13',
    name: 'Pindi Point (Chair Lift) Murree Hills',
    lat: 33.893416881243056,
    lng: 73.37849827645022,
  },
  {
    id: '14',
    name: 'Ayubia National Park',
    lat: 34.06447603335609,
    lng: 73.40651314488075,
  },
  {
    id: '15',
    name: 'Naran Town Apartment',
    lat: 47.846347082120076,
    lng: 106.79000369600175,
  },
  {
    id: '16',
    name: 'Saif ul Malook Lake',
    lat: 34.87748142560702,
    lng: 73.69452779281337,
  },
  {
    id: '17',
    name: 'Babusar Top track view point',
    lat: 35.14698470014142,
    lng: 74.04667180868717,
  },

  { id: '18', name: 'Shogran', lat: 34.64110485209841, lng: 73.46450644181336 },
  {
    id: '19',
    name: 'Siri Paye',
    lat: 34.618086448748045,
    lng: 73.483749168185,
  },
  { id: '20', name: 'Malam Jabba National Forest', lat: 33.7078, lng: 73.0499 },
  {
    id: '21',
    name: 'Malam Jabba Chair Lifts',
    lat: 34.79919477430394,
    lng: 72.57307451052223,
  },
  { id: '22', name: 'Fizagat', lat: 34.79559938312855, lng: 72.40029040663724 },

  {
    id: '23',
    name: 'Ushu Forest',
    lat: 35.495316896307216,
    lng: 72.59371411375136,
  },

  {
    id: '24',
    name: 'Blue Lake, Nalter',
    lat: 36.236693146311666,
    lng: 74.10050327198172,
  },

  {
    id: '25',
    name: 'Baltit Fort',
    lat: 36.325815998177184, lng: 74.66949877384054
  },
  {
    id: '26',
    name: 'Altit Fort',
    lat: 36.317575271437676,
    lng: 74.68198256019312,
  },

  {
    id: '27',
    name: 'Passu Cones Viewpoint',
    lat: 36.49292525861139,
    lng: 74.8809789944231,
  },
  { id: '28', name: 'Gulmit', lat: 36.38906393411383, lng: 74.86514864882497 },

  {
    id: '29',
    name: 'Hussaini Suspension Bridge',
    lat: 36.42356510867843,
    lng: 74.88217781043248,
  },

  {
    id: '30',
    name: 'Eagles Nest Viewpoint',
    lat: 51.67387643896627,
    lng: -2.6835426981528863,
  },
  {
    id: '31',
    name: 'Shangrila Resort Skardu',
    lat: 35.42605264367282,
    lng: 75.45618230396202,
  },

  {
    id: '32',
    name: 'Lower Kachura Lake',
    lat: 35.426873435170826,
    lng: 75.45498409871169,
  },

  {
    id: '33',
    name: 'Katpana Desert',
    lat: 35.31594866250827,
    lng: 75.59988667378443,
  },
  {
    id: '34',
    name: 'Deosai National Park',
    lat: 34.9706615766805,
    lng: 75.47226345064684,
  },

  {
    id: '35',
    name: 'Serena Shigar Fort',
    lat: 35.4230157501056,
    lng: 75.74269097671667,
  },
  {
    id: '36',
    name: 'Serena Khaplu Palace',
    lat: 35.15188073134311,
    lng: 76.33562030702461,
  },

  {
    id: '37',
    name: 'Rama Meadows',
    lat: 35.3494979243836,
    lng: 74.80419798564783,
  },
  {
    id: '38',
    name: 'Rama Lake',
    lat: 35.330270772439015,
    lng: 74.78538097763777,
  },


  { id: '39', name: 'Kel', lat: 34.82718001814831, lng: 74.35895242370425 },
  {
    id: '40',
    name: 'Toli Peer',
    lat: 33.88683748929917,
    lng: 73.91932853323411,
  },


  {
    id: '41',
    name: 'Pakistan Maritime Museum',
    lat: 24.886045048902467,
    lng: 67.09041161933139,
  },

  {
    id: '42',
    name: 'Rush Lake',
    lat: 36.17435293073414,
    lng: 74.88276416046303,
  },

  {
    id: '43',
    name: 'Ranikot Fort',
    lat: 25.897318755572364,
    lng: 67.90216742586786,
  },
  {
    id: '44',
    name: 'Makli Necropolis',
    lat: 24.752068101206902,
    lng: 67.89856553466932,
  },
  {
    id: '45',
    name: 'Derawar Fort',
    lat: 28.76821517736611,
    lng: 71.33463724462182,
  },
  {
    id: '46',
    name: 'Noor Mahal',
    lat: 29.379511468009923,
    lng: 71.66839455500981,
  },

  {
    id: '47',
    name: 'Katas Raj Temple Complex',
    lat: 32.72419617153398,
    lng: 72.95200827550133,
  },
  {
    id: '48',
    name: 'Rohtas Fort(Jhelum)',
    lat: 32.965163161790684,
    lng: 73.5734009743702,
  },
  {
    id: '49',
    name: 'Taxila Museum',
    lat: 33.74614560194813,
    lng: 72.81905376039339,
  },

  {
    id: '50',
    name: 'Nanga Parbat Base Camp',
    lat: 35.32006584548789,
    lng: 74.58544164865619,
  },

  {
    id: '51',
    name: 'Hopper Glacier View point',
    lat: 36.214044313656636,
    lng: 74.76927160269899,
  },
  {
    id: '52',
    name: 'Concordia Campsite.18 5kpeaks campsite',
    lat: 35.73643094242929,
    lng: 76.3709360319855,
  },

  {
    id: '53',
    name: 'Basho Valley (Sultanabad Medow)',
    lat: 35.45343078107898,
    lng: 75.31146331004379,
  },
  {
    id: '54',
    name: 'Shaktipeeth Shri Hinglaj Mata Mandir',
    lat: 25.51476339268255,
    lng: 65.51831144633842,
  },
  {
    id: '55',
    name: 'Quaid-i-Azam Residency, Ziarat Balochistan',
    lat: 30.379155891654978, lng: 67.72672281163791
  },
  {
    id: '56',
    name: 'Taobat Bala',
    lat: 34.73664190045999, lng: 74.73430569133528
  },
  {
    id: '57',
    name: 'Ratti Gali Lake',
    lat: 34.82993817896989, lng: 74.0609406807033
  },
  {
    id: '58',
    name: 'Chitta Katha Lake',
    lat: 34.919751392904956, lng: 74.52159661646452
  },
  {
    id: '59',
    name: 'Spoon Lake',
    lat: 34.97328711731403, lng: 74.51343201928692
  },
  {
    id: '60',
    name: 'Chukar Hill Shell',
    lat: 47.30666097045088, lng: -119.56066802360368
  },
  {
    id: '61',
    name: 'Jalkhand',
    lat: 35.00714322583654, lng: 73.94331066896291
  },
  {
    id: '62',
    name: 'Dudipatsar Lake',
    lat: 35.01754646853937, lng: 74.09021975367352
  },
  {
    id: '63',
    name: 'Ansoo Lake',
    lat: 34.813884786314375, lng: 73.67691814095613
  },
  {
    id: '64',
    name: 'Bahrain',
    lat: 35.20764331563521, lng: 72.54547892930402
  },
  {
    id: '65',
    name: 'Jarogo Waterfall Swat Valley',
    lat: 35.10215651212882, lng: 72.21375636584328
  },
  {
    id: '66',
    name: 'Misgar',
    lat: 36.7882750169548, lng: 74.76735895251853
  },
  {
    id: '67',
    name: 'Kund Bangla Forest Office',
    lat: 34.57619137818384, lng: 73.29649618206474
  },
  {
    id: '68',
    name: 'Nathia Gali',
    lat: 34.075025824544184, lng: 73.3794098339492
  },
  {
    id: '69',
    name: 'Changla Gali',
    lat: 33.99556734887321, lng: 73.3837741305032
  },
  {
    id: '70',
    name: 'Patriata',
    lat: 33.872047265691435, lng: 73.46310080493215
  },
  {
    id: '71',
    name: 'The White Palace | Marghazar',
    lat: 34.66335668123562, lng: 72.34541432440327
  },
  {
    id: '72',
    name: 'Kiwai',
    lat: 34.62753412547599, lng: 73.44878695766214
  },
  {
    id: '73',
    name: 'Kutton Water Fall',
    lat: 34.55102933011294, lng: 73.83127792163202
  },
  {
    id: '74',
    name: 'Sharda main bazar',
    lat: 34.794801173146574, lng: 74.19350623699029
  },
  {
    id: '75',
    name: 'Banjosa Lake',
    lat: 33.810255717052286, lng: 73.81701696810346
  },
  {
    id: '76',
    name: 'Khewra Salt Mine',
    lat: 32.64814244630549, lng: 73.00892207920522
  },
  {
    id: '77',
    name: 'Hingol Balochistan National Park',
    lat: 25.51479116908549, lng: 65.52016256733866
  },
  {
    id: '78',
    name: 'Changa Manga Forest Park',
    lat: 31.071054329983866, lng: 73.98276187541927
  },
  {
    id: '79',
    name: 'Duiker Hill',
    lat: 36.32454815158898, lng: 74.69105066034923
  },
  {
    id: '80',
    name: 'Dhanni Waterfall',
    lat: 34.42427177207641, lng: 73.69158146395277
  },
  {
    id: '81',
    name: 'Shamspir Island',
    lat: 24.84465502474069, lng: 66.92018409858409
  },
  {
    id: '82',
    name: 'Khanpur Dam',
    lat: 33.80201875569284, lng: 72.93048305279648
  },
  {
    id: '83',
    name: 'Simly Dam',
    lat: 33.719067451831876, lng: 73.34057840253512
  },
  {
    id: '84',
    name: 'Kundal Shahi Waterfall',
    lat: 34.550964376335045, lng: 73.83124540257919
  },


];

export default function Explore({ navigation }) {
  // Later, if user clicks profile:
  const [selected, setSelected] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});
  const [searchText, setSearchText] = useState('');

  const listRef = useRef(null);
  const scrollOffset = useRef(0);

  useEffect(() => {
    LOCATIONS.forEach(fetchImage);
  }, []);

  const fetchImage = async loc => {
    try {
      const geoRes = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${loc.lat},${loc.lng}&key=${API_KEY}`,
      );
      const geoJson = await geoRes.json();
      const placeId = geoJson.results[0]?.place_id;

      if (!placeId) return;

      const detailsRes = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos&key=${API_KEY}`,
      );
      const detailsJson = await detailsRes.json();

      const photoRef = detailsJson.result.photos?.[0]?.photo_reference;

      const imgUrl = photoRef
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${API_KEY}`
        : `https://maps.googleapis.com/maps/api/staticmap?center=${loc.lat},${loc.lng}&zoom=16&size=400x200&key=${API_KEY}`;

      setLoadedImages(prev => ({ ...prev, [loc.id]: imgUrl }));
    } catch (e) {
      console.log(e);
    }
  };

  const generateHTML = (lat, lng) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      <style>
        html,body { margin:0; padding:0; height:100%; }
        #pano { width:100vw; height:100vh; }
      </style>
      <script src="https://maps.googleapis.com/maps/api/js?key=${API_KEY}"></script>
      <script>
        function load(){
          new google.maps.StreetViewPanorama(
            document.getElementById('pano'),
            {
              position:{lat:${lat},lng:${lng}},
              pov:{heading:0,pitch:0},
              zoom:1
            }
          );
        }
        window.onload = load;
      </script>
    </head>
    <body>
      <div id="pano"></div>
    </body>
    </html>
  `;

  const filteredLocations = LOCATIONS.filter(loc =>
    loc.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <LinearGradient
      colors={['#01411C', '#0B6B3A', '#FFFFFF']}
      style={{ flex: 1 }}
    >
      <Text style={styles.header}>Pakistan VR Explorer 🇵🇰</Text>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#999" />
        <TextInput
          placeholder="Search locations..."
          placeholderTextColor="#aaa"
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />
      </View>

      {/* Cards */}
      <FlatList
        ref={listRef}
        data={filteredLocations}
        keyExtractor={item => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 12 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        onScroll={e => {
          scrollOffset.current = e.nativeEvent.contentOffset.y;
        }}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 16 }}>
            <View style={styles.card}>
              {loadedImages[item.id] ? (
                <Image source={{ uri: loadedImages[item.id] }} style={styles.img} />
              ) : (
                <ActivityIndicator color="#fff" style={{ height: 150 }} />
              )}

              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>

                <TouchableOpacity onPress={() => setSelected(item)}>
                  <LinearGradient
                    colors={['#01411C', '#0B6B3A',]}
                    style={styles.button}
                  >
                    <Text style={[styles.buttonText, { color: '#fff' }]}>View in VR</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ marginTop: 10 }}
                  onPress={() =>
                    navigation.navigate('AR', { location: item })
                  }
                >
                  <LinearGradient
                    colors={['#c8f2dc', '#FFFFFF']}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>View in AR</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {/* 🔥 VR MODAL */}
      <Modal visible={!!selected} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
          <TouchableOpacity
            style={styles.back}
            onPress={() => setSelected(null)}
          >
            <Text style={{ color: '#fff', fontSize: 16 }}>Back</Text>
          </TouchableOpacity>

          {selected && (
            <WebView
              source={{ html: generateHTML(selected.lat, selected.lng) }}
              style={{ flex: 1 }}
            />
          )}
        </SafeAreaView>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginVertical: 20,
    marginTop: 60,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 10,
    backgroundColor: '#11131B',
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: '#1F2430',
    marginHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    paddingVertical: 10,
    marginLeft: 8,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    overflow: 'hidden',
  },
  img: { width: '100%', height: 150 },
  info: { padding: 10, alignItems: 'center' },
  name: { color: '#fff', textAlign: 'center', marginBottom: 5 },
  button: {
    paddingVertical: 7,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 5,
  },
  buttonText: { fontWeight: 'bold' },
  back: {
    padding: 10,
    backgroundColor: '#111',
    alignItems: 'center',
  },
});

