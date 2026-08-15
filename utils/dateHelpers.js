export const getTodayString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatDisplayDate = (date = new Date()) => {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
};

export const getGreeting = (date = new Date()) => {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 21) return "Good evening";
  return "Good night";
};

export const getDayName = (date = new Date()) => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
};

// Parses time strings like "8:00 AM", "08 : 30 pm", "14:15"
export const parseTimeString = (timeStr) => {
  if (!timeStr) return { hours: 0, minutes: 0 };
  const cleaned = timeStr.trim().toLowerCase();
  const isPM = cleaned.includes("pm");
  const isAM = cleaned.includes("am");
  const timePart = cleaned.replace(/(am|pm)/g, "").trim();
  const parts = timePart.split(":").map((p) => parseInt(p.trim(), 10));

  let hours = parts[0] || 0;
  const minutes = parts[1] || 0;

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  return { hours, minutes };
};

export const getScheduledDateObj = (scheduledTimeStr, referenceDate = new Date()) => {
  const { hours, minutes } = parseTimeString(scheduledTimeStr);
  const date = new Date(referenceDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

// Returns difference in minutes between now and scheduled time (positive = past, negative = future)
export const getMinutesFromScheduled = (scheduledTimeStr, now = new Date()) => {
  const scheduledDate = getScheduledDateObj(scheduledTimeStr, now);
  const diffMs = now.getTime() - scheduledDate.getTime();
  return Math.floor(diffMs / (1000 * 60));
};

// Action buttons appear ONLY if within 30 mins before scheduled time or overdue/missed
export const isActionable = (scheduledTimeStr, now = new Date()) => {
  const diffMins = getMinutesFromScheduled(scheduledTimeStr, now);
  // Actionable if <= 30 mins away in future (diffMins >= -30) or past due
  return diffMins >= -30;
};

// Checks if scheduled time is due now (within -30 min to +60 min window)
export const isDueNow = (scheduledTimeStr, now = new Date()) => {
  const diffMins = getMinutesFromScheduled(scheduledTimeStr, now);
  return diffMins >= -30 && diffMins <= 60;
};

// Checks if dose was scheduled for earlier today (>60 mins ago) and past due window
export const isMissed = (scheduledTimeStr, now = new Date()) => {
  const diffMins = getMinutesFromScheduled(scheduledTimeStr, now);
  return diffMins > 60;
};

// Helpful status text for upcoming doses (e.g., "Due in 45m" or "Due at 8:00 PM")
export const getUpcomingTimeLabel = (scheduledTimeStr, now = new Date()) => {
  const diffMins = getMinutesFromScheduled(scheduledTimeStr, now);
  if (diffMins < -60) {
    const hours = Math.ceil(Math.abs(diffMins) / 60);
    return `Due in ${hours}h`;
  } else if (diffMins < -30) {
    const mins = Math.abs(diffMins);
    return `Due in ${mins}m`;
  }
  return `Due ${scheduledTimeStr}`;
};

// Returns last 7 days array of { dateStr, dayLabel, fullDate }
export const getLast7Days = (referenceDate = new Date()) => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(referenceDate);
    d.setDate(d.getDate() - i);
    days.push({
      dateStr: getTodayString(d),
      dayLabel: getDayName(d),
      isToday: i === 0,
      fullDate: d,
    });
  }
  return days;
};
