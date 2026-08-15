# Privacy Policy for NextPills

*Last updated: August 15, 2026*

**NextPills** ("we", "our", or "the app") is a privacy-first medicine reminder and medication tracker application developed by **Dev Kant Kumar**. This Privacy Policy explains our practices regarding your data when you use the NextPills mobile application.

---

## 1. Zero Data Collection Principle
NextPills is designed as a **100% offline application**. We do not collect, transmit, store on external servers, or sell any personal data, health data, or device identifiers.

---

## 2. On-Device Data Storage
All data entered into the application remains solely within your device's private sandboxed storage (`AsyncStorage`). This includes:
- Medicine names, dosages, and intake schedules
- Dose log history (timestamps of taken/skipped doses)
- User display name (optional, for local greeting only)
- User preferences (reminder chime sounds, snooze duration)

**None of this information ever leaves your device.**

---

## 3. Local Push Notifications
NextPills utilizes your operating system's local notification scheduling system (`expo-notifications`).
- Reminder triggers are calculated and queued locally on your phone.
- No push notification servers or remote messaging services are utilized.
- All notification interactions (`Taken`, `Skip`, `15m Snooze`) are handled directly by your device.

---

## 4. Data Export & Sharing
- You may export your medication history to a **CSV** file or **PDF** report at any time.
- File generation occurs on-device.
- You have complete control over where the exported file is shared via your device's native share sheet (e.g., WhatsApp, Email, Google Drive). NextPills retains no copy of exported files.

---

## 5. Data Deletion
You can permanently delete all stored data from your device at any time:
1. Open **NextPills** → Navigate to **Settings**.
2. Under **Your Data**, tap **Clear all data**.
3. Confirm deletion to permanently erase all medicines and history logs.

Uninstalling the app from your device also permanently purges all local app data.

---

## 6. Third-Party Services
NextPills does not integrate with any third-party analytics (e.g., Google Analytics, Firebase), advertising networks, or tracking SDKs. The app has zero network calls.

---

## 7. Children’s Privacy
NextPills does not collect any personal data from anyone, including children under 13 years of age.

---

## 8. Contact
If you have any questions about this Privacy Policy, you can reach out via:
- **Developer**: Dev Kant Kumar
- **Website**: [devkantkumar.com](https://devkantkumar.com)
- **GitHub**: [github.com/dev-kant-kumar/NextPills](https://github.com/dev-kant-kumar/NextPills)
