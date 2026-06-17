# NextPills — Design System & Stitch Prompt Guide

---

## Design Philosophy

**The brief, restated:** A medicine reminder app with no login, no cloud, no account. The entire pitch is trust through simplicity — "your data never leaves this device."

**Aesthetic direction:** Calm, clinical, warm. Not a hospital app (sterile, cold blues). Not a wellness app (soft pastels, rounded everything). This sits between — closer to how a well-made physical pill organizer feels: simple dividers, clear labels, a sense of order that reduces anxiety rather than adding to it.

**The signature element:** A **dose ring** — a small circular progress indicator that wraps around each medicine's time icon, filling in as the day's doses get marked taken. It's the one piece of visual storytelling in the app: at a glance, an empty ring means "not yet," a filled ring means "done," and a half ring mid-day means "in progress." No other reminder app uses this — most just use checkmarks. This single element does the job of a progress bar, a status icon, and a sense of daily completion, all in one shape.

---

## Token System

### Colors

| Name | Hex | Usage |
|---|---|---|
| `surface-base` | `#FAF8F4` | App background — warm off-white, not stark white |
| `surface-card` | `#FFFFFF` | Medicine cards, list rows |
| `surface-sunken` | `#F0EDE6` | Input fields, inactive segments |
| `accent-primary` | `#2D6A4F` | Primary actions, taken state, dose ring fill — deep clinical green, not neon |
| `accent-warm` | `#E07A5F` | Upcoming/due-now state, gentle urgency without alarm |
| `accent-missed` | `#9B2C2C` | Missed dose — muted brick red, not aggressive |
| `text-primary` | `#1F2922` | Medicine names, headers — near-black with a green undertone |
| `text-secondary` | `#6B7268` | Dosage, time, subtitles |
| `text-muted` | `#A8A39A` | Placeholder, disabled, dividers |
| `border` | `#E6E2D8` | Card borders, dividers |
| `ring-track` | `#E6E2D8` | Empty dose ring background |

### Typography

| Role | Family | Weight | Size |
|---|---|---|---|
| Display (medicine name, headers) | `Fraunces` | 500 (Medium) | 22–28sp |
| Body (dosage, descriptions) | `Inter` | 400 | 14–16sp |
| Label (time, frequency tags) | `Inter` | 600 (SemiBold) | 12sp |
| Caption (timestamps, meta) | `Inter` | 400 | 11sp |
| Numeral (dose count, big numbers) | `Fraunces` | 400, italic | 32sp |

**Why Fraunces:** It's a warm serif with soft, slightly organic curves — distinct from both the sharp sans-serif of generic health apps and the rounded-everything of wellness apps. It reads as considered, not clinical or cutesy. Used sparingly: medicine names and the one big numeral, nowhere else.

### Spacing Scale

```
4 / 8 / 12 / 16 / 24 / 32 / 48
```
Base unit: **4dp**.

### Border Radius

| Element | Radius |
|---|---|
| Cards | 16dp |
| Buttons | 12dp |
| Input fields | 10dp |
| Dose ring container | 50% (circle) |
| Bottom sheet | 24dp top corners only |

### Iconography

**Phosphor Icons**, Regular weight, 24dp default. Rounded line-style, not filled — matches the organic but precise feel of Fraunces.

---

## Screen Inventory

1. **Today** — home screen, today's schedule with dose rings
2. **Add Medicine** — form to create a new medicine + schedule
3. **Medicines** — full list of all medicines
4. **Medicine Detail** — view/edit one medicine
5. **History** — adherence log over time
6. **Onboarding / Welcome** — first-launch intro, no login
7. **Settings** — notification sound, theme, data export/clear
8. **Edit Medicine** — same form as Add, pre-filled, with delete
9. **Empty States** — no medicines yet, no history yet

Persistent across tab screens (Today, Medicines, History):
- Bottom tab bar, 3 tabs
- Floating Add button (Today + Medicines screens only)

---

## Shared Components

**Bottom Tab Bar**
- Background: `#FFFFFF`, 64dp tall, top border 1dp `#E6E2D8`
- 3 tabs: Today (house/calendar icon), Medicines (capsule icon), History (clock-counter icon)
- Active: icon + label in `#2D6A4F`
- Inactive: icon + label in `#A8A39A`

