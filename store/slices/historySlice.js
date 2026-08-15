import { createSelector, createSlice } from "@reduxjs/toolkit";
import { getLast7Days, getTodayString } from "../../utils/dateHelpers";

const generateDemoHistory = () => {
  const last7 = getLast7Days();
  const logs = [];

  // Generate taken/skipped history for the past 6 days
  last7.slice(0, 6).forEach((dayObj) => {
    logs.push({
      _id: "demo-med-1",
      name: "Paracetamol",
      dose: "500mg",
      action: "taken",
      scheduledTime: "08:00 AM",
      timestamp: `${dayObj.dateStr}T08:02:00.000Z`,
    });

    logs.push({
      _id: "demo-med-2",
      name: "Vitamin D3",
      dose: "1000 IU",
      action: "taken",
      scheduledTime: "09:00 AM",
      timestamp: `${dayObj.dateStr}T09:05:00.000Z`,
    });
  });

  return logs;
};

const initialState = {
  history: [],
};

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    recordMedicineAction: (state, action) => {
      const { _id, name, dose, scheduledTime, action: actionType } = action.payload;

      const todayStr = getTodayString();
      state.history = state.history.filter(
        (h) =>
          !(
            h._id === _id &&
            h.scheduledTime === scheduledTime &&
            h.timestamp &&
            h.timestamp.split("T")[0] === todayStr
          ),
      );

      const medHistory = {
        _id,
        name,
        dose,
        action: actionType,
        scheduledTime,
        timestamp: new Date().toISOString(),
      };

      state.history.unshift(medHistory);
    },

    loadDemoHistory: (state) => {
      state.history = generateDemoHistory();
    },

    clearHistory: (state) => {
      state.history = [];
    },
  },
});

export const selectMedicineHistory = (state) => state.history.history || [];

export const selectMedicineHistoryById = (id) => (state) =>
  (state.history.history || []).filter((med) => med._id === id);

export const selectGroupedHistory = createSelector(
  [selectMedicineHistory],
  (history) => {
    const todayStr = getTodayString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getTodayString(yesterday);

    const groups = {
      TODAY: [],
      YESTERDAY: [],
      EARLIER: [],
    };

    history.forEach((item) => {
      const dateStr = item.timestamp ? item.timestamp.split("T")[0] : "";
      if (dateStr === todayStr) {
        groups.TODAY.push(item);
      } else if (dateStr === yesterdayStr) {
        groups.YESTERDAY.push(item);
      } else {
        groups.EARLIER.push(item);
      }
    });

    return groups;
  },
);

export const selectWeeklyAdherence = createSelector(
  [selectMedicineHistory, (state) => state.medicines.medicines || []],
  (history, medicines) => {
    const last7Days = getLast7Days();

    let totalTaken = 0;
    let totalScheduled = 0;

    const daysData = last7Days.map((dayObj) => {
      const dayHistory = history.filter(
        (h) => h.timestamp && h.timestamp.split("T")[0] === dayObj.dateStr,
      );
      const takenCount = dayHistory.filter((h) => h.action === "taken").length;
      const missedOrSkippedCount = dayHistory.filter((h) => h.action === "skip").length;

      totalTaken += takenCount;

      let dayScheduled = 0;
      medicines.forEach((m) => {
        if (m.frequency === "daily") {
          dayScheduled += (m.times || []).length;
        } else if (m.frequency === "specific-days" && Array.isArray(m.days)) {
          if (m.days.includes(dayObj.dayLabel)) {
            dayScheduled += (m.times || []).length;
          }
        }
      });

      totalScheduled += dayScheduled;

      return {
        ...dayObj,
        takenCount,
        missedCount: missedOrSkippedCount,
        scheduledCount: dayScheduled,
        adherenceRatio: dayScheduled > 0 ? takenCount / dayScheduled : takenCount > 0 ? 1 : 0,
      };
    });

    return {
      totalTaken,
      totalScheduled: Math.max(totalTaken, totalScheduled),
      daysData,
    };
  },
);

export const selectAdherenceStreak = createSelector(
  [selectWeeklyAdherence],
  ({ daysData }) => {
    let streak = 0;
    // Count consecutive past days with >= 80% adherence
    for (let i = daysData.length - 2; i >= 0; i--) {
      const day = daysData[i];
      if (day.takenCount > 0 && day.adherenceRatio >= 0.8) {
        streak += 1;
      } else {
        break;
      }
    }
    return streak;
  },
);

export default historySlice.reducer;
export const { recordMedicineAction, loadDemoHistory, clearHistory } = historySlice.actions;
