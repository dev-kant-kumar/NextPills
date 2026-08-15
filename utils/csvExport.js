import { Alert, Share } from "react-native";

export const exportHistoryToCSV = async (history = [], medicines = []) => {
  try {
    if (!history || history.length === 0) {
      Alert.alert("Export Data", "No history entries found to export.");
      return;
    }

    const medMap = {};
    medicines.forEach((m) => {
      medMap[m._id] = m;
    });

    const headers = ["ID", "Medicine Name", "Dosage", "Action", "Scheduled Time", "Recorded Timestamp"];
    const rows = history.map((item) => {
      const med = medMap[item._id] || {};
      const medName = item.name || med.name || "Unknown";
      const dose = item.dose || med.dose || "N/A";
      return [
        `"${item._id || ""}"`,
        `"${medName.replace(/"/g, '""')}"`,
        `"${dose.replace(/"/g, '""')}"`,
        `"${item.action || ""}"`,
        `"${item.scheduledTime || ""}"`,
        `"${item.timestamp || ""}"`,
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");

    await Share.share({
      title: "NextPills Medicine History Export.csv",
      message: csvContent,
    });
  } catch (error) {
    console.error("Error exporting CSV:", error);
    Alert.alert("Export Error", "Failed to generate CSV export.");
  }
};
