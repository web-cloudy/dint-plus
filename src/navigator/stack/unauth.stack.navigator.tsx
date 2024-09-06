import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ROUTES } from "constants";
import { ServicesScreensStack } from "navigator/bottomTabs/Services.tabs.stack";
import PeopleNearby from "screens/ActivityScreen/PeopleNearby/PeopleNearby";
import PeopleNearbyProfile from "screens/ActivityScreen/PeopleNearby/PeopleNearbyProfile";
import ShowNearbyPeople from "screens/ActivityScreen/PeopleNearby/ShowNearbyPeople";
import BuyEvents from "screens/BuyEvents/BuyEvents";
import ChatDetailScreen from "screens/ChatDetailScreen";
import CreateEvent from "screens/CreateEvent";
import EarningDetail from "screens/Earnings/EarningDetail";
import Earnings from "screens/Earnings/Earnings";
import EventDetails from "screens/EventDetails";
import Events from "screens/Events";
import FilterResults from "screens/FilterResults/FilterResults";
import GroupNameScreen from "screens/GroupNameScreen";
import MainScreen from "screens/MainScreen";
import NewGroupScreen from "screens/NewGroupScreen";
import OnBoardingScreen from "screens/OnBoarding";
import PaymentScreen from "screens/PaymentScreen/PaymentScreen";
import SelectContactScreen from "screens/SelectContactScreen";
import { OtpScreen } from "screens/Settings/Accounts/OtpScreen";
import ChatHelp from "screens/Settings/Help/Chats/ChatHelp";
import ChatsBackup from "screens/Settings/Help/ChatsBackup/ChatsBackup";
import Help from "screens/Settings/Help/Help/Help";
import AddCardForPaymentMethod from "screens/Settings/Payment/AddCardForPaymentMethod";
import PaymentMethodScreen from "screens/Settings/Payment/PaymentMethodScreen";
import AddPayout from "screens/Settings/Payouts/AddPayout";
import Payout from "screens/Settings/Payouts/Payout";
import AdvanceSettings from "screens/Settings/Privacy/AdvanceSettings/AdvanceSettings";
import DisappearingMessagesScreen from "screens/Settings/Privacy/PrivacySettings/DisappearingMessagesScreen";
import ServicesScreen from "screens/Settings/ServicesScreen";
import MobileTopUpScreen from "screens/Settings/ServicesScreen/DailyServices/MobileTopUpScreen";
import MoneyScreen from "screens/Settings/ServicesScreen/Money/MoneyScreen";
import QRCodeScanScreen from "screens/Settings/ServicesScreen/Money/QRCodeScanScreen";
import QRCodeViewScreen from "screens/Settings/ServicesScreen/Money/QRCodeViewScreen";
import SendMoneyScreen from "screens/Settings/ServicesScreen/Money/SendMoneyScreen";
import WalletScreen from "screens/Settings/ServicesScreen/WalletScreen";
import MyStatusScreen from "screens/Settings/StatusScreens/MyStatusScreen";
import StarredMessages from "screens/StarredMessages";
import Ticket from "screens/Ticket";

const Stack = createNativeStackNavigator();

const navigatorOptions: NativeStackNavigationOptions = {
  headerShown: false,
};

export const UnAuthStack = () => {
  return (
    <Stack.Navigator screenOptions={navigatorOptions}>
      <Stack.Screen name="Main" component={MainScreen} />
      <Stack.Screen name={ROUTES.OtpScreen} component={OtpScreen} />
      <Stack.Screen name="ChatDetail" component={ChatDetailScreen} />
      <Stack.Screen name="Services" component={ServicesScreen} />
      <Stack.Screen name="OnBoardingScreen" component={OnBoardingScreen} />
      <Stack.Screen name="NewGroup" component={NewGroupScreen} />
      <Stack.Screen name="GroupName" component={GroupNameScreen} />
      <Stack.Screen name="SelectContact" component={SelectContactScreen} />
      <Stack.Screen name="CreateEvent" component={CreateEvent} />
      <Stack.Screen name="StarredMessages" component={StarredMessages} />
      <Stack.Screen name="Ticket" component={Ticket} />
      <Stack.Screen name="EventDetails" component={EventDetails} />
      <Stack.Screen name="FilterResults" component={FilterResults} />
      <Stack.Screen name="BuyEvents" component={BuyEvents} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      <Stack.Screen name="Earnings" component={Earnings} />
      <Stack.Screen name="EarningDetail" component={EarningDetail} />
      <Stack.Screen name="Help" component={Help} />
      <Stack.Screen name="ChatHelp" component={ChatHelp} />
      <Stack.Screen name="ChatBackup" component={ChatsBackup} />
      <Stack.Screen name="AdvanceSettings" component={AdvanceSettings} />
      <Stack.Screen name={"Events"} component={Events} />
      <Stack.Screen name={"PeopleNearby"} component={PeopleNearby} />
      <Stack.Screen name={"ShowNearbyPeople"} component={ShowNearbyPeople} />
      <Stack.Screen
        name={"PeopleNearbyProfile"}
        component={PeopleNearbyProfile}
      />
      <Stack.Screen name={"WalletScreen"} component={WalletScreen} />
      <Stack.Screen name={"PayoutMethodScreen"} component={Payout} />
      <Stack.Screen name={"AddPayoutScreen"} component={AddPayout} />
      <Stack.Screen
        name={"PaymentMethodScreen"}
        component={PaymentMethodScreen}
      />
      <Stack.Screen
        name={"AddCardForPaymentMethod"}
        component={AddCardForPaymentMethod}
      />
      <Stack.Screen name={"MobileTopUpScreen"} component={MobileTopUpScreen} />
      <Stack.Screen name={"MoneyScreen"} component={MoneyScreen} />
      <Stack.Screen name={"QRCodeScanScreen"} component={QRCodeScanScreen} />
      <Stack.Screen name={"SendMoneyScreen"} component={SendMoneyScreen} />
      <Stack.Screen name={"QRCodeViewScreen"} component={QRCodeViewScreen} />
      <Stack.Screen name={"MyStatusScreen"} component={MyStatusScreen} />
      <Stack.Screen
        name={"DisappearingMessagesScreen"}
        component={DisappearingMessagesScreen}
      />
    </Stack.Navigator>
  );
};
