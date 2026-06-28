# Toast Spec

## Purpose
Global, non-blocking notification system backed by a Zustand store — no React Context needed.

## Requirements

### Requirement: Toast store
The system SHALL expose a Zustand store in `src/shared/store/toastStore.ts` with `toasts` state and `addToast` / `removeToast` actions. No React Context or Provider is needed.

#### Scenario: Adding a toast
- **WHEN** `addToast({ message: "Saved", variant: "success" })` is called
- **THEN** the toast appears in the `toasts` array with a generated `id`

#### Scenario: Removing a toast by id
- **WHEN** `removeToast(id)` is called
- **THEN** the toast with that `id` is removed from the `toasts` array

#### Scenario: Auto-dismiss after timeout
- **WHEN** a toast is added
- **THEN** it is automatically removed after 3 seconds

### Requirement: useToast hook
The system SHALL provide a `useToast()` hook in `src/shared/store/toastStore.ts` (re-exported from the store) that gives components access to `addToast` without importing the full store.

#### Scenario: Hook exposes addToast
- **WHEN** a component calls `const { addToast } = useToast()`
- **THEN** calling `addToast` updates the global toast state

### Requirement: ToastContainer component
The system SHALL provide a `ToastContainer` component in `src/shared/components/Toast/ToastContainer.tsx` that reads from the Zustand store and renders active toasts in a fixed bottom-right overlay.

#### Scenario: Toasts are rendered
- **WHEN** one or more toasts exist in the store
- **THEN** each is displayed as a styled card in the bottom-right corner

#### Scenario: No toasts renders nothing
- **WHEN** the toasts array is empty
- **THEN** the container renders nothing visible
