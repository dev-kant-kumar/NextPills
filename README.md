# 💊 NextPills

A simple, offline-first medicine reminder app built with React Native & Expo

![React Native](https://img.shields.io/badge/React%20Native-20232A?style=flat&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=flat&logo=expo&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Android](https://img.shields.io/badge/Android-3DDC84?style=flat&logo=android&logoColor=white)

No login. No signup. No internet. No backend. Your medicine schedule stays on your device — nowhere else.

---

## 📖 About The Project

NextPills is a minimal medicine reminder app built to solve one problem: remembering to take medicine, on time, without friction.

Most reminder apps ask you to sign up, sync to a cloud, and accept tracking before you can set a single reminder. NextPills doesn't. You open the app, add a medicine, set a time — and it just works. Closed app, dead Wi-Fi, airplane mode — the reminder still fires.

The interaction model is borrowed from something everyone already understands: payment app notifications. The same way a UPI app pops up "₹100 received," NextPills pops up "💊 Time to take Paracetamol 500mg" — heads-up, impossible to miss, actionable right from the lock screen.

### Why This Project?

Most reminder app tutorials stop at local notifications firing once. I wanted to build something that:

- Handles **recurring, scheduled reminders** that survive app restarts and device reboots
- Treats **on-device storage as the only source of truth** — no backend, no auth, no sync
- Uses **actionable notifications** (Taken / Skip) instead of just a ping
- Respects that this is health data — privacy by architecture, not by policy

---

## ✨ Features

- 💊 **Add Medicines** — name, dosage, frequency, custom times
- ⏰ **Heads-Up Reminders** — notification fires at the exact time, even if the app is closed
- ✅ **Quick Actions** — mark Taken or Skip directly from the notification, no app open needed
- 📋 **Today's Schedule** — see every dose due today, in order
- 📊 **History Log** — track taken/missed/skipped over time
- 🔒 **Fully Offline** — zero network calls, zero accounts, zero data leaving the device
- 🎨 **Clean Interface** — built to feel like a native utility app, not a SaaS product

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native (Expo) |
| Language | JavaScript (ES6+) |
| Navigation | Expo Router (file-based) |
| Local Storage | `@react-native-async-storage/async-storage` |
| Notifications | `expo-notifications` |
| State Management | Redux Toolkit |
| Styling | StyleSheet API |

No backend. No database server. No authentication provider.

---

## 📁 Project Structure

```
NextPills/
├── app/
│   ├── _layout.js               # Root layout & theme
│   ├── (tabs)/
│   │   ├── _layout.js           # Bottom tab navigator config
│   │   ├── today.js             # Today's schedule screen
│   │   ├── medicines.js         # All medicines list screen
│   │   └── history.js           # Taken/missed/skipped log
│   └── medicine/
│       ├── add.js               # Add new medicine screen
│       └── [id].js              # Medicine detail / edit screen (dynamic route)
├── components/
│   ├── MedicineCard.js          # Reusable medicine row
│   ├── ScheduleItem.js          # Today's schedule row with action buttons
│   ├── HistoryItem.js           # History log row
│   └── EmptyState.js            # Empty list fallback UI
├── store/
│   ├── store.js                 # Redux store config
│   └── medicinesSlice.js        # Medicines + schedule state
├── hooks/
│   ├── useMedicines.js          # AsyncStorage read/write for medicines
│   ├── useNotifications.js      # Scheduling + handling notification responses
│   └── useHistory.js            # History log CRUD with AsyncStorage
├── utils/
│   ├── storage.js               # AsyncStorage helper wrappers
│   ├── notificationHelper.js    # Build & schedule notification triggers
│   └── dateHelpers.js           # Time/date formatting and comparisons
├── constants/
│   └── theme.js                 # Colors, spacing, typography
└── assets/
    └── icons/                   # Custom icons
```

---

## 📱 Screens

### 1. Today
The home screen. Shows every dose scheduled for today, in chronological order, with a clear visual state for taken, upcoming, and missed doses. Quick-action buttons let you mark a dose without leaving the screen.

### 2. Medicines
Full list of every medicine you've added, with dosage and frequency. Tap to view or edit details, including changing or removing scheduled times.

### 3. Add Medicine
Form to add a new medicine — name, dosage, how often, and what time(s) of day. Saves to AsyncStorage and immediately schedules the corresponding local notifications.

### 4. History
A log of every dose over time — taken, missed, or skipped — so you can see adherence patterns at a glance.

### 5. Medicine Detail
View or edit a single medicine's schedule. Delete the medicine entirely, which also cancels its pending notifications.

---

## 🔔 How Reminders Work

```
Add medicine + time
        ↓
expo-notifications schedules a local trigger
        ↓
Device fires notification at exact time
   (works even if app is closed or device was rebooted,
    once trigger is rescheduled on next app open)
        ↓
Notification shows: "💊 Time to take [Medicine] [Dosage]"
   with Taken / Skip action buttons
        ↓
User response is written to AsyncStorage history
        ↓
Today screen + History screen update
```

No server round-trip at any point. The entire flow happens on-device.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- Android device or emulator

### Installation

```bash
# Clone the repo
git clone https://github.com/dev-kant-kumar/NextPills.git
cd NextPills

# Install dependencies
npm install

# Start dev server
npx expo start
```

### Building APK

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure build
eas build:configure

# Build APK for Android
eas build -p android --profile preview
```

---

## 🧠 What I'm Learning

This is my first app built around scheduled local notifications and pure on-device persistence, without any backend.

**Expo Notifications & Triggers**
Scheduling a one-time alert is trivial. Scheduling recurring, time-accurate reminders that survive app kills and device reboots — and cancelling/rescheduling them correctly when a medicine is edited or deleted — is where the real learning is.

**AsyncStorage as the Only Data Layer**
Designing a data model (medicines, schedules, history) that lives entirely in key-value storage, stays fast to read/write, and doesn't get corrupted by partial writes or concurrent updates.

**Actionable Notifications**
Handling user responses (Taken / Skip) from inside a notification — without opening the app — and writing that response back into Redux + AsyncStorage state correctly.

**Designing for Trust**
A health-adjacent app with no login and no cloud has to *earn* trust through reliability of the one thing it promises: the reminder fires, on time, every time.

---

## 🗺️ Roadmap

- [ ] Project setup & navigation architecture
- [ ] Data model: medicines, schedules, history (AsyncStorage)
- [ ] Add medicine screen
- [ ] Today's schedule screen
- [ ] Notification scheduling (expo-notifications)
- [ ] Actionable notifications (Taken / Skip)
- [ ] History log screen
- [ ] Medicine detail / edit / delete
- [ ] Reboot persistence testing
- [ ] APK build & release

---

## 👨‍💻 Author

**Dev Kant Kumar**
[Portfolio](https://devkantkumar.com)

NextPills is built to learn local notifications and on-device data persistence properly — by shipping something real, not a tutorial clone.

---

## 📄 License

This project is open source and available under the MIT License.

---

*Built with ❤️ — your medicine schedule, staying exactly where it should: on your phone.*
