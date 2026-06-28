## Why

The project has no automated build or release process. Every release requires manual cross-platform builds, making it error-prone and slow. A CI/CD pipeline ensures every merge to `main` produces verified, downloadable installers for macOS and Windows.

## What Changes

- Add a GitHub Actions workflow that triggers on every push of a version tag (e.g. `v*`)
- Build macOS (`.dmg`) and Windows (`.exe` / `.msi`) installers via `tauri-apps/tauri-action`
- Publish built artifacts as a GitHub Release (draft or auto-published)
- No code signing in initial implementation

## Capabilities

### New Capabilities

- `ci-release-pipeline`: GitHub Actions workflow that builds Tauri installers for macOS and Windows and publishes them as a GitHub Release on every merge to `main`

### Modified Capabilities

<!-- No existing spec-level behavior is changing -->

## Impact

- New file: `.github/workflows/release.yml`
- No changes to frontend (`src/`) or Rust backend (`src-tauri/`)
- Requires `GITHUB_TOKEN` (auto-provided by Actions) — no additional secrets for unsigned builds
- Build time will increase per merge (matrix across 2 OS runners); no impact on local dev
