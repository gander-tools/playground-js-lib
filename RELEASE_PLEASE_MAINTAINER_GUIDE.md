# Release Please - Maintainer Guide

> Practical guide for maintaining releases with Release Please in this project

## Table of Contents

- [Daily Workflow](#daily-workflow)
- [Understanding Release PRs](#understanding-release-prs)
- [Version Control Scenarios](#version-control-scenarios)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)
- [FAQ](#faq)

---

## Daily Workflow

### 1. Making Changes

When you make changes to the project, use **Conventional Commits** format:

```bash
# Adding a new feature (will bump patch in pre-1.0)
git commit -m "feat: add user authentication"

# Fixing a bug (will bump patch)
git commit -m "fix: resolve memory leak in cache"

# Breaking change (will bump minor in pre-1.0)
git commit -m "feat!: redesign API interface"

# Internal changes (won't trigger release)
git commit -m "chore: update dev dependencies"
git commit -m "docs: improve README"
git commit -m "test: add integration tests"
```

### 2. Pushing to Master

```bash
# Run checks before pushing
bun run check:fix
bun run typecheck
bun run test:run

# Push to master
git push origin master
```

### 3. What Happens Next

After you push to `master`:

1. **GitHub Actions runs** - Release Please workflow is triggered
2. **Release Please analyzes commits** - Looks for conventional commits since last release
3. **PR is created/updated** - A Release PR appears with:
   - Proposed version number (e.g., `0.8.1`)
   - Updated `CHANGELOG.md`
   - Updated `package.json` and `jsr.json` versions

**Example Release PR title**: `chore(main): release 0.8.1`

---

## Understanding Release PRs

### What's in a Release PR?

A Release PR contains:

```
Changes:
✓ CHANGELOG.md         - New entries for this release
✓ package.json         - Updated version field
✓ jsr.json            - Updated version field
✓ .release-please-manifest.json - Updated version tracking
```

### Reading the Release PR

**PR Title**: `chore(main): release 0.8.1`

**PR Body** shows:
- List of features, fixes, and changes
- Grouped by type (Features, Bug Fixes, etc.)
- Links to commits and pull requests

**Example**:
```markdown
## 0.8.1 (2025-11-27)

### Features

* add user authentication ([abc123](link-to-commit))

### Bug Fixes

* resolve memory leak in cache ([def456](link-to-commit))
```

### When to Merge the Release PR

✅ **Merge when**:
- All CI checks pass (tests, typecheck, lint)
- Version number is correct
- CHANGELOG looks good
- You're ready to publish to npm and JSR

⚠️ **Don't merge yet if**:
- You want to add more changes to this release
- Version number is wrong (see troubleshooting)
- You're not ready to publish

**Important**: Merging the Release PR **immediately triggers**:
1. GitHub Release creation
2. Publication to npm
3. Publication to JSR

---

## Version Control Scenarios

### Scenario 1: Normal Development (Current: 0.8.0)

**You commit**:
```bash
git commit -m "feat: add export button"
git commit -m "fix: typo in tooltip"
```

**Release Please creates PR**:
- Version: `0.8.0` → `0.8.1` (patch bump)
- Why: Both `feat:` and `fix:` bump patch in pre-1.0 (due to `bump-patch-for-minor-pre-major: true`)

**Action**: Review and merge when ready ✅

---

### Scenario 2: Breaking Change (Current: 0.8.0)

**You commit**:
```bash
git commit -m "feat!: redesign authentication API"
```

**Release Please creates PR**:
- Version: `0.8.0` → `0.9.0` (minor bump)
- Why: Breaking changes bump minor in pre-1.0 (due to `bump-minor-pre-major: true`)

**Action**: Review carefully, merge when ready ✅

---

### Scenario 3: Ready for 1.0.0 (Current: 0.9.5)

**You decide**: "We're ready for 1.0.0!"

**Steps**:
1. **Edit `.release-please-manifest.json`**:
   ```json
   {
     ".": "1.0.0"
   }
   ```

2. **Commit and push**:
   ```bash
   git add .release-please-manifest.json
   git commit -m "chore: prepare for 1.0.0 release"
   git push origin master
   ```

3. **Release Please creates PR**:
   - Version: `0.9.5` → `1.0.0`

4. **If existing Release PR exists** (for 0.9.6):
   - Close it
   - Remove `autorelease: pending` label
   - Push your commit
   - New PR will be created for 1.0.0

**Action**: Review and merge ✅

---

### Scenario 4: Want to Stay on 0.8.x Branch

**Situation**: Currently on `0.8.5`, want to continue with `0.8.6`, `0.8.7`, etc. without jumping to `0.9.0`

**What's already configured**: ✅ Done!
- `bump-patch-for-minor-pre-major: true` - `feat:` commits bump only patch
- `bump-minor-pre-major: true` - `feat!:` commits bump only minor

**Behavior**:
- `feat: ...` → `0.8.5` → `0.8.6` (patch)
- `fix: ...` → `0.8.5` → `0.8.6` (patch)
- `feat!: ...` → `0.8.5` → `0.9.0` (minor, only for breaking changes)

**To jump to 0.9.0 manually**: Edit `.release-please-manifest.json` to `"0.9.0"` (see Scenario 3)

---

### Scenario 5: Release PR Suggests Wrong Version

**Problem**: Release PR suggests `1.0.0`, but you want `0.9.0`

**Solution**:

1. **Close the Release PR** (don't merge)
2. **Remove label**: Go to PR → Labels → Remove `autorelease: pending`
3. **Check configuration**: Ensure `release-please-config.json` has:
   ```json
   {
     "bump-minor-pre-major": true,
     "bump-patch-for-minor-pre-major": true
   }
   ```
4. **Make a small commit** (to trigger new PR):
   ```bash
   git commit --allow-empty -m "chore: trigger new release PR"
   git push origin master
   ```
5. **New PR appears** with correct version

**Alternative**: Manually set version in `.release-please-manifest.json` and push

---

### Scenario 6: Accumulating Changes Before Release

**You want**: Add multiple features before releasing

**Steps**:
1. **Work normally** - Make commits, push to master
2. **Don't merge the Release PR** - Let it accumulate changes
3. **Release Please auto-updates the PR** - Each push updates the existing PR
4. **When ready** - Review accumulated changes and merge

**Example timeline**:
- Day 1: Push `feat: add login` → PR created for `0.8.1`
- Day 2: Push `feat: add logout` → Same PR updated, still `0.8.1`
- Day 3: Push `fix: login bug` → Same PR updated, still `0.8.1`
- Day 4: Merge PR → Release `0.8.1` with all three changes

---

## Troubleshooting

### Problem: Release PR Not Created

**Check**:
1. ✅ Commits use Conventional Commits format (`feat:`, `fix:`, etc.)
2. ✅ Commits are on `master` branch (workflow triggers on `master`)
3. ✅ No existing Release PR with `autorelease: pending` label

**Solution**: Look for closed PRs with `autorelease: pending` label and remove it

---

### Problem: Release PR Has Wrong Version

**Example**: Suggests `1.0.0` instead of `0.9.0`

**Solution** (Choose one):

**Option A: Close and Reconfigure**
```bash
# 1. Close the PR and remove 'autorelease: pending' label
# 2. Ensure config has pre-1.0 protection:
# Already set in release-please-config.json:
#   "bump-minor-pre-major": true
#   "bump-patch-for-minor-pre-major": true

# 3. Trigger new PR
git commit --allow-empty -m "chore: retrigger release PR"
git push origin master
```

**Option B: Manually Override**
```bash
# Edit .release-please-manifest.json
echo '{"."": "0.9.0"}' > .release-please-manifest.json

git add .release-please-manifest.json
git commit -m "chore: set version to 0.9.0"
git push origin master
```

---

### Problem: Accidentally Merged Wrong Version

**Oh no**: Merged Release PR with version `1.0.0`, but you wanted `0.9.0`

**Solution**: Create a new release with correct version

```bash
# Option 1: Revert the release commit
git revert HEAD
git push origin master

# Option 2: Force new version in manifest
echo '{"."": "0.9.0"}' > .release-please-manifest.json
git add .release-please-manifest.json
git commit -m "chore: correct version to 0.9.0"
git push origin master
```

**Important**: You may need to:
- Delete the wrong GitHub release
- Deprecate the wrong npm version: `npm deprecate @gander-tools/playground@1.0.0 "Released by mistake"`
- JSR doesn't support unpublishing - document the mistake

---

### Problem: Need to Prevent Accidental Merges

**Solution**: Enable draft mode

Edit `release-please-config.json`:
```json
{
  "draft-pull-request": true,  // Change from false to true
  "packages": { ... }
}
```

Commit and push:
```bash
git add release-please-config.json
git commit -m "chore: enable draft mode for release PRs"
git push origin master
```

**Result**: Future Release PRs will be **drafts** - you must manually click "Ready for review" before merging.

---

### Problem: Release Failed After Merging PR

**Check GitHub Actions**:
1. Go to Actions tab
2. Find failed "Release Please" workflow
3. Check which job failed:
   - `publish-to-npm` - npm publication failed
   - `publish-to-jsr` - JSR publication failed

**Common causes**:
- Tests failed: Fix tests and push fix commit
- Build failed: Fix build issues and push fix commit
- Auth issues: Check repository secrets (NPM_TOKEN)
- Network issues: Rerun the workflow

---

## Best Practices

### ✅ DO

1. **Always use Conventional Commits**
   ```bash
   feat: add feature
   fix: fix bug
   docs: update docs
   chore: internal changes
   ```

2. **Run checks before pushing**
   ```bash
   bun run check:fix
   bun run typecheck
   bun run test:run
   ```

3. **Review Release PRs carefully**
   - Check version number
   - Review CHANGELOG
   - Ensure CI passes

4. **Accumulate related changes**
   - Don't rush to merge Release PR
   - Let multiple features/fixes accumulate
   - Merge when you have a meaningful release

5. **Use draft mode if uncertain**
   - Set `draft-pull-request: true`
   - Gives you extra safety

### ❌ DON'T

1. **Don't push without conventional commits**
   ```bash
   git commit -m "updated stuff"  # ❌ Bad
   git commit -m "feat: add login" # ✅ Good
   ```

2. **Don't manually edit versions in package.json**
   - Release Please manages versions
   - Edit `.release-please-manifest.json` instead

3. **Don't close Release PRs without removing labels**
   - Always remove `autorelease: pending` label
   - Otherwise new PRs won't be created

4. **Don't merge if CI fails**
   - Fix issues first
   - Push fixes, let PR update

5. **Don't manually create tags/releases**
   - Let Release Please handle it
   - Merging Release PR creates tag and release automatically

---

## FAQ

### Q: Can I edit the Release PR?

**A**: No need! Release Please auto-updates it when you push new commits.

If you want to change the CHANGELOG or version:
- Don't edit the PR files directly
- Instead, push configuration changes or use manifest file

---

### Q: What if I want to skip a release?

**A**: Just don't merge the Release PR. It will accumulate changes until you're ready.

---

### Q: Can I have multiple versions in parallel (0.x and 1.x)?

**A**: Yes, but requires setup:
1. Create separate branches (`0.x`, `1.x`)
2. Create separate workflows for each branch
3. See `CLAUDE.md` → "Advanced Release Please Control" → "Parallel Release Branches"

---

### Q: How do I create a hotfix for older version?

**Example**: Current version is `1.5.0`, need to fix bug in `1.4.x`

**Option 1: Simple backport**
```bash
# Cherry-pick fix to master, release as 1.5.1
git cherry-pick <commit-hash>
git push origin master
```

**Option 2: Separate branch (advanced)**
```bash
# Create 1.4.x branch from 1.4.0 tag
git checkout -b 1.4.x v1.4.0
git cherry-pick <fix-commit>
git push origin 1.4.x

# Set up separate Release Please workflow for 1.4.x branch
```

---

### Q: What commits trigger releases?

**Triggers release** (bumps version):
- `feat:` - New feature (patch bump in pre-1.0)
- `fix:` - Bug fix (patch bump)
- `perf:` - Performance improvement (patch bump)
- `revert:` - Revert previous change (patch bump)
- `feat!:` - Breaking change (minor bump in pre-1.0)

**Included in CHANGELOG but doesn't bump version**:
- `docs:` - Documentation
- `refactor:` - Code refactoring

**Not included in release**:
- `chore:` - Internal changes
- `test:` - Tests
- `ci:` - CI configuration
- `build:` - Build system
- `style:` - Code style

---

### Q: How do I control when to bump minor vs patch?

**Current configuration** (pre-1.0):
- `feat:` → patch (0.8.0 → 0.8.1)
- `fix:` → patch (0.8.0 → 0.8.1)
- `feat!:` → minor (0.8.0 → 0.9.0)

**To manually bump minor**: Edit `.release-please-manifest.json` to `"0.9.0"`

**After 1.0.0**, standard semver applies:
- `feat:` → minor (1.0.0 → 1.1.0)
- `fix:` → patch (1.0.0 → 1.0.1)
- `feat!:` → major (1.0.0 → 2.0.0)

---

### Q: Can I test Release Please locally?

**A**: Not easily. Release Please is designed for GitHub Actions.

**Alternatives**:
1. **Preview version**: Check `.release-please-manifest.json` + commit history
2. **Use a fork**: Test on a fork repository first
3. **Read the PR**: Release PR shows exactly what will happen

---

### Q: What if I need to release urgently?

**A**: Merge the Release PR immediately after pushing your fix:

```bash
# Fix the urgent bug
git commit -m "fix: critical security issue"
git push origin master

# Wait ~30 seconds for Release PR to appear
# Review and merge immediately
# GitHub Actions will publish within 2-3 minutes
```

---

## Quick Reference Card

### Commit Types & Version Bumps (Pre-1.0)

| Commit Type | Version Change | Example |
|-------------|----------------|---------|
| `feat:` | 0.8.0 → 0.8.1 | `feat: add button` |
| `fix:` | 0.8.0 → 0.8.1 | `fix: broken link` |
| `feat!:` | 0.8.0 → 0.9.0 | `feat!: new API` |
| `chore:` | No change | `chore: update deps` |
| `docs:` | No change | `docs: fix typo` |

### Common Commands

```bash
# Check before pushing
bun run check:fix && bun run typecheck && bun run test:run

# Normal commit
git commit -m "feat: add feature"

# Breaking change
git commit -m "feat!: breaking change"

# Trigger new Release PR (if stuck)
git commit --allow-empty -m "chore: trigger release"

# Manually set version
echo '{"."": "0.9.0"}' > .release-please-manifest.json
git add .release-please-manifest.json
git commit -m "chore: set version to 0.9.0"
```

### Configuration Files

| File | Purpose |
|------|---------|
| `release-please-config.json` | Release Please settings |
| `.release-please-manifest.json` | Current version tracking |
| `.github/workflows/release-please.yml` | GitHub Actions workflow |

---

## Getting Help

- **Documentation**: See `CLAUDE.md` for project-specific info
- **Release Please Docs**: https://github.com/googleapis/release-please
- **Issues**: Open issue on this repository
- **Conventional Commits**: https://www.conventionalcommits.org/

---

**Last Updated**: 2025-11-27
**Project Version**: 0.8.0
**Configuration**: Controlled versioning with pre-1.0 protection enabled