**Dose Ring** (signature element)
- 48dp circle, 3dp stroke width
- Track: `#E6E2D8`
- Fill: `#2D6A4F`, animates clockwise from 12 o'clock as doses are marked taken
- Center: medicine-type icon (capsule/tablet/syringe) in `#1F2922`, 20dp
- Partial fill states: 0% (empty/upcoming), 50% (one of two doses taken), 100% (all done — fill turns into a small checkmark overlay)

**Floating Add Button**
- 56dp circle, background `#2D6A4F`, positioned bottom-right, 16dp margin above tab bar
- Plus icon, white, 24dp
- Soft shadow, no border

**Card (Medicine Row)**
- Background `#FFFFFF`, border 1dp `#E6E2D8`, radius 16dp
- 16dp internal padding
- Left: Dose Ring (48dp)
- Center: Name (Fraunces Medium 18sp) + dosage/time (Inter 13sp `#6B7268`)
- Right: chevron or quick-action icon

---

## Screen-by-Screen Design Specs + Stitch Prompts

---

### Screen 1: Today

**Layout:**
```
┌─────────────────────────────┐
│  Good morning, Dev           │  ← Fraunces Medium 24sp
│  Wednesday, 17 June           │  ← Inter 13sp #6B7268
│                              │
│  ┌────────────────────────┐  │
│  │ ◐ Paracetamol           │  │  ← dose ring + name
│  │   500mg · 8:00 AM       │  │
│  └────────────────────────┘  │
│  ┌────────────────────────┐  │
│  │ ○ Vitamin D               │  │
│  │   1 tablet · 9:00 AM    │  │
│  └────────────────────────┘  │
│  ┌────────────────────────┐  │
│  │ ● Amoxicillin (done)    │  │
│  │   250mg · 7:00 AM       │  │
│  └────────────────────────┘  │
│                              │
│                       [+]    │  ← floating add button
└─────────────────────────────┘
│     Bottom Tab Bar           │
└─────────────────────────────┘
```

**Card states:**
- **Upcoming** (not yet due): ring empty, card border `#E6E2D8`
- **Due now** (within 30 min window): ring outlined in `#E07A5F`, subtle warm tint on card background
- **Taken**: ring filled `#2D6A4F` with checkmark, name text slightly muted, no action buttons shown
- **Missed**: ring outlined `#9B2C2C`, small "Missed" label in caption text

**Quick actions** (swipe or inline buttons on Due Now cards):
- Two pill buttons: "Taken" (filled `#2D6A4F`, white text) and "Skip" (outline `#A8A39A`, text `#6B7268`)

---

**Stitch Prompt — Today Screen:**

```
Design a calm, warm-toned mobile app home screen for a medicine reminder app.

Background: #FAF8F4 (warm off-white, not pure white). Status bar icons dark.

Top greeting section: "Good morning, Dev" in Fraunces Medium serif, 24sp, color #1F2922. Below it, the date "Wednesday, 17 June" in Inter Regular 13sp, color #6B7268. 24dp padding from top and sides.

Below greeting, a vertical list of medicine cards. Each card: white background (#FFFFFF), 1dp border #E6E2D8, border-radius 16dp, 16dp internal padding, 12dp gap between cards.

Each card layout (horizontal):
- Left: a 48dp circular progress ring with 3dp stroke. Track color #E6E2D8. For an upcoming dose, ring is empty with a capsule icon (Phosphor Icons, line style) centered in #1F2922. For a taken dose, ring is fully filled in #2D6A4F with a small checkmark overlay.
- Center: medicine name in Fraunces Medium 18sp #1F2922, and below it dosage + time in Inter Regular 13sp #6B7268 (e.g. "500mg · 8:00 AM")
- Right: nothing for taken cards; for a "due now" card show two small pill buttons stacked or side by side: "Taken" (filled #2D6A4F background, white text, Inter SemiBold 12sp) and "Skip" (outline #A8A39A border, #6B7268 text)

Show 3 cards: one "due now" card with a warm #E07A5F ring outline and the Taken/Skip buttons visible, one upcoming card with empty ring, one already-taken card with filled green ring and checkmark, slightly muted/faded name text.

Bottom-right floating action button: 56dp circle, background #2D6A4F, white plus icon, soft drop shadow, positioned above the tab bar with 16dp margin.

Bottom tab bar: white background, 64dp tall, 1dp top border #E6E2D8. Three tabs: "Today" (active, icon + label in #2D6A4F), "Medicines" (inactive, #A8A39A), "History" (inactive, #A8A39A). Use Phosphor line-style icons.

Overall mood: calm, warm, organized — like a well-designed pill organizer, not a sterile hospital app. No harsh blues, no neon, no gradients.
```

