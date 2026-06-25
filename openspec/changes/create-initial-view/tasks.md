## 1. GoalCard Component

- [ ] 1.1 Create `src/features/goals/components/GoalCard.tsx` — renders title, optional description, a completion checkbox (calls `useUpdateGoal` on change), and a delete button (calls `useDeleteGoal` on click)
- [ ] 1.2 Wire mutation errors from `useUpdateGoal` and `useDeleteGoal` to the toast store via `useToast`
- [ ] 1.3 Write `GoalCard.test.tsx` — test checkbox toggle calls update hook, delete button calls delete hook, description is only rendered when non-null

## 2. GoalList Component

- [ ] 2.1 Create `src/features/goals/components/GoalList.tsx` — renders a `<Spinner />` when loading, an empty-state message when the list is empty, and a `GoalCard` for each goal otherwise
- [ ] 2.2 Apply `max-h` + `overflow-y-auto` on the list container to prevent unbounded widget growth
- [ ] 2.3 Write `GoalList.test.tsx` — test loading state shows spinner, empty state shows message, goals list renders correct number of cards

## 3. AddGoalForm Component

- [ ] 3.1 Create `src/features/goals/components/AddGoalForm.tsx` — controlled form with a required title `<Input />` and an optional description `<Input />`; on submit calls `useCreateGoal` and clears form on success; prevents submission when title is empty
- [ ] 3.2 Send `undefined` (not empty string) for description when the field is blank
- [ ] 3.3 Write `AddGoalForm.test.tsx` — test submit with title calls create, submit with empty title is blocked, form clears on success, description is optional

## 4. GoalWidget Component

- [ ] 4.1 Create `src/features/goals/components/GoalWidget.tsx` — renders a drag handle strip at the top (calls `getCurrentWindow().startDragging()` on `mousedown`), then `<GoalList />`, then `<AddGoalForm />`
- [ ] 4.2 Style drag handle with `cursor-grab` and sufficient height (≥ 20 px); wrap the widget in a transparent rounded panel matching the window chrome

## 5. Wire into App

- [ ] 5.1 Update `src/App.tsx` to mount `<GoalWidget />` in place of the placeholder heading; keep `<ToastContainer />`
- [ ] 5.2 Export all new components from `src/features/goals/components/index.ts`

## 6. Verify

- [ ] 6.1 Run `pnpm test:run` and confirm all new and existing tests pass
- [ ] 6.2 Run `pnpm lint` and confirm no ESLint errors
- [ ] 6.3 Start `pnpm tauri dev` and manually verify: goals load, add form creates a goal, checkbox toggles completion, delete button removes a goal, drag handle moves the window
