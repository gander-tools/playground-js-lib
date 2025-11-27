# @gander-tools/playground

## Project Overview

This is a playground project designed for testing and experimenting with multi-system module configurations, linters, tests, and publication workflows across different package registries (npm, JSR). It serves as a learning environment for package development best practices.

## Tech Stack

- **Language**: TypeScript 5.7
- **Build Tool**: pkgroll (Rollup-based)
- **Testing**: Vitest with coverage
- **Linting/Formatting**: Biome 1.9
- **Git Hooks**: Lefthook
- **Release Management**: Release Please (automated via GitHub Actions)
- **Node Version**: ^20 || >=22
- **Optional Dependencies**: Vue 3 Reactivity API

## Project Structure

```
.
├── src/
│   └── index.ts          # Main exports (add, addRef functions)
├── test/                 # Vitest test files
├── dist/                 # Build output (CommonJS & ESM)
├── package.json          # Package configuration
├── tsconfig.json         # TypeScript configuration
├── biome.json           # Biome linter/formatter config
├── cliff.toml           # git-cliff changelog config
└── lefthook.yml         # Git hooks configuration
```

## Core Functionality

The library provides simple utility functions:
- `add(a, b)` - Basic number addition
- `addRef(a, b)` - Reactive addition using Vue's Ref system

## Available Scripts

### Development
- `bun run check` - Run Biome checks (lint + format)
- `bun run check:fix` - Auto-fix Biome issues
- `bun run format` - Check formatting
- `bun run format:fix` - Auto-fix formatting
- `bun run lint` - Run linting
- `bun run lint:fix` - Auto-fix lint issues
- `bun run typecheck` - Run TypeScript type checking

### Testing
- `bun run test` - Run tests in watch mode
- `bun run test:run` - Run tests once
- `bun run test:watch` - Run tests in watch mode
- `bun run test:coverage` - Run tests with coverage report

### Build & Release
- `bun run prepack` - Build package (generates CJS/ESM/types in dist/)
- `bun run publint` - Validate package for publication
- `bun run release` - Manual release with release-it (legacy, use Release Please instead)

## Development Workflow

1. **Making Changes**: Edit files in `src/`
2. **Code Quality**: Run `bun run check:fix` before committing
3. **Testing**: Ensure tests pass with `bun run test:run`
4. **Type Safety**: Verify with `bun run typecheck`
5. **Building**: Test build with `bun run prepack`
6. **Committing**: Use Conventional Commits format (e.g., `feat:`, `fix:`)
7. **Releasing**: Automated via Release Please when merging to `main`

## Module System

The package supports both CommonJS and ESM:
- **CJS**: `dist/index.cjs` with `dist/index.d.cts`
- **ESM**: `dist/index.mjs` with `dist/index.d.mts`

## Git Hooks

Lefthook is configured to run pre-commit checks. Hooks may include linting, formatting, and type checking.

## GitHub Actions

### Version Pinning Requirement

**IMPORTANT**: All GitHub Actions workflows in this repository **MUST** use SHA-pinned action versions for security and reproducibility. This is a repository configuration requirement.

**Example of correct version pinning:**
```yaml
- uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2
- uses: actions/setup-node@39370e3970a6d050c480ffad4ff0ed4d3fdee5af # v4.1.0
```

**Why version pinning is required:**
- **Security**: Prevents malicious code injection through compromised action versions
- **Reproducibility**: Ensures workflows behave consistently over time
- **Compliance**: Repository security policies require SHA-pinned actions

**When adding or updating workflows:**
1. Always pin actions to specific commit SHA (40-character hash)
2. Include a comment with the human-readable version tag (e.g., `# v4.2.2`)
3. Use the same SHA hashes across workflows for consistency
4. Verify the SHA matches the official release before using it

**Standard Actions Used:**
- `actions/checkout`: `11bd71901bbe5b1630ceea73d27597364c9af683` (v4.2.2)
- `actions/setup-node`: `39370e3970a6d050c480ffad4ff0ed4d3fdee5af` (v4.1.0)
- `oven-sh/setup-bun`: `4bc047ad259df6fc24a6c9b0f9a0cb08cf17fbe5` (v2.0.1)
- `denoland/setup-deno`: `be0a6a1c12850f58f0c99d5a4b7f62bb24be0669` (v2.1.0)
- `googleapis/release-please-action`: `16a9c90856f42705d54a6fda1823352bdc62cf38` (v4.4.0)

## Release Process

This project uses **Release Please** for fully automated release management via GitHub Actions.

📖 **For maintainers**: See [RELEASE_PLEASE_MAINTAINER_GUIDE.md](./RELEASE_PLEASE_MAINTAINER_GUIDE.md) for detailed workflow instructions, troubleshooting, and practical examples.

### How It Works

1. **Automatic PR Creation**: When you merge commits to `main`, Release Please automatically:
   - Analyzes commit messages (using Conventional Commits format)
   - Determines the next version number (semver)
   - Updates `CHANGELOG.md` with new entries
   - Creates/updates a Release PR

2. **Release Triggers**: When you merge the Release PR:
   - Automatically runs all quality checks (tests, typecheck, lint)
   - Builds the package
   - Publishes to npm with provenance
   - Publishes to JSR
   - Creates a GitHub release with the version tag

### Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

- `feat: add new feature` → Patch version bump (0.8.x) while in pre-1.0
- `fix: resolve bug` → Patch version bump (0.8.x)
- `feat!: breaking change` → Minor version bump (0.x.0) while in pre-1.0
- `chore: update deps` → No release (internal changes)
- `docs: update readme` → Included in changelog

**Breaking changes**: Add `!` after the type or include `BREAKING CHANGE:` in commit body.

