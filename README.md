<div align="center">

# 💊 NextPills
### Privacy-First, 100% Offline Medicine Reminder & Adherence Tracker

[![Release](https://img.shields.io/github/v/release/dev-kant-kumar/NextPills?color=2D6A4F&style=for-the-badge&logo=github)](https://github.com/dev-kant-kumar/NextPills/releases/latest)
[![Download APK](https://img.shields.io/badge/Download-APK%20(v1.0.0)-E07A5F?style=for-the-badge&logo=android&logoColor=white)](https://github.com/dev-kant-kumar/NextPills/releases/download/v1.0.0/NextPills-v1.0.0.apk)
[![License: MIT](https://img.shields.io/badge/License-MIT-2D6A4F?style=for-the-badge)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS-1F2922?style=for-the-badge&logo=expo)](https://expo.dev)

<p align="center">
  <b>No Login · No Tracking · No Cloud Servers · Zero Network Calls</b>
  <br />
  <i>Your complete medicine schedule and history stay strictly on your device.</i>
</p>

[📥 Download Latest APK](https://github.com/dev-kant-kumar/NextPills/releases/download/v1.0.0/NextPills-v1.0.0.apk) · [✨ Key Features](#-key-features) · [🛠️ Tech Stack](#️-tech-stack) · [📱 Quick Start](#-quick-start) · [🔒 Privacy Commitment](#-privacy--security-by-design)

</div>

---

## 📖 Overview

**NextPills** is a minimal, reliable, and privacy-first medicine reminder application built with **React Native** and **Expo**. 

Most health and medicine apps require cloud signups, account creation, and user telemetry just to schedule a basic pill alert. **NextPills removes all of that friction.** You open the app, add your medicines, set your times, and your phone handles the rest — whether you are in airplane mode, off the grid, or rebooting your device.

---

## ✨ Key Features

- ⏰ **Actionable Heads-Up Reminders** — Local push notifications with sound that fire on time. Mark **Taken**, **Skip**, or **15m Snooze** directly from the notification.
- 🌿 **Full-Bleed Modern UI** — Warm clinical aesthetic (`#FAF8F4` surface with `#2D6A4F` forest mint accents) and dynamic time-of-day greeting banners.
- 📊 **Daily Intake Progress & Streaks** — Visual progress tracking bar and streak counter to celebrate daily adherence.
- ⚠️ **5-Day Refill Inventory Alerts** — Automated local alerts warn you when a medicine supply drops to 5 or fewer days remaining.
- 📈 **7-Day Adherence Visual Charts** — Interactive weekly bar chart breakdown with filter chips (`All Logs`, `Taken`, `Skipped`).
- 📄 **One-Tap Medical Report Export** — Generate professionally styled **PDF Medical Reports** and structured **CSV logs** shareable directly with your physician via WhatsApp, Email, or Google Drive.
- 📳 **Haptic Tactile Feedback** — Native vibration response on dose interactions.
- 🔒 **100% On-Device Privacy** — Zero analytics, zero ads, zero external servers.

---

## 🏗️ Architecture & How Reminders Work

```
User Schedules Medicine
         │
         ▼
expo-notifications (Local Trigger Engine)
         │
         ├──► On-Device SQLite / AsyncStorage (Redux Persist)
         │
         ▼
[Scheduled Time Reached]
         │
         ▼
Heads-Up Lock Screen Notification ("💊 Time to take Paracetamol 500mg")
         │
    ┌────┴───────────────────────────┐
    ▼                                ▼
[Taken]                           [Skip] / [15m Snooze]
    │                                │
    ▼                                ▼
Inventory Decremented          Snooze Trigger Scheduled (15m)
Adherence Log Written          Skipped Reason Logged
    │                                │
    └────────────────┬───────────────┘
                     ▼
       UI Updates & History Synced
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | [React Native](https://reactnative.dev/) + [Expo SDK 54](https://expo.dev/) | Cross-platform native runtime |
| **Routing** | [Expo Router v4](https://docs.expo.dev/router/introduction/) | File-based typed navigation |
| **State Management** | [Redux Toolkit](https://redux-toolkit.js.org/) + [Redux Persist](https://github.com/rt2zz/redux-persist) | Predictable offline state caching |
| **Notifications** | [`expo-notifications`](https://docs.expo.dev/versions/latest/sdk/notifications/) | Exact-alarm scheduled triggers & action categories |
| **PDF & Export** | [`expo-print`](https://docs.expo.dev/versions/latest/sdk/print/) + [`expo-sharing`](https://docs.expo.dev/versions/latest/sdk/sharing/) | HTML5-to-PDF rendering & native share sheets |
| **Icons & Haptics** | [`lucide-react-native`](https://lucide.dev/) + [`expo-haptics`](https://docs.expo.dev/versions/latest/sdk/haptics/) | Feather vector icons & vibration feedback |
| **Design System** | Custom StyleSheet Design Tokens | Warm clinical palette with safe-area clearance |

---

## 📱 Quick Start & Local Setup

### Prerequisites
- **Node.js**: `v18.0.0` or higher
- **Package Manager**: `npm` or `yarn`
- **Expo Go App** (or Android Emulator / Physical Device)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/dev-kant-kumar/NextPills.git
cd NextPills

# 2. Install dependencies
npm install

# 3. Start Expo development server
npx expo start
```

### Build Standalone Android APK

```bash
# Build APK using free EAS cloud builder
npx eas-cli build -p android --profile preview
```

---

## 🔒 Privacy & Security by Design

- **Zero Cloud Dependence**: NextPills contains no API endpoints, analytics trackers, or authentication tokens.
- **Data Retention**: Your health data is exclusively stored within your device's private sandboxed app directory (`AsyncStorage`).
- **Data Deletion**: Tapping **Settings → Your Data → Clear All Data** or uninstalling the app permanently purges all data from the device.

---

## 🗺️ Project Roadmap

- [x] Onboarding flow with Android 13+ runtime notification permissions
- [x] Chronological daily dose intake schedule with status rings
- [x] Quick Action buttons (`Taken`, `Skip`, `15m Snooze`)
- [x] 5-Day Low Stock refill alerts
- [x] Weekly 7-day adherence chart & filter chips
- [x] PDF Medical Adherence Report generator & CSV export
- [x] Full-bleed forest green theme & custom status bar integration
- [x] Native haptic tactile feedback
- [x] Standalone Android APK release (v1.0.0)

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">
  <b>Developed with ❤️ by <a href="https://devkantkumar.com">Dev Kant Kumar</a></b>
  <br />
  <sub>Keeping your medicine schedule exactly where it belongs — on your phone.</sub>
</div>
