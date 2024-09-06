import React, { useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { Alert } from "react-native";
import { getCurrentLocation, requestLocationPermission } from "utils";
import { hp, wp } from "utils/metrix";
import {
  View,
  StyleSheet,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  Image,
} from "react-native";
import { useTheme } from "contexts/ThemeContext";
import { getCurrentTheme } from "constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  isVisible: boolean;
  hideModal: () => void;
  onPressDone?: any;
};

const PickLocationOnMap = ({ isVisible, hideModal, onPressDone }: Props) => {
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    // latitudeDelta: 0.0922,
    // longitudeDelta: 0.0421,

    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });

  const [marker, setMarker] = useState({
    latitude: 0,
    longitude: 0,
  });

  const [selectedPosition, setSelectedPosition] = useState({
    latitude: 0,
    longitude: 0,
  });

  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);

  const handleRegionChangeComplete = (region: any) => {
    setRegion(region);
  };

  const handleMarkerDragEnd = (e: any) => {
    setMarker(e.nativeEvent.coordinate);
    setSelectedPosition({
      latitude: e?.nativeEvent?.coordinate?.latitude,
      longitude: e?.nativeEvent?.coordinate?.longitude,
    });
  };

  async function getLocation() {
    const hasPermission = await requestLocationPermission();
    if (hasPermission) {
      try {
        const { latitude, longitude } = await getCurrentLocation();
        console.log("latitude&longitude ", latitude, longitude);
        setRegion({ ...region, latitude: latitude, longitude: longitude });
        setSelectedPosition({ latitude: latitude, longitude: longitude });
        setMarker({ latitude: latitude, longitude: longitude });
        console.log({ ...region, latitude: latitude, longitude: longitude });
      } catch (error: any) {
        Alert.alert("Error getting location", error);
      }
    }
  }

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <Modal visible={isVisible} onRequestClose={hideModal} transparent={true}>
      <SafeAreaView style={styles.container}>
        <View style={styles.topView}>
          <TouchableOpacity onPress={hideModal}>
            <Text style={styles.closeIcon}>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onPressDone(selectedPosition)}>
            <Text style={styles.closeIcon}>Done</Text>
          </TouchableOpacity>
        </View>
        <MapView
          style={styles.mapView}
          initialRegion={region}
          onRegionChangeComplete={handleRegionChangeComplete}
        >
          {region?.latitude != 0 && (
            <Marker
              coordinate={marker}
              draggable={true}
              onDragEnd={handleMarkerDragEnd}
            />
          )}
        </MapView>
      </SafeAreaView>
    </Modal>
  );
};

export default PickLocationOnMap;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.backgroundColor,
      height: hp(95),
      width: wp(100),
      bottom: 0,
      position: "absolute",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 30,
    },
    topView: {
      height: hp(6),
      paddingHorizontal: wp(5),
      paddingTop: hp(2),
      borderTopLeftRadius: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      borderTopRightRadius: 30,
    },
    outerContainer: { flex: 1, justifyContent: "center" },
    mapView: {
      height: hp(89),
      width: wp(100),
      borderTopLeftRadius: 20,
      borderTopRightRadius: 30,
    },
    closeIcon: {
      color: Color.primary,
      fontSize: hp(2),
      fontWeight: "600",
    },
  });
};
