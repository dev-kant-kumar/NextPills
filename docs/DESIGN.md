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

---

## Stitch Workflow Tips

1. Use the prompts above as-is for first generation
2. If Stitch defaults to a cold/blue palette — reinforce: *"Use only these exact hex colors: background #FAF8F4, primary #2D6A4F, warm accent #E07A5F. No blue anywhere."*
3. If Fraunces isn't available as an option — fall back to any warm serif (Lora, Source Serif) and note it in your actual code as a substitution
4. Generate one screen at a time, export as PNG before moving to next
5. The dose ring is the hardest element to get Stitch to render correctly — if it comes out wrong, describe it as "a circular progress bar like a fitness ring, but thin and minimal, 3dp stroke"

---

*NextPills · Design System v1.0 · Dev Kant Kumar*
