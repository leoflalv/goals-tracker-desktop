## ADDED Requirements

### Requirement: Workflow triggers on PR events targeting main
The CI system SHALL run checks automatically whenever a pull request targeting `main` is opened or a new commit is pushed to it.

#### Scenario: PR opened against main triggers checks
- **WHEN** a pull request targeting `main` is opened
- **THEN** the PR check workflow starts and runs all checks

#### Scenario: New commit pushed to open PR triggers checks
- **WHEN** a commit is pushed to the branch of an open PR targeting `main`
- **THEN** the PR check workflow re-runs all checks against the latest commit

#### Scenario: PR targeting a non-main branch does not trigger checks
- **WHEN** a pull request targets a branch other than `main`
- **THEN** the PR check workflow is not triggered

### Requirement: Tests must pass on every PR
The pipeline SHALL run `pnpm test:run` on every PR check; the check SHALL fail if any test fails.

#### Scenario: All tests pass
- **WHEN** `pnpm test:run` exits with code 0
- **THEN** the test step is marked as passed and the job continues

#### Scenario: A test fails
- **WHEN** `pnpm test:run` exits with a non-zero code
- **THEN** the job fails and the PR check is marked as failed

### Requirement: ESLint must pass on every PR
The pipeline SHALL run `pnpm lint` on every PR check; the check SHALL fail if ESLint reports any errors.

#### Scenario: No lint errors
- **WHEN** `pnpm lint` exits with code 0
- **THEN** the lint step is marked as passed and the job continues

#### Scenario: Lint errors are present
- **WHEN** `pnpm lint` exits with a non-zero code
- **THEN** the job fails and the PR check is marked as failed

### Requirement: Failed PR checks block merging to main
Merging a PR to `main` SHALL be blocked if the PR check workflow has not completed successfully.

#### Scenario: Checks pass — merge is allowed
- **WHEN** all PR check steps (tests + lint) pass
- **THEN** the merge button is enabled and the PR can be merged

#### Scenario: Checks fail — merge is blocked
- **WHEN** any PR check step fails
- **THEN** the merge button is disabled until the checks pass on a subsequent push
