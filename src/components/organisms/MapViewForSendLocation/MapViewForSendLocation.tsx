import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { getCurrentLocation, requestLocationPermission } from "utils";
import { hp, wp } from "utils/metrix";
import { View, StyleSheet, Text, Modal, Image } from "react-native";
import { useTheme } from "contexts/ThemeContext";
import { getCurrentTheme } from "constants/Colors";
import { ms, mvs } from "react-native-size-matters";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Images } from "assets/images";
import { FONTS } from "constants/fonts";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { ChatSelectors, createMessageAPI } from "store/slices/chat";
import { showToastError, showToastSuccess } from "components";

type Props = {
  isVisible: boolean;
  hideModal: () => void;
  setIsVisible?: any;
  senderId?: any;
  recieverId?: any;
  showSearchPlace?: boolean;
};

const MapViewForSendLocation = ({
  isVisible,
  hideModal,
  setIsVisible,
  recieverId,
  senderId,
  showSearchPlace = true,
}: Props) => {
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });

  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);
  const mapRef = useRef<MapView>(null);
  const dispatch = useDispatch();
  const { loading } = ChatSelectors();

  const handleRegionChangeComplete = (newRegion: any) => {
    setRegion(newRegion);
  };

  async function getLocation() {
    const hasPermission = await requestLocationPermission();
    if (hasPermission) {
      try {
        const { latitude, longitude } = await getCurrentLocation();
        const newRegion = {
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        };
        setRegion(newRegion);
        // Animate to the new region
        mapRef.current?.animateToRegion(newRegion, 1000);
      } catch (error: any) {
        Alert.alert("Error getting location", error.message);
      }
    }
  }

  useEffect(() => {
    getLocation();
  }, []);

  const sendLoaction = async () => {
    try {
      const body = {
        reciever: recieverId,
        sender: senderId,
        content: "Here is my current location.",
        latitude: region?.latitude,
        longitude: region?.longitude,
      };
      const res = await dispatch(createMessageAPI(body));
      if (res?.payload?.code == 200 || res?.payload?.code == 201) {
        setIsVisible(false);
        showToastSuccess(res?.payload?.message);
      } else {
        setIsVisible(false);
        showToastError(res?.payload?.message);
      }
      console.log("🚀 ~ sendLoaction ~ res:", JSON.stringify(res));
    } catch (error) {
      setIsVisible(false);
      showToastError(error?.message);
      console.error(error);
    }
  };

  return (
    <Modal visible={isVisible} onRequestClose={hideModal} transparent={true}>
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          style={[
            styles.mapView,
            { height: showSearchPlace ? hp(60) : hp(100) },
          ]}
          initialRegion={region}
          onRegionChangeComplete={handleRegionChangeComplete}
        />
        <View style={styles.buttonView}>
          <TouchableOpacity
            onPress={() => {
              setIsVisible(false);
            }}
            style={[styles.SendView, { backgroundColor: "red" }]}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              sendLoaction();
            }}
            style={styles.SendView}
          >
            {loading ? (
              <ActivityIndicator size={"small"} />
            ) : (
              <Text style={styles.cancelText}>Send</Text>
            )}
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            getLocation();
          }}
          activeOpacity={0.5}
          style={[
            styles.targetIconView,
            { bottom: showSearchPlace ? hp(44) : hp(10) },
          ]}
        >
          <Image style={styles.targetIcon} source={Images.target} />
        </TouchableOpacity>
        <View
          pointerEvents="none"
          style={[
            styles.markerFixed,
            { top: showSearchPlace ? hp(30) : hp(50) },
          ]}
        >
          <Image
            resizeMode="contain"
            style={styles.marker}
            source={Images.locationPin}
          />
        </View>
        {showSearchPlace && (
          <View style={styles.searchView}>
            <GooglePlacesAutocomplete
              fetchDetails={true}
              enablePoweredByContainer={false}
              debounce={500}
              placeholder="Search for a place"
              styles={{
                textInput: styles.googleSearch,
                textInputContainer: styles.textInputContainer,
                description: {
                  color: "black",
                },
              }}
              textInputProps={{
                placeholderTextColor: "rgb(142,154,175)",
              }}
              keepResultsAfterBlur={true}
              onPress={(data, details = null) => {
                if (details?.geometry?.location) {
                  const { lat, lng } = details.geometry.location;
                  const newRegion = {
                    latitude: lat,
                    longitude: lng,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                  };
                  setRegion(newRegion);
                  // Animate to the new region
                  mapRef.current?.animateToRegion(newRegion, 1000);
                }
              }}
              onFail={(error) => console.error(error)}
              query={{
                key: "AIzaSyCmI0Rfe_sLW3KDfsFwhFQRDdMDJSojwn0",
                language: "en",
              }}
              listEmptyComponent={
                <View
                  style={{ flex: 1, alignSelf: "center", marginTop: hp(5) }}
                >
                  <Text style={styles.notFoundText}>No place was found</Text>
                </View>
              }
            />
          </View>
        )}
      </View>
    </Modal>
  );
};

export default MapViewForSendLocation;

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Color.backgroundColor,
    },
    mapView: {
      height: hp(60),
      width: wp(100),
      borderTopLeftRadius: 20,
      borderTopRightRadius: 30,
    },
    markerFixed: {
      left: wp(50),
      top: hp(30),
      position: "absolute",
      marginLeft: mvs(-24),
      marginTop: mvs(-24),
    },
    marker: {
      height: mvs(48),
      width: mvs(48),
    },
    searchView: {
      flex: 1,
      backgroundColor: Color.white,
      borderTopRightRadius: mvs(10),
      borderTopLeftRadius: mvs(10),
      marginTop: mvs(-5),
    },
    googleSearch: {
      height: 48,
      width: wp(100),
      borderRadius: 10,
      borderWidth: 1.5,
      backgroundColor: Color.light_grey,
      marginTop: mvs(18),
      color: "black",
      textAlign: "center",
    },
    notFoundText: {
      fontSize: ms(16),
      color: Color.grey,
    },
    textInputContainer: {
      width: wp(90),
      alignSelf: "center",
    },
    cancelText: {
      fontSize: ms(16),
      fontFamily: FONTS.robotoRegular,
      color: Color.black,
    },
    SendView: {
      backgroundColor: Color.primary,
      height: ms(30),
      width: ms(60),
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 5,
    },
    buttonView: {
      width: wp(100),
      position: "absolute",
      top: useSafeAreaInsets().top + mvs(10),
      paddingHorizontal: ms(16),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    targetIconView: {
      position: "absolute",
      bottom: hp(44),
      backgroundColor: Color.white,
      height: ms(48),
      width: ms(48),
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 5,
      left: ms(16),
    },
    targetIcon: {
      height: mvs(24),
      width: mvs(24),
      tintColor: "rgb(77,141,219)",
    },
  });
};
