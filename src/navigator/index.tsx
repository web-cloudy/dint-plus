import React, { useCallback, useEffect, useState } from "react";
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import { navigationRef } from "./RootNavigation";
import Login from "screens/Login";
import Splash from "screens/Splash";
import Ticket from "screens/Ticket";
import EventDetails from "screens/EventDetails";
import SignUpScreen from "screens/SignUpScreen";
import ServicesScreen from "screens/Settings/ServicesScreen";
import MainScreen from "screens/MainScreen";
import ChatDetailScreen from "screens/ChatDetailScreen";
import { AuthProvider, useAuth } from "contexts/AuthContext";
import NewGroupScreen from "screens/NewGroupScreen";
import GroupNameScreen from "screens/GroupNameScreen";
import SelectContactScreen from "screens/SelectContactScreen";
import CreateEvent from "screens/CreateEvent";
import { ROUTES } from "constants";
import { CallingScreen, IncomingCallScreen } from "screens";
import OnBoardingScreen from "screens/OnBoarding";
import FilterResults from "screens/FilterResults/FilterResults";
import BuyEvents from "screens/BuyEvents/BuyEvents";
import PaymentScreen from "screens/PaymentScreen/PaymentScreen";
import { ChatSelectors } from "store/slices/chat";
import Earnings from "screens/Earnings/Earnings";
import EarningDetail from "screens/Earnings/EarningDetail";
import { OtpScreen } from "screens/Settings/Accounts/OtpScreen";
import Help from "screens/Settings/Help/Help/Help";
import ChatHelp from "screens/Settings/Help/Chats/ChatHelp";
import ChatsBackup from "screens/Settings/Help/ChatsBackup/ChatsBackup";
import AdvanceSettings from "screens/Settings/Privacy/AdvanceSettings/AdvanceSettings";
import StarredMessages from "screens/StarredMessages";
import useAppDispatch from "hooks/useAppDispatch";
import {
  getVerificationStatusRequest,
  ProfileSelectors,
  updateVerifiedWithOtp,
} from "store/slices/profile";
import PayoutActionModal from "components/organisms/PayoutActionModal";
import AuthenticationPopup from "components/organisms/AuthenticationPopup/AuthenticationPopup";
import { getDataFromAsync, storeDataInAsync } from "utils/LocalStorage";
import { Alert, Appearance } from "react-native";
import { useTheme } from "contexts/ThemeContext";
import { savetoken } from "constants/chatSocket";
import { UnAuthStack } from "./stack/unauth.stack.navigator";
import { AuthStack } from "./stack/auth.stack.navigator";

const Stack = createNativeStackNavigator();

function Navigator(props: any): JSX.Element {  
  const { setUserId, userId, setIsLoggedIn, isLoggedIn } = useAuth();
  const { setTheme, theme } = useTheme();
  // const Socket = React.useCallback((props: any) => {
  //   return <SocketHandler />;
  // }, []);
  const dispatch = useAppDispatch();
  const { verificationCodeResp } = ProfileSelectors();

  useEffect(() => {
    dispatch(getVerificationStatusRequest());
  }, []);

  useEffect(() => {
    console.log("verificationCodeResp ", verificationCodeResp);
    if (verificationCodeResp?.data?.is_pin_set === true) {
      verifiedWithOtp === undefined && dispatch(updateVerifiedWithOtp(true));
    }
  }, [verificationCodeResp]);

  const { incomingCallState, handleIncommingCallState } = ChatSelectors();
  const { verifiedWithOtp } = ProfileSelectors();

  const authScreenOptions: NativeStackNavigationOptions = {
    animationTypeForReplace: "push",
    animation: "slide_from_bottom",
  };
  const renderLandingView = useCallback(() => {
    return isLoggedIn === true ? (
      <Stack.Screen
        name="UnAuthStack"
        component={UnAuthStack}
        options={authScreenOptions}
      />
    ) : (
      <Stack.Screen
        name="AuthStack"
        component={AuthStack}
        options={authScreenOptions}
      />
    );
  }, [setIsLoggedIn, isLoggedIn]);

  return (
    <>
      <NavigationContainer
        ref={navigationRef}
    
        theme={props?.theme === "dark" ? DarkTheme : DefaultTheme}
      >
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          // initialRouteName="Splash"
        >
          {/* <Stack.Screen name="Splash" component={Splash} /> */}

          <Stack.Group>{renderLandingView()}</Stack.Group>

          </Stack.Navigator>
      </NavigationContainer>
      {(incomingCallState || handleIncommingCallState) && (
        <IncomingCallScreen />
      )}

      {verifiedWithOtp && <AuthenticationPopup />}
    </>
  );
}

export default Navigator;
