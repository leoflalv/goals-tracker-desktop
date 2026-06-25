## Context

The app is a Tauri 2 widget-style overlay (transparent, no OS titlebar) using React 19 + Tailwind v4. There are no shared UI components yet — only a `Result<T>` utility exists in `src/shared/`. Features like goals will need consistent, reusable UI primitives and a standardized way to surface errors to users.

## Goals / Non-Goals

**Goals:**
- Deliver three foundational shared components: `Button`, `Input`, `Spinner` with hardcoded Tailwind variant classes
- Implement a self-contained Toast system (provider + hook + renderer) that any feature can use via `useToast()`
- Mount `ToastContainer` once in `App.tsx` — no provider needed

**Non-Goals:**
- A class-merging utility (`cn()`) — variants are hardcoded, no external `className` merging needed
- A full-blown design system or Storybook catalog
- Animation libraries beyond Tailwind utilities
- Multiple toast queuing/stacking strategies (keep it simple: show latest, auto-dismiss)

## Decisions

### Toast via Zustand store (no React Context)
A Zustand store holds `toasts` state with `addToast` / `removeToast` actions. `useToast()` is a thin hook re-exported from the store. `ToastContainer` reads directly from the store and renders the overlay — no Provider needed in `App.tsx`. Alternative: React Context — rejected in favour of Zustand since the project will likely use Zustand for other state too, and it avoids the boilerplate of a provider + context pair.

### Toast positioning: fixed bottom-right
The app window is positioned top-left as a widget. Fixed bottom-right toasts avoid overlapping the main content. Position can be changed later via a prop if needed.

### Shared components as thin Tailwind wrappers
`Button`, `Input`, and `Spinner` are small wrapper components with variant props. Variant styles are hardcoded Tailwind class strings — no merging utility needed. No external component library (e.g. Radix, shadcn) — this app is simple enough that hand-rolled primitives are sufficient.

## Risks / Trade-offs

- [Toast state lost on unmount] If `ToastProvider` unmounts (e.g. during HMR), queued toasts are lost. → Acceptable for this widget app; not a data-integrity concern.

## Migration Plan

Purely additive. No existing code is changed except `App.tsx` (wrapping with `ToastProvider`). No migration needed.
