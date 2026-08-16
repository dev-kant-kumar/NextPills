import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  BellRingingIcon,
  CaretRightIcon,
  CheckIcon,
  MagicWandIcon,
  ShieldCheckIcon,
  UserIcon,
} from "phosphor-react-native";
import { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import ConfirmationModal from "../../components/macro/ConfirmationModal";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";
import { selectSettings, selectUserName, updateSettings } from "../../store/slices/appSlice";
import { clearHistory, loadDemoHistory, selectMedicineHistory } from "../../store/slices/historySlice";
import { clearAllMedicines, loadDemoMedicines, selectMedicines } from "../../store/slices/medicinesSlice";
import { exportHistoryToCSV } from "../../utils/csvExport";
import { exportHistoryToPDF } from "../../utils/pdfExport";
import { cancelAllNotifications, sendTestNotification } from "../../utils/notificationHelper";

const soundOptions = [
  { id: "Default Chime", name: "Default Chime", desc: "Standard clean notification sound" },
  { id: "Zen Garden", name: "Zen Garden", desc: "Calm, gentle ambient tone" },
  { id: "Gentle Bell", name: "Gentle Bell", desc: "Soft single bell chime" },
  { id: "Alarm Tone", name: "Alarm Tone", desc: "Prominent alarm tone for heavy sleepers" },
];

const snoozeOptions = ["5 min", "10 min", "15 min", "30 min"];

const Settings = () => {
  const insets = useSafeAreaInsets();
  const settings = useSelector(selectSettings);
  const userName = useSelector(selectUserName);
  const history = useSelector(selectMedicineHistory);
  const medicines = useSelector(selectMedicines);
  const dispatch = useDispatch();
  const router = useRouter();

  const [nameInput, setNameInput] = useState(userName === "Friend" ? "" : userName);
  const [showClearDataModal, setShowClearDataModal] = useState(false);
  const [showSoundModal, setShowSoundModal] = useState(false);
  const [showSnoozeModal, setShowSnoozeModal] = useState(false);

  const hasData = (medicines && medicines.length > 0) || (history && history.length > 0);

  const handleSaveName = (text) => {
    setNameInput(text);
    dispatch(updateSettings({ userName: text.trim() }));
  };

  const handleToggleHeadsUp = (val) => {
    dispatch(updateSettings({ headsUpEnabled: val }));
  };

  const handleSelectSound = (soundId) => {
    dispatch(updateSettings({ reminderSound: soundId }));
    setShowSoundModal(false);
  };

  const handleSelectSnooze = (snoozeVal) => {
    dispatch(updateSettings({ snoozeDuration: snoozeVal }));
    setShowSnoozeModal(false);
  };

  const handleTestNotification = async () => {
    const success = await sendTestNotification(5);
    if (success) {
      Alert.alert(
        "🔔 Test Notification Scheduled",
        "A heads-up reminder will fire in 5 seconds with sound and Taken/Skip action buttons. Lock your phone or switch apps to test it live!",
      );
    } else {
      Alert.alert(
        "Notification Permission Required",
        "Please enable notification permissions in your device settings to test reminders.",
      );
    }
  };

  const handleExportCSV = () => {
    if (!hasData) return;
    exportHistoryToCSV(history, medicines);
  };

  const handleExportPDF = () => {
    if (!hasData) return;
    exportHistoryToPDF(history, medicines, userName);
  };

  const handleLoadDemoData = () => {
    dispatch(loadDemoMedicines());
    dispatch(loadDemoHistory());
    Alert.alert(
      "Demo Data Loaded",
      "Loaded sample medicines (Paracetamol, Vitamin D3, Amoxicillin) and 7-day adherence history logs.",
    );
  };

  const handleClearAllData = async () => {
    if (!hasData) return;
    await cancelAllNotifications();
    dispatch(clearAllMedicines());
    dispatch(clearHistory());
    setShowClearDataModal(false);
    Alert.alert("Data Cleared", "All saved medicines and log entries have been cleared.");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent backgroundColor="transparent" />

      {/* Full-Bleed Green Top Header */}
      <View
        style={[
          styles.fullBleedHeader,
          { paddingTop: Math.max(insets.top, 20) + SPACING.md },
        ]}
      >
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>
          App Preferences & On-Device Data Management
        </Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>

        {/* Section 0: User Profile */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>YOUR PROFILE</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.iconRowLeft}>
                <UserIcon size={18} color={COLORS.accentPrimary} weight="bold" />
                <Text style={styles.rowLabel}>Your name</Text>
              </View>
              <TextInput
                style={styles.nameTextInput}
                placeholder="Enter name (e.g. Alex)"
                placeholderTextColor={COLORS.textMuted}
                value={nameInput}
                onChangeText={handleSaveName}
                autoCapitalize="words"
              />
            </View>
          </View>
        </View>

        {/* Section 1: Notifications & Test Trigger */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>NOTIFICATIONS</Text>
          <View style={styles.card}>
            <Pressable
              style={[styles.row, styles.rowDivider]}
              onPress={handleTestNotification}
            >
              <View style={styles.iconRowLeft}>
                <BellRingingIcon size={18} color={COLORS.accentPrimary} weight="bold" />
                <Text style={[styles.rowLabel, { color: COLORS.accentPrimary, fontWeight: "600" }]}>
                  Test Notification (Fires in 5s)
                </Text>
              </View>
              <CaretRightIcon size={18} color={COLORS.accentPrimary} />
            </Pressable>

            <Pressable
              style={[styles.row, styles.rowDivider]}
              onPress={() => setShowSoundModal(true)}
            >
              <Text style={styles.rowLabel}>Reminder sound</Text>
              <View style={styles.rowRight}>
                <Text style={styles.rowValue}>{settings.reminderSound || "Default Chime"}</Text>
                <CaretRightIcon size={18} color={COLORS.textMuted} />
              </View>
            </Pressable>

            <Pressable
              style={[styles.row, styles.rowDivider]}
              onPress={() => setShowSnoozeModal(true)}
            >
              <Text style={styles.rowLabel}>Snooze duration</Text>
              <View style={styles.rowRight}>
                <Text style={styles.rowValue}>{settings.snoozeDuration || "10 min"}</Text>
                <CaretRightIcon size={18} color={COLORS.textMuted} />
              </View>
            </Pressable>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Heads-up style</Text>
              <Switch
                value={settings.headsUpEnabled !== false}
                onValueChange={handleToggleHeadsUp}
                trackColor={{ false: COLORS.border, true: COLORS.accentPrimary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* Section 2: Appearance */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>APPEARANCE</Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Theme</Text>
              <View style={styles.rowRight}>
                <Text style={styles.rowValue}>Warm Off-White</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Section 3: Your Data & Demo Mode */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>YOUR DATA</Text>
          <View style={styles.card}>
            <Pressable
              style={[styles.row, styles.rowDivider]}
              onPress={handleLoadDemoData}
            >
              <View style={styles.iconRowLeft}>
                <MagicWandIcon size={18} color={COLORS.accentPrimary} weight="bold" />
                <Text style={[styles.rowLabel, { color: COLORS.accentPrimary }]}>
                  Load Sample Demo Data
                </Text>
              </View>
              <CaretRightIcon size={18} color={COLORS.accentPrimary} />
            </Pressable>

            {/* Export PDF Report */}
            <Pressable
              style={[styles.row, styles.rowDivider, !hasData && styles.disabledRow]}
              onPress={handleExportPDF}
              disabled={!hasData}
            >
              <Text style={[styles.rowLabel, !hasData && styles.disabledText]}>
                Export report as PDF
              </Text>

              <View style={styles.rowRight}>
                {!hasData && <Text style={styles.inactiveBadgeText}>No data</Text>}
                <CaretRightIcon size={18} color={hasData ? COLORS.textMuted : COLORS.border} />
              </View>
            </Pressable>

            {/* Export CSV */}
            <Pressable
              style={[styles.row, styles.rowDivider, !hasData && styles.disabledRow]}
              onPress={handleExportCSV}
              disabled={!hasData}
            >
              <Text style={[styles.rowLabel, !hasData && styles.disabledText]}>
                Export data as CSV
              </Text>

              <View style={styles.rowRight}>
                {!hasData && <Text style={styles.inactiveBadgeText}>No data</Text>}
                <CaretRightIcon size={18} color={hasData ? COLORS.textMuted : COLORS.border} />
              </View>
            </Pressable>

            {/* Clear All Data (Inactive when no data) */}
            <Pressable
              style={[styles.row, !hasData && styles.disabledRow]}
              onPress={() => hasData && setShowClearDataModal(true)}
              disabled={!hasData}
            >
              <Text
                style={[
                  styles.rowLabel,
                  { color: hasData ? COLORS.accentMissed : COLORS.textMuted },
                ]}
              >
                Clear all data
              </Text>

              <View style={styles.rowRight}>
                {!hasData && <Text style={styles.inactiveBadgeText}>No data</Text>}
                <CaretRightIcon
                  size={18}
                  color={hasData ? COLORS.accentMissed : COLORS.border}
                />
              </View>
            </Pressable>
          </View>
        </View>

        {/* Section 4: About & Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>ABOUT</Text>
          <View style={styles.card}>
            <View style={styles.aboutWrapper}>
              <View style={styles.aboutHeader}>
                <ShieldCheckIcon size={22} color={COLORS.accentPrimary} weight="fill" />
                <Text style={styles.aboutTitle}>Version 1.0.0</Text>
              </View>
              <Text style={styles.aboutBody}>
                No account. No cloud. No tracking. Your medicine schedule and history stay entirely on your device.
              </Text>
            </View>

            <View style={styles.privacyDivider} />

            <Pressable
              style={styles.privacyRow}
              onPress={() => router.push("/privacy")}
            >
              <Text style={[styles.rowLabel, { color: COLORS.accentPrimary }]}>
                Privacy Policy
              </Text>
              <CaretRightIcon size={18} color={COLORS.accentPrimary} />
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Reminder Sound Selector Modal */}
      <Modal
        visible={showSoundModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSoundModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowSoundModal(false)}
        >
          <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Select Reminder Sound</Text>

            <View style={styles.modalList}>
              {soundOptions.map((opt) => {
                const isSelected = (settings.reminderSound || "Default Chime") === opt.id;
                return (
                  <Pressable
                    key={opt.id}
                    style={[styles.modalOptionRow, isSelected && styles.modalOptionRowSelected]}
                    onPress={() => handleSelectSound(opt.id)}
                  >
                    <View style={styles.modalOptionContent}>
                      <Text style={[styles.modalOptionName, isSelected && styles.modalOptionNameSelected]}>
                        {opt.name}
                      </Text>
                      <Text style={styles.modalOptionDesc}>{opt.desc}</Text>
                    </View>
                    {isSelected && (
                      <CheckIcon size={20} color={COLORS.accentPrimary} weight="bold" />
                    )}
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={styles.modalCloseBtn}
              onPress={() => setShowSoundModal(false)}
            >
              <Text style={styles.modalCloseBtnText}>Done</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Snooze Duration Selector Modal */}
      <Modal
        visible={showSnoozeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSnoozeModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowSnoozeModal(false)}
        >
          <View style={styles.modalCard} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Snooze Duration</Text>

            <View style={styles.modalList}>
              {snoozeOptions.map((opt) => {
                const isSelected = (settings.snoozeDuration || "10 min") === opt;
                return (
                  <Pressable
                    key={opt}
                    style={[styles.modalOptionRow, isSelected && styles.modalOptionRowSelected]}
                    onPress={() => handleSelectSnooze(opt)}
                  >
                    <Text style={[styles.modalOptionName, isSelected && styles.modalOptionNameSelected]}>
                      {opt}
                    </Text>
                    {isSelected && (
                      <CheckIcon size={20} color={COLORS.accentPrimary} weight="bold" />
                    )}
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={styles.modalCloseBtn}
              onPress={() => setShowSnoozeModal(false)}
            >
              <Text style={styles.modalCloseBtnText}>Done</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      <ConfirmationModal
        visible={showClearDataModal}
        title="Clear All Data?"
        message="This action cannot be undone. All your saved medicines and history logs will be permanently deleted."
        confirmText="Clear All"
        isDestructive
        onConfirm={handleClearAllData}
        onCancel={() => setShowClearDataModal(false)}
      />
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surfaceBase,
  },
  headerSafeArea: {
    backgroundColor: COLORS.accentPrimary,
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.surfaceBase,
  },
  scrollContent: {
    paddingTop: SPACING.lg,
    paddingBottom: 110,
    backgroundColor: COLORS.surfaceBase,
  },
  fullBleedHeader: {
    backgroundColor: COLORS.accentPrimary,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.85)",
    fontWeight: "500",
  },
  section: {
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.xl,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  card: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    height: 52,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  rowLabel: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: "500",
  },
  nameTextInput: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: "500",
    textAlign: "right",
    flex: 1,
    marginLeft: SPACING.md,
  },
  iconRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
  },
  rowValue: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  disabledRow: {
    opacity: 0.5,
  },
  disabledText: {
    color: COLORS.textMuted,
  },
  inactiveBadgeText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginRight: 4,
  },
  aboutWrapper: {
    padding: SPACING.lg,
  },
  aboutHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  aboutTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  aboutBody: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  privacyDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.lg,
  },
  privacyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    height: 48,
  },

  /* Modals */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADIUS.card,
    padding: SPACING.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  modalList: {
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  modalOptionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.md,
    borderRadius: RADIUS.input,
    backgroundColor: COLORS.surfaceSunken,
    borderWidth: 1,
    borderColor: "transparent",
  },
  modalOptionRowSelected: {
    borderColor: COLORS.accentPrimary,
    backgroundColor: "rgba(45, 106, 79, 0.08)",
  },
  modalOptionContent: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  modalOptionName: {
    fontSize: 14,
    fontWeight: "500",
    color: COLORS.textPrimary,
  },
  modalOptionNameSelected: {
    fontWeight: "600",
    color: COLORS.accentPrimary,
  },
  modalOptionDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  modalCloseBtn: {
    backgroundColor: COLORS.accentPrimary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.button,
    alignItems: "center",
  },
  modalCloseBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
