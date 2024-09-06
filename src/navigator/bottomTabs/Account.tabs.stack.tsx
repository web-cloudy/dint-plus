import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ROUTES } from "constants";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import MainSettings from "screens/Settings/MainSettings";
import EditProfileScreen from "screens/EditProfileScreen";
import NotificationSettingsScreen from "screens/Settings/Notifications/NotificationSettingsScreen";
import PrivacySettingsScreen from "screens/Settings/Privacy/PrivacySettings";
import SettingsAccountScreen from "screens/Settings/Accounts/AccountScreen";
import SettingsScreen from "screens/Settings/SettingsScreen";
import ChangeEmailScreen from "screens/Settings/Accounts/ChangeEmailScreen/ChangeEmailScreen";
import { OtpScreen } from "screens/Settings/Accounts/OtpScreen";
import { DeleteAccountScreen } from "screens/Settings/Accounts/DeleteAccountScreen";
import { ChangeNumberScreen } from "screens/Settings/Accounts/ChangeNumberScreen";
import RequestAccountInfo from "screens/Settings/Accounts/RequestAccountInfo/RequestAccountInfo";
import TwoStepVerification from "screens/Settings/TwoStepVerification/TwoStepVerification";
import TellAFriend from "screens/Settings/TellAFriend/TellAFriend";
import Payout from "screens/Settings/Payouts/Payout";
import AddPayout from "screens/Settings/Payouts/AddPayout";
import OtpTwoStepVerification from "screens/Settings/TwoStepVerification/OtpTwoStepVerification";
import ChatSettings from "screens/Settings/ChatSettings";

const Stack = createNativeStackNavigator();

export const AccountScreensStack = () => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");

  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          title: "Account",
          headerShown: false,
        }}
        name={"Account"}
        component={MainSettings}
      />
      <Stack.Screen
        options={{
          title: "Settings",
          headerShown: false,
          headerTintColor: Color.plain_white,
        }}
        name={"Settings"}
        component={SettingsScreen}
      />

      <Stack.Screen
        options={{
          title: "Chat",
          headerShown: false,
          headerTintColor: Color.plain_white,
        }}
        name={"ChatSettings"}
        component={ChatSettings}
      />

      <Stack.Screen
        options={{
          title: "EditProfile",
          headerShown: false,
          headerTintColor: Color.plain_white,
        }}
        name={"EditProfile"}
        component={EditProfileScreen}
      />
      <Stack.Screen
        options={{
          title: "SettingsAccount",
          headerShown: false,
          headerTintColor: Color.plain_white,
        }}
        name={"SettingsAccount"}
        component={SettingsAccountScreen}
      />
      <Stack.Screen
        options={{
          title: ROUTES.ChangeNumberScreen,
          headerShown: false,
          headerTintColor: Color.plain_white,
        }}
        name={ROUTES.ChangeNumberScreen}
        component={ChangeNumberScreen}
      />
      <Stack.Screen
        options={{
          title: ROUTES.ChangeEmailScreen,
          headerShown: false,
          headerTintColor: Color.plain_white,
        }}
        name={ROUTES.ChangeEmailScreen}
        component={ChangeEmailScreen}
      />
      <Stack.Screen
        options={{
          title: ROUTES.OtpScreen,
          headerShown: false,
          headerTintColor: Color.plain_white,
        }}
        name={ROUTES.OtpScreen}
        component={OtpScreen}
      />
      <Stack.Screen
        options={{
          title: ROUTES.DeleteAccountScreen,
          headerShown: false,
          headerTintColor: Color.plain_white,
        }}
        name={ROUTES.DeleteAccountScreen}
        component={DeleteAccountScreen}
      />
      <Stack.Screen
        options={{
          title: "PrivacySettings",
          headerShown: false,
          headerTintColor: Color.plain_white,
        }}
        name={"PrivacySettings"}
        component={PrivacySettingsScreen}
      />
      <Stack.Screen
        options={{
          title: "NotificationSettings",
          headerShown: false,
          headerTintColor: Color.plain_white,
        }}
        name={"NotificationSettings"}
        component={NotificationSettingsScreen}
      />
      <Stack.Screen
        options={{
          title: "RequestAccountInfo",
          headerShown: false,
          headerTintColor: Color.plain_white,
        }}
        name={"RequestAccountInfo"}
        component={RequestAccountInfo}
      />
      <Stack.Screen
        options={{
          title: "TwoStepVerification",
          headerShown: false,
          headerTintColor: Color.plain_white,
        }}
        name={"TwoStepVerification"}
        component={TwoStepVerification}
      />
      <Stack.Screen
        options={{
          title: "TellAFriend",
          headerShown: false,
          headerTintColor: Color.plain_white,
        }}
        name={"TellAFriend"}
        component={TellAFriend}
      />

      <Stack.Screen
        options={{
          title: "Payout",
          headerShown: false,
          headerTintColor: Color.plain_white,
        }}
        name={"Payout"}
        component={Payout}
      />

      <Stack.Screen
        options={{
          title: "AddPayout",
          headerShown: false,
          headerTintColor: Color.plain_white,
        }}
        name={"AddPayout"}
        component={AddPayout}
      />
      <Stack.Screen
        options={{
          title: "OtpTwoStepVerification",
          headerShown: false,
          headerTintColor: Color.plain_white,
        }}
        name={"OtpTwoStepVerification"}
        component={OtpTwoStepVerification}
      />
    </Stack.Navigator>
  );
};
