import { useAppState } from "@react-native-community/hooks";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { COLORS } from "../constants/theme";
import "../global.css";
import { useNotifications } from "../hooks/useNotifications";
import Store, { persistor } from "../store/index";
import { updateToday } from "../store/slices/appSlice";

import * as NavigationBar from "expo-navigation-bar";
import { Platform, StatusBar as RNStatusBar } from "react-native";

const AppStateWatcher = () => {
  const dispatch = useDispatch();
  const currentState = useAppState();

  useNotifications();

  useEffect(() => {
    if (Platform.OS === "android") {
      RNStatusBar.setTranslucent(true);
      RNStatusBar.setBackgroundColor("transparent", true);
      RNStatusBar.setBarStyle("light-content", true);
      NavigationBar.setButtonStyleAsync("dark").catch(() => {});
    }
  }, []);

  useEffect(() => {
    dispatch(updateToday());
  }, [dispatch]);

  useEffect(() => {
    if (currentState === "active") {
      dispatch(updateToday());
      if (Platform.OS === "android") {
        RNStatusBar.setTranslucent(true);
        RNStatusBar.setBackgroundColor("transparent", true);
        RNStatusBar.setBarStyle("light-content", true);
        NavigationBar.setButtonStyleAsync("dark").catch(() => {});
      }
    }
  }, [dispatch, currentState]);

  return null;
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Provider store={Store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppStateWatcher />
          <StatusBar style="light" translucent backgroundColor="transparent" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: COLORS.surfaceBase },
            }}
          >
            <Stack.Screen
              name="index"
              options={{ title: "Onboarding", headerShown: false }}
            />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="addmedicine" options={{ headerShown: false }} />
            <Stack.Screen name="meddetail" options={{ headerShown: false }} />
            <Stack.Screen name="privacy" options={{ headerShown: false }} />
          </Stack>
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
}
