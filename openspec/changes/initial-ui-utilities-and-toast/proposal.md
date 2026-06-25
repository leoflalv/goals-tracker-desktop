## Why

The app has no shared UI layer yet — features will need consistent building blocks (buttons, inputs, feedback) as the UI is built out. Without a centralized toast system, errors from Tauri commands would surface silently or require ad-hoc handling per feature.

## What Changes

- Add foundational shared UI components (Button, Input, Spinner) reusable across features
- Add a Toast notification system wired to gracefully surface errors and user feedback

## Capabilities

### New Capabilities
- `shared-components`: Reusable React UI components (Button, Input, Spinner) in `src/shared/components/`
- `toast`: A Toast notification system with provider, hook, and component — used to display errors and status messages across the app

### Modified Capabilities
<!-- none -->

## Impact

- New files under `src/shared/components/` (UI primitives, ToastContainer) and `src/shared/store/` (Zustand toast store)
- `App.tsx` mounts `<ToastContainer />` once; features call `useToast()` directly from the store
- Requires adding `zustand` as a dependency
- No breaking changes — purely additive
