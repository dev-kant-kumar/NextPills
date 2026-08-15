import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AlertTriangle } from "lucide-react-native";
import { CheckIcon, ClockIcon, PlusIcon, XIcon } from "phosphor-react-native";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import EmptyState from "../../components/macro/EmptyState";
import GreetUserHeader from "../../components/macro/GreetUserHeader";
import StreakBadge from "../../components/macro/StreakBadge";
import DoseRing from "../../components/micro/DoseRing";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";
import { recordMedicineAction, selectAdherenceStreak } from "../../store/slices/historySlice";
import {
  decrementStock,
  selectGroupedTodayDoses,
} from "../../store/slices/medicinesSlice";
import {
  scheduleLowStockNotification,
  sendTestNotification,
} from "../../utils/notificationHelper";

const Today = () => {
  const insets = useSafeAreaInsets();
  const { groups, hasDoses } = useSelector(selectGroupedTodayDoses);
  const streakCount = useSelector(selectAdherenceStreak);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleMedAction = (med, actionType) => {
    try {
      if (actionType === "taken") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (_e) {}

    dispatch(
      recordMedicineAction({
        _id: med._id,
        name: med.name,
        dose: med.dose,
        scheduledTime: med.scheduledTime,
        action: actionType,
      }),
    );

    if (actionType === "taken") {
      dispatch(decrementStock(med._id));

      const remaining =
        typeof med.quantityRemaining === "number" ? med.quantityRemaining - 1 : null;
      if (remaining !== null && (remaining <= 5 || med.daysRemaining <= 5)) {
        scheduleLowStockNotification(
          { ...med, quantityRemaining: Math.max(0, remaining) },
          med.daysRemaining || 5,
        );
      }
    }
  };

  const handleSnooze = (med) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (_e) {}

    sendTestNotification(15 * 60);
    Alert.alert(
      "⏰ Reminder Snoozed",
      `Reminder for ${med.name} snoozed for 15 minutes.`,
    );
  };

  const handleAddMedicine = () => {
    router.push({ pathname: "/addmedicine", params: {} });
  };

  const renderDoseCard = (med, index) => {
    const isDueNow = med.status === "due-now";
    const isTaken = med.status === "taken";
    const isSkipped = med.status === "skip";
    const isMissed = med.status === "missed";
    const canTake = med.canTake;

    return (
      <View
        key={`${med._id}-${med.scheduledTime}-${index}`}
        style={[
          styles.card,
          isDueNow && styles.dueNowCard,
          (isTaken || isSkipped) && styles.doneCard,
        ]}
      >
        <DoseRing status={med.status} ringSize={44} />

        <View style={styles.cardContent}>
          <Text style={[styles.medName, (isTaken || isSkipped) && styles.mutedText]}>
            {med.name}
          </Text>

          {med.isLowStock && !isTaken && (
            <View style={styles.lowStockBadge}>
              <AlertTriangle size={12} color={COLORS.accentWarm} />
              <Text style={styles.lowStockText}>
                {`Refill Soon (${med.quantityRemaining} left)`}
              </Text>
            </View>
          )}

          <Text style={styles.medSubtitle}>
            {`${med.dose} · ${med.scheduledTime}`}
          </Text>
        </View>

        {/* Action buttons / Smart Status indicators */}
        <View style={styles.actionContainer}>
          {isTaken ? (
            <View style={styles.statusBadgeTaken}>
              <CheckIcon size={14} color={COLORS.accentPrimary} weight="bold" />
              <Text style={styles.statusBadgeTakenText}>Taken</Text>
            </View>
          ) : isSkipped ? (
            <View style={styles.statusBadgeSkipped}>
              <XIcon size={14} color={COLORS.textSecondary} weight="bold" />
              <Text style={styles.statusBadgeSkippedText}>Skipped</Text>
            </View>
          ) : isMissed ? (
            <View style={styles.missedContainer}>
              <View style={styles.statusBadgeMissed}>
                <Text style={styles.statusBadgeMissedText}>Missed</Text>
              </View>
              <View style={styles.buttonGroup}>
                <Pressable
                  style={styles.takenBtn}
                  onPress={() => handleMedAction(med, "taken")}
                >
                  <Text style={styles.takenBtnText}>Taken</Text>
                </Pressable>
              </View>
            </View>
          ) : canTake ? (
            <View style={styles.buttonGroup}>
              <Pressable
                style={styles.takenBtn}
                onPress={() => handleMedAction(med, "taken")}
              >
                <Text style={styles.takenBtnText}>Taken</Text>
              </Pressable>

              <Pressable
                style={styles.snoozeBtn}
                onPress={() => handleSnooze(med)}
              >
                <Text style={styles.snoozeBtnText}>15m</Text>
              </Pressable>

              <Pressable
                style={styles.skipBtn}
                onPress={() => handleMedAction(med, "skip")}
              >
                <Text style={styles.skipBtnText}>Skip</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.upcomingBadge}>
              <ClockIcon size={14} color={COLORS.textMuted} weight="bold" />
              <Text style={styles.upcomingBadgeText}>{med.upcomingLabel}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
      <StatusBar style="light" backgroundColor={COLORS.accentPrimary} />
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <GreetUserHeader />

          {/* Adherence Streak Badge */}
          <StreakBadge streakCount={streakCount} />

          <View style={styles.listContainer}>
            {hasDoses ? (
              <>
                {/* DUE NOW & OVERDUE SECTION */}
                {groups.DUE_NOW.length > 0 && (
                  <View style={styles.sectionGroup}>
                    <Text style={styles.sectionHeader}>DUE NOW & OVERDUE</Text>
                    {groups.DUE_NOW.map(renderDoseCard)}
                  </View>
                )}

                {/* UPCOMING SECTION */}
                {groups.UPCOMING.length > 0 && (
                  <View style={styles.sectionGroup}>
                    <Text style={styles.sectionHeader}>UPCOMING</Text>
                    {groups.UPCOMING.map(renderDoseCard)}
                  </View>
                )}

                {/* COMPLETED SECTION */}
                {groups.COMPLETED.length > 0 && (
                  <View style={styles.sectionGroup}>
                    <Text style={styles.sectionHeader}>COMPLETED</Text>
                    {groups.COMPLETED.map(renderDoseCard)}
                  </View>
                )}
              </>
            ) : (
              <EmptyState
                title="No medicines for today"
                subTitle="You're all caught up, or tap below to add a new medicine schedule."
              />
            )}
          </View>
        </ScrollView>

        {/* Floating Add Button */}
        {hasDoses && (
          <Pressable
            style={[styles.fab, { bottom: 20 + insets.bottom }]}
            onPress={handleAddMedicine}
          >
            <PlusIcon size={26} color="#FFFFFF" weight="bold" />
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Today;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surfaceBase,
  },
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: COLORS.surfaceBase,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  listContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xs,
  },
  sectionGroup: {
    marginBottom: SPACING.lg,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textSecondary,
    letterSpacing: 1,
    marginBottom: SPACING.sm,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  dueNowCard: {
    borderColor: COLORS.accentWarm,
    borderWidth: 1.5,
    backgroundColor: "#FFFBF9",
  },
  doneCard: {
    opacity: 0.8,
  },
  cardContent: {
    flex: 1,
    marginLeft: SPACING.sm,
    marginRight: SPACING.xs,
    justifyContent: "center",
  },
  medName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  lowStockBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(224, 122, 95, 0.12)",
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginVertical: 2,
  },
  lowStockText: {
    fontSize: 11,
    fontWeight: "600",
    color: COLORS.accentWarm,
  },
  mutedText: {
    color: COLORS.textSecondary,
    textDecorationLine: "line-through",
  },
  medSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  actionContainer: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 4,
  },
  takenBtn: {
    backgroundColor: COLORS.accentPrimary,
    paddingVertical: 7,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.button,
  },
  takenBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  snoozeBtn: {
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: RADIUS.button,
    backgroundColor: COLORS.surfaceSunken,
  },
  snoozeBtnText: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: "600",
  },
  skipBtn: {
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 6,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.button,
    backgroundColor: COLORS.surfaceSunken,
  },
  skipBtnText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "500",
  },
  statusBadgeTaken: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(45, 106, 79, 0.15)",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.pill,
  },
  statusBadgeTakenText: {
    color: COLORS.accentPrimary,
    fontSize: 12,
    fontWeight: "600",
  },
  statusBadgeSkipped: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.surfaceSunken,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.pill,
  },
  statusBadgeSkippedText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "500",
  },
  missedContainer: {
    alignItems: "flex-end",
    gap: 4,
  },
  statusBadgeMissed: {
    backgroundColor: "rgba(155, 44, 44, 0.15)",
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: RADIUS.pill,
  },
  statusBadgeMissedText: {
    color: COLORS.accentMissed,
    fontSize: 11,
    fontWeight: "600",
  },
  upcomingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.surfaceSunken,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: RADIUS.pill,
  },
  upcomingBadgeText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: "500",
  },
  fab: {
    position: "absolute",
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.accentPrimary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
});
