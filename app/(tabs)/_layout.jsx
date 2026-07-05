import { router, Tabs } from "expo-router";
import {
  CalendarDotIcon,
  ClockCounterClockwiseIcon,
  GearIcon,
  PillIcon,
} from "phosphor-react-native";

import AddButton from "../../components/micro/AddButton";

const Mainlayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2D6A4F",
        tabBarInactiveTintColor: "gray",
        animation: "fade",
      }}
    >
      <Tabs.Screen
        name="today"
        options={{
          title: "Today",
          tabBarLabel: "Today",
          tabBarIcon: ({ color, size }) => (
            <CalendarDotIcon color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="medicines"
        options={{
          title: "Medicines",
          tabBarLabel: "Medicines",
          tabBarIcon: ({ color, size }) => (
            <PillIcon color={color} size={size} />
          ),
        }}
      />

      {/* custom button */}

      <Tabs.Screen
        name="addmedicine"
        options={{
          title: "Add Medicine",
          headerShown: false,
          tabBarButton: AddButton,
          tabBarStyle: {
            display: "none",
          },
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.replace("/addmedicine");
          },
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarLabel: "History",
          tabBarIcon: ({ color, size }) => (
            <ClockCounterClockwiseIcon color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarLabel: "Setting",
          tabBarIcon: ({ color, size }) => (
            <GearIcon color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="meddetail"
        options={{
          href: null,
          headerShown: false,
          tabBarStyle: {
            display: "none",
          },
        }}
      />
    </Tabs>
  );
};

export default Mainlayout;
