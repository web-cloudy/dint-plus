import React, { useEffect } from "react";
import { StyleSheet, Image, StatusBar, Alert, Appearance } from "react-native";
import applogo from "assets/images/app-logo.png";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { getDataFromAsync, storeDataInAsync } from "utils/LocalStorage";
import { useAuth } from "contexts/AuthContext";
import { getCurrentTheme } from "constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { savetoken } from "constants/chatSocket";
import { useTheme } from "contexts/ThemeContext";

const Splash = () => {
  const { setUserId, setIsLoggedIn } = useAuth();
  const { setTheme, theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");
  const styles = screenStyles(Color);

  useEffect(() => {
    const checkLoginSession = async () => {
      const token = await getDataFromAsync("token");
      const userId = await getDataFromAsync("userId");
      const storedTheme = await getDataFromAsync("theme");
      const systemTheme = Appearance.getColorScheme();
      const themeToSet = storedTheme || systemTheme;
      if (!storedTheme) {
        await storeDataInAsync("theme", systemTheme);
      }
      setTheme(themeToSet);
        if (token && userId) {
          setUserId(userId);
          savetoken(token);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
    };
    checkLoginSession();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Color.white} />
      <Image source={applogo} style={styles.imgStyle} />
    </SafeAreaView>
  );
};

const screenStyles = (Color: any) => {
  return StyleSheet.create({
    imgStyle: {
      width: widthPercentageToDP(30),
      height: widthPercentageToDP(30),
    },
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: Color.white,
      position:'absolute',
      top:0, bottom:0,
      zIndex:1000,
      left:0, right:0
    },
  });
};

export default Splash;
