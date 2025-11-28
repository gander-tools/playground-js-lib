# @gander-tools/playground

## Project Overview

Playground project for testing TypeScript library development with automated releases to npm/JSR. Learning environment for package development best practices with multi-system module support.

**Core functionality**: Simple utility functions (`add`, `addRef` with Vue Reactivity)

## ⚠️ CONVENTIONAL COMMITS - REQUIRED

This repository **strictly enforces** [Conventional Commits](https://www.conventionalcommits.org/) format. **All commits and PR titles MUST follow this format or they will be rejected.**

### Why This Matters

Conventional Commits enable:
- **Automated releases** via Release Please (analyzes commits → determines version → publishes)
- **Automatic changelog generation** organized by commit type
- **Semantic versioning control** (different commit types = different version bumps)
- **Clear project history** for reviews and maintenance

### Allowed Commit Types

- `feat:` - New feature (→ **patch bump** in pre-1.0, e.g., 0.8.0 → 0.8.1)
- `fix:` - Bug fix (→ **patch bump**)
- `feat!:` or `BREAKING CHANGE:` - Breaking change (→ **minor bump** in pre-1.0, e.g., 0.8.0 → 0.9.0)
- `docs:` - Documentation only
- `style:` - Code style/formatting (no logic changes)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Test changes
- `build:` - Build system/dependencies
- `ci:` - CI configuration
- `chore:` - Other changes (no src/test)
- `revert:` - Revert previous commit

### Format Rules

**Structure**: `type: description` (lowercase type, colon + space, lowercase description)

**Valid Examples:**
```bash
✅ feat: add calculation caching
✅ fix: resolve memory leak in cache
✅ feat!: redesign public API (breaking)
✅ docs: update installation guide
✅ chore: upgrade dependencies
```

**Invalid Examples:**
```bash
❌ Added new feature          # missing type
❌ feat Add feature           # missing colon
❌ FEAT: add feature          # uppercase type
❌ feat:add feature           # missing space after colon
❌ feat: Add feature          # uppercase description
```

### Multi-Layer Enforcement

**1. Local (Lefthook + commitlint)**
- Validates commit messages immediately on `git commit`
- Invalid commits are rejected before they're created
- Config: `commitlint.config.js`, `lefthook.yml`

**2. Remote (GitHub Actions)**
- `.github/workflows/validate-commits.yml` - Validates ALL commit messages in PRs (**required check**)
- `.github/workflows/validate-pr-title.yml` - Validates PR titles (**required check**)
- PRs cannot merge if validation fails

**3. Cannot Be Bypassed**
- Local: `git commit --no-verify` skips local hooks, but...
- Remote: GitHub Actions will still reject on push
- Fix locally: `git commit --amend -m "feat: correct message"`

### Version Bump Strategy

**Pre-1.0 (current):**
- `feat:` → patch (0.10.2 → 0.10.3)
- `fix:` → patch (0.10.2 → 0.10.3)
- `feat!:` → minor (0.10.2 → 0.11.0)
- Major (1.0.0) requires manual edit of `.release-please-manifest.json`

**Configuration**: `bump-minor-pre-major` + `bump-patch-for-minor-pre-major` in `release-please-config.json`

### ⚠️ GitHub Merge Commit Configuration Required

**Issue:** GitHub's default merge commit format (`Merge pull request #102 from...`) does not follow Conventional Commits, causing Release Please parsing errors.

**Solution:** Configure GitHub repository settings to include PR titles in merge commits:

1. Go to **Settings** → **General** → **Pull Requests**
2. Under "Allow merge commits", set default to **"pull request title"**
3. This changes merge commits from `Merge pull request #102...` to `feat: description (#102)`

**Alternative:** Use "Squash and merge" strategy (recommended for most PRs):
- Eliminates merge commits entirely
- PR title becomes the commit message (already validated)
- Cleaner git history

**See:** [`.github/MERGE_COMMIT_SETUP.md`](.github/MERGE_COMMIT_SETUP.md) for detailed setup instructions.

## Tech Stack & Tools

- **Language**: TypeScript 5.7, Node ^20 || >=22
- **Build**: pkgroll (Rollup-based) → CJS/ESM dual exports
- **Testing**: Vitest with coverage
- **Linting**: Biome 1.9 (lint + format)
- **Git Hooks**: Lefthook (pre-commit + commit-msg)
- **Releases**: Release Please (GitHub Actions)
- **Optional**: Vue 3 Reactivity API

## Available Scripts

**Development:**
- `npm run check` / `check:fix` - Biome lint + format
- `npm run typecheck` - TypeScript validation
- `npm run lint` / `lint:fix` - Linting only
- `npm run format` / `format:fix` - Formatting only

**Testing:**
- `npm test` - Watch mode
- `npm run test:run` - Run once
- `npm run test:coverage` - With coverage

**Build:**
- `npm run prepack` - Build CJS/ESM to dist/
- `npm run publint` - Validate package

## Package Lock Files

**⚠️ IMPORTANT:** This project **does NOT maintain package lock files** (`package-lock.json`, `npm-shrinkwrap.json`).

**Why:**
- Learning/experimental project - dependencies update frequently
- Simpler workflow for quick iterations
- No production deployments requiring lock file stability

**Implications:**
- Always use `npm install` (NOT `npm ci`) - in local development and CI/CD
- `npm ci` will fail because it requires a lock file
- GitHub Actions workflows use `npm install` for dependency installation
- Dependency versions are controlled by `package.json` semver ranges

**In workflows:**
```yaml
- name: Install dependencies
  run: npm install  # NOT npm ci
```

## Development Workflow

1. Edit files in `src/`
2. Run `npm run check:fix` (auto-fix style issues)
3. Run `npm run typecheck` (verify types)
4. Run `npm run test:run` (verify tests pass)
5. **Commit with Conventional Commits format** (e.g., `feat: add feature`)
6. Push to branch → GitHub validates commits
7. Merge to `main` → Release Please creates release PR
8. Merge release PR → Auto-publish to npm/JSR

## Project Structure

```
.
├── src/index.ts              # Main exports
├── test/                     # Vitest tests
├── dist/                     # Build output (CJS/ESM)
├── commitlint.config.js      # Commit validation rules
├── lefthook.yml              # Git hooks (pre-commit + commit-msg)
├── biome.json                # Linter/formatter config
├── release-please-config.json # Release automation config
└── .release-please-manifest.json # Version tracking
```

## Git Hooks (Lefthook)

**Configured hooks** (auto-installed with `npm install`):
1. **`pre-commit`** - Runs `npm run check` (Biome lint + format)
2. **`commit-msg`** - Runs `commitlint` (validates Conventional Commits format)

**Manual install**: `npx lefthook install`

## Claude Code Hooks

Configured in `.claude/settings.json` for automated development environment:

**SessionStart Hook:**
- Runs `npm install` on session start (timeout: 300s)

**PostToolUse Hook:**
- Runs `npm run check` after Write/Edit operations (timeout: 120s)
- Provides immediate code quality feedback

**Local customization**: Create `.claude/settings.local.json` for overrides (not version-controlled)

## GitHub Actions

**Workflows:**
- `test-and-build.yml` - Tests, typecheck, lint, build validation (runs on all PRs)
- `release-please.yml` - Automated releases
- `validate-commits.yml` - Validates commit messages (**required check**)
- `validate-pr-title.yml` - Validates PR titles (**required check**)

**Version Pinning (Required):**
All actions MUST use SHA-pinned versions for security:
```yaml
- uses: actions/checkout@1af3b93b6815bc44a9784bd300feb67ff0d1eeb3 # v6.0.0
```

**Standard Actions:**
- `actions/checkout`: `1af3b93b6815bc44a9784bd300feb67ff0d1eeb3` (v6.0.0)
- `actions/setup-node`: `2028fbc5c25fe9cf00d9f06a71cc4710d4507903` (v6.0.0)
- `googleapis/release-please-action`: `16a9c90856f42705d54a6fda1823352bdc62cf38` (v4.4.0)
- `amannn/action-semantic-pull-request`: `0723387faaf9b38adef4775cd42cfd5155ed6017` (v5.5.3)

**Branch Protection (Recommended):**
Configure `master` branch to require passing `Test & Build` check before merging. This prevents Release Please PRs with failing tests/linting from being merged and blocking releases.

## NPM Publishing (Trusted Publishers)

**⚠️ IMPORTANT:** This project uses **npm Trusted Publishers** (OIDC-based authentication), **NOT token-based authentication**.

**What this means:**
- **NO `NPM_TOKEN` secret required** - npm trusts GitHub Actions directly via OIDC
- Workflow uses `id-token: write` permission to authenticate with npm
- More secure than token-based auth (no long-lived secrets, automatic rotation)

**Configuration:**
1. **On npmjs.com:** Configure trusted publisher for `@gander-tools/playground`:
   - Package Settings → Publishing Access → Trusted Publishers
   - Add: `gander-tools/playground-js-lib` repository, workflow `release-please.yml`

2. **In workflow:** Already configured correctly:
   ```yaml
   permissions:
     id-token: write  # Required for OIDC auth with npm

   - uses: actions/setup-node@sha
     with:
       node-version: "22"
       # registry-url NOT needed for Trusted Publishers with OIDC
       # Removing it prevents deprecated 'always-auth=true' warnings

   - run: npm install -g npm@11.5.1  # Required for Trusted Publishers

   - run: npm publish --provenance --access public
   ```

**Key points:**
- `--provenance` flag is **required** for trusted publishers (generates attestation)
- **npm >= 11.5.1 required** for Trusted Publishers support
- Workflow must have `id-token: write` permission
- **DO NOT use `registry-url`** in setup-node (causes deprecated warnings)
- **DO NOT use `always-auth`** or `scope`** (not needed with OIDC)
- No secrets needed in GitHub repository settings
- Publishes only from `master` branch via `release-please.yml` workflow

**⚠️ CRITICAL: npm Version Requirement**

npm Trusted Publishers **requires npm >= 11.5.1**. This was the root cause of initial publishing failures (fixed in PR #115).

**The Problem:**
- Node.js 22 ships with npm < 11.5.1 by default
- Older npm versions don't support OIDC-based Trusted Publishers
- Even with correct `id-token: write` and `--provenance` flags, publishing silently fails

**The Solution:**
```yaml
- name: Install latest npm
  run: npm install -g npm@11.5.1

- name: Verify npm >= 11.5.1 for Trusted Publishers
  run: |
    CURRENT_NPM=$(npm --version)
    if [ "$(printf '%s\n' "11.5.1" "$CURRENT_NPM" | sort -V | head -n1)" = "11.5.1" ]; then
      echo "✓ npm version $CURRENT_NPM is sufficient (>= 11.5.1)"
    else
      echo "❌ Error: npm version $CURRENT_NPM is too old"
      exit 1
    fi
```

**Additional fixes applied:**
- Removed `registry-url` from `setup-node` (causes deprecated `always-auth=true` warnings in npm 11+)
- Removed `scope` and `always-auth` parameters (not needed with OIDC)
- Upgraded to Node 22 and actions v6 for better compatibility

**See:** [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for detailed problem analysis and solution.

**⚠️ Common Trusted Publisher issues:**
- **Workflow filename must match EXACTLY** - npm checks `.github/workflows/release-please.yml` path
- **Repository owner/name must match** - verify `gander-tools/playground-js-lib` on npmjs.com
- **Environment name** - if set in trusted publisher config, must match workflow's `environment:` setting
- **Branch restrictions** - if configured, publish only works from specified branches

## Release Process (Release Please)

**Fully automated** via GitHub Actions. See [RELEASE_PLEASE_MAINTAINER_GUIDE.md](./RELEASE_PLEASE_MAINTAINER_GUIDE.md) for detailed instructions.

**How it works:**
1. Merge commits to `main` with Conventional Commits format
2. Release Please analyzes commits → creates/updates Release PR with changelog
3. Merge Release PR → auto-publishes to npm/JSR + creates GitHub release

**Key config files:**
- `release-please-config.json` - Configuration (version bump rules)
- `.release-please-manifest.json` - Current version tracking

**Version control:**
- To bump to specific version: Edit `.release-please-manifest.json` manually
- Commit changes: `git commit -m "chore: prepare for version X.Y.Z"`
- Release Please uses new version as baseline

**Rejecting aggressive version bump:**
1. Close the Release PR on GitHub
2. Remove `autorelease: pending` label
3. Update `release-please-config.json` with version controls
4. Push new commit → Release Please creates fresh PR

**Draft mode:** Set `"draft-pull-request": true` in config to create PRs as drafts (prevents accidental merges)

**Labels:**
- `autorelease: pending` - PR waiting to merge
- `autorelease: triggered` - Release in progress

## Notes for AI Assistants

**⚠️ CRITICAL - Conventional Commits:**
- **ALL commits MUST follow Conventional Commits format** (e.g., `feat: description`, `fix: description`)
- Enforced locally (Lefthook + commitlint) and remotely (GitHub Actions)
- **Cannot be bypassed** - invalid commits will be rejected
- PR titles must also follow format
- Format: lowercase type, colon + space, lowercase description
- `feat:` → patch, `feat!:` → minor (pre-1.0), major requires manual edit of `.release-please-manifest.json`

**Development:**
- Learning/experimental project - suggest improvements freely
- Use `npm` (not `bun`) for all commands in Claude Code
- **ALWAYS use `npm install` (NEVER `npm ci`)** - project does not maintain lock files
- Claude Code hooks: SessionStart runs `npm install`, PostToolUse runs `npm run check`
- Always run `npm run check:fix` + `npm run typecheck` before committing
- Maintain Node 20+/22+ compatibility
- Keep CJS/ESM dual exports working
- Update tests for new functionality
- Follow Biome code style

**Release workflow:**
- Releases fully automated via Release Please
- Merge to `main` with proper commit messages → Release PR created
- Merge Release PR → auto-publish to npm/JSR
- See `RELEASE_PLEASE_MAINTAINER_GUIDE.md` for details

**Configuration changes:**
- After changing `release-please-config.json`: Close PR, remove `autorelease: pending` label, push new commit
- Enable `draft-pull-request: true` to prevent accidental merges
- Set up branch protection on `master` with required `Test & Build` check
