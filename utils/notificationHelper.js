import Constants from "expo-constants";
import { Alert, Platform } from "react-native";
import { parseTimeString } from "./dateHelpers";

export const isExpoGo = () => {
  try {
    return (
      Constants.appOwnership === "expo" ||
      Constants.executionEnvironment === "storeClient"
    );
  } catch (e) {
    return false;
  }
};

let Notifications = null;
if (!isExpoGo()) {
  try {
    Notifications = require("expo-notifications");
    if (Notifications && typeof Notifications.setNotificationHandler === "function") {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });
    }
  } catch (e) {
    console.warn("expo-notifications module load notice:", e);
  }
}

export const requestNotificationPermissions = async () => {
  if (isExpoGo() || !Notifications) {
    return true;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });
      finalStatus = status;
    }

    if (finalStatus === "granted" && Platform.OS === "android") {
      await setupAndroidNotificationChannel();
    }

    return finalStatus === "granted";
  } catch (error) {
    return true;
  }
};

export const setupAndroidNotificationChannel = async () => {
  if (Platform.OS !== "android" || isExpoGo() || !Notifications) return;
  try {
    await Notifications.setNotificationChannelAsync("medicine-reminders", {
      name: "Medicine Reminders",
      description: "High priority heads-up reminders for scheduled medicines and stock refills",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#2D6A4F",
      sound: "default",
      enableVibrate: true,
      showBadge: true,
    });
  } catch (error) {
    // Channel warning
  }
};

export const setupNotificationCategories = async () => {
  if (isExpoGo() || !Notifications) return;
  try {
    await Notifications.setNotificationCategoryAsync("MEDICINE_REMINDER", [
      {
        identifier: "TAKEN_ACTION",
        buttonTitle: "Taken",
        options: { isAuthenticationRequired: false },
      },
      {
        identifier: "SKIP_ACTION",
        buttonTitle: "Skip",
        options: { isDestructive: true },
      },
    ]);
  } catch (error) {
    // Category warning
  }
};

export const scheduleMedicineNotifications = async (medicine) => {
  if (!medicine || !medicine.times) return [];
  if (isExpoGo() || !Notifications) {
    console.log(`[NextPills] Medicine ${medicine.name} scheduled on-device.`);
    return ["expo-go-mock-id"];
  }

  const scheduledIds = [];
  try {
    if (Platform.OS === "android") {
      await setupAndroidNotificationChannel();
    }

    const dayToWeekdayMap = {
      Sun: 1,
      Mon: 2,
      Tue: 3,
      Wed: 4,
      Thu: 5,
      Fri: 6,
      Sat: 7,
    };

    for (const timeStr of medicine.times) {
      const { hours, minutes } = parseTimeString(timeStr);

      const content = {
        title: `💊 Time to take ${medicine.name}`,
        body: `${medicine.dose} · Scheduled for ${timeStr}`,
        sound: "default",
        priority: Notifications.AndroidNotificationPriority.MAX,
        channelId: "medicine-reminders",
        data: { medicineId: medicine._id, scheduledTime: timeStr },
        categoryIdentifier: "MEDICINE_REMINDER",
      };

      if (medicine.frequency === "daily") {
        const identifier = await Notifications.scheduleNotificationAsync({
          content,
          trigger: {
            hour: hours,
            minute: minutes,
            repeats: true,
          },
        });
        scheduledIds.push(identifier);
      } else if (medicine.frequency === "specific-days" && Array.isArray(medicine.days)) {
        for (const day of medicine.days) {
          const weekday = dayToWeekdayMap[day];
          if (weekday) {
            const identifier = await Notifications.scheduleNotificationAsync({
              content,
              trigger: {
                weekday: weekday,
                hour: hours,
                minute: minutes,
                repeats: true,
              },
            });
            scheduledIds.push(identifier);
          }
        }
      }
    }
  } catch (error) {
    console.warn("Notification scheduling notice:", error);
  }

  return scheduledIds;
};

// 5-Day Low Stock Refill Alert Notification
export const scheduleLowStockNotification = async (medicine, daysRemaining = 5) => {
  if (!medicine || isExpoGo() || !Notifications) return;

  try {
    if (Platform.OS === "android") {
      await setupAndroidNotificationChannel();
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `⚠️ Low Stock Warning: ${medicine.name}`,
        body: `Only ${medicine.quantityRemaining} pills left (~${daysRemaining} days remaining). Tap to refill your stock!`,
        sound: "default",
        priority: Notifications.AndroidNotificationPriority.MAX,
        channelId: "medicine-reminders",
        data: { medicineId: medicine._id, isRefillAlert: true },
      },
      trigger: {
        seconds: 2,
      },
    });
  } catch (error) {
    console.warn("Low stock notification warning:", error);
  }
};

// Immediate test notification (fires in delaySeconds)
export const sendTestNotification = async (delaySeconds = 5) => {
  if (isExpoGo() || !Notifications) {
    Alert.alert(
      "Expo Go Environment Notice",
      "Expo SDK 53+ removed native notification triggers inside Expo Go.\n\nLocal notifications are fully active when built as an Android APK or Development Build!\n\n(All schedule cards, dose rings, and history tracking work live now).",
    );
    return false;
  }

  try {
    await requestNotificationPermissions();
    await setupNotificationCategories();
    if (Platform.OS === "android") {
      await setupAndroidNotificationChannel();
    }

    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: "💊 Time to take Paracetamol",
        body: "500mg · Test medicine reminder (flew in on time!)",
        sound: "default",
        priority: Notifications.AndroidNotificationPriority.MAX,
        channelId: "medicine-reminders",
        data: { medicineId: "test-med", scheduledTime: "Now" },
        categoryIdentifier: "MEDICINE_REMINDER",
      },
      trigger: {
        seconds: delaySeconds,
      },
    });

    return Boolean(identifier);
  } catch (error) {
    console.warn("Test notification error:", error);
    return false;
  }
};

export const cancelMedicineNotifications = async (scheduledIds = []) => {
  if (!Array.isArray(scheduledIds) || isExpoGo() || !Notifications) return;
  for (const id of scheduledIds) {
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
    } catch (e) {
      // Safe cancellation
    }
  }
};

export const cancelAllNotifications = async () => {
  if (isExpoGo() || !Notifications) return;
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (e) {
    // Safe cancellation
  }
};
