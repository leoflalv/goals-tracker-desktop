## Why

The project has no automated build or release process, and no guardrails on pull requests. Every release requires manual cross-platform builds, and broken code or lint errors can be merged undetected. A CI/CD pipeline ensures PRs are verified before merging and every tagged release produces downloadable installers for macOS and Windows.

## What Changes

- Add a GitHub Actions workflow that runs tests and ESLint on every PR opened or updated against `main`; merging is blocked if checks fail
- Add a GitHub Actions workflow that triggers on every push of a version tag (e.g. `v*`), builds macOS (`.dmg`) and Windows (`.exe` / `.msi`) installers, and publishes them as a GitHub Release
- No code signing in initial implementation

## Capabilities

### New Capabilities

- `ci-pr-checks`: GitHub Actions workflow that runs `pnpm test:run` and `pnpm lint` on every PR targeting `main`, blocking merge if either fails
- `ci-release-pipeline`: GitHub Actions workflow that builds Tauri installers for macOS and Windows and publishes them as a GitHub Release on every version tag push

### Modified Capabilities

<!-- No existing spec-level behavior is changing -->

## Impact

- New file: `.github/workflows/pr-checks.yml`
- New file: `.github/workflows/release.yml`
- No changes to frontend (`src/`) or Rust backend (`src-tauri/`)
- Requires `GITHUB_TOKEN` (auto-provided by Actions) — no additional secrets for unsigned builds
- GitHub branch protection must be configured to require the `pr-checks` status check before merging
- Release builds run on macOS + Windows runners; PR checks run on `ubuntu-latest` (faster, cheaper)
