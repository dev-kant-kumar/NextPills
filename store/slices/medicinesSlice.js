import { createSelector, createSlice } from "@reduxjs/toolkit";
import * as crypto from "expo-crypto";
import {
  getDayName,
  getTodayString,
  getUpcomingTimeLabel,
  isActionable,
  isDueNow,
  isMissed,
  parseTimeString,
} from "../../utils/dateHelpers";
import { selectToday } from "./appSlice";
import { selectMedicineHistory } from "./historySlice";

const demoMedicines = [
  {
    _id: "demo-med-1",
    name: "Paracetamol",
    dose: "500mg",
    frequency: "daily",
    days: [],
    times: ["08:00 AM", "08:00 PM"],
    quantityRemaining: 18,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "demo-med-2",
    name: "Vitamin D3",
    dose: "1000 IU",
    frequency: "daily",
    days: [],
    times: ["09:00 AM"],
    quantityRemaining: 4,
    createdAt: new Date().toISOString(),
  },
  {
    _id: "demo-med-3",
    name: "Amoxicillin",
    dose: "250mg",
    frequency: "specific-days",
    days: ["Mon", "Wed", "Fri", "Sat"],
    times: ["01:00 PM"],
    quantityRemaining: 12,
    createdAt: new Date().toISOString(),
  },
];

const initialState = {
  medicines: [],
};

const medicinesSlice = createSlice({
  name: "medicines",
  initialState,

  reducers: {
    addMedicine: (state, action) => {
      const medToAdd = {
        ...action.payload,
        _id: action.payload._id || crypto.randomUUID(),
        quantityRemaining: action.payload.quantityRemaining
          ? parseInt(action.payload.quantityRemaining, 10)
          : null,
        createdAt: new Date().toISOString(),
      };
      state.medicines.push(medToAdd);
    },

    updateMedicine: (state, action) => {
      const index = state.medicines.findIndex(
        (m) => m._id === action.payload._id,
      );
      if (index !== -1) {
        state.medicines[index] = {
          ...state.medicines[index],
          ...action.payload,
          quantityRemaining:
            action.payload.quantityRemaining !== undefined
              ? parseInt(action.payload.quantityRemaining, 10)
              : state.medicines[index].quantityRemaining,
          updatedAt: new Date().toISOString(),
        };
      }
    },

    decrementStock: (state, action) => {
      const med = state.medicines.find((m) => m._id === action.payload);
      if (med && typeof med.quantityRemaining === "number" && med.quantityRemaining > 0) {
        med.quantityRemaining -= 1;
      }
    },

    deleteMedicine: (state, action) => {
      state.medicines = state.medicines.filter((m) => m._id !== action.payload);
    },

    loadDemoMedicines: (state) => {
      state.medicines = demoMedicines;
    },

    clearAllMedicines: (state) => {
      state.medicines = [];
    },
  },
});

export const selectMedicines = (state) => state.medicines.medicines || [];
export const selectMedicineById = (id) => (state) =>
  state.medicines.medicines.find((m) => m._id === id);

// Selector for medicines running out within 5 days
export const selectLowStockMedicines = createSelector(
  [selectMedicines],
  (medicines) => {
    return (medicines || [])
      .filter((med) => {
        if (typeof med.quantityRemaining !== "number") return false;
        const timesPerDay = Array.isArray(med.times) && med.times.length > 0 ? med.times.length : 1;
        let pillsPerDay = timesPerDay;
        if (med.frequency === "specific-days" && Array.isArray(med.days) && med.days.length > 0) {
          pillsPerDay = (timesPerDay * med.days.length) / 7;
        }
        const daysRemaining = med.quantityRemaining / (pillsPerDay || 1);
        return med.quantityRemaining <= 5 || daysRemaining <= 5;
      })
      .map((med) => {
        const timesPerDay = Array.isArray(med.times) && med.times.length > 0 ? med.times.length : 1;
        let pillsPerDay = timesPerDay;
        if (med.frequency === "specific-days" && Array.isArray(med.days) && med.days.length > 0) {
          pillsPerDay = (timesPerDay * med.days.length) / 7;
        }
        const daysRemaining = Math.max(1, Math.ceil(med.quantityRemaining / (pillsPerDay || 1)));
        return {
          ...med,
          daysRemaining,
        };
      });
  },
);

export const selectMedicineToTakeToday = createSelector(
  [selectMedicines, selectMedicineHistory, selectToday],
  (medicines, history, today) => {
    const todayDayName = getDayName();
    const todayStr = today || getTodayString();

    const medicinesForToday = medicines.filter((med) => {
      if (med.frequency === "daily") return true;
      if (med.frequency === "specific-days" && Array.isArray(med.days)) {
        return med.days.includes(todayDayName);
      }
      return true;
    });

    const todaysDoses = medicinesForToday.flatMap((med) =>
      (med.times || []).map((time) => {
        const historyRecord = (history || []).find(
          (h) =>
            h._id === med._id &&
            h.scheduledTime === time &&
            h.timestamp &&
            h.timestamp.split("T")[0] === todayStr,
        );

        let status = "upcoming";
        if (historyRecord) {
          status = historyRecord.action === "taken" ? "taken" : "skip";
        } else if (isDueNow(time)) {
          status = "due-now";
        } else if (isMissed(time)) {
          status = "missed";
        }

        const timesPerDay = Array.isArray(med.times) && med.times.length > 0 ? med.times.length : 1;
        let pillsPerDay = timesPerDay;
        if (med.frequency === "specific-days" && Array.isArray(med.days) && med.days.length > 0) {
          pillsPerDay = (timesPerDay * med.days.length) / 7;
        }
        const daysRemaining = Math.max(1, Math.ceil(med.quantityRemaining / (pillsPerDay || 1)));
        const isLowStock =
          typeof med.quantityRemaining === "number" && (med.quantityRemaining <= 5 || daysRemaining <= 5);
        const canTake = historyRecord ? false : isActionable(time);
        const upcomingLabel = getUpcomingTimeLabel(time);

        return {
          ...med,
          scheduledTime: time,
          status,
          canTake,
          upcomingLabel,
          isLowStock,
          daysRemaining,
          isDone: status === "taken" || status === "skip",
        };
      }),
    );

    return todaysDoses;
  },
);

export const selectGroupedTodayDoses = createSelector(
  [selectMedicineToTakeToday],
  (todaysDoses) => {
    const sorted = [...todaysDoses].sort((a, b) => {
      const timeA = parseTimeString(a.scheduledTime);
      const timeB = parseTimeString(b.scheduledTime);
      const minsA = timeA.hours * 60 + timeA.minutes;
      const minsB = timeB.hours * 60 + timeB.minutes;
      return minsA - minsB;
    });

    const groups = {
      DUE_NOW: [],
      UPCOMING: [],
      COMPLETED: [],
    };

    sorted.forEach((dose) => {
      if (dose.isDone) {
        groups.COMPLETED.push(dose);
      } else if (dose.status === "due-now" || dose.status === "missed") {
        groups.DUE_NOW.push(dose);
      } else {
        groups.UPCOMING.push(dose);
      }
    });

    return {
      allSorted: sorted,
      groups,
      hasDoses: sorted.length > 0,
    };
  },
);

export default medicinesSlice.reducer;
export const {
  addMedicine,
  updateMedicine,
  decrementStock,
  deleteMedicine,
  loadDemoMedicines,
  clearAllMedicines,
} = medicinesSlice.actions;
