import { Tabs } from "expo-router";
import {
  CalendarDotIcon,
  ClockCounterClockwiseIcon,
  GearIcon,
  PillIcon,
} from "phosphor-react-native";
import { COLORS } from "../../constants/theme";

const MainLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.accentPrimary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.surfaceCard,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
        },
        headerStyle: {
          backgroundColor: COLORS.surfaceBase,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          color: COLORS.textPrimary,
          fontSize: 20,
          fontWeight: "600",
        },
        sceneStyle: {
          backgroundColor: COLORS.surfaceBase,
        },
      }}
    >
      <Tabs.Screen
        name="today"
        options={{
          title: "Today",
          headerShown: false,
          tabBarLabel: "Today",
          tabBarIcon: ({ color, size }) => (
            <CalendarDotIcon color={color} size={size || 24} />
          ),
        }}
      />

      <Tabs.Screen
        name="medicines"
        options={{
          title: "Medicines",
          headerShown: false,
          tabBarLabel: "Medicines",
          tabBarIcon: ({ color, size }) => (
            <PillIcon color={color} size={size || 24} />
          ),
        }}
      />

      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          headerShown: false,
          tabBarLabel: "History",
          tabBarIcon: ({ color, size }) => (
            <ClockCounterClockwiseIcon color={color} size={size || 24} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerShown: false,
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <GearIcon color={color} size={size || 24} />
          ),
        }}
      />
    </Tabs>
  );
};

export default MainLayout;
