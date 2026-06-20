# Goals Tracker

A desktop widget for tracking daily habits on macOS and Windows, inspired by *Atomic Habits* by James Clear.

The widget lives at desktop level — always visible on the wallpaper, never in front of your apps. Mark habits done with a single tap, see your streaks and weekly progress at a glance, and get immediate positive feedback every time you show up.

For full product design and decisions, see [PRODUCT.md](./PRODUCT.md).

---

## Features

- Always-visible daily checklist (desktop-layer window, behind all apps)
- Streak counter and last-7-days dots per habit
- Daily progress bar
- User-chosen color per habit
- Create, edit, and delete habits
- History view with per-day and per-habit filtering
- Data stored locally in SQLite — no accounts, no sync

---

## Tech Stack

| Layer     | Technology                    |
|-----------|-------------------------------|
| Shell     | Tauri 2 (Rust)                |
| Frontend  | React 19 + TypeScript         |
| Styling   | Tailwind CSS v4               |
| Database  | SQLite via `tauri-plugin-sql` |
| Build     | Vite + pnpm                   |

---

## Development

```bash
pnpm tauri dev      # start the full app (Vite + Tauri shell)
pnpm dev            # Vite-only frontend (no native shell)
pnpm test:run       # run tests once
pnpm lint           # run ESLint
```

Requires [Rust](https://www.rust-lang.org/tools/install) and [pnpm](https://pnpm.io/installation).
