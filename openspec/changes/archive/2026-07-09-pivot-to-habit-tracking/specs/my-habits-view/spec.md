## ADDED Requirements

### Requirement: List habits with color swatch
The My Habits tab SHALL render all active habits returned by `useGetHabits`, each showing its color swatch, name, an edit button, and a delete button.

#### Scenario: Habits load and display
- **WHEN** the tab mounts and habits are available
- **THEN** each habit is shown with its color swatch, name, edit button, and delete button

#### Scenario: Empty state
- **WHEN** there are zero active habits
- **THEN** a message indicating no habits exist is displayed

### Requirement: Create a habit with name and color
The tab SHALL provide a form (inline or modal) with a required name field and a color picker. Submitting with a non-empty name and a selected color SHALL call `useCreateHabit`, and the new habit SHALL appear in the list on success.

#### Scenario: Successful creation
- **WHEN** the user enters a name, picks a color, and submits
- **THEN** `useCreateHabit` is called with the name and color, and the new habit appears in the list

#### Scenario: Empty name prevented
- **WHEN** the user submits the form with an empty name
- **THEN** the form does not call `useCreateHabit`

### Requirement: Edit an existing habit's name and color
Clicking a habit's edit button SHALL open a form pre-filled with its current name and color. Submitting SHALL call `useUpdateHabit` and the list SHALL reflect the change on success.

#### Scenario: Successful edit
- **WHEN** the user changes the name and/or color of a habit and submits
- **THEN** `useUpdateHabit` is called with the habit's id and the changed fields, and the list reflects the update

### Requirement: Delete a habit is a soft delete
Clicking a habit's delete button SHALL call `useDeleteHabit`. On success the habit SHALL no longer appear in the list, while its historical completions remain intact for the History tab.

#### Scenario: Delete removes habit from list
- **WHEN** the user clicks delete on a habit and confirms
- **THEN** `useDeleteHabit` is called with the habit's id and it no longer appears in the My Habits list

#### Scenario: Deleted habit's history is preserved
- **WHEN** a habit with prior completions is deleted
- **THEN** its completion history remains queryable and visible in the History tab

### Requirement: Mutation errors surface via toast
Errors from create, update, and delete mutations SHALL be shown via the toast notification system rather than inline error states.

#### Scenario: Create error
- **WHEN** `useCreateHabit` fails
- **THEN** a toast notification displays the error message

#### Scenario: Update error
- **WHEN** `useUpdateHabit` fails
- **THEN** a toast notification displays the error message

#### Scenario: Delete error
- **WHEN** `useDeleteHabit` fails
- **THEN** a toast notification displays the error message