### Version Control Strategy

This project uses **controlled versioning** to prevent aggressive version bumps:

- **Pre-1.0 Protection**: While version is below 1.0.0:
  - `feat:` commits bump only **patch** (0.8.0 → 0.8.1)
  - `feat!:` or `BREAKING CHANGE:` bumps only **minor** (0.8.0 → 0.9.0)
  - Major version (1.0.0) requires **manual intervention**

- **Manual Version Control**: To change minor/major version:
  1. Edit `.release-please-manifest.json` and set desired version (e.g., `"0.9.0"` or `"1.0.0"`)
  2. Commit and push: `git add . && git commit -m "chore: prepare for version X.Y.Z" && git push`
  3. Release Please will use the new version as baseline

- **Configuration**: See `bump-minor-pre-major` and `bump-patch-for-minor-pre-major` options in `release-please-config.json`

### Release Workflow

1. **Development**:
   - Make changes and commit with conventional commit messages
   - Push to `main` branch

2. **Release Please automatically**:
   - Creates/updates a Release PR
   - Accumulates changes until you're ready to release

3. **Publishing**:
   - Review and merge the Release PR
   - GitHub Actions automatically publishes to npm and JSR

### Configuration Files

- `.github/workflows/release-please.yml` - GitHub Actions workflow
- `release-please-config.json` - Release Please configuration
- `.release-please-manifest.json` - Current version tracking
- `RELEASE_PLEASE_MAINTAINER_GUIDE.md` - Maintainer workflow guide

### Advanced Release Please Control

#### Draft Pull Requests (Preventing Accidental Merges)

To prevent accidentally merging a Release PR, enable **draft mode** in `release-please-config.json`:

```json
{
  "draft-pull-request": true,  // Change from false to true
  "packages": {
    ".": {
      // ... your configuration
    }
  }
}
```

This makes Release Please create PRs as **drafts** that must be manually marked as "Ready for review" before merging. Great for projects where you want an extra safety check.

**Current setting**: `draft-pull-request: false` (PRs are immediately mergeable)

#### Rejecting an Aggressive Version Bump

If Release Please creates a PR with a version that's too aggressive (e.g., suggesting 1.0.0 when you're not ready):

1. **Close the PR** - Click "Close pull request" on GitHub
2. **Remove the label** - Remove the `autorelease: pending` label from the closed PR
3. **Adjust configuration** - Update `release-please-config.json` with appropriate controls (e.g., `bump-minor-pre-major`)
4. **Push new commits** - Release Please will create a new PR with correct version on next push to `master`

**Important**: If you don't remove the `autorelease: pending` label, Release Please won't create new PRs (it checks for existing labeled PRs).

#### What Happens to Existing PRs After Configuration Changes?

**Existing open Release PRs will NOT automatically update their proposed version** when you change configuration options like `bump-minor-pre-major`.

**Best practice after config changes:**
1. Close the existing Release PR
2. Remove the `autorelease: pending` label
3. Make a new commit to `master` (even a small change like updating docs)
4. Release Please will create a fresh PR with the new versioning rules

#### Maintaining Parallel Release Branches (0.x and 1.x)

To maintain multiple major versions simultaneously (e.g., bug fixes for 0.x while developing 1.x):

1. **Create separate branches**:
   ```bash
   git checkout -b 0.x    # For 0.x maintenance
   git checkout -b 1.x    # For 1.x development
   ```

2. **Create separate workflow files** for each branch:

   `.github/workflows/release-0.x.yml`:
   ```yaml
   on:
     push:
       branches:
         - 0.x
   jobs:
     release-please:
       steps:
         - uses: googleapis/release-please-action@...
           with:
             target-branch: 0.x
             release-type: node
   ```

   `.github/workflows/release-1.x.yml`:
   ```yaml
   on:
     push:
       branches:
         - 1.x
   jobs:
     release-please:
       steps:
         - uses: googleapis/release-please-action@...
           with:
             target-branch: 1.x
             release-type: node
   ```

3. **Manage separately**:
   - Each branch maintains its own `.release-please-manifest.json`
   - Cherry-pick or backport bug fixes between branches as needed
   - Release Please creates independent PRs for each branch

**Note**: Release Please doesn't handle branch management or backporting - you must manually manage which commits go to which branches.

#### Label System and PR Management

Release Please uses labels to track PR state:
- `autorelease: pending` - PR is waiting to be merged
- `autorelease: triggered` - Release is in progress

**Best practices**:
- Always remove labels when closing PRs manually
- Check for existing labeled PRs before expecting new ones
- Use draft mode if you want to prevent quick accidental merges

### Manual Release (Legacy)

The old `bun run release` command (using release-it) is still available but deprecated in favor of the automated Release Please workflow.

## Notes for AI Assistants

- This is a **learning/experimental project** - feel free to suggest improvements
- Always run `bun run check:fix` and `bun run typecheck` before committing
- **Use Conventional Commits format** for all commit messages (e.g., `feat:`, `fix:`, `chore:`)
- **Version bumps are controlled**: `feat:` → patch only, `feat!:` → minor only (pre-1.0)
- To bump minor/major version, manually edit `.release-please-manifest.json`
- **After changing Release Please config**: Close existing Release PR, remove `autorelease: pending` label, push new commit
- Set `draft-pull-request: true` in config if you want PRs as drafts to prevent accidental merges
- **For detailed Release Please workflows**: Refer to `RELEASE_PLEASE_MAINTAINER_GUIDE.md`
- Maintain compatibility with Node 20+ and Node 22+
- Keep both CJS and ESM exports working
- Update tests when adding new functionality
- Follow existing code style (managed by Biome)
- Releases are fully automated via Release Please - just merge to main with proper commit messages
