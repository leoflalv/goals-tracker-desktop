# History View Spec

## Purpose

The Manage Window's History tab — a month view of day-by-day habit completions, with month navigation and per-habit filter chips, including soft-deleted habits with prior history.

## Requirements

### Requirement: Month view of day-by-day completions
The History tab SHALL display a calendar-style month view where each day shows which habits were completed, derived from `useGetCompletions` for the visible month's date range.

#### Scenario: Month renders completions
- **WHEN** the History tab is showing a given month and completions exist for several days
- **THEN** each day in the grid indicates which habits (by color) were completed that day

#### Scenario: Loading state
- **WHEN** the completions query for the visible month is in flight
- **THEN** a spinner is shown in place of the month grid

### Requirement: Navigate backwards and forwards by month
The tab SHALL provide controls to move to the previous or next month, refetching completions for the newly visible range. Navigating forward SHALL NOT go beyond the current month.

#### Scenario: Navigate to previous month
- **WHEN** the user clicks the "previous month" control
- **THEN** the visible month moves back by one and completions are refetched for that range

#### Scenario: Navigate to next month
- **WHEN** the user clicks the "next month" control while viewing a past month
- **THEN** the visible month moves forward by one and completions are refetched for that range

#### Scenario: Cannot navigate past the current month
- **WHEN** the user is viewing the current month
- **THEN** the "next month" control is disabled

### Requirement: Filter by habit
The tab SHALL render a filter chip for each habit (including soft-deleted ones with prior history). Selecting one or more chips SHALL restrict the month view to only those habits' completions; with no chips selected, all habits SHALL be shown.

#### Scenario: Filtering to one habit
- **WHEN** the user selects a single habit's filter chip
- **THEN** the month view shows only that habit's completions

#### Scenario: Clearing filters shows all habits
- **WHEN** the user deselects all filter chips
- **THEN** the month view shows completions for all habits again

### Requirement: Deleted habits remain visible in history
Soft-deleted habits SHALL still appear in the History tab's filter chips and month view if they have prior completions, so historical data is not lost.

#### Scenario: Deleted habit's completions still show
- **WHEN** a habit was deleted after being completed on several past days
- **THEN** those past completions still appear in the month view and its filter chip is still selectable
