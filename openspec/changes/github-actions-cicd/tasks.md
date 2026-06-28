## 1. Workflow File Setup

- [ ] 1.1 Create `.github/workflows/release.yml` with `on: push: tags: ['v*']` trigger
- [ ] 1.2 Define a matrix strategy with `os: [macos-latest, windows-latest]`

## 2. CI Environment

- [ ] 2.1 Add step to install pnpm via `pnpm/action-setup` (match version in `package.json` `packageManager` field or use `latest`)
- [ ] 2.2 Add step to set up Node via `actions/setup-node` with `cache: 'pnpm'`
- [ ] 2.3 Add step to install Rust stable toolchain via `dtolnay/rust-toolchain@stable`

## 3. Build

- [ ] 3.1 Add `pnpm install` step to install frontend dependencies
- [ ] 3.2 Add `pnpm test:run` step before the Tauri build; configure it to fail the job on non-zero exit
- [ ] 3.3 Add `tauri-apps/tauri-action` step configured to build and collect installers (runs only if tests pass)
- [ ] 3.4 Set `tagName` to use the app version from `tauri.conf.json` (e.g. `app-v__VERSION__`)
- [ ] 3.5 Set `releaseDraft: true` so releases are created as drafts

## 4. Verification

- [ ] 4.1 Push a version tag (e.g. `v0.1.0`) and confirm the workflow starts in GitHub Actions
- [ ] 4.2 Confirm the test step runs and passes before the build starts
- [ ] 4.3 Introduce a failing test locally, tag, and push — confirm the workflow fails before any installer is built
- [ ] 4.4 Confirm macOS job produces a `.dmg` artifact attached to the draft release
- [ ] 4.5 Confirm Windows job produces `.exe` / `.msi` artifacts attached to the draft release
- [ ] 4.6 Confirm pushing a branch commit (including to `main`) does NOT trigger the workflow
