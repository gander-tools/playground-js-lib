# Troubleshooting Guide

This document contains solutions to common problems encountered in this project.

## Table of Contents

- [Missing Dependencies and Code Formatting Issues](#missing-dependencies-and-code-formatting-issues)
- [Conventional Commits Not Enforced](#conventional-commits-not-enforced)
- [npm Publish Failures with Trusted Publishers](#npm-publish-failures-with-trusted-publishers)

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
