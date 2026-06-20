# Goals Tracker — Product Document

## Purpose

Goals Tracker is a desktop widget for building and maintaining daily habits, inspired by the principles in *Atomic Habits* by James Clear. It runs on macOS and Windows. The core idea is to make good behavior visible, immediate, and satisfying: you see your habits every time you look at your desktop, you mark them done with a single tap, and you get instant feedback that reinforces the identity of someone who shows up every day.

The widget lives at desktop level — always visible on the wallpaper, never in front of your apps. It is ambient, not intrusive.

---

## Core Concept

Small habits compound. The biggest obstacle to building them is forgetting they exist. This tool solves that with a persistent, always-visible checklist that requires zero navigation to use. Open your laptop, see your habits, mark them done, move on.

Positive feedback is immediate and personal: each habit has a user-chosen color, a daily checkmark, a weekly view, and a streak counter. These are the "satisfying" and "obvious" laws of *Atomic Habits* made concrete.

---

## Who It Is For

Personal use. A single user, one machine, no sync or accounts. The data lives locally in a SQLite database.

---

## Windows

The app has two windows with distinct roles:

### Main Widget (always visible)
- Lives at desktop level — behind all app windows, above the wallpaper
- No OS titlebar; draws its own drag handle
- Width: ~380px. Height: dynamic based on habit count, scrollable beyond 10 habits
- Shows the daily checklist and nothing else

### Manage Window (on demand)
- Opens when the user clicks the gear icon on the main widget
- Normal OS window, closeable
- Contains two tabs: **My Habits** and **History**

---

## Main Widget Layout

```
┌──────────────────────────────────────┐
│  Goals Tracker          Sat Jun 21  ⚙│  ← drag handle + date + gear
│  ████████████████░░░░  4 / 5 today   │  ← progress bar
├──────────────────────────────────────┤
│  ✓  Morning workout              🔥 6│
│     ● ● ● ● ● ● ○                   │  ← week dots in habit color
│                                      │
│  ○  Read 30 min                  🔥 3│
│     ● ● ○ ● ● ● ○                   │
│                                      │
│  ○  Cold shower                  🔥 0│
│     ○ ○ ○ ○ ○ ○ ○                   │
└──────────────────────────────────────┘
```

Each habit row shows:
- A checkbox (tap to mark done for today)
- Habit name
- The last 7 days as dots, filled in the habit's color when completed
- A flame + streak count (consecutive days ending today)

---

## Manage Window

### My Habits tab
- List of all active habits with their color swatch, name, edit button, and delete button
- Inline or modal form to create or edit a habit (name + color picker)
- Deleting a habit is a soft delete — historical completions are preserved

### History tab
- Month view with day-by-day completion rows
- Navigate backwards by month
- Filter chips to show only selected habits
- Per-day and per-habit visibility

---

## Data Model

```
habits
  id          TEXT  — uuid
  name        TEXT
  color       TEXT  — hex color chosen by user
  sort_order  INT   — display order
  created_at  TEXT  — ISO datetime
  deleted_at  TEXT  — NULL = active (soft delete)

habit_completions
  id           TEXT  — uuid
  habit_id     TEXT  — FK → habits.id
  completed_on TEXT  — "YYYY-MM-DD", one per habit per day
  UNIQUE(habit_id, completed_on)
```

Streak, week dots, and daily progress are computed from queries — no stored counters.

---

## Features

### MVP (V1)
- Daily habits only (resets each day)
- Mark a habit done / undo
- User-chosen color per habit
- Week dots (last 7 days)
- Streak counter
- Daily progress bar
- Create, edit, delete habits
- History view (per day + per habit filter)
- Desktop-level window (wallpaper layer)
- Dynamic widget height, scrollable past 10 habits

### V2 (future)
- Habits with a target frequency (e.g. 3×/week instead of daily)
- Reorder habits via drag

---

## Technical Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Shell     | Tauri 2 (Rust)                    |
| Frontend  | React 19 + TypeScript             |
| Styling   | Tailwind CSS v4                   |
| Database  | SQLite via `tauri-plugin-sql`     |
| Build     | Vite + pnpm                       |

**Window layer**: The main widget is positioned at desktop level — below normal app windows, above the wallpaper. This is implemented with platform-specific Rust code: macOS uses `NSWindowLevel` via the `cocoa` crate; Windows uses `SetWindowPos(HWND_BOTTOM)` via `windows-rs`.

**Inter-window communication**: Rust emits a Tauri event after each data mutation (`habits:changed`). Both windows listen and re-fetch, keeping them in sync without polling.
