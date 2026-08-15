import { useAppState } from "@react-native-community/hooks";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { COLORS } from "../constants/theme";
import "../global.css";
import { useNotifications } from "../hooks/useNotifications";
import Store, { persistor } from "../store/index";
import { updateToday } from "../store/slices/appSlice";

const AppStateWatcher = () => {
  const dispatch = useDispatch();
  const currentState = useAppState();

  useNotifications();

  useEffect(() => {
    dispatch(updateToday());
  }, [dispatch]);

  useEffect(() => {
    if (currentState === "active") {
      dispatch(updateToday());
    }
  }, [dispatch, currentState]);

  return null;
};

export default function RootLayout() {
  return (
    <Provider store={Store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppStateWatcher />
        <StatusBar style="light" backgroundColor={COLORS.accentPrimary} />
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
  );
}
