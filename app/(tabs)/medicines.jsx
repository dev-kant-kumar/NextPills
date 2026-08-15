import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AlertTriangle } from "lucide-react-native";
import { CaretRightIcon, PillIcon, PlusIcon } from "phosphor-react-native";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import EmptyState from "../../components/macro/EmptyState";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";
import { selectMedicines } from "../../store/slices/medicinesSlice";

const Medicines = () => {
  const insets = useSafeAreaInsets();
  const medicines = useSelector(selectMedicines);
  const router = useRouter();

  const handleShowDetails = (id) => {
    router.push({
      pathname: "/meddetail",
      params: { id },
    });
  };

  const handleAddMedicine = () => {
    router.push({ pathname: "/addmedicine", params: {} });
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
      <StatusBar style="light" backgroundColor={COLORS.accentPrimary} />
      <View style={styles.container}>
        {/* Full-Bleed Green Top Header Banner */}
        <View style={styles.fullBleedHeader}>
          <Text style={styles.headerTitle}>Medicines</Text>
          <Text style={styles.headerSubtitle}>
            {medicines && medicines.length > 0
              ? `${medicines.length} saved ${medicines.length === 1 ? "medicine" : "medicines"}`
              : "Your medicine catalog"}
          </Text>
        </View>

        {medicines && medicines.length > 0 ? (
          <FlatList
            data={medicines}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const freqText =
                item.frequency === "daily"
                  ? "Daily"
                  : item.days && item.days.length > 0
                  ? item.days.join(", ")
                  : "As needed";

              const timesCount = item.times ? item.times.length : 0;
              const isLowStock =
                typeof item.quantityRemaining === "number" && item.quantityRemaining <= 5;

              return (
                <Pressable
                  onPress={() => handleShowDetails(item._id)}
                  style={styles.cardPressable}
                >
                  <View style={styles.cardRow}>
                    {/* Left: 48dp Icon Circle */}
                    <View style={styles.iconCircle}>
                      <PillIcon size={24} color={COLORS.accentPrimary} />
                    </View>

                    {/* Center: Title, Low Stock & Subtitle */}
                    <View style={styles.cardDetails}>
                      <Text style={styles.medName}>{item.name}</Text>

                      {isLowStock && (
                        <View style={styles.lowStockBadge}>
                          <AlertTriangle size={12} color={COLORS.accentWarm} />
                          <Text style={styles.lowStockText}>
                            {`Refill Soon (${item.quantityRemaining} left)`}
                          </Text>
                        </View>
                      )}

                      <Text style={styles.medMeta}>
                        {`${item.dose} · ${freqText}, ${timesCount}x`}
                      </Text>
                    </View>

                    {/* Right: Caret Arrow */}
                    <CaretRightIcon size={20} color={COLORS.textMuted} />
                  </View>
                </Pressable>
              );
            }}
          />
        ) : (
          <EmptyState
            title="No saved medicines"
            subTitle="Add your medicines here to get scheduled reminders on your phone."
          />
        )}

        {medicines && medicines.length > 0 && (
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

export default Medicines;

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
  fullBleedHeader: {
    backgroundColor: COLORS.accentPrimary,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xl,
    marginBottom: SPACING.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
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
  listContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 110,
  },
  cardPressable: {
    marginBottom: SPACING.md,
  },
  cardRow: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(45, 106, 79, 0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
  },
  cardDetails: {
    flex: 1,
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
  medMeta: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 1,
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
