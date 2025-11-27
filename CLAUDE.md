# @gander-tools/playground

## Project Overview

This is a playground project designed for testing and experimenting with multi-system module configurations, linters, tests, and publication workflows across different package registries (npm, JSR). It serves as a learning environment for package development best practices.

## Tech Stack

- **Language**: TypeScript 5.7
- **Build Tool**: pkgroll (Rollup-based)
- **Testing**: Vitest with coverage
- **Linting/Formatting**: Biome 1.9
- **Git Hooks**: Lefthook
- **Release Management**: release-it with git-cliff for changelog generation
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
- `bun run release` - Create new version with release-it

## Development Workflow

1. **Making Changes**: Edit files in `src/`
2. **Code Quality**: Run `bun run check:fix` before committing
3. **Testing**: Ensure tests pass with `bun run test:run`
4. **Type Safety**: Verify with `bun run typecheck`
5. **Building**: Test build with `bun run prepack`
6. **Releasing**: Use `bun run release` for version management

## Module System

The package supports both CommonJS and ESM:
- **CJS**: `dist/index.cjs` with `dist/index.d.cts`
- **ESM**: `dist/index.mjs` with `dist/index.d.mts`

## Git Hooks

Lefthook is configured to run pre-commit checks. Hooks may include linting, formatting, and type checking.

## Release Process

This project uses:
- **release-it** for version bumping and git tag management
- **git-cliff** for automated changelog generation
- Package published to npm under `@gander-tools/playground`

## Notes for AI Assistants

- This is a **learning/experimental project** - feel free to suggest improvements
- Always run `bun run check:fix` and `bun run typecheck` before committing
- Maintain compatibility with Node 20+ and Node 22+
- Keep both CJS and ESM exports working
- Update tests when adding new functionality
- Follow existing code style (managed by Biome)
