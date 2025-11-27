# Fixing Release Please Merge Commit Parsing Issues

## Problem

Release Please fails to parse GitHub's default merge commit messages, causing errors like:

```
❯ commit could not be parsed: ced54cdea299e8cac898dc1bf26ecb0ab2841fee Merge pull request #102 from...
❯ error message: Error: unexpected token ' ' at 1:6, valid tokens [(, !, :]
```

While Release Please continues working (by parsing commits within PRs), these errors are noisy and indicate a configuration issue.

## Root Cause

GitHub's default merge commit format is:
```
Merge pull request #102 from gander-tools/branch-name
```

This doesn't follow Conventional Commits format, which requires:
```
type: description
```

## Solution: Configure GitHub Merge Settings

### Step 1: Access Repository Settings

1. Go to your GitHub repository
2. Click **Settings** → **General**
3. Scroll to **Pull Requests** section

### Step 2: Configure Merge Commit Message Format

Under "Allow merge commits", configure the default commit message:

**Recommended Setting:**
- ✅ **Default to pull request title** or **Default to pull request title and commit details**

This changes merge commits from:
```
Merge pull request #102 from gander-tools/branch-name

ci: simplify npm publish workflow to only run lint check
```

To:
```
ci: simplify npm publish workflow to only run lint check (#102)
```

### Step 3: Verify Settings

After configuration:
1. Create a test PR with a Conventional Commits title (e.g., `feat: test feature`)
2. Merge it
3. Check the merge commit message follows the PR title
4. Verify Release Please parses it without errors

## Alternative Solutions

### Option 1: Require Squash Merging (Recommended for small PRs)

1. In **Settings** → **Pull Requests**
2. ✅ **Allow squash merging** (enable)
3. ❌ **Allow merge commits** (disable)
4. ❌ **Allow rebase merging** (optional)

**Benefits:**
- No merge commits → no parsing errors
- Cleaner git history
- PR title becomes the commit message (already validated by semantic-pr.yml)

**Drawbacks:**
- Loses individual commit history in PRs
- Not suitable for PRs with multiple significant commits

### Option 2: Require Rebase Merging

1. In **Settings** → **Pull Requests**
2. ❌ **Allow merge commits** (disable)
3. ❌ **Allow squash merging** (disable)
4. ✅ **Allow rebase merging** (enable)

**Benefits:**
- No merge commits
- Preserves individual commits
- Each commit must follow Conventional Commits (enforced by commitlint.yml)

**Drawbacks:**
- Requires all commits in PR to be properly formatted
- Can be confusing for contributors unfamiliar with rebasing

## Verification

After applying the fix, Release Please should:
1. ✅ Parse merge commits without errors
2. ✅ Generate release PRs based on commit types
3. ✅ Include proper entries in CHANGELOG.md

Check Release Please logs in GitHub Actions:
```
✔ Collecting release commit SHAs
✔ Building candidate release pull request for path: .
✔ Created/updated release PR
```

## Current Project Status

**Configured Validations:**
- ✅ `.github/workflows/semantic-pr.yml` - Validates PR titles follow Conventional Commits
- ✅ `.github/workflows/commitlint.yml` - Validates individual commits in PRs
- ✅ `lefthook.yml` + `commitlint.config.js` - Local commit message validation

**Missing:**
- ❌ GitHub merge commit message format not configured
- ❌ This causes parsing errors in Release Please logs

**Recommended Action:**
Apply **Step 2** above to configure merge commit message format to use PR title.

## References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Release Please Documentation](https://github.com/googleapis/release-please)
- [GitHub Merge Methods](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges)
