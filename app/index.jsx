import { Redirect, useRouter } from "expo-router";
import {
  BellRingingIcon,
  ClockIcon,
  LockIcon,
  PillIcon,
  UserIcon,
} from "phosphor-react-native";
import { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import { updateSettings } from "../store/slices/appSlice";
import { onBoarded, selectOnboardingStatus } from "../store/slices/onboardingSlice";
import { requestNotificationPermissions } from "../utils/notificationHelper";

const onboardingScreens = [
  {
    icon: <PillIcon size={56} color={COLORS.accentPrimary} />,
    title: "Never miss a dose",
    subTitle: "Gentle reminders, right when you need them.",
  },
  {
    icon: <LockIcon size={56} color={COLORS.accentPrimary} />,
    title: "Stays on your phone",
    subTitle: "No account, no cloud, no one else sees your health data.",
  },
  {
    icon: <BellRingingIcon size={56} color={COLORS.accentPrimary} />,
    title: "Enable Notifications",
    subTitle:
      "NextPills needs notification permission to send you timely medicine reminders. Without it, you may miss your doses.",
    isNotificationStep: true,
  },
  {
    icon: <ClockIcon size={56} color={COLORS.accentPrimary} />,
    title: "Ready to start?",
    subTitle:
      "Takes 10 seconds to add your medicines, dosage, and times — that's it.",
  },
];

const Onboarding = () => {
  const onboardingStatus = useSelector(selectOnboardingStatus);
  const [currentScreen, setCurrentScreen] = useState(0);
  const [nameInput, setNameInput] = useState("");
  const [notifGranted, setNotifGranted] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  if (onboardingStatus) {
    return <Redirect href="/(tabs)/today" />;
  }

  const handleRequestNotifPermission = async () => {
    const granted = await requestNotificationPermissions();
    setNotifGranted(granted);
    if (granted) {
      // Move to next step after granting
      setCurrentScreen((prev) => prev + 1);
    } else {
      Alert.alert(
        "Notifications Disabled",
        "You can enable notifications later from your device Settings. Medicine reminders won't work without them.",
        [
          { text: "Continue Anyway", onPress: () => setCurrentScreen((prev) => prev + 1) },
        ],
      );
    }
  };

  const handleNextScreen = () => {
    const activeItem = onboardingScreens[currentScreen];

    // If this is the notification step, request permission instead of just advancing
    if (activeItem.isNotificationStep) {
      handleRequestNotifPermission();
      return;
    }

    if (currentScreen >= onboardingScreens.length - 1) {
      handleFinishOnboarding();
    } else {
      setCurrentScreen((prev) => prev + 1);
    }
  };

  const handleFinishOnboarding = () => {
    if (nameInput.trim()) {
      dispatch(updateSettings({ userName: nameInput.trim() }));
    }
    dispatch(onBoarded());
    router.replace("/(tabs)/today");
  };

  const activeItem = onboardingScreens[currentScreen];
  const isLast = currentScreen === onboardingScreens.length - 1;
  const isNotifStep = activeItem.isNotificationStep;

  // Determine button text
  let btnText = "Next";
  if (isLast) btnText = "Get Started";
  if (isNotifStep) btnText = "Enable Notifications";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <View
            style={[
              styles.iconContainer,
              isNotifStep && styles.iconContainerNotif,
            ]}
          >
            {activeItem.icon}
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>{activeItem.title}</Text>
          <Text style={styles.subTitle}>{activeItem.subTitle}</Text>
        </View>

        {/* User Name Field on Last Slide */}
        {isLast && (
          <View style={styles.nameInputContainer}>
            <View style={styles.nameInputWrapper}>
              <UserIcon size={20} color={COLORS.accentPrimary} />
              <TextInput
                style={styles.nameInput}
                placeholder="Enter your name (optional)"
                placeholderTextColor={COLORS.textMuted}
                value={nameInput}
                onChangeText={setNameInput}
                autoCapitalize="words"
              />
            </View>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.indicatorContainer}>
          {onboardingScreens.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.indicatorDot,
                idx === currentScreen ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        <Pressable onPress={handleNextScreen} style={styles.nextBtn}>
          <Text style={styles.nextBtnText}>{btnText}</Text>
        </Pressable>

        {!isLast && (
          <Pressable
            onPress={
              isNotifStep
                ? () => setCurrentScreen((prev) => prev + 1)
                : handleFinishOnboarding
            }
            style={styles.skipBtn}
          >
            <Text style={styles.skipBtnText}>
              {isNotifStep ? "Maybe Later" : "Skip"}
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surfaceBase,
    justifyContent: "space-between",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.xxl,
  },
  iconWrapper: {
    marginBottom: SPACING.xl,
  },
  iconContainer: {
    backgroundColor: COLORS.surfaceSunken,
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconContainerNotif: {
    backgroundColor: "rgba(45, 106, 79, 0.1)",
    borderColor: COLORS.accentPrimary,
  },
  textContainer: {
    alignItems: "center",
    maxWidth: 300,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    color: COLORS.textPrimary,
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  subTitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  nameInputContainer: {
    width: "100%",
    maxWidth: 300,
    marginTop: SPACING.sm,
  },
  nameInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    backgroundColor: COLORS.surfaceSunken,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.input,
    paddingHorizontal: SPACING.md,
    height: 48,
  },
  nameInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  footer: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxl,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.xl,
    gap: SPACING.sm,
  },
  indicatorDot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: COLORS.accentPrimary,
  },
  inactiveDot: {
    width: 8,
    backgroundColor: COLORS.border,
  },
  nextBtn: {
    backgroundColor: COLORS.accentPrimary,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.button,
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  nextBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  skipBtn: {
    paddingVertical: SPACING.md,
    alignItems: "center",
  },
  skipBtnText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: "500",
  },
});
