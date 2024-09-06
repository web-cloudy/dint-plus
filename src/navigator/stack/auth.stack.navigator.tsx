import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ROUTES } from "constants";
import Login from "screens/Login";
import OnBoardingScreen from "screens/OnBoarding";
import { OtpScreen } from "screens/Settings/Accounts/OtpScreen";
import SignUpScreen from "screens/SignUpScreen";

const Stack = createNativeStackNavigator();

const navigatorOptions: NativeStackNavigationOptions = {
  headerShown: false,
};

export const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={navigatorOptions}>
      <Stack.Screen
        name={ROUTES.Login} component={Login} 
      />
      <Stack.Screen
        name="SignUp" component={SignUpScreen} 
      />
      <Stack.Screen
        name={ROUTES.OtpScreen} component={OtpScreen} 
      />

      <Stack.Screen
       name="OnBoardingScreen" component={OnBoardingScreen} 
      />
      
    </Stack.Navigator>
  );
};
