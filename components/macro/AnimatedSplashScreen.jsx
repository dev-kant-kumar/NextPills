import { PillIcon, ShieldCheckIcon } from "phosphor-react-native";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";

const AnimatedSplashScreen = ({ onFinish }) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const pulseRingScale = useRef(new Animated.Value(1)).current;
  const pulseRingOpacity = useRef(new Animated.Value(0.6)).current;
  const exitFade = useRef(new Animated.Value(1)).current;
  const exitScale = useRef(new Animated.Value(1)).current;

  const [loadingText, setLoadingText] = useState("Loading your schedule...");

  useEffect(() => {
    // Entrance animations: Fade in + Scale up icon
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.4)),
      }),
    ]).start();

    // Infinite gentle pulse ring animation
    Animated.loop(
      Animated.parallel([
        Animated.timing(pulseRingScale, {
          toValue: 1.6,
          duration: 1800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseRingOpacity, {
          toValue: 0,
          duration: 1800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Text status update sequence
    const t1 = setTimeout(() => setLoadingText("Checking today's doses..."), 800);
    const t2 = setTimeout(() => setLoadingText("Ready"), 1500);

    // Exit animation trigger after 1.8 seconds
    const exitTimer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(exitFade, {
          toValue: 0,
          duration: 450,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(exitScale, {
          toValue: 1.1,
          duration: 450,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ]).start(() => {
        if (onFinish) onFinish();
      });
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(exitTimer);
    };
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: exitFade,
          transform: [{ scale: exitScale }],
        },
      ]}
    >
      <View style={styles.centerContent}>
        {/* Animated Outer Pulse Ring */}
        <Animated.View
          style={[
            styles.pulseRing,
            {
              transform: [{ scale: pulseRingScale }],
              opacity: pulseRingOpacity,
            },
          ]}
        />

        {/* Central Logo Emblem */}
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={styles.pillIconCircle}>
            <View style={styles.pillBadgeLeft} />
            <View style={styles.pillBadgeRight} />
            <PillIcon size={52} color="#FFFFFF" weight="fill" />
          </View>
        </Animated.View>

        {/* Brand Name & Tagline */}
        <Animated.View style={[styles.textWrapper, { opacity: opacityAnim }]}>
          <View style={styles.brandTitleRow}>
            <Text style={styles.brandNameNext}>Next</Text>
            <Text style={styles.brandNamePills}>Pills</Text>
          </View>
          <Text style={styles.tagline}>Privacy-First Medicine Reminders</Text>
        </Animated.View>
      </View>

      {/* Footer Privacy Badge & Loading Status */}
      <Animated.View style={[styles.footer, { opacity: opacityAnim }]}>
        <View style={styles.statusRow}>
          <View style={styles.loadingDot} />
          <Text style={styles.statusText}>{loadingText}</Text>
        </View>

        <View style={styles.privacyBadge}>
          <ShieldCheckIcon size={14} color={COLORS.accentPrimary} weight="fill" />
          <Text style={styles.privacyText}>100% Offline & Private</Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default AnimatedSplashScreen;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.surfaceBase,
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 99999,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  pulseRing: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(45, 106, 79, 0.2)",
  },
  logoWrapper: {
    marginBottom: SPACING.xl,
    shadowColor: COLORS.accentPrimary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  pillIconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: COLORS.accentPrimary,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  pillBadgeLeft: {
    position: "absolute",
    left: -10,
    top: -10,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  pillBadgeRight: {
    position: "absolute",
    right: -10,
    bottom: -10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(224, 122, 95, 0.3)",
  },
  textWrapper: {
    alignItems: "center",
  },
  brandTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  brandNameNext: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: 0.5,
  },
  brandNamePills: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.accentPrimary,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  footer: {
    alignItems: "center",
    paddingBottom: 48,
    gap: SPACING.md,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  loadingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.accentPrimary,
  },
  statusText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: "500",
  },
  privacyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(45, 106, 79, 0.1)",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: RADIUS.pill,
  },
  privacyText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.accentPrimary,
  },
});
