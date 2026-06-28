## 1. Release Workflow File Setup

- [x] 1.1 Create `.github/workflows/release.yml` with `on: push: tags: ['v*']` trigger
- [x] 1.2 Define a matrix strategy with `os: [macos-latest, windows-latest]`

## 2. Release CI Environment

- [x] 2.1 Add step to install pnpm via `pnpm/action-setup` (match version in `package.json` `packageManager` field or use `latest`)
- [x] 2.2 Add step to set up Node via `actions/setup-node` with `cache: 'pnpm'`
- [x] 2.3 Add step to install Rust stable toolchain via `dtolnay/rust-toolchain@stable`

## 3. Release Build

- [ ] 3.1 Add `pnpm install` step to install frontend dependencies
- [ ] 3.2 Add `pnpm test:run` step before the Tauri build; configure it to fail the job on non-zero exit
- [ ] 3.3 Add `tauri-apps/tauri-action` step configured to build and collect installers (runs only if tests pass)
- [ ] 3.4 Set `tagName` to use the app version from `tauri.conf.json` (e.g. `app-v__VERSION__`)
- [ ] 3.5 Set `releaseDraft: true` so releases are created as drafts

## 4. PR Check Workflow

- [ ] 4.1 Create `.github/workflows/pr-checks.yml` with `on: pull_request: branches: [main]` trigger
- [ ] 4.2 Set runner to `ubuntu-latest`
- [ ] 4.3 Add pnpm + Node setup steps (same as release workflow, no Rust needed)
- [ ] 4.4 Add `pnpm install` step
- [ ] 4.5 Add `pnpm test:run` step
- [ ] 4.6 Add `pnpm lint` step
- [ ] 4.7 Enable branch protection on `main` in GitHub repo settings and add the PR check job as a required status check

## 5. Verification

- [ ] 5.1 Push a version tag (e.g. `v0.1.0`) and confirm the release workflow starts in GitHub Actions
- [ ] 5.2 Confirm the test step runs and passes before the build starts
- [ ] 5.3 Introduce a failing test locally, tag, and push — confirm the workflow fails before any installer is built
- [ ] 5.4 Confirm macOS job produces a `.dmg` artifact attached to the draft release
- [ ] 5.5 Confirm Windows job produces `.exe` / `.msi` artifacts attached to the draft release
- [ ] 5.6 Open a PR with a failing test — confirm the PR check fails and the merge button is disabled
- [ ] 5.7 Open a PR with a lint error — confirm the PR check fails and the merge button is disabled
- [ ] 5.8 Open a clean PR — confirm checks pass and merge is allowed
