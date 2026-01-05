# GitHub Merge Commit Configuration for Automated Releases

## Problem

semantic-release (and Release Please before it) cannot parse GitHub's default merge commit messages, causing potential release issues.

GitHub's default merge commit format:
```
Merge pull request #102 from gander-tools/branch-name
```

This doesn't follow Conventional Commits format required by semantic-release.

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
4. Verify semantic-release processes it correctly

## Alternative Solutions

### Option 1: Require Squash Merging (Recommended for small PRs)

1. In **Settings** → **Pull Requests**
2. ✅ **Allow squash merging** (enable)
3. ❌ **Allow merge commits** (disable)
4. ❌ **Allow rebase merging** (optional)

**Benefits:**
- No merge commits → cleaner git history
- PR title becomes the commit message (already validated by validate-pr-title.yml)
- semantic-release triggers immediately on the squashed commit

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

After applying the fix, semantic-release should:
1. ✅ Parse all commits correctly
2. ✅ Determine version bumps accurately
3. ✅ Publish releases for qualifying commits
4. ✅ Update CHANGELOG.md properly

Check semantic-release logs in GitHub Actions for successful execution.

## Current Project Status

**Configured Validations:**
- ✅ `.github/workflows/validate-pr-title.yml` - Validates PR titles follow Conventional Commits
- ✅ `.github/workflows/validate-commits.yml` - Validates individual commits in PRs
- ✅ `lefthook.yml` + `commitlint.config.js` - Local commit message validation
- ✅ `semantic-release` - Automated per-commit releases

**Recommended Setup:**
- ✅ Use "Squash and merge" strategy (eliminates merge commits)
- OR configure merge commit message format to use PR title (if using merge commits)

**Recommended Action:**
Apply **Option 1** (Squash Merging) from the alternatives above for best results with semantic-release.

## References

- [Conventional Commits](https://www.conventionalcommits.org/)
- [semantic-release Documentation](https://semantic-release.gitbook.io/)
- [GitHub Merge Methods](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges)
