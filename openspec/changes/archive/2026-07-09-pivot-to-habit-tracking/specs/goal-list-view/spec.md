## REMOVED Requirements

### Requirement: Display goal list
**Reason**: Replaced by the habit row list (color checkbox, week dots, streak) specified in `main-widget-view`.
**Migration**: None — pre-release pivot.

### Requirement: Toggle goal completion
**Reason**: Replaced by the color-coded completion checkbox and `useToggleHabitCompletion` flow in `main-widget-view`.
**Migration**: None — pre-release pivot.

### Requirement: Delete a goal
**Reason**: Deleting is moved to the Manage Window's My Habits tab; the main widget no longer has inline delete. See `my-habits-view`.
**Migration**: None — pre-release pivot.

### Requirement: Add a new goal
**Reason**: Creating a habit (name + color) is moved to the Manage Window's My Habits tab; the main widget no longer has an inline creation form. See `my-habits-view`.
**Migration**: None — pre-release pivot.

### Requirement: Drag handle for window repositioning
**Reason**: Retained but re-specified in `main-widget-view` as part of the reworked header.
**Migration**: None — pre-release pivot.

### Requirement: Mutation errors surface via toast
**Reason**: Retained but re-specified in `main-widget-view` and `my-habits-view` against habit/completion mutations.
**Migration**: None — pre-release pivot.
