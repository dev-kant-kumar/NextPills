import { FlameIcon } from "phosphor-react-native";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";

const StreakBadge = ({ streakCount = 0 }) => {
  if (streakCount <= 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <FlameIcon size={20} color={COLORS.accentWarm} weight="fill" />
      </View>

      <View style={styles.textWrapper}>
        <Text style={styles.title}>{`${streakCount}-Day Adherence Streak!`}</Text>
        <Text style={styles.subtitle}>
          Great job staying consistent with your medicine schedule.
        </Text>
      </View>
    </View>
  );
};

export default StreakBadge;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
    backgroundColor: "rgba(224, 122, 95, 0.12)",
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: "rgba(224, 122, 95, 0.4)",
    padding: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(224, 122, 95, 0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
