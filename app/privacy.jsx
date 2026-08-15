import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowLeftIcon, ShieldCheckIcon } from "phosphor-react-native";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, RADIUS, SPACING } from "../constants/theme";

const PrivacyPolicy = () => {
  const router = useRouter();

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
      <StatusBar style="light" backgroundColor={COLORS.accentPrimary} />

      {/* Full-Bleed Green Header */}
      <View style={styles.fullBleedHeader}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeftIcon size={22} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Trust Badge */}
        <View style={styles.trustBadge}>
          <ShieldCheckIcon size={28} color={COLORS.accentPrimary} weight="fill" />
          <View style={styles.trustTextWrap}>
            <Text style={styles.trustTitle}>100% Offline & Private</Text>
            <Text style={styles.trustSubtitle}>
              Your health data never leaves your device
            </Text>
          </View>
        </View>

        {/* Policy Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.bodyText}>
            NextPills is a medicine reminder application designed with your privacy as the
            highest priority. This app operates entirely offline on your device. No user
            data is collected, transmitted, stored on external servers, or shared with any
            third party.
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data We Store</Text>
          <Text style={styles.bodyText}>
            All data is stored locally on your device using on-device storage (AsyncStorage).
            This includes:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>
              • Medicine names, dosages, and reminder schedules
            </Text>
            <Text style={styles.bulletItem}>
              • Dose intake history (taken, skipped timestamps)
            </Text>
            <Text style={styles.bulletItem}>
              • Your display name (optional, for personalization only)
            </Text>
            <Text style={styles.bulletItem}>
              • App preferences (notification sound, snooze duration)
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data We Do NOT Collect</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• No personal identification information</Text>
            <Text style={styles.bulletItem}>• No location data</Text>
            <Text style={styles.bulletItem}>• No analytics or usage tracking</Text>
            <Text style={styles.bulletItem}>• No advertising identifiers</Text>
            <Text style={styles.bulletItem}>• No network requests to external servers</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <Text style={styles.bodyText}>
            NextPills uses local on-device notifications to remind you to take your
            medicines at scheduled times. These notifications are generated and
            delivered entirely by your device's operating system. No notification
            data is sent to any external server.
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Export</Text>
          <Text style={styles.bodyText}>
            You may export your medicine history as a CSV file or PDF report using
            the built-in export feature. The exported file is generated locally on
            your device and shared via your device's native share sheet. NextPills
            does not retain or transmit any copy of the exported data.
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Deletion</Text>
          <Text style={styles.bodyText}>
            You can permanently delete all stored data at any time from
            Settings → Your Data → Clear All Data. Uninstalling the app will
            also remove all locally stored data from your device.
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Third-Party Services</Text>
          <Text style={styles.bodyText}>
            NextPills does not integrate with any third-party analytics,
            advertising, or data collection services. The app has zero network
            dependencies and functions fully without an internet connection.
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Children's Privacy</Text>
          <Text style={styles.bodyText}>
            NextPills does not knowingly collect any personal information from
            children under 13. Since no data leaves the device, there is no
            risk of external data exposure for users of any age.
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Changes to This Policy</Text>
          <Text style={styles.bodyText}>
            Any updates to this privacy policy will be reflected in future app
            updates. The core commitment to 100% offline, on-device data storage
            will not change.
          </Text>
        </View>

        <View style={styles.footerNote}>
          <Text style={styles.footerNoteText}>
            Last updated: August 2026
          </Text>
          <Text style={styles.footerNoteText}>
            NextPills v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surfaceBase,
  },
  fullBleedHeader: {
    backgroundColor: COLORS.accentPrimary,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.lg,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  backBtn: {
    marginRight: SPACING.lg,
    padding: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: RADIUS.pill,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  scrollContent: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  trustBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    backgroundColor: "rgba(45, 106, 79, 0.08)",
    padding: SPACING.lg,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: "rgba(45, 106, 79, 0.2)",
    marginBottom: SPACING.xl,
  },
  trustTextWrap: {
    flex: 1,
  },
  trustTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.accentPrimary,
    marginBottom: 2,
  },
  trustSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  bodyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  bulletList: {
    marginTop: SPACING.sm,
    gap: 4,
  },
  bulletItem: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
    paddingLeft: SPACING.xs,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.lg,
  },
  footerNote: {
    marginTop: SPACING.lg,
    alignItems: "center",
    gap: 2,
  },
  footerNoteText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
});
