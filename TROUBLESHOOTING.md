# Troubleshooting Guide

Comprehensive solutions to problems encountered in this project, organized by category.

## Table of Contents

### Development Tools
- [Claude Code Hooks](#claude-code-hooks) - Auto-install dependencies, auto-validate code
- [Lefthook Git Hooks](#lefthook-git-hooks) - Pre-commit validation, commit message linting

### Code Quality
- [Biome](#biome) - Linting & formatting (replaces ESLint + Prettier)
- [TypeScript](#typescript) - Type checking
- [Vitest](#vitest) - Testing & coverage
- [Publint](#publint) - Package validation (CJS/ESM)

### Commit & Release Management
- [Commitlint](#commitlint) - Conventional Commits enforcement
- [Release Please](#release-please) - Automated releases from commits

### Security & Dependencies
- [Dependency Review](#dependency-review) - Vulnerable dependencies in PRs
- [OpenSSF Scorecard](#openssf-scorecard) - Supply chain security
- [SBOM](#sbom) - Software Bill of Materials
- [Harden-Runner](#harden-runner) - Network monitoring in CI

### Workflow Validation
- [Actionlint](#actionlint) - GitHub Actions validation
- [Markdownlint](#markdownlint) - Markdown linting

### Common Issues
- [npm Trusted Publishers](#npm-trusted-publishers) - Publishing failures
- [GitHub Actions SHA Pinning](#github-actions-sha-pinning) - Invalid SHA references
- [Automerge Configuration](#automerge-configuration) - PR auto-merge issues

---

## Claude Code Hooks

**Problem**: Missing dependencies on session start, formatting errors after edits.

**What it solves**:
- ✅ Automatically installs dependencies when session starts
- ✅ Validates code immediately after Write/Edit operations
- ✅ Prevents "module not found" errors
- ✅ Catches formatting issues before commit

### Minimal Configuration

**File**: `.claude/settings.json`

```json
{
  "hooks": {
    "SessionStart": [{
      "matcher": "startup",
      "hooks": [{
        "type": "command",
        "command": "cd \"$CLAUDE_PROJECT_DIR\" && npm install",
        "timeout": 300
      }]
    }],
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{
        "type": "command",
        "command": "cd \"$CLAUDE_PROJECT_DIR\" && npm run check",
        "timeout": 120
      }]
    }]
  }
}
```

**File**: `.gitignore`

```gitignore
.claude/settings.local.json
```

### Works With
- **Biome** - `npm run check` runs linting + formatting
- **Lefthook** - Pre-commit hook validates same rules
- **TypeScript** - Can run `npm run typecheck` in PostToolUse

### Workflow Triggers
- **SessionStart**: On Claude Code session initialization
- **PostToolUse**: After every Write/Edit tool operation

### Related
- Commit: `e4303d9`
- PR: #97

---

## Lefthook Git Hooks

**Problem**: Commits bypass local validation, formatting issues discovered later.

**What it solves**:
- ✅ Validates code before commit (pre-commit)
- ✅ Validates commit message format (commit-msg)
- ✅ Faster feedback than waiting for CI
- ✅ Works offline

### Minimal Configuration

**File**: `lefthook.yml`

```yaml
pre-commit:
  jobs:
    - run: npm run check

commit-msg:
  commands:
    commitlint:
      run: npx commitlint --edit {1}
```

**File**: `package.json`

```json
{
  "devDependencies": {
    "lefthook": "^2.0.4",
    "@commitlint/cli": "^18.0.0",
    "@commitlint/config-conventional": "^18.0.0"
  }
}
```

**Install**: Runs automatically on `npm install` via prepare script

```json
{
  "scripts": {
    "prepare": "lefthook install"
  }
}
```

### Works With
- **Commitlint** - Validates commit messages
- **Biome** - Runs lint/format checks
- **GitHub Actions** - Provides local preview of CI checks

### Workflow Triggers
- **pre-commit**: Before `git commit`
- **commit-msg**: After entering commit message

### Bypass (Not Recommended)
```bash
git commit --no-verify  # Skips hooks (CI will still catch issues)
```

### Related
- Fixed: Using `npm` instead of `bun` (commit `69a4bf6`)

---

## Biome

**Problem**: Slow linting (ESLint), separate formatter (Prettier), config complexity.

**What it solves**:
- ✅ 100x faster than ESLint + Prettier
- ✅ Single tool for lint + format
- ✅ TypeScript-first design
- ✅ Automatic code fixes

### Minimal Configuration

**File**: `biome.json`

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "tab"
  }
}
```

**File**: `package.json`

```json
{
  "scripts": {
    "check": "biome check",
    "check:fix": "biome check --write",
    "lint": "biome lint",
    "format": "biome format"
  },
  "devDependencies": {
    "@biomejs/biome": "^1.9.4"
  }
}
```

### Usage

```bash
# Check only (no fixes)
npm run check

# Auto-fix issues
npm run check:fix
```

### Works With
- **Claude Code Hooks** - PostToolUse runs `npm run check`
- **Lefthook** - Pre-commit runs `npm run check`
- **GitHub Actions** - CI validates formatting

### Workflow Triggers
- **Local**: Manual via `npm run check`
- **Pre-commit**: Via Lefthook
- **PR**: `.github/workflows/test-and-build.yml`
- **Push to master**: Same workflow

### Related
- Replaced ESLint + Prettier for speed

---

## TypeScript

**Problem**: Type errors discovered at runtime or during build.

**What it solves**:
- ✅ Catches type errors before compilation
- ✅ Faster than full build (no output)
- ✅ IDE integration for real-time feedback

### Minimal Configuration

**File**: `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**File**: `package.json`

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "typescript": "^5.7.0"
  }
}
```

### Usage

```bash
npm run typecheck
```

### Works With
- **pkgroll** - Build uses same tsconfig
- **Biome** - Lints TypeScript code
- **GitHub Actions** - CI runs type check

### Workflow Triggers
- **Local**: Manual via `npm run typecheck`
- **PR**: `.github/workflows/test-and-build.yml`
- **Push to master**: Same workflow

---

## Vitest

**Problem**: No test coverage, manual testing unreliable.

**What it solves**:
- ✅ Automated unit testing
- ✅ Code coverage reporting
- ✅ Fast test execution (native ESM)
- ✅ Watch mode for development

### Minimal Configuration

**File**: `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
})
```

**File**: `package.json`

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest --coverage"
  },
  "devDependencies": {
    "vitest": "^2.0.0",
    "@vitest/coverage-v8": "^2.0.0"
  }
}
```

### Usage

```bash
# Watch mode (development)
npm test

# Run once (CI)
npm run test:run

# With coverage
npm run test:coverage
```

### Works With
- **Codecov** - Uploads coverage reports
- **GitHub Actions** - Runs tests in CI
- **TypeScript** - Native TS support

### Workflow Triggers
- **Local**: Manual via `npm test`
- **PR**: `.github/workflows/test-and-build.yml`
- **Push to master**: Same workflow

---

## Publint

**Problem**: Broken npm package (CJS/ESM export issues, missing types).

**What it solves**:
- ✅ Validates dual package exports
- ✅ Checks TypeScript declaration files
- ✅ Verifies package.json correctness
- ✅ Prevents publishing broken packages

### Minimal Configuration

**File**: `package.json`

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
  },
  "scripts": {
    "publint": "publint",
    "prepack": "pkgroll && npm run publint"
  },
  "devDependencies": {
    "publint": "^0.2.0"
  }
}
```

### Usage

```bash
# Validate package
npm run publint

# Runs automatically before publish
npm publish
```

### Works With
- **pkgroll** - Builds dual CJS/ESM packages
- **TypeScript** - Validates declaration files
- **GitHub Actions** - CI validates before release

### Workflow Triggers
- **Local**: Manual via `npm run publint`
- **Before publish**: Via `prepack` script
- **PR**: `.github/workflows/test-and-build.yml`

### Common Issues Fixed
- Missing `.d.cts` or `.d.mts` files
- Incorrect `exports` conditions
- CJS/ESM compatibility problems

---

## Commitlint

**Problem**: Invalid commit messages break Release Please.

**What it solves**:
- ✅ Enforces Conventional Commits format
- ✅ Enables automated changelogs
- ✅ Enables automated version bumps
- ✅ Prevents Release Please parsing errors

### Minimal Configuration

**File**: `commitlint.config.js`

```javascript
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", [
      "feat", "fix", "docs", "style", "refactor",
      "perf", "test", "build", "ci", "chore", "revert"
    ]],
    "subject-empty": [2, "never"],
    "subject-full-stop": [2, "never", "."],
    "body-leading-blank": [2, "always"],
    "footer-leading-blank": [0, "always"]  // Disabled
  }
}
```

**File**: `lefthook.yml`

```yaml
commit-msg:
  commands:
    commitlint:
      run: npx commitlint --edit {1}
```

**File**: `.github/workflows/validate-commits.yml`

```yaml
name: Validate Commits
on:
  pull_request:
  push:
    branches: [master]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v6
        with:
          node-version: '22'
      - run: npm install -D @commitlint/cli @commitlint/config-conventional
      - run: npx commitlint --from ${{ github.event.pull_request.base.sha }} --to ${{ github.event.pull_request.head.sha }} --verbose
        if: github.event_name == 'pull_request'
```

### Valid Commit Examples

```bash
✅ feat: add user authentication
✅ fix: resolve memory leak in cache
✅ feat!: redesign API (breaking change)
✅ docs: update installation guide

❌ Added new feature  # No type
❌ feat:add feature   # Missing space
❌ feat: Add feature  # Uppercase description
```

### Works With
- **Release Please** - Parses commits for changelog
- **Lefthook** - Local validation
- **GitHub Actions** - Remote validation (cannot bypass)

### Workflow Triggers
- **Local**: Via Lefthook commit-msg hook
- **PR**: `.github/workflows/validate-commits.yml`
- **PR Title**: `.github/workflows/validate-pr-title.yml`

### Related
- Commit: `064b84b`, `e3c5fec`
- PR: #95, #126

---

## Release Please

**Problem**: Manual releases, inconsistent changelogs, version management.

**What it solves**:
- ✅ Automated version bumps from commits
- ✅ Auto-generated changelogs
- ✅ Automated npm publishing
- ✅ GitHub releases

### Minimal Configuration

**File**: `release-please-config.json`

```json
{
  "bump-minor-pre-major": true,
  "bump-patch-for-minor-pre-major": true,
  "packages": {
    ".": {
      "release-type": "node",
      "package-name": "playground",
      "include-component-in-tag": false
    }
  }
}
```

**File**: `.release-please-manifest.json`

```json
{
  ".": "0.10.9"
}
```

**File**: `.github/workflows/release-please.yml`

```yaml
name: Release Please
on:
  push:
    branches: [master]

permissions:
  contents: write
  pull-requests: write
  id-token: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: googleapis/release-please-action@v4
        id: release

      - if: ${{ steps.release.outputs.release_created }}
        uses: actions/checkout@v6

      - if: ${{ steps.release.outputs.release_created }}
        uses: actions/setup-node@v6
        with:
          node-version: '22'

      - if: ${{ steps.release.outputs.release_created }}
        run: npm install -g npm@11.5.1

      - if: ${{ steps.release.outputs.release_created }}
        run: npm install && npm run prepack

      - if: ${{ steps.release.outputs.release_created }}
        run: npm publish --provenance --access public
```

### How It Works

1. Push commits with Conventional Commits format
2. Release Please creates/updates PR with changelog
3. Merge PR → triggers publish workflow
4. Package published to npm + GitHub release created

### Version Bump Rules (Pre-1.0)

```
feat: add feature    → 0.10.0 → 0.10.1 (patch)
fix: bug fix         → 0.10.0 → 0.10.1 (patch)
feat!: breaking      → 0.10.0 → 0.11.0 (minor)
```

### Works With
- **Commitlint** - Validates commit format
- **npm Trusted Publishers** - OIDC-based publishing
- **GitHub Actions** - Automated workflow

### Workflow Triggers
- **Push to master**: Creates/updates release PR
- **Merge release PR**: Publishes to npm

### Common Issues
- **Wrong branch**: Must be `master` not `main` (commit `606ba79`)
- **Invalid inputs**: Don't use `package-name` in workflow (commit `bfe3818`)
- **Tag prefix**: Set `include-component-in-tag: false` (commit `a123503`)

### Related
- Commits: `606ba79`, `bfe3818`, `a123503`

---

## Dependency Review

**Problem**: Vulnerable dependencies introduced in PRs.

**What it solves**:
- ✅ Blocks PRs with vulnerable dependencies
- ✅ Checks license compatibility
- ✅ Detects malicious packages
- ✅ Posts detailed PR comments

### Minimal Configuration

**File**: `.github/workflows/dependency-review.yml`

```yaml
name: Dependency Review
on: [pull_request]

permissions:
  contents: read
  pull-requests: write

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/dependency-review-action@v4
        with:
          fail-on-severity: moderate
          comment-summary-in-pr: always
```

### Works With
- **Dependabot** - Automated dependency updates
- **GitHub Advisory Database** - Vulnerability data source

### Workflow Triggers
- **PR**: Every pull request

### Blocks On
- Moderate, high, or critical vulnerabilities
- Incompatible licenses
- Known malicious packages

---

## OpenSSF Scorecard

**Problem**: No visibility into supply chain security posture.

**What it solves**:
- ✅ Comprehensive security assessment (0-10 score)
- ✅ Evaluates 18+ security checks
- ✅ Automated weekly scans
- ✅ SARIF results in Security tab

### Minimal Configuration

**File**: `.github/workflows/scorecard.yml`

```yaml
name: OpenSSF Scorecard
on:
  schedule:
    - cron: '0 0 * * 6'  # Weekly Saturday
  push:
    branches: [master]

permissions: read-all

jobs:
  analysis:
    runs-on: ubuntu-latest
    permissions:
      security-events: write
      id-token: write
    steps:
      - uses: actions/checkout@v6
        with:
          persist-credentials: false

      - uses: ossf/scorecard-action@v2
        with:
          results_file: results.sarif
          publish_results: true

      - uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: results.sarif
```

### Checks Include
- Branch protection
- Code review
- Dependency updates (Dependabot)
- Signed releases
- Token permissions
- Dangerous workflows
- And 12+ more...

### Works With
- **GitHub Security** - Results in Security tab
- **Branch Protection** - Requires settings
- **Dependabot** - Automated updates score

### Workflow Triggers
- **Weekly**: Saturdays at 00:00 UTC
- **Push to master**: On every push

---

## SBOM

**Problem**: No visibility into dependencies for compliance/audits.

**What it solves**:
- ✅ Complete dependency inventory
- ✅ License compliance tracking
- ✅ Vulnerability impact analysis
- ✅ SPDX standard format

### Minimal Configuration

**File**: `.github/workflows/sbom.yml`

```yaml
name: SBOM
on:
  push:
    branches: [master]
  release:
    types: [published]

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: '22'
      - run: npm install
      - run: npx @cyclonedx/cyclonedx-npm --output-file sbom.json
      - uses: actions/upload-artifact@v4
        with:
          name: sbom
          path: sbom.json
```

### Works With
- **Dependency Review** - Vulnerability scanning
- **License compliance** - Tools that parse SPDX

### Workflow Triggers
- **Push to master**: On every push
- **Release**: When GitHub release published

---

## Harden-Runner

**Problem**: No visibility into network activity in CI, supply chain attacks.

**What it solves**:
- ✅ Monitors all outbound network calls
- ✅ Detects compromised GitHub Actions
- ✅ Prevents data exfiltration
- ✅ Audit trail of network activity

### Minimal Configuration

Add to **all critical workflows**:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: step-security/harden-runner@v2
        with:
          disable-sudo: true
          egress-policy: audit  # or 'block'

      # ... rest of workflow
```

### Modes
- **audit**: Logs all connections (recommended initially)
- **block**: Blocks unauthorized connections (requires whitelist)

### Works With
- **All GitHub Actions** - Add to every workflow
- **StepSecurity Dashboard** - View network logs

### Workflow Triggers
- **All workflows**: Add as first step

---

## Actionlint

**Problem**: Invalid GitHub Actions workflows discovered after push.

**What it solves**:
- ✅ Validates YAML syntax
- ✅ Checks workflow schema
- ✅ Integrates shellcheck for scripts
- ✅ Validates expressions `${{ }}`

### Minimal Configuration

**File**: `.github/workflows/actionlint.yml`

```yaml
name: Actionlint
on:
  pull_request:
    paths: ['.github/workflows/**']
  push:
    branches: [master]
    paths: ['.github/workflows/**']

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: reviewdog/action-actionlint@v1
        with:
          fail_on_error: true
```

### Catches
- Invalid YAML syntax
- Undefined workflow inputs
- Circular job dependencies
- Shell script errors (SC2129, etc.)
- Missing required permissions

### Works With
- **shellcheck** - Validates `run:` scripts
- **GitHub Actions** - All workflows

### Workflow Triggers
- **PR**: When `.github/workflows/**` changed
- **Push to master**: Same path filter

### Related
- Fixed shellcheck SC2129 (commit `a606bc6`)

---

## Markdownlint

**Problem**: Inconsistent Markdown formatting.

**What it solves**:
- ✅ Enforces consistent style
- ✅ Validates heading hierarchy
- ✅ Checks list formatting
- ✅ Prevents common mistakes

### Minimal Configuration

**File**: `.markdownlint.json`

```json
{
  "default": true,
  "MD013": false,
  "MD024": { "siblings_only": true },
  "MD033": {
    "allowed_elements": ["details", "summary", "table", "tr", "td", "th"]
  },
  "MD041": false
}
```

**File**: `.github/workflows/markdownlint.yml`

```yaml
name: Markdownlint
on:
  pull_request:
    paths: ['**/*.md']
  push:
    branches: [master]
    paths: ['**/*.md']

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - run: npx markdownlint-cli2 '**/*.md' --config .markdownlint.json
```

### Rules Relaxed
- **MD013**: Line length (disabled)
- **MD033**: Inline HTML (allowed for tables)
- **MD041**: First line heading (disabled)

### Works With
- **Documentation** - All Markdown files

### Workflow Triggers
- **PR**: When `**/*.md` changed
- **Push to master**: Same path filter

### Related
- Commit: `9d69eff`

---

## npm Trusted Publishers

**Problem**: npm publish fails silently despite correct OIDC configuration.

**What it solves**:
- ✅ Secure publishing without secrets
- ✅ OIDC-based authentication
- ✅ Package provenance attestation
- ✅ Supply chain transparency

### Root Cause
**npm >= 11.5.1 required** for Trusted Publishers support.

### Minimal Configuration

**File**: `.github/workflows/release-please.yml`

```yaml
permissions:
  id-token: write  # Required for OIDC

steps:
  - uses: actions/setup-node@v6
    with:
      node-version: '22'
      # NO registry-url, scope, or always-auth

  - run: npm install -g npm@11.5.1  # Critical!

  - run: npm install && npm run prepack

  - run: npm publish --provenance --access public
    # NO NODE_AUTH_TOKEN environment variable
```

### What to Remove
```diff
- uses: actions/setup-node@v6
  with:
    node-version: '22'
-   registry-url: 'https://registry.npmjs.org'  # Remove
-   scope: '@your-scope'                        # Remove
-   always-auth: true                           # Remove

- name: Publish
  run: npm publish --provenance --access public
- env:
-   NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}  # Remove
```

### npmjs.com Configuration
1. Package Settings → Publishing Access → Trusted Publishers
2. Add: Repository `gander-tools/playground-js-lib`, workflow `release-please.yml`

### Works With
- **Release Please** - Automated publishing
- **GitHub OIDC** - Secure authentication

### Workflow Triggers
- **Release**: When Release Please PR merged

### Related
- Commits: `52fc92a`, `50c778e`, `9786ee1`
- PR: #115

---

## GitHub Actions SHA Pinning

**Problem**: Invalid SHA references, unpinned actions, security risks.

**What it solves**:
- ✅ Reproducible builds
- ✅ Protection against supply chain attacks
- ✅ No unexpected breaking changes
- ✅ Security best practice

### Format
```yaml
# ❌ Wrong
- uses: actions/checkout@v6

# ✅ Correct
- uses: actions/checkout@1af3b93b6815bc44a9784bd300feb67ff0d1eeb3 # v6.0.0
```

### Standard SHAs

```yaml
# actions/checkout v6.0.0
- uses: actions/checkout@1af3b93b6815bc44a9784bd300feb67ff0d1eeb3

# actions/setup-node v6.0.0
- uses: actions/setup-node@2028fbc5c25fe9cf00d9f06a71cc4710d4507903

# googleapis/release-please-action v4.4.0
- uses: googleapis/release-please-action@16a9c90856f42705d54a6fda1823352bdc62cf38

# amannn/action-semantic-pull-request v5.5.3
- uses: amannn/action-semantic-pull-request@0723387faaf9b38adef4775cd42cfd5155ed6017
```

### Find Correct SHA
```bash
# Visit GitHub repo → Releases → Click version tag → Copy commit SHA
# Or via API:
curl -s https://api.github.com/repos/actions/checkout/git/ref/tags/v6.0.0 \
  | jq -r '.object.sha'
```

### Works With
- **Actionlint** - Validates SHA format
- **Dependabot** - Can update pinned versions

### Workflow Triggers
- **All workflows**: Use SHA pinning everywhere

### Related
- Commits: `d75b330`, `1a5a027`

---

## Automerge Configuration

**Problem**: Release PRs auto-merged without manual review.

**What it solves**:
- ✅ Prevents accidental release merges
- ✅ Allows automerge for other PRs
- ✅ Requires manual approval for releases

### Minimal Configuration

**File**: `.github/workflows/automerge.yml`

```yaml
name: Automerge
on:
  pull_request:
    types: [labeled, synchronize]

jobs:
  automerge:
    runs-on: ubuntu-latest
    if: |
      !startsWith(github.head_ref, 'release-please--') &&
      contains(github.event.pull_request.labels.*.name, 'automerge')
    steps:
      - uses: pascalgn/automerge-action@v0.16.4
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          MERGE_METHOD: squash
```

### Exclusions
```yaml
# Exclude by branch prefix
!startsWith(github.head_ref, 'release-please--')

# Exclude by label
!contains(github.event.pull_request.labels.*.name, 'autorelease: pending')
```

### Works With
- **Release Please** - Prevents auto-merge
- **Branch protection** - Additional safety

### Workflow Triggers
- **PR labeled**: When `automerge` label added
- **PR synchronized**: When commits pushed

### Related
- Commits: `ad67252`, `f33d0de`
- PR: #120

---

## Contributing

Found a solution? Add it to this guide:

1. **Problem** - Clear description with symptoms
2. **What it solves** - Bullet points of benefits
3. **Minimal Configuration** - Working code only
4. **Works With** - Related tools
5. **Workflow Triggers** - When it runs
6. **Related** - Commits/PRs

Keep examples minimal and focused on the specific problem.
