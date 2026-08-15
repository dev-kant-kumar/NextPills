import { CheckIcon, PillIcon } from "phosphor-react-native";
import { StyleSheet, View } from "react-native";
import { COLORS } from "../../constants/theme";

const DoseRing = ({ status = "upcoming", iconSize = 20, ringSize = 48 }) => {
  let borderColor = COLORS.border;
  let iconColor = COLORS.textPrimary;
  let isTaken = status === "taken";
  let isDueNow = status === "due-now";
  let isMissed = status === "missed";

  if (isTaken) {
    borderColor = COLORS.accentPrimary;
    iconColor = COLORS.accentPrimary;
  } else if (isDueNow) {
    borderColor = COLORS.accentWarm;
    iconColor = COLORS.accentWarm;
  } else if (isMissed) {
    borderColor = COLORS.accentMissed;
    iconColor = COLORS.accentMissed;
  }

  return (
    <View style={[styles.container, { width: ringSize, height: ringSize }]}>
      <View
        style={[
          styles.ringTrack,
          {
            width: ringSize,
            height: ringSize,
            borderRadius: ringSize / 2,
            borderColor: borderColor,
            borderWidth: isDueNow || isTaken ? 3 : 2,
            backgroundColor: isTaken ? "rgba(45, 106, 79, 0.15)" : COLORS.surfaceSunken,
          },
        ]}
      >
        <PillIcon size={iconSize} color={iconColor} weight={isTaken ? "bold" : "regular"} />
      </View>

      {isTaken && (
        <View style={styles.checkmarkBadge}>
          <CheckIcon size={10} color="#FFFFFF" weight="bold" />
        </View>
      )}
    </View>
  );
};

export default DoseRing;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  ringTrack: {
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: COLORS.accentPrimary,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
});
