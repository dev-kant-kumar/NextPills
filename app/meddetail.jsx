import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AlertTriangle, Package } from "lucide-react-native";
import {
  ArrowLeftIcon,
  CalendarCheckIcon,
  ClockIcon,
  PillIcon,
  PencilSimpleIcon,
  TrashIcon,
} from "phosphor-react-native";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import ConfirmationModal from "../components/macro/ConfirmationModal";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import {
  selectMedicineHistoryById,
} from "../store/slices/historySlice";
import {
  deleteMedicine,
  selectMedicineById,
} from "../store/slices/medicinesSlice";
import { cancelMedicineNotifications } from "../utils/notificationHelper";

const formatLogTime = (ts) => {
  if (!ts) return "";
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return String(ts);
  }
};

const MedDetail = () => {
  const params = useLocalSearchParams();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const router = useRouter();
  const dispatch = useDispatch();

  const medicine = useSelector(selectMedicineById(id));
  const historyLogs = useSelector(selectMedicineHistoryById(id));

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!medicine) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" backgroundColor={COLORS.accentPrimary} />
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Medicine not found.</Text>
          <Pressable style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  // Calculate actual taken and skipped counts
  const takenCount = (historyLogs || []).filter((log) => log.action === "taken").length;
  const skippedCount = (historyLogs || []).filter((log) => log.action === "skip").length;
  const totalRecorded = takenCount + skippedCount;
  const adherencePct = totalRecorded > 0 ? Math.round((takenCount / totalRecorded) * 100) : 100;

  const handleEdit = () => {
    router.push({ pathname: "/addmedicine", params: { id: medicine._id } });
  };

  const handleDelete = async () => {
    if (medicine.notificationIds) {
      await cancelMedicineNotifications(medicine.notificationIds);
    }
    dispatch(deleteMedicine(medicine._id));
    setShowDeleteModal(false);
    router.replace("/medicines");
  };

  const isLowStock =
    typeof medicine.quantityRemaining === "number" && medicine.quantityRemaining <= 5;

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
      <StatusBar style="light" backgroundColor={COLORS.accentPrimary} />

      {/* Full-Bleed Green Top Header & Hero */}
      <View style={styles.fullBleedHeader}>
        <View style={styles.topNav}>
          <Pressable onPress={() => router.back()} style={styles.iconBtn}>
            <ArrowLeftIcon size={22} color="#FFFFFF" />
          </Pressable>

          <View style={styles.rightNavBtns}>
            <Pressable onPress={handleEdit} style={styles.iconBtn}>
              <PencilSimpleIcon size={20} color="#FFFFFF" />
            </Pressable>
            <Pressable
              onPress={() => setShowDeleteModal(true)}
              style={styles.iconBtn}
            >
              <TrashIcon size={20} color="rgba(255, 255, 255, 0.9)" />
            </Pressable>
          </View>
        </View>

        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>{medicine.name}</Text>
          <Text style={styles.heroDose}>{medicine.dose}</Text>

          {typeof medicine.quantityRemaining === "number" && (
            <View style={[styles.inventoryBadge, isLowStock && styles.inventoryBadgeWarning]}>
              {isLowStock ? (
                <AlertTriangle size={13} color="#FFFFFF" />
              ) : (
                <Package size={13} color="#FFFFFF" />
              )}
              <Text style={styles.inventoryText}>
                {isLowStock
                  ? `Low Stock: ${medicine.quantityRemaining} pills remaining`
                  : `Inventory: ${medicine.quantityRemaining} pills remaining`}
              </Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Seamless Performance Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statCol}>
            <Text style={styles.statValueTaken}>{takenCount}</Text>
            <Text style={styles.statLabel}>Taken</Text>
          </View>

          <View style={styles.colDivider} />

          <View style={styles.statCol}>
            <Text style={styles.statValueSkipped}>{skippedCount}</Text>
            <Text style={styles.statLabel}>Skipped</Text>
          </View>

          <View style={styles.colDivider} />

          <View style={styles.statCol}>
            <Text style={styles.statValueAdherence}>{`${adherencePct}%`}</Text>
            <Text style={styles.statLabel}>Adherence</Text>
          </View>
        </View>

        {/* Schedule Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>SCHEDULE DETAILS</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <CalendarCheckIcon size={20} color={COLORS.accentPrimary} />
              <View style={styles.infoTextWrapper}>
                <Text style={styles.infoLabel}>Frequency</Text>
                <Text style={styles.infoValue}>
                  {medicine.frequency === "daily"
                    ? "Every day"
                    : `Specific days: ${
                        Array.isArray(medicine.days)
                          ? medicine.days.join(", ")
                          : "None"
                      }`}
                </Text>
              </View>
            </View>

            <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
              <ClockIcon size={20} color={COLORS.accentPrimary} />
              <View style={styles.infoTextWrapper}>
                <Text style={styles.infoLabel}>Reminder Times</Text>
                <Text style={styles.infoValue}>
                  {Array.isArray(medicine.times) && medicine.times.length > 0
                    ? medicine.times.join(", ")
                    : "No times configured"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* History Log Section */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>LOG HISTORY</Text>
          <View style={styles.infoCard}>
            {historyLogs && historyLogs.length > 0 ? (
              historyLogs.map((log, index) => {
                const isTaken = log.action === "taken";
                return (
                  <View
                    key={log.id || index}
                    style={[
                      styles.logRow,
                      index === historyLogs.length - 1 && { borderBottomWidth: 0 },
                    ]}
                  >
                    <View>
                      <Text style={styles.logTimeStr}>{log.scheduledTime}</Text>
                      <Text style={styles.logTimestamp}>
                        {formatLogTime(log.timestamp)}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.logBadge,
                        isTaken ? styles.logBadgeTaken : styles.logBadgeSkipped,
                      ]}
                    >
                      <Text
                        style={[
                          styles.logBadgeText,
                          isTaken
                            ? styles.logBadgeTextTaken
                            : styles.logBadgeTextSkipped,
                        ]}
                      >
                        {isTaken ? "Taken" : "Skipped"}
                      </Text>
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyLogWrapper}>
                <Text style={styles.emptyLogText}>
                  No dose history recorded for this medicine yet.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <ConfirmationModal
        visible={showDeleteModal}
        title={`Delete ${medicine.name}?`}
        message="This will permanently delete this medicine and cancel all scheduled reminders."
        confirmText="Delete"
        isDestructive
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </SafeAreaView>
  );
};

export default MedDetail;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surfaceBase,
  },
  scrollContent: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xxl,
    backgroundColor: COLORS.surfaceBase,
  },
  fullBleedHeader: {
    backgroundColor: COLORS.accentPrimary,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  rightNavBtns: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  iconBtn: {
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: RADIUS.pill,
  },
  heroContent: {
    alignItems: "flex-start",
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 2,
    letterSpacing: -0.5,
  },
  heroDose: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.85)",
    marginBottom: SPACING.sm,
  },
  inventoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.pill,
  },
  inventoryBadgeWarning: {
    backgroundColor: "rgba(224, 122, 95, 0.4)",
  },
  inventoryText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
    backgroundColor: COLORS.surfaceBase,
  },
  notFoundText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  backBtn: {
    backgroundColor: COLORS.accentPrimary,
    paddingVertical: 10,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.button,
  },
  backBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  /* Seamless Performance Stats Bar */
  statsCard: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.xl,
    marginTop: SPACING.md,
  },
  statCol: {
    flex: 1,
    alignItems: "center",
  },
  colDivider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.border,
  },
  statValueTaken: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.accentPrimary,
  },
  statValueSkipped: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  statValueAdherence: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  section: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
    letterSpacing: 1,
    marginBottom: SPACING.sm,
  },
  infoCard: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.lg,
    gap: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoTextWrapper: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "500",
    color: COLORS.textPrimary,
  },
  logRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  logTimeStr: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  logTimestamp: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  logBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.pill,
  },
  logBadgeTaken: {
    backgroundColor: "rgba(45, 106, 79, 0.15)",
  },
  logBadgeSkipped: {
    backgroundColor: COLORS.surfaceSunken,
  },
  logBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  logBadgeTextTaken: {
    color: COLORS.accentPrimary,
  },
  logBadgeTextSkipped: {
    color: COLORS.textSecondary,
  },
  emptyLogWrapper: {
    padding: SPACING.xl,
    alignItems: "center",
  },
  emptyLogText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
});
