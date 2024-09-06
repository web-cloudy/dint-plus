import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getCurrentTheme } from "constants/Colors";
import { useTheme } from "contexts/ThemeContext";
import Events from "screens/Events";
import ServicesScreen from "screens/Settings/ServicesScreen";

const Stack = createNativeStackNavigator();

export const ServicesScreensStack = () => {
  const { theme } = useTheme();
  const Color = getCurrentTheme(theme || "light");

  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          title: "ServicesScreen",
          headerShown: false,
        }}
        name={"ServicesScreen"}
        component={ServicesScreen}
      />
      <Stack.Screen
        options={{
          title: "Events",
          headerShown: false,
          headerTintColor: Color.plain_white,
        }}
        name={"Events"}
        component={Events}
      />
    </Stack.Navigator>
  );
};
