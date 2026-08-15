import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  ArrowLeftIcon,
  PlusIcon,
  WarningCircleIcon,
  XIcon,
} from "phosphor-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import ConfirmationModal from "../components/macro/ConfirmationModal";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import {
  addMedicine,
  deleteMedicine,
  selectMedicineById,
  updateMedicine,
} from "../store/slices/medicinesSlice";
import {
  cancelMedicineNotifications,
  scheduleMedicineNotifications,
} from "../utils/notificationHelper";

const howOften = [
  { id: 1, title: "Daily", frequency: "daily" },
  { id: 2, title: "Specific days", frequency: "specific-days" },
];

const daysOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const getInitialMedicineData = () => ({
  name: "",
  dose: "",
  frequency: "daily",
  days: [],
  times: [],
  quantityRemaining: "",
});

const AddMedicine = () => {
  const params = useLocalSearchParams();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const existingMedicine = useSelector(selectMedicineById(id));
  const isEditing = Boolean(id && existingMedicine);

  const [medicineData, setMedicineData] = useState(getInitialMedicineData());
  const [errors, setErrors] = useState({});
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickedTime, setPickedTime] = useState(new Date());
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  // Reset or populate form when route params change
  useEffect(() => {
    if (id && existingMedicine) {
      setMedicineData({
        _id: existingMedicine._id,
        name: existingMedicine.name || "",
        dose: existingMedicine.dose || "",
        frequency: existingMedicine.frequency || "daily",
        days: existingMedicine.days || [],
        times: existingMedicine.times || [],
        quantityRemaining:
          existingMedicine.quantityRemaining !== undefined &&
          existingMedicine.quantityRemaining !== null
            ? String(existingMedicine.quantityRemaining)
            : "",
        notificationIds: existingMedicine.notificationIds || [],
      });
    } else {
      setMedicineData(getInitialMedicineData());
      setErrors({});
    }
  }, [id, existingMedicine]);

  const handleFormData = (field, value) => {
    setMedicineData((prev) => ({
      ...prev,
      [field]: value,
    }));
    validateField(field, value);
  };

  const validateField = (field, value) => {
    let error = "";
    if (field === "name") {
      if (!value || !value.trim()) error = "Medicine name is required";
      else if (value.trim().length < 2) error = "Name is too short";
    } else if (field === "dose") {
      if (!value || !value.trim()) error = "Dosage is required";
    } else if (field === "days") {
      if (
        medicineData.frequency === "specific-days" &&
        (!value || value.length < 1)
      ) {
        error = "Select at least one day";
      }
    } else if (field === "times") {
      if (!value || value.length < 1) {
        error = "Add at least one reminder time";
      }
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return error;
  };

  const isFormValid = () => {
    const errName = validateField("name", medicineData.name);
    const errDose = validateField("dose", medicineData.dose);
    const errDays =
      medicineData.frequency === "specific-days"
        ? validateField("days", medicineData.days)
        : "";
    const errTimes = validateField("times", medicineData.times);

    return !(errName || errDose || errDays || errTimes);
  };

  const handleTimeChange = (event, selectedDate) => {
    setShowTimePicker(false);
    if (selectedDate) {
      const hours = (selectedDate.getHours() % 12 || 12)
        .toString()
        .padStart(2, "0");
      const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
      const period = selectedDate.getHours() >= 12 ? "PM" : "AM";
      const formattedTime = `${hours}:${minutes} ${period}`;

      if (medicineData.times.includes(formattedTime)) {
        Alert.alert(
          "Duplicate Time",
          "This reminder time has already been added.",
        );
        return;
      }

      handleFormData("times", [...medicineData.times, formattedTime]);
    }
  };

  const handleSubmitForm = async () => {
    if (!isFormValid()) {
      return;
    }

    if (isEditing && medicineData.notificationIds) {
      await cancelMedicineNotifications(medicineData.notificationIds);
    }

    const newNotificationIds =
      await scheduleMedicineNotifications(medicineData);

    const updatedMedData = {
      ...medicineData,
      notificationIds: newNotificationIds,
    };

    if (isEditing) {
      dispatch(updateMedicine(updatedMedData));
    } else {
      dispatch(addMedicine(updatedMedData));
    }

    setMedicineData(getInitialMedicineData());
    setErrors({});
    router.replace("/medicines");
  };

  const handleDelete = async () => {
    if (isEditing) {
      if (medicineData.notificationIds) {
        await cancelMedicineNotifications(medicineData.notificationIds);
      }
      dispatch(deleteMedicine(medicineData._id));
    }
    setShowDeleteModal(false);
    setMedicineData(getInitialMedicineData());
    setErrors({});
    router.replace("/medicines");
  };

  const handleBack = () => {
    setMedicineData(getInitialMedicineData());
    setErrors({});
    router.back();
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
      <StatusBar style="light" backgroundColor={COLORS.accentPrimary} />

      {/* Full-Bleed Green Top Header */}
      <View style={styles.fullBleedHeader}>
        <Pressable onPress={handleBack} style={styles.backBtn}>
          <ArrowLeftIcon size={22} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerTitle}>
          {isEditing ? "Edit Medicine" : "Add Medicine"}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          {/* Medicine Name */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Medicine name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Paracetamol"
              placeholderTextColor={COLORS.textMuted}
              value={medicineData.name}
              onChangeText={(text) => handleFormData("name", text)}
            />
            {errors.name ? (
              <View style={styles.errorRow}>
                <WarningCircleIcon size={14} color={COLORS.accentMissed} />
                <Text style={styles.errorText}>{errors.name}</Text>
              </View>
            ) : null}
          </View>

          {/* Dosage */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Dosage</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 500mg"
              placeholderTextColor={COLORS.textMuted}
              value={medicineData.dose}
              onChangeText={(text) => handleFormData("dose", text)}
            />
            {errors.dose ? (
              <View style={styles.errorRow}>
                <WarningCircleIcon size={14} color={COLORS.accentMissed} />
                <Text style={styles.errorText}>{errors.dose}</Text>
              </View>
            ) : null}
          </View>

          {/* Pill Inventory Count (Optional) */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Pill count / Inventory (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 20 pills left"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="number-pad"
              value={medicineData.quantityRemaining}
              onChangeText={(text) => handleFormData("quantityRemaining", text)}
            />
          </View>

          {/* Frequency Segmented Control */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>How often?</Text>
            <View style={styles.segmentedContainer}>
              {howOften.map((opt) => {
                const isActive = medicineData.frequency === opt.frequency;
                return (
                  <Pressable
                    key={opt.id}
                    style={[
                      styles.segmentBtn,
                      isActive && styles.segmentBtnActive,
                    ]}
                    onPress={() => handleFormData("frequency", opt.frequency)}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        isActive && styles.segmentTextActive,
                      ]}
                    >
                      {opt.title}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Specific Days Selector */}
            {medicineData.frequency === "specific-days" && (
              <View style={styles.daysWrapper}>
                <View style={styles.daysRow}>
                  {daysOptions.map((day) => {
                    const isSelected = medicineData.days.includes(day);
                    return (
                      <Pressable
                        key={day}
                        style={[
                          styles.dayChip,
                          isSelected && styles.dayChipSelected,
                        ]}
                        onPress={() => {
                          const newDays = isSelected
                            ? medicineData.days.filter((d) => d !== day)
                            : [...medicineData.days, day];
                          handleFormData("days", newDays);
                        }}
                      >
                        <Text
                          style={[
                            styles.dayChipText,
                            isSelected && styles.dayChipTextSelected,
                          ]}
                        >
                          {day}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
                {errors.days ? (
                  <View style={styles.errorRow}>
                    <WarningCircleIcon size={14} color={COLORS.accentMissed} />
                    <Text style={styles.errorText}>{errors.days}</Text>
                  </View>
                ) : null}
              </View>
            )}
          </View>

          {/* Times */}
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>What time(s)?</Text>
            <View style={styles.timesContainer}>
              {medicineData.times.map((t, idx) => (
                <View key={idx} style={styles.timeChip}>
                  <Text style={styles.timeChipText}>{t}</Text>
                  <Pressable
                    onPress={() =>
                      handleFormData(
                        "times",
                        medicineData.times.filter((time) => time !== t),
                      )
                    }
                  >
                    <XIcon size={14} color={COLORS.accentPrimary} />
                  </Pressable>
                </View>
              ))}

              <Pressable
                style={styles.addTimeChip}
                onPress={() => setShowTimePicker(true)}
              >
                <PlusIcon size={14} color={COLORS.textMuted} weight="bold" />
                <Text style={styles.addTimeText}>Add time</Text>
              </Pressable>
            </View>
            {errors.times ? (
              <View style={styles.errorRow}>
                <WarningCircleIcon size={14} color={COLORS.accentMissed} />
                <Text style={styles.errorText}>{errors.times}</Text>
              </View>
            ) : null}
          </View>

          {/* Save Button */}
          <Pressable style={styles.saveBtn} onPress={handleSubmitForm}>
            <Text style={styles.saveBtnText}>
              {isEditing ? "Save Changes" : "Save Medicine"}
            </Text>
          </Pressable>

          {/* Delete Option (Edit Mode) */}
          {isEditing && (
            <Pressable
              style={styles.deleteLink}
              onPress={() => setShowDeleteModal(true)}
            >
              <Text style={styles.deleteLinkText}>Delete medicine</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>

      {showTimePicker && (
        <DateTimePicker
          value={pickedTime}
          mode="time"
          is24Hour={false}
          onChange={handleTimeChange}
        />
      )}

      <ConfirmationModal
        visible={showDeleteModal}
        title={`Delete ${medicineData.name}?`}
        message="This will permanently delete this medicine and cancel all its scheduled reminders."
        confirmText="Delete"
        isDestructive
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </SafeAreaView>
  );
};

export default AddMedicine;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surfaceBase,
  },
  scrollContent: {
    padding: SPACING.xl,
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
  form: {
    gap: SPACING.xl,
  },
  fieldGroup: {
    gap: SPACING.xs,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  input: {
    backgroundColor: COLORS.surfaceSunken,
    borderRadius: RADIUS.input,
    height: 48,
    paddingHorizontal: SPACING.lg,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.accentMissed,
  },
  segmentedContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.surfaceSunken,
    borderRadius: RADIUS.input,
    padding: 4,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: RADIUS.input - 2,
  },
  segmentBtnActive: {
    backgroundColor: COLORS.accentPrimary,
  },
  segmentText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  segmentTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  daysWrapper: {
    marginTop: SPACING.md,
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surfaceCard,
  },
  dayChipSelected: {
    backgroundColor: COLORS.accentPrimary,
    borderColor: COLORS.accentPrimary,
  },
  dayChipText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  dayChipTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  timesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.md,
    alignItems: "center",
  },
  timeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.xs,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.accentPrimary,
    backgroundColor: "rgba(45, 106, 79, 0.1)",
  },
  timeChipText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.accentPrimary,
  },
  addTimeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderStyle: "dashed",
    backgroundColor: COLORS.surfaceCard,
  },
  addTimeText: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: "500",
  },
  saveBtn: {
    backgroundColor: COLORS.accentPrimary,
    height: 52,
    borderRadius: RADIUS.button,
    justifyContent: "center",
    alignItems: "center",
    marginTop: SPACING.md,
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  deleteLink: {
    alignItems: "center",
    paddingVertical: SPACING.md,
  },
  deleteLinkText: {
    color: COLORS.accentMissed,
    fontSize: 14,
    fontWeight: "500",
  },
});
