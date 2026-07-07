## Context

The app is a Tauri 2 desktop widget built with React + TypeScript (pnpm) and a Rust backend. It targets macOS and Windows. Currently there is no automated build process — releases are manual. The goal is to wire up GitHub Actions so that every merge to `main` automatically produces downloadable installers and publishes them as a GitHub Release.

## Goals / Non-Goals

**Goals:**
- Block merging a PR to `main` if tests or ESLint fail
- Run the full test suite on every tag push; block release if tests fail
- Automated builds for macOS and Windows on every version tag push
- GitHub Release created with `.dmg`, `.exe`, and `.msi` artifacts attached
- Zero manual steps after tagging

**Non-Goals:**
- Code signing (macOS notarization / Windows Authenticode) — deferred to a later change
- Linux builds — not a target platform
- Auto-updating / Tauri updater plugin — out of scope
- Type-checking in CI — covered implicitly by `pnpm build`; not added as a separate step

## Decisions

### 1. Tag-based trigger (`push: tags: v*`) over branch trigger

**Decision**: Trigger on git tag pushes matching `v*` (e.g. `v1.0.0`), not on every push to `main`

**Rationale**: Gives intentional control over when a release is cut. Not every merge warrants a release — tagging is a deliberate act. Avoids accidental releases and version collisions from merges that don't bump the version.

**Alternative considered**: Branch trigger (`on: push: branches: [main]`) — simpler, but creates a release on every merge regardless of intent. Leads to version collisions if the version isn't bumped in every PR.

### 2. Separate workflow files for PR checks vs. release

**Decision**: Two distinct workflow files — `pr-checks.yml` (triggered by `pull_request` targeting `main`) and `release.yml` (triggered by `push: tags: v*`).

**Rationale**: Different triggers, different runners, different jobs. Keeping them separate makes each file easy to read and modify independently. A single combined file would require complex conditional logic to skip the release steps on PRs and vice versa.

**PR checks runner**: `ubuntu-latest` — tests and ESLint are platform-agnostic and Linux runners are the fastest and cheapest option.

**Blocking merges**: The PR check job name must be added to GitHub's branch protection rules as a required status check. This is a one-time repo configuration step; it is not part of the workflow file itself.

### 3. `tauri-apps/tauri-action` as the build driver

**Decision**: Use the official `tauri-apps/tauri-action` GitHub Action.

**Rationale**: It handles Node + Rust setup, `pnpm tauri build`, artifact collection, and GitHub Release creation in one action. Avoids hand-rolling the matrix setup and upload steps.

### 4. Matrix strategy: macOS + Windows only

**Decision**: Run two parallel jobs — `macos-latest` and `windows-latest`.

**Rationale**: Matches the app's declared target platforms. Linux runner would produce an `.AppImage` that is not a supported target, so it's excluded.

### 5. pnpm via `pnpm/action-setup`

**Decision**: Install pnpm in CI using the official `pnpm/action-setup` action, then `actions/setup-node` with `cache: 'pnpm'`.

**Rationale**: Mirrors local dev toolchain. Avoids npm/yarn mismatches. pnpm cache integration keeps installs fast.

### 6. Draft releases (auto-publish off)

**Decision**: Releases are created as **drafts** by default.

**Rationale**: Gives the option to review artifacts and write release notes before publishing. Can be switched to auto-publish by setting `draft: false` in the action config once the team is comfortable with the pipeline.

## Risks / Trade-offs

- **Build time**: Matrix across 2 OS runners adds ~10-20 min per merge. Acceptable for a desktop app with infrequent releases.
- **Version collisions**: Pushing the same tag twice will fail or overwrite the existing release. Mitigation: Never re-push a tag; use `git tag -d` + re-tag only intentionally.
- **No signing → user friction**: macOS Gatekeeper and Windows SmartScreen will warn users. Mitigation: Document this in the release notes; add signing in a follow-up change.
- **macOS runner minutes cost**: `macos-latest` consumes GitHub Actions minutes at 10× the Linux rate. Mitigation: Acceptable at current merge frequency; revisit if cost becomes an issue.
