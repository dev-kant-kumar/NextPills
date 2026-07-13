import { Stack } from "expo-router";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "../global.css";
import Store, { persistor } from "../store/index";
import { selectOnboardingStatus } from "../store/slices/onboardingSlice";

const AppNavigation = () => {
  const onbordingStatus = useSelector(selectOnboardingStatus);
  return (
    <Stack>
      {!onbordingStatus && (
        <Stack.Screen
          name="index"
          options={{ title: "Home", headerShown: false }}
        />
      )}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
};

const RootLayout = () => {
  return (
    <Provider store={Store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppNavigation />
      </PersistGate>
    </Provider>
  );
};

export default RootLayout;
