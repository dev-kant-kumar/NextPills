import { StatusBar } from "expo-status-bar";
import { CheckCircleIcon, ClockIcon, XCircleIcon } from "phosphor-react-native";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import EmptyState from "../../components/macro/EmptyState";
import { COLORS, RADIUS, SPACING } from "../../constants/theme";
import {
  selectGroupedHistory,
  selectWeeklyAdherence,
} from "../../store/slices/historySlice";

const History = () => {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState("all"); // 'all' | 'taken' | 'skip'
  const groupedHistory = useSelector(selectGroupedHistory);
  const { totalTaken, totalScheduled, daysData } = useSelector(selectWeeklyAdherence);

  const filterLogs = (logs) => {
    if (activeFilter === "all") return logs;
    return logs.filter((item) => item.action === activeFilter);
  };

  const todayFiltered = filterLogs(groupedHistory.TODAY);
  const yesterdayFiltered = filterLogs(groupedHistory.YESTERDAY);
  const earlierFiltered = filterLogs(groupedHistory.EARLIER);

  const hasHistory =
    todayFiltered.length > 0 ||
    yesterdayFiltered.length > 0 ||
    earlierFiltered.length > 0;

  const getEmptyStateContent = () => {
    if (activeFilter === "skip") {
      return {
        title: "No skipped doses",
        subTitle: "Great job! You haven't skipped any scheduled doses.",
      };
    }
    if (activeFilter === "taken") {
      return {
        title: "No taken doses recorded",
        subTitle: "Log your medicine doses on the Today screen to see them recorded here.",
      };
    }
    return {
      title: "Nothing logged yet",
      subTitle: "Once you start taking your medicines, your history will show up here.",
    };
  };

  const emptyContent = getEmptyStateContent();

  const renderHistoryItem = (item, index, totalItems) => {
    const isTaken = item.action === "taken";
    const isLast = index === totalItems - 1;

    return (
      <View
        key={`${item._id}-${item.timestamp}-${index}`}
        style={[styles.historyCardItem, isLast && { borderBottomWidth: 0 }]}
      >
        <View style={styles.itemLeft}>
          {isTaken ? (
            <CheckCircleIcon size={20} color={COLORS.accentPrimary} weight="fill" />
          ) : (
            <XCircleIcon size={20} color={COLORS.accentMissed} weight="fill" />
          )}

          <View style={styles.itemTextGroup}>
            <Text style={styles.itemMedName}>{item.name || "Medicine"}</Text>
            {item.dose ? <Text style={styles.itemDose}>{item.dose}</Text> : null}
          </View>
        </View>

        <View style={styles.itemRight}>
          <Text style={[styles.actionBadgeText, !isTaken && { color: COLORS.accentMissed }]}>
            {isTaken ? "Taken" : "Skipped"}
          </Text>
          <Text style={styles.itemTimeText}>{item.scheduledTime}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.rootContainer}>
      <StatusBar style="light" translucent backgroundColor="transparent" />

      {/* Full-Bleed Green Top Header */}
      <View
        style={[
          styles.fullBleedHeader,
          { paddingTop: Math.max(insets.top, 20) + SPACING.md },
        ]}
      >
        <Text style={styles.headerTitle}>History</Text>
        <Text style={styles.headerSubtitle}>
          {`Weekly Adherence: ${totalTaken}/${totalScheduled} doses taken`}
        </Text>
      </View>

      <FlatList
        style={styles.flatList}
        data={[]}
        renderItem={null}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.container}>
            {/* Weekly Summary Card */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>7-Day Dose Adherence</Text>

              {/* 7-Day Mini Bar Chart */}
              <View style={styles.chartContainer}>
                {daysData.map((d, i) => {
                  const heightPct = Math.max(15, Math.min(100, Math.round(d.adherenceRatio * 100)));
                  let barColor = COLORS.border;
                  if (d.takenCount > 0 && d.adherenceRatio >= 0.8) {
                    barColor = COLORS.accentPrimary;
                  } else if (d.takenCount > 0) {
                    barColor = COLORS.accentWarm;
                  } else if (d.missedCount > 0) {
                    barColor = COLORS.accentMissed;
                  }

                  return (
                    <View key={i} style={styles.chartColumn}>
                      <View style={styles.barTrack}>
                        <View
                          style={[
                            styles.barFill,
                            { height: `${heightPct}%`, backgroundColor: barColor },
                          ]}
                        />
                      </View>
                      <Text
                        style={[
                          styles.dayLabel,
                          d.isToday && styles.todayLabel,
                        ]}
                      >
                        {d.dayLabel}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Log Filter Chips */}
            <View style={styles.filterChipRow}>
              {[
                { id: "all", label: "All Logs" },
                { id: "taken", label: "Taken" },
                { id: "skip", label: "Skipped" },
              ].map((chip) => {
                const isSelected = activeFilter === chip.id;
                return (
                  <Pressable
                    key={chip.id}
                    style={[styles.filterChip, isSelected && styles.filterChipActive]}
                    onPress={() => setActiveFilter(chip.id)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        isSelected && styles.filterChipTextActive,
                      ]}
                    >
                      {chip.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Grouped Logs */}
            {hasHistory ? (
              <View style={styles.logsWrapper}>
                {todayFiltered.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionHeader}>TODAY</Text>
                    <View style={styles.cardGroup}>
                      {todayFiltered.map((item, idx) =>
                        renderHistoryItem(item, idx, todayFiltered.length),
                      )}
                    </View>
                  </View>
                )}

                {yesterdayFiltered.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionHeader}>YESTERDAY</Text>
                    <View style={styles.cardGroup}>
                      {yesterdayFiltered.map((item, idx) =>
                        renderHistoryItem(item, idx, yesterdayFiltered.length),
                      )}
                    </View>
                  </View>
                )}

                {earlierFiltered.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionHeader}>EARLIER</Text>
                    <View style={styles.cardGroup}>
                      {earlierFiltered.map((item, idx) =>
                        renderHistoryItem(item, idx, earlierFiltered.length),
                      )}
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <EmptyState
                title={emptyContent.title}
                subTitle={emptyContent.subTitle}
                showButton={false}
                icon={<ClockIcon size={40} color={COLORS.accentPrimary} />}
              />
            )}
          </View>
        }
      />
    </View>
  );
};

export default History;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: COLORS.surfaceBase,
  },
  headerSafeArea: {
    backgroundColor: COLORS.accentPrimary,
  },
  flatList: {
    flex: 1,
    backgroundColor: COLORS.surfaceBase,
  },
  listContent: {
    paddingBottom: 110,
    backgroundColor: COLORS.surfaceBase,
  },
  container: {
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
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
  summaryCard: {
    marginHorizontal: SPACING.xl,
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 80,
    paddingHorizontal: SPACING.xs,
  },
  chartColumn: {
    alignItems: "center",
    width: 28,
  },
  barTrack: {
    width: 10,
    height: 54,
    backgroundColor: COLORS.surfaceSunken,
    borderRadius: 5,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: {
    width: "100%",
    borderRadius: 5,
  },
  dayLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 6,
    fontWeight: "500",
  },
  todayLabel: {
    color: COLORS.accentPrimary,
    fontWeight: "700",
  },
  filterChipRow: {
    flexDirection: "row",
    paddingHorizontal: SPACING.xl,
    gap: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  filterChip: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surfaceCard,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: "center",
    justifyContent: "center",
  },
  filterChipActive: {
    backgroundColor: COLORS.accentPrimary,
    borderColor: COLORS.accentPrimary,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  filterChipTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  logsWrapper: {
    paddingHorizontal: SPACING.xl,
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
  cardGroup: {
    backgroundColor: COLORS.surfaceCard,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.lg,
  },
  historyCardItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
  },
  itemTextGroup: {
    justifyContent: "center",
  },
  itemMedName: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  itemDose: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  itemRight: {
    alignItems: "flex-end",
  },
  actionBadgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.accentPrimary,
  },
  itemTimeText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
