import { router } from "expo-router";
import { PillIcon, PlusIcon } from "phosphor-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";

const EmptyState = ({
  title = "No medicines yet",
  subTitle = "Add your first one to start getting reminders.",
  showButton = true,
  icon = <PillIcon size={40} color={COLORS.accentPrimary} />,
}) => {
  const handleAddMedicine = () => {
    router.push({ pathname: "/addmedicine", params: {} });
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>{icon}</View>

      <View style={styles.textWrapper}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subTitle}>{subTitle}</Text>
      </View>

      {showButton && (
        <Pressable style={styles.btn} onPress={handleAddMedicine}>
          <PlusIcon size={18} color="#FFFFFF" weight="bold" />
          <Text style={styles.btnTxt}>Add Medicine</Text>
        </Pressable>
      )}
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    padding: SPACING.xl,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: SPACING.xxl,
  },
  iconContainer: {
    backgroundColor: COLORS.surfaceSunken,
    height: 96,
    width: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  textWrapper: {
    alignItems: "center",
    marginBottom: SPACING.xl,
    maxWidth: 280,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  subTitle: {
    textAlign: "center",
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  btn: {
    backgroundColor: COLORS.accentPrimary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.button,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  btnTxt: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});

