# Troubleshooting Guide

This document contains solutions to common problems encountered in this project.

## Table of Contents

- [Code Quality, Security & Validation Tools Overview](#code-quality-security--validation-tools-overview)
- [Missing Dependencies and Code Formatting Issues](#missing-dependencies-and-code-formatting-issues)
- [Conventional Commits Not Enforced](#conventional-commits-not-enforced)
- [npm Publish Failures with Trusted Publishers](#npm-publish-failures-with-trusted-publishers)
- [Lefthook Pre-Commit Hook Failures](#lefthook-pre-commit-hook-failures)
- [GitHub Actions SHA Pinning Issues](#github-actions-sha-pinning-issues)
- [Security Scanning Workflow Conflicts](#security-scanning-workflow-conflicts)
- [Release Please Configuration Issues](#release-please-configuration-issues)
- [jsr.json Formatting Blocking Releases](#jsrjson-formatting-blocking-releases)
- [Format-Files Job Not Running](#format-files-job-not-running)
- [Automerge Accidentally Merging Release PRs](#automerge-accidentally-merging-release-prs)
- [Shellcheck Errors in Workflows](#shellcheck-errors-in-workflows)
- [Markdownlint Blocking CI](#markdownlint-blocking-ci)
- [Release Please Merge Commit Parsing](#release-please-merge-commit-parsing)

---

## Code Quality, Security & Validation Tools Overview

This project implements comprehensive code quality, security scanning, and validation layers
to ensure code correctness, security, and consistency. This section documents all tools,
their purpose, configuration, and integration points.

### Why Multi-Layer Validation?

**Problem:**
- Code quality issues slip through without automated checks
- Security vulnerabilities introduced via dependencies
- Inconsistent code formatting across contributors
- Invalid configurations break builds
- Supply chain attacks via compromised dependencies

**Solution:**
- **Multi-layer defense** - validate at every stage (local → PR → merge → release)
- **Automated enforcement** - cannot be bypassed
- **Immediate feedback** - catch issues early in development cycle
- **Comprehensive coverage** - code, dependencies, workflows, packages, security

### Validation Layers

```
┌──────────────────────────────────────────────────────────────────┐
│ LOCAL DEVELOPMENT                                                 │
├──────────────────────────────────────────────────────────────────┤
│ 1. Claude Code Hooks                                             │
│    ├─ SessionStart: npm install (ensure dependencies)            │
│    └─ PostToolUse: npm run check (Biome formatting/linting)      │
│                                                                   │
│ 2. Lefthook Git Hooks                                            │
│    ├─ pre-commit: npm run check (Biome)                          │
│    └─ commit-msg: commitlint (Conventional Commits)              │
│                                                                   │
│ 3. npm Scripts (manual validation)                               │
│    ├─ npm run check (Biome lint + format)                        │
│    ├─ npm run typecheck (TypeScript)                             │
│    ├─ npm test (Vitest unit tests)                               │
│    └─ npm run publint (package validation)                       │
├──────────────────────────────────────────────────────────────────┤
│ PULL REQUEST VALIDATION (GitHub Actions)                         │
├──────────────────────────────────────────────────────────────────┤
│ 4. Code Quality Checks (.github/workflows/test-and-build.yml)   │
│    ├─ TypeScript compilation (tsc --noEmit)                      │
│    ├─ Biome linting (npm run lint)                               │
│    ├─ Biome formatting (npm run format)                          │
│    ├─ Vitest tests (npm run test:run)                            │
│    ├─ Code coverage (vitest --coverage)                          │
│    └─ Build validation (npm run prepack)                         │
│                                                                   │
│ 5. Commit Validation                                             │
│    ├─ validate-commits.yml (all commits in PR)                   │
│    └─ validate-pr-title.yml (PR title format)                    │
│                                                                   │
│ 6. Security Scanning                                             │
│    ├─ dependency-review.yml (vulnerable dependencies)            │
│    ├─ codecov.yml (code coverage reports)                        │
│    └─ harden-runner (network egress auditing)                    │
│                                                                   │
│ 7. Configuration Validation                                      │
│    ├─ actionlint.yml (GitHub Actions workflows)                  │
│    └─ markdownlint.yml (Markdown documentation)                  │
├──────────────────────────────────────────────────────────────────┤
│ CONTINUOUS MONITORING (Scheduled/Push to master)                 │
├──────────────────────────────────────────────────────────────────┤
│ 8. Supply Chain Security                                         │
│    ├─ scorecard.yml (OpenSSF Scorecard, weekly)                  │
│    └─ sbom.yml (Software Bill of Materials)                      │
│                                                                   │
│ 9. Package Validation                                            │
│    └─ publint (pre-publish package structure validation)         │
└──────────────────────────────────────────────────────────────────┘
```

---

## 1. Code Quality & Formatting

### 1.1 Biome (Linter + Formatter)

**Purpose:** Fast, unified linter and formatter for JavaScript/TypeScript (replaces ESLint + Prettier)

**Configuration:** `biome.json`

**What it validates:**
- Code style (indentation, quotes, semicolons, etc.)
- Code quality (unused variables, console.log, etc.)
- Formatting (line length, trailing commas, etc.)

**Integration points:**

**Local:**
```bash
# Check (no fixes)
npm run check

# Auto-fix
npm run check:fix

# Lint only
npm run lint
npm run lint:fix

# Format only
npm run format
npm run format:fix
```

**Claude Code Hooks:** `.claude/settings.json`
```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "command": "cd \"$CLAUDE_PROJECT_DIR\" && npm run check"
      }]
    }]
  }
}
```

**Lefthook:** `lefthook.yml`
```yaml
pre-commit:
  jobs:
    - run: npm run check
```

**GitHub Actions:** `.github/workflows/test-and-build.yml`
```yaml
- name: Run linter
  run: npm run lint

- name: Check code formatting
  run: npm run format
```

**Why Biome?**
- ✅ 100x faster than ESLint + Prettier
- ✅ Single tool (less configuration)
- ✅ TypeScript-first
- ✅ Compatible with Prettier configs (migration friendly)

### 1.2 TypeScript Type Checking

**Purpose:** Static type analysis, catch type errors before runtime

**Configuration:** `tsconfig.json`

**What it validates:**
- Type correctness
- Type inference
- Strict null checks
- No implicit any
- Module resolution

**Integration points:**

**Local:**
```bash
npm run typecheck
```

**GitHub Actions:** `.github/workflows/test-and-build.yml`
```yaml
- name: Run type check
  run: npm run typecheck  # tsc --noEmit
```

**Why separate from build?**
- Faster feedback (no compilation)
- Catches type errors without generating output
- Used in CI before build step

### 1.3 Vitest (Testing + Coverage)

**Purpose:** Unit testing framework with built-in coverage

**Configuration:** `vitest.config.ts`

**What it validates:**
- Unit test correctness
- Code coverage (statements, branches, functions, lines)
- Edge cases and error handling

**Integration points:**

**Local:**
```bash
# Watch mode (development)
npm test

# Run once
npm run test:run

# With coverage
npm run test:coverage
```

**GitHub Actions:** `.github/workflows/test-and-build.yml`
```yaml
- name: Run tests
  run: npm run test:run

- name: Generate coverage
  run: npm run test:coverage
```

**Coverage reporting:** Codecov uploads coverage to https://codecov.io

### 1.4 Publint (Package Validation)

**Purpose:** Validates npm package structure and exports before publishing

**Configuration:** None (uses package.json)

**What it validates:**
- Dual package (CJS/ESM) exports correctness
- package.json fields (main, module, types, exports)
- Missing files in dist/
- Incorrect TypeScript declaration files

**Integration points:**

**Local:**
```bash
npm run publint
```

**Runs automatically:** Before `npm publish` (prepack script validates build output)

**Why critical for this project?**
- Dual CJS/ESM support required
- Complex exports configuration
- TypeScript declaration files must match exports

---

## 2. Security Scanning

### 2.1 Dependency Review

**Purpose:** Scans pull requests for vulnerable or malicious dependencies

**Workflow:** `.github/workflows/dependency-review.yml`

**What it scans:**
- Known vulnerabilities in dependencies (via GitHub Advisory Database)
- Dependency license compatibility
- Malicious packages
- Supply chain risks

**Configuration:**
```yaml
fail-on-severity: moderate  # Blocks PR on moderate+ severity
comment-summary-in-pr: always  # Posts summary comment
```

**Triggers:** Every pull request

**How it works:**
1. Compares dependencies in PR vs base branch
2. Queries GitHub Advisory Database for vulnerabilities
3. Fails if moderate/high/critical vulnerabilities found
4. Posts summary comment with details

**Example output:**
```
🔍 Dependency Review Results:
❌ 1 vulnerability found in dependency changes

Package: lodash@4.17.15
Severity: High
Advisory: Prototype Pollution
Fix: Update to lodash@4.17.21
```

### 2.2 OpenSSF Scorecard

**Purpose:** Comprehensive supply chain security assessment

**Workflow:** `.github/workflows/scorecard.yml`

**What it evaluates:**
- Branch protection settings
- Code review practices
- CI/CD test coverage
- Dependency update tools (Dependabot)
- Signed releases
- Vulnerabilities disclosure
- Binary artifacts
- Dangerous workflow patterns
- Token permissions

**Triggers:**
- Weekly (Saturdays at 00:00 UTC)
- Push to master
- Branch protection rule changes

**Scoring:** Rates project 0-10 on each metric

**Results:** Uploaded to GitHub Security tab as SARIF

**View results:**
- GitHub Security tab → Code scanning
- OpenSSF Scorecard badge (optional)

### 2.3 SBOM (Software Bill of Materials)

**Purpose:** Generate comprehensive list of all dependencies for supply chain transparency

**Workflow:** `.github/workflows/sbom.yml`

**What it generates:**
- Complete dependency tree
- Licenses for all dependencies
- Version information
- Package provenance

**Format:** SPDX (Software Package Data Exchange)

**Triggers:** Push to master, releases

**Use cases:**
- Compliance audits
- License compliance verification
- Supply chain risk assessment
- Vulnerability impact analysis

### 2.4 Codecov (Code Coverage)

**Purpose:** Track and visualize test coverage over time

**Workflow:** `.github/workflows/codecov.yml`

**What it tracks:**
- Line coverage
- Branch coverage
- Function coverage
- Coverage trends over time
- PR coverage diff

**Integration:**
- Uploads coverage from Vitest
- Comments on PRs with coverage changes
- Blocks PR if coverage drops (configurable)

**Configuration:** `codecov.yml` (in repo root)

### 2.5 Harden-Runner (Runtime Network Monitoring)

**Purpose:** Monitor and audit network egress from GitHub Actions runners

**Integration:** Added to all critical workflows

**Configuration:**
```yaml
- name: Harden Runner
  uses: step-security/harden-runner@v2.10.1
  with:
    disable-sudo: true
    egress-policy: audit  # or 'block'
```

**What it does:**
- **Audit mode:** Logs all outbound network connections
- **Block mode:** Blocks unauthorized network egress
- Detects supply chain attacks (e.g., compromised actions)
- Monitors for data exfiltration attempts

**Benefits:**
- Detect compromised GitHub Actions
- Prevent supply chain attacks
- Audit trail of all network activity
- Zero-trust security model

---

## 3. Workflow & Configuration Validation

### 3.1 Actionlint (GitHub Actions Validation)

**Purpose:** Lint and validate GitHub Actions workflow files

**Workflow:** `.github/workflows/actionlint.yml`

**What it validates:**
- YAML syntax
- Workflow schema compliance
- Job dependencies (needs:)
- Expression syntax (${{ }})
- Shellcheck integration (validates run: scripts)
- Action version pinning (warns on unpinned versions)
- Deprecated action usage

**Triggers:**
- Pull requests modifying `.github/workflows/**`
- Push to master

**Example errors caught:**
- Invalid YAML syntax
- Undefined workflow inputs
- Circular job dependencies
- Shell script errors (via shellcheck)
- Missing required permissions

**Configuration:** None (uses built-in rules)

### 3.2 Markdownlint (Markdown Validation)

**Purpose:** Enforce consistent Markdown formatting

**Workflow:** `.github/workflows/markdownlint.yml`

**Configuration:** `.markdownlint.json`

**What it validates:**
- Heading hierarchy
- List formatting
- Line length (disabled in this project)
- Trailing whitespace
- Link formatting
- Inline HTML (allowed with restrictions)

**Triggers:**
- Pull requests modifying `**/*.md`
- Push to master

**Local integration:**
```bash
npm run lint:md  # Check
npm run lint:md:fix  # Auto-fix
```

**Relaxed rules in this project:**
- MD013 (line length) - disabled
- MD033 (inline HTML) - allowed for <details>, <table>, etc.
- MD041 (first line heading) - disabled

### 3.3 Commitlint (Commit Message Validation)

**Purpose:** Enforce Conventional Commits format (critical for Release Please)

**See full section:** [Conventional Commits Not Enforced](#conventional-commits-not-enforced)

**Validation layers:**
1. Local: Lefthook + commitlint (commit-msg hook)
2. GitHub Actions: validate-commits.yml (all PR commits)
3. GitHub Actions: validate-pr-title.yml (PR title)

---

## 4. Build & Package Validation

### 4.1 Test & Build Workflow

**Purpose:** Comprehensive validation before merge

**Workflow:** `.github/workflows/test-and-build.yml`

**Validation steps:**

```yaml
1. Path filtering (dorny/paths-filter)
   - Only run if src/, test/, or config changed
   - Optimizes CI performance

2. Harden Runner
   - Network egress auditing

3. Type checking
   - npm run typecheck (tsc --noEmit)

4. Linting
   - npm run lint (Biome)

5. Formatting
   - npm run format (Biome)

6. Testing
   - npm run test:run (Vitest)

7. Build validation
   - npm run prepack (pkgroll)
   - Validates CJS/ESM dual export
   - Generates TypeScript declarations

8. Package validation
   - npm run publint (after build)
   - Validates package.json exports
```

**Branch protection:** Required to pass before merge

### 4.2 Dual Package Validation

**Challenge:** This project supports both CJS and ESM

**package.json exports:**
```json
{
  "main": "./dist/index.cjs",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.cts",
  "exports": {
    "require": {
      "types": "./dist/index.d.cts",
      "default": "./dist/index.cjs"
    },
    "import": {
      "types": "./dist/index.d.mts",
      "default": "./dist/index.mjs"
    }
  }
}
```

**Validation:**
- **Publint:** Checks exports configuration correctness
- **TypeScript:** Validates declaration files match exports
- **Build:** pkgroll generates both formats + declarations

**Common issues caught:**
- Missing .d.cts or .d.mts files
- Incorrect exports conditions
- CJS/ESM compatibility issues

---

## 5. Summary: Complete Validation Matrix

| Tool | Type | Runs | Blocks | Purpose |
|------|------|------|--------|---------|
| **Biome** | Linter/Formatter | Local, Claude Hooks, Lefthook, CI | Yes (CI) | Code style & quality |
| **TypeScript** | Type Checker | Local, CI | Yes (CI) | Type safety |
| **Vitest** | Test Runner | Local, CI | Yes (CI) | Unit tests |
| **Publint** | Package Validator | Local, CI | Yes (CI) | npm package structure |
| **Commitlint** | Commit Validator | Local (Lefthook), CI | Yes (both) | Conventional Commits |
| **Actionlint** | Workflow Validator | CI (on workflow changes) | Yes | GitHub Actions syntax |
| **Markdownlint** | Markdown Linter | Local, CI (on .md changes) | Yes (CI) | Markdown formatting |
| **Dependency Review** | Security Scanner | CI (PR only) | Yes | Vulnerable dependencies |
| **OpenSSF Scorecard** | Security Auditor | CI (weekly + push) | No | Supply chain security |
| **SBOM Generator** | Inventory Tool | CI (push + releases) | No | Dependency tracking |
| **Codecov** | Coverage Reporter | CI | Optional | Test coverage |
| **Harden-Runner** | Runtime Monitor | CI (all workflows) | Optional | Network egress audit |

### Bypass Capabilities

| Layer | Can Bypass Locally? | Can Bypass in CI? |
|-------|---------------------|-------------------|
| Claude Hooks | ✅ Yes (don't use Claude Code) | N/A |
| Lefthook | ✅ Yes (--no-verify) | N/A |
| GitHub Actions | ❌ No | ❌ No (required checks) |
| Branch Protection | ❌ No | ❌ No (admin only) |

**Design principle:** Local tools provide fast feedback, CI enforcement prevents bypass.

### Tool Selection Rationale

**Why Biome over ESLint + Prettier?**
- 100x faster
- Single tool, less configuration
- TypeScript-first design
- Better error messages

**Why Vitest over Jest?**
- Native ESM support
- Faster test execution
- Built-in coverage (no c8/nyc needed)
- Better TypeScript integration

**Why Actionlint?**
- Catches workflow errors before pushing
- Integrates shellcheck for script validation
- Prevents invalid GitHub Actions configs

**Why Harden-Runner?**
- Detect compromised actions
- Supply chain attack prevention
- Zero-trust security model

**Why OpenSSF Scorecard?**
- Industry-standard security assessment
- Comprehensive supply chain evaluation
- Badge for README (trust signal)

---

## 6. Setting Up All Validations

### New Repository Setup Checklist

If setting up a new repository with similar validation:

**1. Code Quality**
- [ ] Install Biome: `npm install -D @biomejs/biome`
- [ ] Create `biome.json` configuration
- [ ] Add scripts to package.json: `check`, `lint`, `format`, `typecheck`
- [ ] Configure TypeScript: `tsconfig.json`

**2. Testing**
- [ ] Install Vitest: `npm install -D vitest`
- [ ] Create `vitest.config.ts`
- [ ] Add test scripts: `test`, `test:run`, `test:coverage`

**3. Git Hooks**
- [ ] Install Lefthook: `npm install -D lefthook`
- [ ] Create `lefthook.yml` with pre-commit and commit-msg hooks
- [ ] Install commitlint: `npm install -D @commitlint/{cli,config-conventional}`
- [ ] Create `commitlint.config.js`

**4. Claude Code Hooks**
- [ ] Create `.claude/settings.json`
- [ ] Configure SessionStart hook: `npm install`
- [ ] Configure PostToolUse hook: `npm run check`
- [ ] Add `.claude/settings.local.json` to `.gitignore`

**5. GitHub Actions**
- [ ] Copy `.github/workflows/` directory
- [ ] Update workflow triggers/branches for your repo
- [ ] Configure branch protection (require checks to pass)
- [ ] Add GitHub secrets if needed (CODECOV_TOKEN, etc.)

**6. Security**
- [ ] Enable Dependabot (Settings → Security → Dependabot)
- [ ] Enable Secret Scanning (Settings → Security → Secret scanning)
- [ ] Configure Harden-Runner in critical workflows
- [ ] Set up OpenSSF Scorecard
- [ ] Configure Dependency Review to fail on moderate+ severity

**7. Documentation**
- [ ] Install markdownlint: `npm install -D markdownlint-cli2`
- [ ] Create `.markdownlint.json`
- [ ] Add markdown linting workflows

**8. Package Validation (for libraries)**
- [ ] Install publint: `npm install -D publint`
- [ ] Configure dual CJS/ESM exports in package.json
- [ ] Add publint to prepack script

**9. Verification**
- [ ] Create test PR
- [ ] Verify all checks run
- [ ] Verify required checks block merge
- [ ] Test local hooks work
- [ ] Test --no-verify is caught by CI

---

## Missing Dependencies and Code Formatting Issues

### Problem Summary

When working with Claude Code, sessions would fail due to missing dependencies or code would
be written with incorrect formatting, causing pre-commit hooks to fail.

**Symptoms:**
- Error: "Cannot find module 'X'" when trying to run npm scripts
- Commands like `npm run check` fail with "module not found"
- Code written by Claude fails Biome formatting checks
- Pre-commit hooks reject commits due to formatting errors
- Manual intervention needed to run `npm install` and `npm run check:fix`
- Development workflow interrupted by missing setup steps

### Root Cause

**Two separate issues:**

1. **Missing dependencies on session start**
   - Claude Code sessions start with a clean environment
   - Dependencies not automatically installed from package.json
   - Tools like Biome, TypeScript, etc. not available
   - Scripts in package.json cannot execute

2. **No automated code validation after edits**
   - Claude writes/edits files but doesn't automatically validate them
   - Formatting errors only discovered when committing
   - Pre-commit hooks fail, requiring manual fixes
   - Workflow: edit → commit fails → run check:fix → commit again (inefficient)

### Solution: Claude Code Hooks

Configure `.claude/settings.json` with **SessionStart** and **PostToolUse** hooks to automate
dependency installation and code validation.

#### Complete Configuration

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": ["Skill"]
  },
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup",
        "hooks": [
          {
            "type": "command",
            "command": "cd \"$CLAUDE_PROJECT_DIR\" && npm install",
            "timeout": 300
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "cd \"$CLAUDE_PROJECT_DIR\" && npm run check",
            "timeout": 120
          }
        ]
      }
    ]
  }
}
```

#### Hook Explanations

**SessionStart Hook:**
- **Runs**: `npm install`
- **When**: Automatically on Claude Code session start
- **Purpose**: Ensures all dependencies are installed before any work begins
- **Timeout**: 300 seconds (5 minutes) - sufficient for large dependency trees
- **Benefit**: No "module not found" errors during development

**PostToolUse Hook:**
- **Runs**: `npm run check` (Biome linting + formatting)
- **When**: After Write/Edit tool operations
- **Purpose**: Immediate feedback on code quality issues
- **Timeout**: 120 seconds (2 minutes)
- **Benefit**: Catch formatting errors immediately, not at commit time

#### Implementation Evolution

The hooks were initially implemented with separate shell scripts, but were simplified to
inline commands for easier maintenance:

**Original approach (deprecated):**
```
.claude/hooks/session-start.sh
.claude/hooks/post-tool-use.sh
```

**Current approach (recommended):**
```json
{
  "hooks": {
    "SessionStart": [
      {
        "type": "command",
        "command": "cd \"$CLAUDE_PROJECT_DIR\" && npm install"
      }
    ]
  }
}
```

**Why inline commands?**
- Simpler configuration (no separate files)
- Easier to understand and modify
- Less file clutter in `.claude/` directory
- Consistent with JSON-based configuration

### Local Customization

Create `.claude/settings.local.json` for personal hook overrides (not version-controlled):

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "cd \"$CLAUDE_PROJECT_DIR\" && npm run typecheck",
            "timeout": 60
          }
        ]
      }
    ]
  }
}
```

**Note**: Add `.claude/settings.local.json` to `.gitignore` to prevent committing
personal settings:

```gitignore
# .gitignore
.claude/settings.local.json
```

### Benefits

✅ **Automated setup** - Dependencies installed automatically on session start
✅ **Immediate feedback** - Code quality issues caught right after editing
✅ **Fewer failed commits** - Formatting validated before commit hooks run
✅ **Consistent environment** - Same setup for all Claude Code users
✅ **No manual intervention** - No need to remember to run `npm install` or `npm run check`
✅ **Faster development** - Workflow: edit → auto-validate → commit succeeds

### Workflow Comparison

**Without hooks:**
```
1. Start Claude Code session
2. Try to run npm script → ❌ Error: dependencies not installed
3. Manually run: npm install
4. Edit code with Claude
5. Commit changes → ❌ Pre-commit hook fails (formatting errors)
6. Manually run: npm run check:fix
7. Commit again → ✅ Success
```

**With hooks:**
```
1. Start Claude Code session → ✅ Dependencies auto-installed
2. Edit code with Claude → ✅ Auto-validated immediately
3. Commit changes → ✅ Success (already formatted)
```

### Related Changes

- **PR #97**: `feat: add claude code hooks configuration`
- **Commit**: `e4303d9`
- Initial implementation with shell scripts, then refactored to inline commands

### Verification

#### Test SessionStart Hook:

1. Delete `node_modules/` directory
2. Start new Claude Code session
3. Check that `node_modules/` is recreated automatically
4. Verify dependencies are available: `npm run check` should work

#### Test PostToolUse Hook:

1. Edit a file with Claude (e.g., add a function to `src/index.ts`)
2. Watch for hook output showing `npm run check` execution
3. If formatting is wrong, you'll see immediate feedback
4. Fix is applied automatically or error is shown

#### View Hook Execution:

Hook output appears in Claude Code session as:
```
[SessionStart:startup hook success]: Dependencies installed
[PostToolUse:Write hook success]: Code validation passed
```

Or on failure:
```
[PostToolUse:Write hook failed]: Biome found formatting errors
```

### Troubleshooting Hook Issues

#### Hook doesn't run:

- Check `.claude/settings.json` syntax is valid JSON
- Verify `"matcher"` regex matches the event (e.g., `"Write|Edit"`)
- Check Claude Code console for hook execution logs

#### Hook times out:

- Increase `"timeout"` value (in seconds)
- For SessionStart, 300s should be sufficient
- For PostToolUse, 120s should be sufficient

#### Hook fails with command not found:

- Ensure `cd "$CLAUDE_PROJECT_DIR"` is in the command
- Use absolute paths if needed
- Check that npm is available in Claude Code environment

### Best Practices

1. **Keep hooks fast** - Long-running hooks slow down development
2. **Use appropriate timeouts** - Balance between reliability and speed
3. **Test locally** - Verify hooks work before committing configuration
4. **Document custom hooks** - Add comments in settings.json for team clarity
5. **Use local overrides** - Personal preferences go in `.local.json`, not main config

---

## Conventional Commits Not Enforced

### Problem Summary

Without enforced commit message validation, developers could create commits with invalid formats,
breaking Release Please's ability to parse commits, generate changelogs, and determine version
bumps correctly.

**Symptoms:**
- Commits with messages like "fixed bug" or "added feature" (no type prefix)
- Release Please errors: "commit could not be parsed"
- Release Please unable to determine version bump type
- Empty or incorrect changelog entries
- Manual intervention needed to fix commit history
- Inconsistent commit message styles across contributors
- Version bumps not matching actual changes (feat commits treated as chore)

### Root Cause

**Release Please requires Conventional Commits format:**

```
type: description

type(scope): description

type!: description (breaking change)
```

**Without enforcement:**
- No validation at commit time
- Developers unaware of format requirements
- Easy to forget or misformat commit messages
- Only discovered when Release Please fails
- Fixing requires rewriting git history (risky)

**Critical for Release Please:**
- `feat:` commits → patch bump (pre-1.0) or minor bump (post-1.0)
- `fix:` commits → patch bump
- `feat!:` or `BREAKING CHANGE:` → minor bump (pre-1.0) or major bump (post-1.0)
- Other types (`docs:`, `chore:`, etc.) → no version bump
- Invalid format → Release Please cannot parse → release blocked

### Solution: Multi-Layer Commit Validation

Implement **three layers** of validation that cannot be bypassed:

1. **Local validation** (Lefthook + commitlint) - immediate feedback
2. **GitHub Actions PR validation** (validate-commits.yml) - validates all commits in PR
3. **GitHub Actions PR title validation** (validate-pr-title.yml) - validates PR title format

#### Layer 1: Local Validation (Lefthook + commitlint)

**Install commitlint dependencies:**

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

**Create `commitlint.config.js`:**

```javascript
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",     // New feature
        "fix",      // Bug fix
        "docs",     // Documentation changes
        "style",    // Code style changes
        "refactor", // Code refactoring
        "perf",     // Performance improvements
        "test",     // Adding or updating tests
        "build",    // Build system changes
        "ci",       // CI configuration changes
        "chore",    // Other changes
        "revert",   // Revert a previous commit
      ],
    ],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "subject-case": [1, "always", "lower-case"],
    "body-leading-blank": [2, "always"],
    "footer-leading-blank": [0, "always"], // Disabled (conflicts with some tools)
  },
};
```

**Add commit-msg hook to `lefthook.yml`:**

```yaml
commit-msg:
  commands:
    commitlint:
      run: npx commitlint --edit {1}
```

**Result:** Invalid commits rejected immediately at creation time.

**Example:**

```bash
$ git commit -m "added new feature"
❌ Error: subject may not be empty
❌ Error: type may not be empty

$ git commit -m "feat: add new feature"
✅ Success
```

**Note:** Can be bypassed locally with `git commit --no-verify`, but GitHub Actions
will still catch invalid commits (cannot bypass remote validation).

#### Layer 2: GitHub Actions - Validate All Commits in PR

**Create `.github/workflows/validate-commits.yml`:**

```yaml
name: Validate Commits

on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]
  push:
    branches:
      - master

permissions:
  contents: read
  pull-requests: read

jobs:
  validate-commit-messages:
    name: Validate Commit Messages
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@1af3b93b6815bc44a9784bd300feb67ff0d1eeb3 # v6.0.0
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@2028fbc5c25fe9cf00d9f06a71cc4710d4507903 # v6.0.0
        with:
          node-version: '22'

      - name: Install commitlint
        run: npm install --save-dev @commitlint/cli @commitlint/config-conventional

      - name: Validate current commit (push)
        if: github.event_name == 'push'
        run: npx commitlint --from HEAD~1 --to HEAD --verbose

      - name: Validate PR commits (pull_request)
        if: github.event_name == 'pull_request'
        run: |
          npx commitlint \
            --from ${{ github.event.pull_request.base.sha }} \
            --to ${{ github.event.pull_request.head.sha }} \
            --verbose
```

**Result:** All commits in PR must follow Conventional Commits format.

**Benefits:**
- Cannot be bypassed (runs on GitHub's servers)
- Validates ALL commits in the PR, not just the latest
- Blocks PR merge if validation fails (when set as required check)
- Same rules as local commitlint

#### Layer 3: GitHub Actions - Validate PR Title

**Create `.github/workflows/validate-pr-title.yml`:**

```yaml
name: Validate PR Title

on:
  pull_request:
    types: [opened, edited, synchronize, reopened]

permissions:
  pull-requests: read
  statuses: write

jobs:
  validate-pr-title:
    name: Validate PR Title
    runs-on: ubuntu-latest
    steps:
      - name: Validate PR title
        uses: amannn/action-semantic-pull-request@0723387faaf9b38adef4775cd42cfd5155ed6017 # v5.5.3
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          types: |
            feat
            fix
            docs
            style
            refactor
            perf
            test
            build
            ci
            chore
            revert
          requireScope: false
          subjectPattern: ^.+$
          validateSingleCommit: true
          headerPattern: '^(\w+)(\(\w+\))?: (.+)$'
```

**Why validate PR title?**
- When using squash merge, PR title becomes the commit message
- Ensures squashed commit follows Conventional Commits
- Prevents invalid commits in main branch history
- Release Please can parse squashed commits correctly

#### Enforcement Strategy

**Multi-layer protection:**

```
┌─────────────────────────────────────────────────┐
│ Developer creates commit                         │
│   ↓                                              │
│ Layer 1: Lefthook + commitlint (local)          │
│   ├─ Valid → commit created ✅                   │
│   └─ Invalid → rejected ❌                       │
│     └─ Can bypass with --no-verify (not recommended) │
│                                                   │
│ Developer pushes to PR                           │
│   ↓                                              │
│ Layer 2: validate-commits.yml (GitHub Actions)  │
│   ├─ All commits valid → check passes ✅         │
│   └─ Any commit invalid → check fails ❌         │
│     └─ Cannot bypass (blocks PR merge)           │
│                                                   │
│ Layer 3: validate-pr-title.yml (GitHub Actions) │
│   ├─ PR title valid → check passes ✅            │
│   └─ PR title invalid → check fails ❌           │
│     └─ Cannot bypass (blocks PR merge)           │
│                                                   │
│ Both checks pass → PR can be merged              │
│   ↓                                              │
│ Release Please can parse commits ✅              │
│ Changelog generated correctly ✅                 │
│ Version bumped according to commit types ✅      │
└─────────────────────────────────────────────────┘
```

### Configuration Synchronization

**CRITICAL:** All three validation layers must use the same commit type list.

**Files to keep in sync:**

1. `commitlint.config.js` - local validation
2. `.github/workflows/validate-pr-title.yml` - PR title validation

**Example commit types (must match everywhere):**

```
feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
```

**If they don't match:**
- Local validation passes but GitHub Actions fails (or vice versa)
- Confusing error messages for developers
- Inconsistent enforcement

### Branch Protection Setup

**Make validation required** (prevents merging invalid PRs):

1. Go to **Settings** → **Branches** → **Branch protection rules**
2. Add rule for `master` branch:
   - ✅ Require status checks to pass before merging
   - ✅ Select required checks:
     - `Validate Commit Messages`
     - `Validate PR Title`
   - ✅ Require branches to be up to date before merging

**Result:** PRs cannot be merged unless all commits and PR title are valid.

### Handling Invalid Commits

#### If local commit is rejected:

```bash
# Fix the commit message
git commit --amend -m "feat: add new feature"

# Or create new commit with correct format
git commit -m "fix: resolve authentication bug"
```

#### If PR validation fails:

**Option 1: Amend commits (if you own the branch):**

```bash
# Rewrite last commit
git commit --amend -m "feat: corrected commit message"
git push --force

# Rewrite multiple commits
git rebase -i HEAD~3  # Interactive rebase last 3 commits
# Edit commit messages in editor
git push --force
```

**Option 2: Add fixup commit:**

```bash
# If you can't rewrite history, add a properly formatted commit
git commit -m "chore: fix commit message formatting"
git push
```

**Warning:** Rewriting history (`--force`) is safe on feature branches but
dangerous on shared branches.

### Common Validation Errors

#### Error: "type may not be empty"

```bash
❌ git commit -m "added feature"
✅ git commit -m "feat: add feature"
```

#### Error: "subject may not be empty"

```bash
❌ git commit -m "feat:"
✅ git commit -m "feat: add user authentication"
```

#### Error: "subject must not be sentence-case, start-case, pascal-case, upper-case"

```bash
❌ git commit -m "feat: Add Feature"
✅ git commit -m "feat: add feature"
```

#### Error: "type must be one of [feat, fix, ...]"

```bash
❌ git commit -m "feature: add login"
✅ git commit -m "feat: add login"
```

### Footer-Leading-Blank Rule Adjustment

**Issue:** Some tools (like Release Please, GitHub merge commits) generate commit
messages without blank lines before footers, causing validation to fail.

**Solution:** Disable `footer-leading-blank` rule:

```diff
# commitlint.config.js
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "body-leading-blank": [2, "always"],
-   "footer-leading-blank": [2, "always"],
+   "footer-leading-blank": [0, "always"], // Disabled
  },
};
```

**Example commit that now passes:**

```
feat: add new feature

This is the body.
Refs: #123
```

Without the adjustment, commitlint would require:

```
feat: add new feature

This is the body.

Refs: #123
```

### Related Changes

- **PR #95**: `ci: enforce conventional commits with lefthook and github actions`
- **PR #126**: `chore: disable footer-leading-blank commitlint rule`
- **Commits**: `064b84b` (initial enforcement), `e3c5fec` (footer rule adjustment)

### Benefits

✅ **Release Please works correctly** - Can parse all commits, generate changelogs, bump versions
✅ **Consistent commit history** - All commits follow the same format
✅ **Automated releases** - Version bumps determined automatically from commit types
✅ **Clear changelogs** - Organized by commit type (Features, Bug Fixes, etc.)
✅ **Cannot be bypassed** - GitHub Actions validation is mandatory
✅ **Immediate feedback** - Local hooks catch errors before pushing
✅ **Team alignment** - Everyone follows the same commit conventions

### Verification

#### Test local validation:

```bash
# This should fail
git commit -m "added feature"

# This should succeed
git commit -m "feat: add feature"
```

#### Test GitHub Actions validation:

1. Create PR with invalid commit message
2. Check "Validate Commits" workflow fails
3. Amend commit to fix format
4. Push again
5. Verify workflow passes

#### Test PR title validation:

1. Create PR with title "Fixed bug"
2. Check "Validate PR Title" fails
3. Edit PR title to "fix: resolve authentication bug"
4. Verify workflow passes

### Troubleshooting

#### Local validation passes but GitHub Actions fails:

- Check that `commitlint.config.js` matches `.github/workflows/validate-commits.yml`
- Ensure commitlint is using same config in both places
- Verify npm dependencies are up to date

#### All commits valid but validation still fails:

- Check for merge commits (these often have non-standard format)
- Verify fetch-depth: 0 in checkout action (needed to see all commits)
- Look at GitHub Actions logs for specific failing commit SHA

#### Want to temporarily disable validation:

**Local:**
```bash
git commit -m "WIP: temporary work" --no-verify
```

**GitHub Actions:**
- Don't do this - defeats the purpose
- If absolutely necessary, remove workflows temporarily (not recommended)

---

## npm Publish Failures with Trusted Publishers

### Problem Summary

`npm publish` was failing silently in GitHub Actions despite correct OIDC configuration (Trusted Publishers).

**Symptoms:**
- Workflow completes without errors
- Package is NOT published to npm registry
- No clear error messages in workflow logs
- OIDC authentication appears configured correctly

### Root Cause

**npm Trusted Publishers requires npm >= 11.5.1**

Older npm versions (including those bundled with Node.js 20 and early Node.js 22) **do not support OIDC-based authentication** used by Trusted Publishers. Even with correct configuration:
- ✅ `permissions: id-token: write`
- ✅ `npm publish --provenance --access public`
- ✅ Trusted Publisher configured on npmjs.com

...publishing will still fail if npm version < 11.5.1.

### Solution

#### 1. Upgrade npm to >= 11.5.1 (CRITICAL)

```yaml
- name: Setup Node.js
  uses: actions/setup-node@2028fbc5c25fe9cf00d9f06a71cc4710d4507903 # v6.0.0
  with:
    node-version: "22"

- name: Install latest npm
  run: npm install -g npm@11.5.1
```

#### 2. Add npm version validation (RECOMMENDED)

Fail-fast if npm is too old:

```yaml
- name: Verify npm >= 11.5.1 for Trusted Publishers
  run: |
    CURRENT_NPM=$(npm --version)
    echo "Current npm version: $CURRENT_NPM"
    if [ "$(printf '%s\n' "11.5.1" "$CURRENT_NPM" | sort -V | head -n1)" = "11.5.1" ]; then
      echo "✓ npm version $CURRENT_NPM is sufficient (>= 11.5.1)"
    else
      echo "❌ Error: npm version $CURRENT_NPM is too old"
      echo "npm >= 11.5.1 is required for Trusted Publishers"
      echo "Update Node.js version in workflow or manually install newer npm"
      exit 1
    fi
```

#### 3. Remove conflicting setup-node parameters

**Remove these parameters** from `actions/setup-node`:

```diff
- uses: actions/setup-node@sha
  with:
    node-version: "22"
-   registry-url: "https://registry.npmjs.org"  # ❌ Remove
-   scope: "@your-scope"                         # ❌ Remove
-   always-auth: true                            # ❌ Remove
```

**Why remove?**
- `registry-url` causes `setup-node` to add deprecated `always-auth=true` to `.npmrc`
- This generates warnings in npm 11+ and conflicts with OIDC auth
- `scope` and `always-auth` are not needed with Trusted Publishers (OIDC handles auth)

#### 4. Remove NPM_TOKEN environment variable

```diff
- name: Publish to npm
  run: npm publish --provenance --access public
- env:
-   NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}  # ❌ Remove
```

**Why remove?**
- Trusted Publishers use OIDC (`id-token: write`), not token-based auth
- `NODE_AUTH_TOKEN` can cause auth conflicts
- No secrets needed in GitHub repository settings

### Complete Working Configuration

See `.github/workflows/release-please.yml` for the full working example. Key excerpts:

```yaml
permissions:
  contents: read
  id-token: write  # Required for OIDC auth with npm

steps:
  - name: Checkout code
    uses: actions/checkout@1af3b93b6815bc44a9784bd300feb67ff0d1eeb3 # v6.0.0

  - name: Setup Node.js
    uses: actions/setup-node@2028fbc5c25fe9cf00d9f06a71cc4710d4507903 # v6.0.0
    with:
      node-version: "22"
      # NO registry-url, scope, or always-auth

  - name: Install latest npm
    run: npm install -g npm@11.5.1

  - name: Install dependencies
    run: npm install

  # ... build and test steps ...

  - name: Verify npm >= 11.5.1 for Trusted Publishers
    run: |
      CURRENT_NPM=$(npm --version)
      echo "Current npm version: $CURRENT_NPM"
      if [ "$(printf '%s\n' "11.5.1" "$CURRENT_NPM" | sort -V | head -n1)" = "11.5.1" ]; then
        echo "✓ npm version $CURRENT_NPM is sufficient (>= 11.5.1)"
      else
        echo "❌ Error: npm version $CURRENT_NPM is too old"
        exit 1
      fi

  - name: Publish to npm
    run: npm publish --provenance --access public
    # NO env variables needed
```

### Related Changes

This fix was implemented in:
- **PR #115**: `ci: update npm publishing for trusted publishers compatibility`
- **Commit**: `1d3a09f1459b181b99b18f91d413af7e6b2c42ba`

### Additional Resources

- [npm Trusted Publishers documentation](https://docs.npmjs.com/generating-provenance-statements)
- [GitHub OIDC tokens documentation](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)
- [npm provenance attestation](https://github.blog/2023-04-19-introducing-npm-package-provenance/)

### Checklist: Verifying Trusted Publishers Setup

- [ ] npm >= 11.5.1 installed in workflow
- [ ] Version validation step added (fail-fast on old npm)
- [ ] `permissions: id-token: write` set in job
- [ ] `npm publish --provenance --access public` command used
- [ ] NO `registry-url` in `setup-node`
- [ ] NO `scope`, `always-auth` parameters
- [ ] NO `NODE_AUTH_TOKEN` / `NPM_TOKEN` env variables
- [ ] Trusted Publisher configured on npmjs.com:
  - [ ] Repository: `gander-tools/playground-js-lib`
  - [ ] Workflow: `release-please.yml`
  - [ ] Branch restrictions (if any) match publish branch

---

## Contributing

Found a solution to a common problem? Add it to this guide:

1. Create a clear problem summary with symptoms
2. Explain the root cause
3. Provide step-by-step solution
4. Include working code examples
5. Add verification checklist if applicable
6. Link to related PRs/commits
