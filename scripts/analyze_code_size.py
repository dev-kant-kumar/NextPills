import os
import re

files = [
    "store/index.js",
    "store/slices/medicinesSlice.js",
    "store/slices/historySlice.js",
    "store/slices/appSlice.js",
    "store/slices/onboardingSlice.js",
    "utils/notificationHelper.js",
    "hooks/useNotifications.js",
    "utils/dateHelpers.js",
    "utils/pdfExport.js",
    "utils/csvExport.js",
    "app/_layout.jsx",
    "app/index.jsx",
    "app/(tabs)/_layout.jsx",
    "app/(tabs)/today.jsx",
    "app/(tabs)/medicines.jsx",
    "app/(tabs)/history.jsx",
    "app/(tabs)/settings.jsx",
    "app/addmedicine.jsx",
    "app/meddetail.jsx",
    "app/privacy.jsx",
    "components/macro/GreetUserHeader.jsx",
    "components/macro/StreakBadge.jsx",
    "components/macro/ConfirmationModal.jsx",
    "components/macro/EmptyState.jsx",
    "components/macro/AnimatedSplashScreen.jsx",
    "components/micro/AddButton.jsx",
    "components/micro/DoseRing.jsx",
    "constants/theme.js",
]

total_raw_lines = 0
for f in files:
    if os.path.exists(f):
        with open(f, 'r', encoding='utf-8', errors='ignore') as fp:
            lines = fp.readlines()
            total_raw_lines += len(lines)
            print(f"{f:38s}: {len(lines):4d} lines")

print(f"\nTotal raw lines in Chapter 6: {total_raw_lines}")
