import { useRouter } from "expo-router";
import { ClockIcon, LockIcon, PillIcon } from "phosphor-react-native";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const onboardingScreen = [
  {
    icon: <PillIcon size={50} color="#2D6A4F" />,
    title: "Never miss a dose",
    subTitle: "Gentle reminders, right when you need them.",
  },
  {
    icon: <LockIcon size={50} color="#2D6A4F" />,
    title: "Stays on your phone",
    subTitle: "No account, no cloud, no one else sees your medicines.",
  },
  {
    icon: <ClockIcon size={50} color="#2D6A4F" />,
    title: "Ready to start ?",
    subTitle: "Takes 10 seconds to add a medcines, dosage, time - that's it.",
  },
];

const Home = () => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const router = useRouter();

  const handleNextScreen = () => {
    if (currentScreen >= onboardingScreen.length - 1) {
      router.replace("/(tabs)/today");
    }

    setCurrentScreen((prev) => prev + 1);
  };

  const handleSkipScreen = () => {
    router.replace("/(tabs)/today");
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flex: 1, justifyContent: "space-between" }}
      >
        <View style={styles.screenContainer}>
          {currentScreen <= onboardingScreen.length - 1 && (
            <View>
              {/* icon container */}
              <View style={styles.iconContainer}>
                {onboardingScreen[currentScreen].icon}
              </View>
              <Text style={styles.title}>
                {onboardingScreen[currentScreen].title}
              </Text>
              <Text style={styles.subTitle}>
                {onboardingScreen[currentScreen].subTitle}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.btnContainer}>
          <View style={styles.indicatorContainer}>
            {onboardingScreen.map((s, idx) => (
              <Text
                style={[
                  styles.indicator,
                  idx === currentScreen && { color: "#2D6A4F" },
                ]}
                key={s.title}
              >
                .
              </Text>
            ))}
          </View>
          <Pressable onPress={handleNextScreen} style={styles.nextBtn}>
            <Text style={styles.nextBtnText}>Next</Text>
          </Pressable>

          <Pressable onPress={handleSkipScreen} style={styles.skipBtn}>
            <Text style={styles.skipBtnText}>Skip</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  screenContainer: {
    padding: 50,
  },
  iconContainer: {
    backgroundColor: "lightgray",
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: "100%",
    margin: 50,
    padding: 20,
  },
  title: {
    textAlign: "center",
    fontSize: 25,
  },
  subTitle: {
    textAlign: "center",
    marginBlockStart: 10,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  indicator: {
    fontSize: 80,
    color: "lightgray",
  },
  btnContainer: {
    paddingInline: 30,
    // borderWidth: 1,
    marginBlockEnd: 70,
  },

  nextBtn: {
    backgroundColor: "#2D6A4F",
    paddingVertical: 10,
    borderRadius: 10,
  },
  nextBtnText: {
    textAlign: "center",
    color: "#FAF8F4",
    fontWeight: 700,
  },
  skipBtn: {
    marginBlock: 20,
  },
  skipBtnText: {
    color: "#2D6A4F",
    textAlign: "center",
  },
});
