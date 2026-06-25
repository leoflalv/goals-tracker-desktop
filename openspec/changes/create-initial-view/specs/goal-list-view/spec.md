## ADDED Requirements

### Requirement: Display goal list
The widget SHALL render all goals returned by `useGetGoals` as a scrollable list. While the list is loading a spinner SHALL be shown. When the list is empty an empty-state message SHALL be displayed.

#### Scenario: Goals load and display
- **WHEN** the widget mounts and goals are available
- **THEN** each goal is shown with its title, an optional description, and a completion checkbox

#### Scenario: Loading state
- **WHEN** the goals query is in flight
- **THEN** a spinner is shown in place of the list

#### Scenario: Empty state
- **WHEN** the goals query resolves with zero items
- **THEN** a message indicating no goals exist is displayed

### Requirement: Toggle goal completion
The widget SHALL allow the user to mark a goal complete or incomplete via a checkbox on each `GoalCard`. On toggle `useUpdateGoal` SHALL be called with the new completed state and the mutation result SHALL be reflected without a full page reload.

#### Scenario: Mark complete
- **WHEN** the user checks the completion checkbox on an incomplete goal
- **THEN** `useUpdateGoal` is called with `completed: true` and the checkbox reflects the updated state

#### Scenario: Mark incomplete
- **WHEN** the user unchecks the completion checkbox on a completed goal
- **THEN** `useUpdateGoal` is called with `completed: false` and the checkbox reflects the updated state

### Requirement: Delete a goal
Each `GoalCard` SHALL include a delete button. Clicking it SHALL call `useDeleteGoal` and remove the goal from the list on success.

#### Scenario: Delete goal
- **WHEN** the user clicks the delete button on a goal card
- **THEN** `useDeleteGoal` is called with the goal's id and the goal no longer appears in the list

### Requirement: Add a new goal
The widget SHALL include an always-visible inline form at the bottom with a required title field and an optional description field. Submitting with a non-empty title SHALL call `useCreateGoal` and the new goal SHALL appear in the list on success. Submitting with an empty title SHALL be prevented.

#### Scenario: Successful creation
- **WHEN** the user enters a non-empty title and submits the form
- **THEN** `useCreateGoal` is called with the title (and description if provided) and the form clears on success

#### Scenario: Empty title prevented
- **WHEN** the user submits the form with an empty title
- **THEN** the form does not call `useCreateGoal` and no new goal is created

#### Scenario: Description is optional
- **WHEN** the user submits the form with only a title (description left blank)
- **THEN** `useCreateGoal` is called with the title and `undefined` for description

### Requirement: Drag handle for window repositioning
The widget SHALL render a drag handle strip at the top that allows the user to reposition the window by dragging. The handle SHALL call `getCurrentWindow().startDragging()` on `mousedown`.

#### Scenario: Window drag
- **WHEN** the user presses the mouse button on the drag handle
- **THEN** `startDragging()` is invoked and the OS allows the window to be moved

### Requirement: Mutation errors surface via toast
Errors from create, update, and delete mutations SHALL be shown via the toast notification system rather than inline error states.

#### Scenario: Create error
- **WHEN** `useCreateGoal` fails
- **THEN** a toast notification displays the error message

#### Scenario: Delete error
- **WHEN** `useDeleteGoal` fails
- **THEN** a toast notification displays the error message
