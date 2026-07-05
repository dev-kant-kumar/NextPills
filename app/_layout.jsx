import { Stack } from "expo-router";
import { Provider } from "react-redux";
import "../global.css";
import Store from "../store/index";

const RootLayout = () => {
  return (
    <Provider store={Store}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ title: "Home", headerShown: false }}
        />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </Provider>
  );
};

export default RootLayout;
