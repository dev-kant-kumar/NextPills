import { Calendar, Moon, Sun } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";
import { selectUserName } from "../../store/slices/appSlice";
import { selectGroupedTodayDoses } from "../../store/slices/medicinesSlice";
import { formatDisplayDate, getGreeting } from "../../utils/dateHelpers";

import { useSafeAreaInsets } from "react-native-safe-area-context";

const GreetUserHeader = () => {
  const insets = useSafeAreaInsets();
  const userName = useSelector(selectUserName);
  const greeting = getGreeting();
  const dateStr = formatDisplayDate();
  const { allSorted } = useSelector(selectGroupedTodayDoses);

  const totalDoses = (allSorted || []).length;
  const takenDoses = (allSorted || []).filter((d) => d.status === "taken").length;
  const progressPct = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0;
  const isAllDone = totalDoses > 0 && takenDoses === totalDoses;

  const isEvening =
    greeting.toLowerCase().includes("evening") || greeting.toLowerCase().includes("night");

  return (
    <View
      style={[
        styles.fullBleedHero,
        { paddingTop: Math.max(insets.top, 20) + SPACING.md },
      ]}
    >
      {/* Top Meta Row */}
      <View style={styles.topRow}>
        <View style={styles.timeBadge}>
          {isEvening ? (
            <Moon size={12} color="#FFFFFF" />
          ) : (
            <Sun size={12} color="#FFFFFF" />
          )}
          <Text style={styles.timeBadgeText}>{greeting.toUpperCase()}</Text>
        </View>

        <View style={styles.dateRow}>
          <Calendar size={13} color="rgba(255, 255, 255, 0.85)" />
          <Text style={styles.dateText}>{dateStr}</Text>
        </View>
      </View>

      {/* Main Headline */}
      <Text style={styles.greetMsg}>
        {"Welcome back, "}
        <Text style={styles.userNameText}>{userName}</Text>
      </Text>

      {/* Daily Intake Progress Bar */}
      {totalDoses > 0 ? (
        <View style={styles.progressSection}>
          <View style={styles.progressTextRow}>
            <Text style={styles.progressLabel}>
              {isAllDone
                ? "🎉 All doses completed today!"
                : `${takenDoses} of ${totalDoses} doses taken`}
            </Text>
            <Text style={styles.progressPctText}>{`${progressPct}%`}</Text>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
          </View>
        </View>
      ) : (
        <Text style={styles.doseSummaryText}>
          No doses scheduled for today. Enjoy your day!
        </Text>
      )}
    </View>
  );
};

export default GreetUserHeader;

const styles = StyleSheet.create({
  fullBleedHero: {
    backgroundColor: COLORS.accentPrimary,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  timeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.pill,
  },
  timeBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.8,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  dateText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.85)",
    fontWeight: "500",
  },
  greetMsg: {
    fontSize: 24,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.9)",
    letterSpacing: -0.3,
    marginBottom: SPACING.md,
  },
  userNameText: {
    fontWeight: "800",
    color: "#FFFFFF",
  },
  doseSummaryText: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.85)",
    fontWeight: "500",
  },

  /* Daily Progress Bar Styles */
  progressSection: {
    marginTop: 2,
  },
  progressTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  progressPctText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  progressTrack: {
    height: 7,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
  },
});
