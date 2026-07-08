## ADDED Requirements

### Requirement: Display habit list with streaks and week dots
The widget SHALL render all active habits returned by `useGetHabits` as a scrollable list. While loading, a spinner SHALL be shown. When there are zero habits, an empty-state message SHALL be displayed. Each row SHALL show a completion checkbox in the habit's color, the habit name, the last-7-days dots, and a flame + streak count.

#### Scenario: Habits load and display
- **WHEN** the widget mounts and habits are available
- **THEN** each habit is shown with its color checkbox, name, week dots, and streak count

#### Scenario: Loading state
- **WHEN** the habits query is in flight
- **THEN** a spinner is shown in place of the list

#### Scenario: Empty state
- **WHEN** the habits query resolves with zero items
- **THEN** a message indicating no habits exist is displayed

### Requirement: Toggle habit completion for today
The widget SHALL allow the user to mark a habit done/undone for today via its checkbox. On toggle, `useToggleHabitCompletion` SHALL be called for today's date, and the checkbox, week dots, streak, and progress bar SHALL update without a full page reload.

#### Scenario: Mark done
- **WHEN** the user checks an incomplete habit's checkbox
- **THEN** `useToggleHabitCompletion` is called for today's date and the checkbox, week dots, and streak reflect the update

#### Scenario: Mark undone
- **WHEN** the user unchecks a completed habit's checkbox
- **THEN** `useToggleHabitCompletion` is called for today's date and the checkbox, week dots, and streak reflect the update

### Requirement: Daily progress bar
The widget SHALL display a progress bar and fraction (e.g. "4 / 5") reflecting how many active habits have a completion for today, out of the total active habits.

#### Scenario: Progress reflects completions
- **WHEN** 3 of 5 active habits are completed for today
- **THEN** the progress bar and label show 3 / 5

### Requirement: Header shows date and gear icon
The widget SHALL render a header with a drag handle, the current date, and a gear icon. Clicking the gear icon SHALL open the Manage Window.

#### Scenario: Gear icon opens Manage Window
- **WHEN** the user clicks the gear icon
- **THEN** the Manage Window opens (or is focused if already open)

### Requirement: Drag handle for window repositioning
The widget's header SHALL act as a drag handle that allows the user to reposition the window by dragging. It SHALL call `getCurrentWindow().startDragging()` on `mousedown`.

#### Scenario: Window drag
- **WHEN** the user presses the mouse button on the header (outside the gear icon)
- **THEN** `startDragging()` is invoked and the OS allows the window to be moved

### Requirement: Dynamic height with scroll past 10 habits
The widget's height SHALL grow with the number of habits up to 10 rows; beyond 10, the list SHALL become scrollable instead of growing further.

#### Scenario: Fewer than 10 habits
- **WHEN** there are 6 active habits
- **THEN** the widget height fits all 6 rows without a scrollbar

#### Scenario: More than 10 habits
- **WHEN** there are 14 active habits
- **THEN** the widget height caps at 10 rows and the list scrolls to reveal the rest

### Requirement: Mutation errors surface via toast
Errors from the completion-toggle mutation SHALL be shown via the toast notification system rather than inline error states.

#### Scenario: Toggle error
- **WHEN** `useToggleHabitCompletion` fails
- **THEN** a toast notification displays the error message
