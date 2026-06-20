## ADDED Requirements

### Requirement: Create a habit
The system SHALL allow the user to create a new daily habit by providing a name, type (positive or negative), and color. A UUID SHALL be generated for the habit's id, and `created_at` SHALL be set to today's date. Newly created habits SHALL be non-archived by default.

#### Scenario: Successful habit creation
- **WHEN** the user submits a valid name, type, and color
- **THEN** a new habit record is persisted in the `habits` table and returned to the frontend

#### Scenario: Habit name is empty
- **WHEN** the user submits a create request with an empty name
- **THEN** the system SHALL reject the request and return an error

### Requirement: Edit a habit
The system SHALL allow the user to update an existing habit's name, type, and color. The habit's `id`, `created_at`, and `archived` fields SHALL NOT be modified by an edit operation. Editing a negative habit into a positive one (or vice versa) SHALL NOT affect existing `habit_logs` records.

#### Scenario: Successful edit
- **WHEN** the user submits updated name, type, or color for an existing habit
- **THEN** the `habits` record is updated and the new values are returned to the frontend

#### Scenario: Editing name to empty string
- **WHEN** the user submits an edit with an empty name
- **THEN** the system SHALL reject the request and return an error

#### Scenario: Type change does not alter logs
- **WHEN** the user changes a habit's type from positive to negative (or vice versa)
- **THEN** all existing `habit_logs` records for that habit remain unchanged

### Requirement: Archive a habit
The system SHALL allow the user to archive a habit via soft-delete. Archiving SHALL set `archived = 1` on the habit record. Archived habits SHALL NOT be deleted, so their historical logs remain intact.

#### Scenario: Archiving a habit
- **WHEN** the user archives a habit
- **THEN** the habit's `archived` flag is set to true and it no longer appears in any active habit list

#### Scenario: Logs preserved after archiving
- **WHEN** a habit is archived
- **THEN** all `habit_logs` records for that habit SHALL remain in the database

### Requirement: List active habits
The system SHALL return all habits where `archived = 0`, ordered by `created_at` ascending.

#### Scenario: Fetching active habits
- **WHEN** the frontend requests the habit list
- **THEN** only non-archived habits are returned, sorted by creation date
