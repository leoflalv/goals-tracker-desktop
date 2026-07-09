# Manage Window Spec

## Purpose

The secondary, on-demand OS window opened from the main widget's gear icon, hosting tab navigation between the My Habits and History views.

## Requirements

### Requirement: Manage Window opens on demand
Clicking the gear icon on the main widget SHALL open a normal, closeable OS window (with titlebar and standard chrome) hosting the Manage UI. If the window is already open, it SHALL be focused instead of opening a duplicate.

#### Scenario: First open creates the window
- **WHEN** the gear icon is clicked and the Manage Window is not open
- **THEN** a new Manage Window is created and shown

#### Scenario: Repeat open focuses the existing window
- **WHEN** the gear icon is clicked while the Manage Window is already open
- **THEN** the existing Manage Window is focused instead of a second one being created

#### Scenario: Manage Window is closeable
- **WHEN** the user clicks the Manage Window's close control
- **THEN** the window closes without affecting the main widget

### Requirement: Tab navigation between My Habits and History
The Manage Window SHALL show two tabs, "My Habits" and "History", and render the corresponding tab's content based on which is selected. "My Habits" SHALL be the default selected tab on open.

#### Scenario: Default tab on open
- **WHEN** the Manage Window opens
- **THEN** the "My Habits" tab is selected and its content is shown

#### Scenario: Switching tabs
- **WHEN** the user clicks the "History" tab
- **THEN** the History tab's content is shown and "My Habits" content is hidden
