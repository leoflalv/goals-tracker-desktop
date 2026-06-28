# Shared Components Spec

## Purpose
Reusable UI primitives used across features — Button, Input, and Spinner — all living under `src/shared/components/`.

## Requirements

### Requirement: Button component
The system SHALL provide a `Button` component in `src/shared/components/Button.tsx` that supports `variant` (`primary` | `secondary` | `ghost`) and `size` (`sm` | `md`) props, forwards all native button attributes, and applies Tailwind styling.

#### Scenario: Default primary button renders
- **WHEN** `<Button>Save</Button>` is rendered
- **THEN** a button element with primary variant styles is displayed

#### Scenario: Variant prop changes appearance
- **WHEN** `<Button variant="secondary">Cancel</Button>` is rendered
- **THEN** secondary styles are applied instead of primary

#### Scenario: Disabled state is forwarded
- **WHEN** `<Button disabled>Save</Button>` is rendered
- **THEN** the button is disabled and visually indicates the disabled state

### Requirement: Input component
The system SHALL provide an `Input` component in `src/shared/components/Input.tsx` that forwards all native input attributes and supports an optional `error` boolean prop that applies error styling.

#### Scenario: Default input renders
- **WHEN** `<Input placeholder="Enter text" />` is rendered
- **THEN** a styled text input is displayed

#### Scenario: Error state applies error styling
- **WHEN** `<Input error />` is rendered
- **THEN** the input displays with error border/ring styling

### Requirement: Spinner component
The system SHALL provide a `Spinner` component in `src/shared/components/Spinner.tsx` that renders an animated loading indicator and accepts a `size` prop (`sm` | `md` | `lg`).

#### Scenario: Spinner renders with animation
- **WHEN** `<Spinner />` is rendered
- **THEN** an animated circular spinner is visible

#### Scenario: Size prop controls dimensions
- **WHEN** `<Spinner size="lg" />` is rendered
- **THEN** the spinner is larger than the default `md` size