---

### Screen 2: Add Medicine

**Layout:**
```
┌─────────────────────────────┐
│  [←]  Add Medicine            │
├─────────────────────────────┤
│  Medicine name                │
│  ┌────────────────────────┐  │
│  │ e.g. Paracetamol         │  │
│  └────────────────────────┘  │
│  Dosage                       │
│  ┌────────────────────────┐  │
│  │ e.g. 500mg                │  │
│  └────────────────────────┘  │
│  How often?                   │
│  [Daily] [Specific days] [As needed] │  ← segmented control
│  What time(s)?                │
│  ┌──────┐  ┌──────┐  [+ Add time] │
│  │8:00AM│  │8:00PM│              │
│  └──────┘  └──────┘              │
│                              │
│  ┌────────────────────────┐  │
│  │      Save Medicine       │  │  ← primary button
│  └────────────────────────┘  │
└─────────────────────────────┘
```

**Form field specs:**
- Label: Inter SemiBold 12sp, `#1F2922`, 8dp bottom margin
- Input: background `#F0EDE6`, no border, radius 10dp, height 48dp, padding 16dp horizontal, placeholder `#A8A39A`
- Segmented control: 3 equal segments, active segment background `#2D6A4F` with white text, inactive `#F0EDE6` background with `#6B7268` text
- Time chips: rounded rect, border `#2D6A4F`, text `#2D6A4F`, removable (small x icon)

---

**Stitch Prompt — Add Medicine Screen:**

```
Design a calm, warm-toned mobile app form screen for adding a new medicine reminder.

Background: #FAF8F4. Top bar: back arrow icon (#1F2922) left-aligned, "Add Medicine" title in Fraunces Medium 20sp #1F2922 next to it. 16dp horizontal padding throughout.

Form fields, each with 24dp vertical spacing:

1. Label "Medicine name" in Inter SemiBold 12sp #1F2922, 8dp below it a text input: background #F0EDE6, no border, border-radius 10dp, height 48dp, 16dp horizontal padding, placeholder text "e.g. Paracetamol" in #A8A39A Inter Regular 14sp.

2. Label "Dosage", same input style, placeholder "e.g. 500mg".

3. Label "How often?" followed by a 3-segment control spanning full width: segments "Daily", "Specific days", "As needed". Active segment (Daily) has background #2D6A4F, white Inter SemiBold 13sp text, border-radius 10dp. Inactive segments have background #F0EDE6, text #6B7268.

4. Label "What time(s)?" followed by a row of removable time chips: rounded pill shape, 1dp border #2D6A4F, text "8:00 AM" in #2D6A4F Inter SemiBold 13sp, small x icon to remove. Show 2 time chips plus a dashed-border "+ Add time" chip in #A8A39A.

At the bottom, a full-width primary button: background #2D6A4F, border-radius 12dp, height 52dp, white text "Save Medicine" in Inter SemiBold 15sp, centered.

Mood: clean, calm, no clutter. Warm off-white background throughout, never stark white or cold gray.
```

---

### Screen 3: Medicines

**Layout:**
```
┌─────────────────────────────┐
│  Medicines                    │
├─────────────────────────────┤
│  ┌────────────────────────┐  │
│  │ ⊙ Paracetamol            │  │
│  │   500mg · Daily, 2x      │  │
│  └────────────────────────┘  │
│  ┌────────────────────────┐  │
│  │ ⊙ Vitamin D               │  │
│  │   1 tablet · Daily, 1x    │  │
│  └────────────────────────┘  │
│                              │
│                       [+]    │
└─────────────────────────────┘
│     Bottom Tab Bar           │
└─────────────────────────────┘
```

