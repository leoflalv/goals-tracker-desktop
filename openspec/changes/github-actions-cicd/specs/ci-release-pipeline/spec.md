## ADDED Requirements

### Requirement: Workflow triggers on version tag push
The CI/CD system SHALL automatically start a release build whenever a git tag matching `v*` (e.g. `v1.0.0`) is pushed.

#### Scenario: Pushing a version tag starts the workflow
- **WHEN** a tag matching `v*` is pushed to the remote
- **THEN** the GitHub Actions workflow is triggered and all build jobs start

#### Scenario: Push to a branch does not trigger workflow
- **WHEN** a commit is pushed to any branch (including `main`)
- **THEN** no release workflow is triggered

#### Scenario: Pushing a non-version tag does not trigger workflow
- **WHEN** a tag that does not match `v*` is pushed
- **THEN** no release workflow is triggered

### Requirement: Tests pass before release artifacts are built
The pipeline SHALL run the full test suite before building installers. A test failure SHALL block the release.

#### Scenario: Tests pass and pipeline continues
- **WHEN** the tag-triggered workflow runs and `pnpm test:run` exits with code 0
- **THEN** the build jobs proceed to produce installers

#### Scenario: Tests fail and pipeline is blocked
- **WHEN** `pnpm test:run` exits with a non-zero code
- **THEN** the workflow fails immediately and no installers are built or published

### Requirement: macOS installer is built
The pipeline SHALL produce a macOS `.dmg` installer artifact on every successful run.

#### Scenario: macOS build succeeds
- **WHEN** the workflow runs on a `macos-latest` runner
- **THEN** `pnpm tauri build` completes and a `.dmg` file is produced

#### Scenario: macOS build failure blocks release
- **WHEN** the macOS build step fails
- **THEN** no GitHub Release is created and the workflow exits with a failure status

### Requirement: Windows installer is built
The pipeline SHALL produce a Windows `.exe` and `.msi` installer artifact on every successful run.

#### Scenario: Windows build succeeds
- **WHEN** the workflow runs on a `windows-latest` runner
- **THEN** `pnpm tauri build` completes and `.exe` / `.msi` files are produced

#### Scenario: Windows build failure blocks release
- **WHEN** the Windows build step fails
- **THEN** no GitHub Release is created and the workflow exits with a failure status

### Requirement: Artifacts are published as a GitHub Release
The pipeline SHALL create a GitHub Release and attach all built installers as downloadable assets.

#### Scenario: All builds succeed and release is created
- **WHEN** both macOS and Windows builds succeed
- **THEN** a GitHub Release is created (as a draft) tagged with the app version from `tauri.conf.json`
- **THEN** `.dmg`, `.exe`, and `.msi` files are attached to the release as downloadable assets

### Requirement: pnpm is used as the package manager
The CI environment SHALL install and use pnpm (matching local dev) for all Node dependency and build steps.

#### Scenario: Dependencies install with pnpm
- **WHEN** the workflow runs
- **THEN** `pnpm install` is used to install Node dependencies
- **THEN** `pnpm tauri build` is used to invoke the Tauri build
