# Troubleshooting Guide

This document contains solutions to common problems encountered in this project.

## Table of Contents

- [npm Publish Failures with Trusted Publishers](#npm-publish-failures-with-trusted-publishers)

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
