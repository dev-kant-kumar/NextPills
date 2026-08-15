import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { recordMedicineAction } from "../store/slices/historySlice";
import {
  isExpoGo,
  requestNotificationPermissions,
  setupNotificationCategories,
} from "../utils/notificationHelper";

let Notifications = null;
if (!isExpoGo()) {
  try {
    Notifications = require("expo-notifications");
  } catch (e) {
    // Safe fallback
  }
}

export const useNotifications = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (isExpoGo() || !Notifications) return;

    let responseSubscription;

    const initNotifications = async () => {
      try {
        const granted = await requestNotificationPermissions();
        if (granted) {
          await setupNotificationCategories();
        }

        if (typeof Notifications.addNotificationResponseReceivedListener === "function") {
          responseSubscription = Notifications.addNotificationResponseReceivedListener(
            (response) => {
              try {
                const actionIdentifier = response.actionIdentifier;
                const data = response?.notification?.request?.content?.data;

                if (data && data.medicineId && data.scheduledTime) {
                  if (actionIdentifier === "TAKEN_ACTION") {
                    dispatch(
                      recordMedicineAction({
                        _id: data.medicineId,
                        scheduledTime: data.scheduledTime,
                        action: "taken",
                      }),
                    );
                  } else if (actionIdentifier === "SKIP_ACTION") {
                    dispatch(
                      recordMedicineAction({
                        _id: data.medicineId,
                        scheduledTime: data.scheduledTime,
                        action: "skip",
                      }),
                    );
                  }
                }
              } catch (err) {
                console.warn("Notification action handling notice:", err);
              }
            },
          );
        }
      } catch (e) {
        console.warn("Notifications listener setup notice:", e);
      }
    };

    initNotifications();

    return () => {
      try {
        if (responseSubscription && typeof responseSubscription.remove === "function") {
          responseSubscription.remove();
        }
      } catch (err) {
        // Safe cleanup
      }
    };
  }, [dispatch]);
};
