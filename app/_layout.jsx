import { useAppState } from "@react-native-community/hooks";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "../global.css";
import Store, { persistor } from "../store/index";
import { updateToday } from "../store/slices/appSlice";
import { selectOnboardingStatus } from "../store/slices/onboardingSlice";

const AppNavigation = () => {
  const onbordingStatus = useSelector(selectOnboardingStatus);
  const dispatch = useDispatch();
  const currentState = useAppState();

  useEffect(() => {
    dispatch(updateToday());
  }, []);

  useEffect(() => {
    if (currentState === "active") {
      dispatch(updateToday());
    }
  }, [dispatch, currentState]);

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