Same card style as Today, but ring shows a static capsule icon (no progress state — this is the full list, not today's status) and right side shows a chevron instead of action buttons.

---

**Stitch Prompt — Medicines Screen:**

```
Design a calm, warm-toned mobile app screen showing a list of all saved medicines.

Background: #FAF8F4. Header: "Medicines" in Fraunces Medium 24sp #1F2922, left-aligned, 24dp padding.

Below header, a vertical list of medicine cards (white #FFFFFF background, 1dp border #E6E2D8, radius 16dp, 16dp padding, 12dp gap between cards).

Each card:
- Left: 48dp circle with #F0EDE6 background and a Phosphor line-style capsule icon centered in #1F2922 (static, no progress ring fill, this is a list not a status view)
- Center: medicine name in Fraunces Medium 18sp #1F2922, below it frequency summary in Inter Regular 13sp #6B7268 (e.g. "500mg · Daily, 2x")
- Right: a chevron-right icon in #A8A39A

Show 4 cards with varied medicines and frequencies.

Bottom-right floating action button: 56dp circle, #2D6A4F background, white plus icon, soft shadow, above tab bar.

Bottom tab bar: white, 64dp, top border 1dp #E6E2D8. "Medicines" tab active (#2D6A4F icon + label), "Today" and "History" inactive (#A8A39A).

Mood: warm, organized, calm — consistent with a clean pill-organizer aesthetic.
```

---

### Screen 4: Medicine Detail

**Layout:**
```
┌─────────────────────────────┐
│  [←]              [edit] [🗑]│
│                              │
│        ⊙ (large icon)         │
│        Paracetamol            │  ← Fraunces 26sp
│        500mg                  │
│                              │
│  SCHEDULE                     │
│  Daily · 8:00 AM, 8:00 PM     │
├─────────────────────────────┤
│  RECENT HISTORY                │
│  ● Taken · Today, 8:02 AM      │
│  ● Taken · Yesterday, 8:05 AM  │
│  ○ Missed · Yesterday, 8:00 PM │
└─────────────────────────────┘
```

---

**Stitch Prompt — Medicine Detail Screen:**

```
Design a calm, warm-toned mobile app detail screen for a single medicine.

Background: #FAF8F4. Top bar: back arrow (#1F2922) left, edit pencil icon and trash icon (#6B7268) right, 16dp padding.

Center-aligned hero section, 32dp top margin:
- 72dp circle, background #F0EDE6, large Phosphor capsule icon centered, #1F2922
- Below: medicine name "Paracetamol" in Fraunces Medium 26sp #1F2922
- Below: dosage "500mg" in Inter Regular 15sp #6B7268

Below hero, a section with header "SCHEDULE" in Inter SemiBold 12sp #6B7268, letter-spacing 1, all caps. Below it: "Daily · 8:00 AM, 8:00 PM" in Inter Regular 15sp #1F2922. White card background, border #E6E2D8, radius 16dp, 16dp padding.

Below that, section header "RECENT HISTORY" same style. List of 3 rows:
- Each row: small status dot (filled #2D6A4F circle for taken, outline #9B2C2C circle for missed) + "Taken · Today, 8:02 AM" in Inter Regular 14sp #1F2922 (or #9B2C2C text for missed entries)
- 1dp divider #E6E2D8 between rows

Mood: calm, warm, precise. No bottom tab bar (this is a stack screen pushed from Medicines or Today).
```

---

### Screen 5: History

**Layout:**
```
┌─────────────────────────────┐
│  History                      │
├─────────────────────────────┤
│  This week: 12/14 doses taken │  ← summary stat
│  ┌────────────────────────┐  │
│  │ ▓▓▓▓▓▓▓░ (mini bar chart) │  │
│  └────────────────────────┘  │
│                              │
│  TODAY                        │
│  ● Paracetamol · 8:02 AM       │
│  ● Amoxicillin · 7:01 AM       │
│  YESTERDAY                    │
│  ● Paracetamol · 8:05 AM       │
│  ○ Vitamin D · Missed          │
└─────────────────────────────┘
│     Bottom Tab Bar           │
└─────────────────────────────┘
```

---

**Stitch Prompt — History Screen:**

```
Design a calm, warm-toned mobile app screen showing medicine adherence history.

Background: #FAF8F4. Header "History" in Fraunces Medium 24sp #1F2922, 24dp padding.

Below header, a summary card: white background, border #E6E2D8, radius 16dp, 16dp padding. Text "This week: 12/14 doses taken" in Inter Medium 14sp #1F2922. Below it, a simple horizontal bar chart with 7 bars (one per day), bar color #2D6A4F for good adherence days, #E07A5F for partial, #9B2C2C for missed days, bars on a #F0EDE6 track.

Below summary card, a list grouped by date. Section headers "TODAY", "YESTERDAY" in Inter SemiBold 12sp #6B7268, all caps, letter-spacing 1.

Each history row: small status dot (filled #2D6A4F for taken, outline #9B2C2C for missed) + medicine name in Inter Regular 14sp #1F2922 + time in #6B7268, right-aligned. Missed rows show "Missed" instead of a time, in #9B2C2C text.

Show 2 rows under Today, 2 rows under Yesterday (one missed).

Bottom tab bar: white, 64dp, top border #E6E2D8. "History" tab active (#2D6A4F), others inactive (#A8A39A).

Mood: calm, data-informative without feeling clinical or judgmental about missed doses.
```

---

### Screen 6: Onboarding / Welcome

**Three-slide intro, no login at any point.** Last slide leads straight into the Today screen (empty state, since no medicines exist yet).

**Layout (Slide 1 of 3):**
```
┌─────────────────────────────┐
│                              │
│                              │
│         (illustration)       │
│        large capsule icon     │
│                              │
│   Never miss a dose           │  ← Fraunces Medium 26sp
│   Gentle reminders, right     │  ← Inter 15sp #6B7268
│   when you need them.         │
│                              │
│                              │
│   ● ○ ○                       │  ← page dots
│                              │
│   ┌────────────────────┐    │
│   │        Next          │    │
│   └────────────────────┘    │
│         Skip                  │  ← text link, #6B7268
└─────────────────────────────┘
```

**Slide content (3 slides):**
1. "Never miss a dose" — gentle reminders, right when you need them
2. "Stays on your phone" — no account, no cloud, no one else sees your medicines
3. "Takes 10 seconds to add a medicine" — name, dosage, time — that's it

**Page dots:** 8dp circles, active `#2D6A4F`, inactive `#E6E2D8`, 8dp gap

**Primary button:** Full-width, `#2D6A4F` background, white text, 52dp height, radius 12dp. Says "Next" on slides 1–2, "Get Started" on slide 3.

**Skip link:** Centered below button, Inter Medium 13sp, `#6B7268`, only on slides 1–2.

---

**Stitch Prompt — Onboarding Screen (Slide 1):**

```
Design a calm, warm-toned mobile app onboarding screen, slide 1 of 3, for a medicine reminder app with no login.

Background: #FAF8F4. No status bar chrome needed, full-bleed content.

Center-top: a simple, large line-art illustration of a capsule/pill inside a soft circle, using #2D6A4F as the line color and #F0EDE6 as a soft background shape behind it. Keep the illustration minimal — no gradients, no shadows, no busy detail.

Below illustration, centered text block:
- Headline "Never miss a dose" in Fraunces Medium 26sp #1F2922
- Subtext "Gentle reminders, right when you need them." in Inter Regular 15sp #6B7268, centered, max width ~280dp

Below text, page indicator dots: 3 small 8dp circles, first one filled #2D6A4F, other two outline/empty #E6E2D8, 8dp gaps, centered.

Bottom section: full-width primary button, #2D6A4F background, white text "Next" in Inter SemiBold 15sp, height 52dp, radius 12dp, 24dp horizontal margin. Below button, centered text link "Skip" in Inter Medium 13sp #6B7268.

Mood: warm, reassuring, uncluttered. This is the very first thing a user sees — it should feel calm, not like a sales pitch.
```

---

### Screen 7: Settings

**Layout:**
```
┌─────────────────────────────┐
│  Settings                     │
├─────────────────────────────┤
│  NOTIFICATIONS                │
│  ┌────────────────────────┐  │
│  │ Reminder sound      ⌄   │  │
│  │ Snooze duration     ⌄   │  │
│  │ Heads-up style    [on/off]│  │
│  └────────────────────────┘  │
│  APPEARANCE                   │
│  ┌────────────────────────┐  │
│  │ Theme          Light ⌄  │  │
│  └────────────────────────┘  │
│  YOUR DATA                    │
│  ┌────────────────────────┐  │
│  │ Export data as CSV   →  │  │
│  │ Clear all data        → │  │  ← red text
│  └────────────────────────┘  │
│  ABOUT                        │
│  ┌────────────────────────┐  │
│  │ Version 1.0.0             │  │
│  │ No account. No cloud.    │  │
│  │ Your data stays here.    │  │
│  └────────────────────────┘  │
└─────────────────────────────┘
```

**Settings row specs:**
- Grouped card style, same as other cards (`#FFFFFF`, border `#E6E2D8`, radius 16dp)
- Row height 52dp, divider 1dp `#E6E2D8` between rows in same card
- Label: Inter Regular 15sp `#1F2922`
- Value/chevron: Inter Regular 14sp `#6B7268`, or toggle switch (`#2D6A4F` when on, `#E6E2D8` track when off)
- Destructive row ("Clear all data"): text in `#9B2C2C`

---

**Stitch Prompt — Settings Screen:**

```
Design a calm, warm-toned mobile app settings screen for a medicine reminder app.

Background: #FAF8F4. Header "Settings" in Fraunces Medium 24sp #1F2922, 24dp padding.

Below header, grouped settings sections, each with a small section label above it in Inter SemiBold 12sp #6B7268, all caps, letter-spacing 1, 8dp bottom margin before the card.

Section 1, label "NOTIFICATIONS": white card (#FFFFFF, border #E6E2D8, radius 16dp). Rows, each 52dp tall with 16dp horizontal padding, 1dp divider #E6E2D8 between rows:
- "Reminder sound" label (Inter Regular 15sp #1F2922) with current value "Default" + chevron right, in #6B7268
- "Snooze duration" with value "10 min" + chevron
- "Heads-up style" with a toggle switch on the right, switch track #2D6A4F (on state), white circle knob

Section 2, label "APPEARANCE": card with one row "Theme" + value "Light" + chevron.

Section 3, label "YOUR DATA": card with two rows: "Export data as CSV" with chevron in #6B7268, and "Clear all data" with text colored #9B2C2C (red, destructive) and a chevron in #9B2C2C too.

Section 4, label "ABOUT": card with a row showing "Version 1.0.0" in #1F2922, and below it smaller text "No account. No cloud. Your data stays on this device." in Inter Regular 13sp #6B7268.

24dp gap between sections. Mood: calm, organized, trustworthy — the "Your data" and "About" sections should visually reinforce the privacy promise.
```

---

### Screen 8: Edit Medicine

**Same layout as Add Medicine**, with three differences: fields pre-filled with existing values, a "Delete medicine" destructive option, and the button says "Save Changes" instead of "Save Medicine."

**Layout:**
```
┌─────────────────────────────┐
│  [←]  Edit Medicine            │
├─────────────────────────────┤
│  Medicine name                │
│  ┌────────────────────────┐  │
│  │ Paracetamol               │  │  ← pre-filled
│  └────────────────────────┘  │
│  Dosage                       │
│  ┌────────────────────────┐  │
│  │ 500mg                     │  │
│  └────────────────────────┘  │
│  How often?                   │
│  [Daily] [Specific days] [As needed] │  ← "Daily" pre-selected
│  What time(s)?                │
│  ┌──────┐  ┌──────┐  [+ Add time] │
│  │8:00AM│  │8:00PM│              │
│  └──────┘  └──────┘              │
│                              │
│  ┌────────────────────────┐  │
│  │      Save Changes        │  │
│  └────────────────────────┘  │
│      Delete medicine          │  ← red text link, centered
└─────────────────────────────┘
```

**Difference from Add Medicine:**
- All fields pre-filled with real values (not placeholders — actual `#1F2922` text, not `#A8A39A` placeholder gray)
- Below the primary button: a centered text link "Delete medicine" in Inter Medium 14sp, `#9B2C2C`
- Tapping delete opens a confirmation sheet (see note below)

---

**Stitch Prompt — Edit Medicine Screen:**

```
Design a calm, warm-toned mobile app form screen for editing an existing medicine reminder. This is nearly identical to an "Add Medicine" form but pre-filled with real data and includes a delete option.

Background: #FAF8F4. Top bar: back arrow (#1F2922) left, "Edit Medicine" title in Fraunces Medium 20sp #1F2922.

Form fields, 24dp vertical spacing:

1. Label "Medicine name" (Inter SemiBold 12sp #1F2922), input field background #F0EDE6, radius 10dp, height 48dp, containing real filled-in text "Paracetamol" in Inter Regular 14sp #1F2922 (not gray placeholder text, since this is real saved data).

2. Label "Dosage", same input style, filled with "500mg".

3. Label "How often?", 3-segment control "Daily" / "Specific days" / "As needed", with "Daily" shown as the active/selected segment (#2D6A4F background, white text).

4. Label "What time(s)?", two filled time chips "8:00 AM" and "8:00 PM" (pill shape, border #2D6A4F, text #2D6A4F, small x to remove), plus a dashed "+ Add time" chip.

Bottom: full-width primary button "Save Changes", #2D6A4F background, white Inter SemiBold 15sp text, height 52dp, radius 12dp.

Below the button, centered text link "Delete medicine" in Inter Medium 14sp, color #9B2C2C (muted red), with no border or background — just a plain text link.

Mood: same calm, warm, organized feel as the rest of the app — editing should feel as easy and unintimidating as adding.
```

**Implementation note:** Tapping "Delete medicine" should open a small confirmation bottom sheet ("Delete Paracetamol? This also removes its reminders.") rather than deleting immediately — standard pattern, prevents accidental data loss with no undo system in place (since there's no backend/trash).

---

### Screen 9: Empty States

Two empty states needed: **no medicines yet** (Today + Medicines screens, first use) and **no history yet** (History screen, first use). Both follow the same visual pattern — illustration, headline, subtext, single CTA where relevant.

**Layout (Empty Today / Medicines):**
```
┌─────────────────────────────┐
│  Good morning, Dev            │
│  Wednesday, 17 June            │
│                              │
│                              │
│       (soft illustration)     │
│         capsule + plus        │
│                              │
│    No medicines yet            │  ← Fraunces Medium 20sp
│    Add your first one to       │  ← Inter 14sp #6B7268
│    start getting reminders.    │
│                              │
│  ┌────────────────────────┐  │
│  │     + Add Medicine        │  │  ← primary button, inline
│  └────────────────────────┘  │
│                              │
└─────────────────────────────┘
```

**Layout (Empty History):**
```
┌─────────────────────────────┐
│  History                      │
│                              │
│       (soft illustration)     │
│         clock + checkmark      │
│                              │
│    Nothing logged yet          │  ← Fraunces Medium 20sp
│    Once you start taking       │  ← Inter 14sp #6B7268
│    medicines, your history     │
│    shows up here.              │
│                              │
└─────────────────────────────┘
```

**Specs:**
- Illustration: 96dp container, soft `#F0EDE6` circle background, line-art icon in `#2D6A4F`, centered vertically in available space (not pinned to top)
- Headline: Fraunces Medium 20sp, `#1F2922`
- Subtext: Inter Regular 14sp, `#6B7268`, centered, max width ~260dp, 2 lines
- CTA (Today/Medicines only): inline primary button below subtext, not floating — History has no CTA since there's nothing to add manually
- No floating add button shown when list is empty on Today (avoid duplicate CTAs) — Medicines screen keeps the floating button regardless, since it's the primary entry point for that tab

---

**Stitch Prompt — Empty State (No Medicines):**

```
Design a calm, warm-toned empty state for a mobile app's home screen, shown when a user has not yet added any medicines.

Background: #FAF8F4. Top: greeting "Good morning, Dev" in Fraunces Medium 24sp #1F2922, date below in Inter Regular 13sp #6B7268 — same as the populated Today screen header.

Center of remaining screen space (vertically centered, not top-aligned):
- A 96dp soft circle, background #F0EDE6, containing a simple line-art icon combining a capsule shape and a small plus symbol, drawn in #2D6A4F, minimal and clean, no shadows or gradients
- Below icon, headline "No medicines yet" in Fraunces Medium 20sp #1F2922, centered
- Below headline, subtext "Add your first one to start getting reminders." in Inter Regular 14sp #6B7268, centered, max-width constrained to about 260dp, wraps to 2 lines
- Below subtext, a primary button (not floating, inline in the layout): "+ Add Medicine" text in white Inter SemiBold 15sp, background #2D6A4F, height 52dp, radius 12dp, width about 200dp, centered

Bottom tab bar: white, 64dp, top border #E6E2D8, "Today" tab active in #2D6A4F, "Medicines" and "History" inactive in #A8A39A.

Mood: inviting, not sad or apologetic. An empty state should feel like an open invitation, not a dead end.
```

---

**Stitch Prompt — Empty State (No History):**

```
Design a calm, warm-toned empty state for a mobile app's history screen, shown when a user has no logged doses yet.

Background: #FAF8F4. Header "History" in Fraunces Medium 24sp #1F2922, 24dp padding, left-aligned, same as populated History screen.

Center of remaining screen space (vertically centered):
- A 96dp soft circle, background #F0EDE6, containing a simple line-art icon combining a clock shape with a small checkmark, drawn in #2D6A4F, minimal, no shadows or gradients
- Below icon, headline "Nothing logged yet" in Fraunces Medium 20sp #1F2922, centered
- Below headline, subtext "Once you start taking medicines, your history shows up here." in Inter Regular 14sp #6B7268, centered, max-width ~260dp, wraps to 2 lines
- No button below this one — there's nothing to manually add on this screen

Bottom tab bar: white, 64dp, top border #E6E2D8, "History" tab active in #2D6A4F, "Today" and "Medicines" inactive in #A8A39A.

Mood: calm and neutral, not empty-feeling or discouraging. This is a "not yet" state, not a failure state.
```

---

## Consistency Checklist (reference before every screen)

- [ ] Background always `#FAF8F4` (never stark white, never dark mode for now)
- [ ] Cards always `#FFFFFF` with `#E6E2D8` border, 16dp radius
- [ ] Fraunces serif ONLY for: medicine names, screen headers, the one big numeral — nowhere else
- [ ] Inter for all body, labels, buttons, captions
- [ ] Green `#2D6A4F` = taken / primary action / done
- [ ] Warm orange `#E07A5F` = due now / needs attention soon
- [ ] Brick red `#9B2C2C` = missed — muted, never alarming bright red
- [ ] Dose ring appears on Today screen only (it's a status element, not decoration)
- [ ] Phosphor line-style icons only — no filled icons, no mixed icon sets
- [ ] Spacing in multiples of 4dp
- [ ] No gradients, no neon, no dark backgrounds — warmth and calm throughout
- [ ] Onboarding illustrations stay line-art and minimal — no stock-style mascots or characters
- [ ] Settings destructive actions ("Clear all data", "Delete medicine") always in `#9B2C2C`, never the primary green
- [ ] Empty states read as invitations, not dead ends — no grayscale, no "sad face" imagery
- [ ] Edit Medicine pre-fills with real text color (`#1F2922`), never placeholder gray (`#A8A39A`)

---

## Stitch Workflow Tips

1. Use the prompts above as-is for first generation
2. If Stitch defaults to a cold/blue palette — reinforce: *"Use only these exact hex colors: background #FAF8F4, primary #2D6A4F, warm accent #E07A5F. No blue anywhere."*
3. If Fraunces isn't available as an option — fall back to any warm serif (Lora, Source Serif) and note it in your actual code as a substitution
4. Generate one screen at a time, export as PNG before moving to next
5. The dose ring is the hardest element to get Stitch to render correctly — if it comes out wrong, describe it as "a circular progress bar like a fitness ring, but thin and minimal, 3dp stroke"

---

*NextPills · Design System v1.1 · 9 screens · Dev Kant Kumar*
