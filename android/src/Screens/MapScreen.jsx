import React, { useState } from 'react';
import { View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const MapScreen = () => {
  const [region, setRegion] = useState({
    latitude: 30.3753, // Pakistan center
    longitude: 69.3451,
    latitudeDelta: 5,
    longitudeDelta: 5,
  });

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        region={region}
      >
        <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
      </MapView>
    </View>
  );
};

export default MapScreen;
