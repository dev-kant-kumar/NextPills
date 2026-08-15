import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";

const ConfirmationModal = ({
  visible,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  isDestructive = true,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}

          <View style={styles.buttonRow}>
            <Pressable style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelBtnText}>{cancelText}</Text>
            </Pressable>

            <Pressable
              style={[
                styles.confirmBtn,
                { backgroundColor: isDestructive ? COLORS.accentMissed : COLORS.accentPrimary },
              ]}
              onPress={onConfirm}
            >
              <Text style={styles.confirmBtnText}>{confirmText}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ConfirmationModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: SPACING.xl,
  },
  modalCard: {
    width: "100%",
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADIUS.card,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  message: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: SPACING.md,
  },
  cancelBtn: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.button,
    backgroundColor: COLORS.surfaceSunken,
  },
  cancelBtnText: {
    color: COLORS.textSecondary,
    fontWeight: "600",
    fontSize: 14,
  },
  confirmBtn: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.button,
  },
  confirmBtnText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
});
