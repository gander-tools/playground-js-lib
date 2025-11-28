# Troubleshooting Guide

This document contains solutions to common problems encountered in this project.

## Table of Contents

- [Missing Dependencies and Code Formatting Issues](#missing-dependencies-and-code-formatting-issues)
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
