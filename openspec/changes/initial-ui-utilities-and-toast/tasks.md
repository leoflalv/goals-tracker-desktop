## 0. Color Tokens

- [x] 0.1 Define semantic color tokens in `src/App.css` via Tailwind v4 `@theme` (`primary`, `secondary`, `surface`, `border`, `error`, `muted`)

## 1. Shared Components

- [x] 1.1 Create `src/shared/components/Button.tsx` with `variant` (`primary` | `secondary` | `ghost`) and `size` (`sm` | `md`) props
- [x] 1.2 Create `src/shared/components/Input.tsx` with `error` boolean prop for error styling
- [x] 1.3 Create `src/shared/components/Spinner.tsx` with `size` (`sm` | `md` | `lg`) prop
- [x] 1.4 Export all components from `src/shared/components/index.ts`

## 2. Toast System

- [ ] 2.1 Install `zustand` dependency
- [ ] 2.2 Create `src/shared/store/toastStore.ts` with Zustand store (`toasts`, `addToast`, `removeToast`) and `useToast()` hook
- [ ] 2.3 Create `src/shared/components/Toast/ToastContainer.tsx` to read from the store and render toasts (fixed bottom-right)
- [ ] 2.4 Export `useToast` from `src/shared/store/toastStore.ts` and `ToastContainer` from `src/shared/components/index.ts`

## 3. Wire Up

- [ ] 3.1 Mount `<ToastContainer />` inside `src/App.tsx` (no provider needed)
