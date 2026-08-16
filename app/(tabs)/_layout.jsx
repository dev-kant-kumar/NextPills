import { Tabs } from "expo-router";
import {
  CalendarDotIcon,
  ClockCounterClockwiseIcon,
  GearIcon,
  PillIcon,
} from "phosphor-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../../constants/theme";

const MainLayout = () => {
  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom || 0;
  const bottomPadding = bottomInset > 0 ? bottomInset + 4 : 8;
  const tabHeight = 56 + bottomPadding;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.accentPrimary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.surfaceBase,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: tabHeight,
          paddingBottom: bottomPadding,
          paddingTop: 6,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.04,
          shadowRadius: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
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
