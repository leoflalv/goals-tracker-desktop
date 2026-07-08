## 1. Release Workflow File Setup

- [x] 1.1 Create `.github/workflows/release.yml` with `on: push: tags: ['v*']` trigger
- [x] 1.2 Define a matrix strategy with `os: [macos-latest, windows-latest]`

## 2. Release CI Environment

- [x] 2.1 Add step to install pnpm via `pnpm/action-setup` (match version in `package.json` `packageManager` field or use `latest`)
- [x] 2.2 Add step to set up Node via `actions/setup-node` with `cache: 'pnpm'`
- [x] 2.3 Add step to install Rust stable toolchain via `dtolnay/rust-toolchain@stable`

## 3. Release Build

- [x] 3.1 Add `pnpm install` step to install frontend dependencies
- [x] 3.2 Add `pnpm test:run` step before the Tauri build; configure it to fail the job on non-zero exit
- [x] 3.3 Add `tauri-apps/tauri-action` step configured to build and collect installers (runs only if tests pass)
- [x] 3.4 Set `tagName` to use the app version from `tauri.conf.json` (e.g. `app-v__VERSION__`)
- [x] 3.5 Set `releaseDraft: true` so releases are created as drafts

## 4. PR Check Workflow

- [x] 4.1 Create `.github/workflows/pr-checks.yml` with `on: pull_request: branches: [main]` trigger
- [x] 4.2 Set runner to `ubuntu-latest`
- [x] 4.3 Add pnpm + Node setup steps (same as release workflow, no Rust needed)
- [x] 4.4 Add `pnpm install` step
- [x] 4.5 Add `pnpm test:run` step
- [x] 4.6 Add `pnpm lint` step
- [x] 4.7 Enable branch protection on `main` in GitHub repo settings and add the PR check job as a required status check

## 5. Verification

- [x] 5.1 Push a version tag (e.g. `v0.1.0`) and confirm the release workflow starts in GitHub Actions
- [x] 5.2 Confirm the test step runs and passes before the build starts
- [x] 5.3 Introduce a failing test locally, tag, and push — confirm the workflow fails before any installer is built
- [x] 5.4 Confirm macOS job produces a `.dmg` artifact attached to the draft release
- [x] 5.5 Confirm Windows job produces `.exe` / `.msi` artifacts attached to the draft release
- [x] 5.6 Open a PR with a failing test — confirm the PR check fails and the merge button is disabled
- [x] 5.7 Open a PR with a lint error — confirm the PR check fails and the merge button is disabled
- [x] 5.8 Open a clean PR — confirm checks pass and merge is allowed
