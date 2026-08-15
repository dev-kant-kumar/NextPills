import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";
import { Alert } from "react-native";

const formatTimestamp = (ts) => {
  if (!ts) return "—";
  try {
    const d = new Date(ts);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(ts);
  }
};

const buildHtml = (history, medicines, userName) => {
  const medMap = {};
  medicines.forEach((m) => {
    medMap[m._id] = m;
  });

  const today = new Date().toLocaleDateString([], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Summary stats
  const totalLogs = history.length;
  const takenCount = history.filter((h) => h.action === "taken").length;
  const skippedCount = history.filter((h) => h.action === "skip").length;
  const adherencePct =
    totalLogs > 0 ? Math.round((takenCount / totalLogs) * 100) : 0;

  // Medicine summary
  const medSummary = {};
  history.forEach((h) => {
    const name = h.name || medMap[h._id]?.name || "Unknown";
    if (!medSummary[name]) {
      medSummary[name] = { taken: 0, skipped: 0, dose: h.dose || medMap[h._id]?.dose || "—" };
    }
    if (h.action === "taken") medSummary[name].taken++;
    else medSummary[name].skipped++;
  });

  const medSummaryRows = Object.entries(medSummary)
    .map(
      ([name, s]) => `
      <tr>
        <td style="padding: 10px 14px; font-weight: 500;">${name}</td>
        <td style="padding: 10px 14px; text-align: center;">${s.dose}</td>
        <td style="padding: 10px 14px; text-align: center; color: #2D6A4F; font-weight: 600;">${s.taken}</td>
        <td style="padding: 10px 14px; text-align: center; color: #9B2C2C; font-weight: 600;">${s.skipped}</td>
        <td style="padding: 10px 14px; text-align: center; font-weight: 600;">${
          s.taken + s.skipped > 0
            ? Math.round((s.taken / (s.taken + s.skipped)) * 100)
            : 0
        }%</td>
      </tr>`,
    )
    .join("");

  // Full log rows
  const logRows = history
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px 14px;">${item.name || medMap[item._id]?.name || "Unknown"}</td>
        <td style="padding: 8px 14px; text-align: center;">${item.dose || medMap[item._id]?.dose || "—"}</td>
        <td style="padding: 8px 14px; text-align: center;">
          <span style="
            display: inline-block;
            padding: 2px 10px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            background: ${item.action === "taken" ? "rgba(45,106,79,0.12)" : "rgba(155,44,44,0.12)"};
            color: ${item.action === "taken" ? "#2D6A4F" : "#9B2C2C"};
          ">${item.action === "taken" ? "Taken" : "Skipped"}</span>
        </td>
        <td style="padding: 8px 14px; text-align: center;">${item.scheduledTime || "—"}</td>
        <td style="padding: 8px 14px; text-align: center; font-size: 12px; color: #666;">${formatTimestamp(item.timestamp)}</td>
      </tr>`,
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, "Segoe UI", Roboto, sans-serif;
          color: #1A1A1A;
          padding: 40px 32px;
          font-size: 14px;
          line-height: 1.5;
        }

        .header {
          background: #2D6A4F;
          color: #FFFFFF;
          padding: 28px 32px;
          margin: -40px -32px 32px -32px;
        }
        .header h1 {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 4px;
          letter-spacing: -0.5px;
        }
        .header p {
          font-size: 13px;
          opacity: 0.85;
        }

        .stats-row {
          display: flex;
          gap: 16px;
          margin-bottom: 32px;
        }
        .stat-card {
          flex: 1;
          background: #F7F5F1;
          border-radius: 10px;
          padding: 16px;
          text-align: center;
        }
        .stat-value {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 2px;
        }
        .stat-value.green { color: #2D6A4F; }
        .stat-value.red { color: #9B2C2C; }
        .stat-value.blue { color: #1A1A1A; }
        .stat-label {
          font-size: 12px;
          color: #666;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .section-title {
          font-size: 14px;
          font-weight: 700;
          color: #2D6A4F;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 2px solid #2D6A4F;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 32px;
          font-size: 13px;
        }
        thead th {
          background: #F7F5F1;
          text-align: left;
          padding: 10px 14px;
          font-weight: 600;
          font-size: 12px;
          color: #555;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 2px solid #E0DCD4;
        }
        thead th:not(:first-child) {
          text-align: center;
        }
        tbody tr {
          border-bottom: 1px solid #EDEBE7;
        }
        tbody tr:nth-child(even) {
          background: #FDFCFA;
        }

        .footer {
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid #E0DCD4;
          text-align: center;
          font-size: 11px;
          color: #999;
        }
      </style>
    </head>
    <body>

      <div class="header">
        <h1>NextPills Medicine Report</h1>
        <p>Prepared for ${userName || "User"} · Generated on ${today}</p>
      </div>

      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-value blue">${totalLogs}</div>
          <div class="stat-label">Total Doses</div>
        </div>
        <div class="stat-card">
          <div class="stat-value green">${takenCount}</div>
          <div class="stat-label">Taken</div>
        </div>
        <div class="stat-card">
          <div class="stat-value red">${skippedCount}</div>
          <div class="stat-label">Skipped</div>
        </div>
        <div class="stat-card">
          <div class="stat-value green">${adherencePct}%</div>
          <div class="stat-label">Adherence</div>
        </div>
      </div>

      <div class="section-title">Medicine Summary</div>
      <table>
        <thead>
          <tr>
            <th>Medicine</th>
            <th>Dosage</th>
            <th>Taken</th>
            <th>Skipped</th>
            <th>Adherence</th>
          </tr>
        </thead>
        <tbody>
          ${medSummaryRows}
        </tbody>
      </table>

      <div class="section-title">Full Dose Log</div>
      <table>
        <thead>
          <tr>
            <th>Medicine</th>
            <th>Dosage</th>
            <th>Action</th>
            <th>Scheduled</th>
            <th>Recorded At</th>
          </tr>
        </thead>
        <tbody>
          ${logRows}
        </tbody>
      </table>

      <div class="footer">
        NextPills · 100% Offline · No Cloud · Your Data Stays On Your Device
      </div>

    </body>
    </html>
  `;
};

export const exportHistoryToPDF = async (history = [], medicines = [], userName = "") => {
  try {
    if (!history || history.length === 0) {
      Alert.alert("Export PDF", "No history entries found to export.");
      return;
    }

    const html = buildHtml(history, medicines, userName);

    // Build a clean filename: Alex_NextPills_Report_Aug15_2025.pdf
    const now = new Date();
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const dateTag = `${monthNames[now.getMonth()]}${now.getDate()}_${now.getFullYear()}`;
    const safeName = (userName || "")
      .trim()
      .replace(/[^a-zA-Z0-9]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "");
    const prefix = safeName ? `${safeName}_` : "";
    const fileName = `${prefix}NextPills_Report_${dateTag}`;

    const { uri } = await Print.printToFileAsync({ html });

    // Rename the generated file to our clean name
    let shareUri = uri;
    try {
      const dir = uri.substring(0, uri.lastIndexOf("/") + 1);
      const newUri = `${dir}${fileName}.pdf`;
      await FileSystem.moveAsync({ from: uri, to: newUri });
      shareUri = newUri;
    } catch (_renameErr) {
      // If rename fails, share with original uri
      shareUri = uri;
    }

    await shareAsync(shareUri, {
      UTI: ".pdf",
      mimeType: "application/pdf",
      dialogTitle: `Share ${fileName}`,
    });
  } catch (error) {
    console.error("Error exporting PDF:", error);
    Alert.alert("Export Error", "Failed to generate PDF export.");
  }
};
