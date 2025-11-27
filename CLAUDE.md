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

## Release Process

This project uses **Release Please** for fully automated release management via GitHub Actions.

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

- `feat: add new feature` → Minor version bump (0.x.0)
- `fix: resolve bug` → Patch version bump (0.0.x)
- `feat!: breaking change` → Major version bump (x.0.0)
- `chore: update deps` → No release (internal changes)
- `docs: update readme` → Included in changelog

**Breaking changes**: Add `!` after the type or include `BREAKING CHANGE:` in commit body.

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

### Manual Release (Legacy)

The old `bun run release` command (using release-it) is still available but deprecated in favor of the automated Release Please workflow.

## Notes for AI Assistants

- This is a **learning/experimental project** - feel free to suggest improvements
- Always run `bun run check:fix` and `bun run typecheck` before committing
- **Use Conventional Commits format** for all commit messages (e.g., `feat:`, `fix:`, `chore:`)
- Maintain compatibility with Node 20+ and Node 22+
- Keep both CJS and ESM exports working
- Update tests when adding new functionality
- Follow existing code style (managed by Biome)
- Releases are fully automated via Release Please - just merge to main with proper commit messages
