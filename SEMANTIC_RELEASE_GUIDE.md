# Semantic Release Guide

This project uses [semantic-release](https://semantic-release.gitbook.io/) for fully automated version management and package publishing.

## How It Works

**Automated per-commit releases:**
1. Push commits to `master` branch with Conventional Commits format
2. semantic-release analyzes commits → determines version bump → publishes immediately
3. Creates GitHub release, updates CHANGELOG.md, publishes to npm/JSR

**Key difference from Release Please:**
- **semantic-release**: Releases on EVERY qualifying commit (feat, fix, etc.)
- **Release Please**: Batches commits into release PRs for manual approval

## Version Bump Strategy

**Pre-1.0 (current):**
- `feat:` → patch bump (0.10.2 → 0.10.3)
- `fix:` → patch bump (0.10.2 → 0.10.3)
- `perf:` → patch bump (0.10.2 → 0.10.3)
- `refactor:` → patch bump (0.10.2 → 0.10.3)
- `feat!:` or `BREAKING CHANGE:` → minor bump (0.10.2 → 0.11.0)
- `docs:`, `style:`, `test:`, `build:`, `ci:`, `chore:` → no release

**Configuration:** See `.releaserc.json` for release rules

## Workflow

1. **Make changes** following Conventional Commits format
2. **Push to master** → semantic-release runs automatically
3. **If commit qualifies** (feat, fix, perf, refactor):
   - Version bumped in package.json and jsr.json
   - CHANGELOG.md updated
   - Published to npm with provenance
   - Published to JSR
   - GitHub release created
   - Git tag created

## Configuration Files

### `.releaserc.json`
Main configuration file defining:
- Branches to release from (`master`)
- Release rules (which commit types trigger releases)
- Plugins for changelog, npm, git, GitHub
- Changelog sections

### `package.json`
Contains version number (updated automatically by semantic-release)

### `jsr.json`
Contains version number (updated automatically via exec plugin)

## Plugins Used

1. **@semantic-release/commit-analyzer** - Analyzes commits to determine version bump
2. **@semantic-release/release-notes-generator** - Generates changelog from commits
3. **@semantic-release/changelog** - Updates CHANGELOG.md file
4. **@semantic-release/npm** - Updates package.json version (npmPublish: false)
5. **@semantic-release/exec** - Runs custom commands (jsr.json update, npm publish with provenance)
6. **@semantic-release/git** - Commits updated files back to repo
7. **@semantic-release/github** - Creates GitHub releases

## NPM Publishing (Trusted Publishers)

This project uses **npm Trusted Publishers** (OIDC-based authentication).

**How it works:**
- semantic-release updates package.json version
- Custom exec plugin runs: `npm publish --provenance --access public`
- npm authenticates via GitHub Actions OIDC (no token needed)
- Package published with provenance attestation

**Requirements:**
- npm >= 11.5.1 (installed in workflow)
- `id-token: write` permission in workflow
- Trusted publisher configured on npmjs.com

## Skipping Releases

To push commits without triggering a release:

**Option 1: Use non-releasing commit types**
```bash
git commit -m "docs: update readme"
git commit -m "chore: update dependencies"
git commit -m "ci: fix workflow"
```

**Option 2: Use [skip ci] in commit message**
```bash
git commit -m "feat: add feature [skip ci]"
```

**Option 3: Use [skip release] in commit message**
```bash
git commit -m "feat: add feature [skip release]"
```

## Changelog

CHANGELOG.md is automatically generated and updated on each release.

**Format:** Follows [Keep a Changelog](https://keepachangelog.com/) structure
- Grouped by commit type (Features, Bug Fixes, etc.)
- Hidden sections: style, chore, test, build, ci

## Troubleshooting

### Release not triggered

**Check commit message format:**
```bash
# Valid (triggers release)
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug"

# Invalid (no release)
git commit -m "add new feature"  # missing type
git commit -m "feat Add feature" # missing colon
```

**Check commit type:**
- Only `feat`, `fix`, `perf`, `refactor` trigger releases
- `docs`, `chore`, `ci`, etc. don't trigger releases

### npm publish fails

**Verify npm version:**
```bash
npm --version  # Must be >= 11.5.1
```

**Check Trusted Publisher configuration:**
- On npmjs.com → Package Settings → Publishing Access
- Verify repository: `gander-tools/playground-js-lib`
- Verify workflow: `semantic-release.yml`
- Verify branch: `master` (if restricted)

### Version conflict

If semantic-release reports version already published:

**Option 1: Bump manually**
```bash
# Edit package.json version to next patch/minor
git commit -m "chore: bump version to X.Y.Z"
git push
```

**Option 2: Use git tags**
```bash
# Check current tags
git tag

# Delete conflicting tag if needed
git tag -d v0.10.10
git push origin :refs/tags/v0.10.10
```

## GitHub Actions Workflow

See `.github/workflows/semantic-release.yml`

**Triggers:** Push to `master` branch

**Steps:**
1. Install dependencies
2. Run tests, typecheck, lint
3. Build package
4. Run semantic-release (version, changelog, npm publish, git commit, GitHub release)
5. Publish to JSR (separate job)

**Required secrets:** None (uses OIDC for npm and JSR)

**Required permissions:**
- `contents: write` (commit changelog, create tags)
- `issues: write` (GitHub releases)
- `pull-requests: write` (GitHub releases)
- `id-token: write` (npm/JSR OIDC auth)

## Comparison with Release Please

| Feature | semantic-release | Release Please |
|---------|------------------|----------------|
| Release trigger | Every qualifying commit | Manual merge of release PR |
| Release frequency | Per-commit (automatic) | Batched (manual approval) |
| Changelog | Auto-generated on release | Auto-generated in PR |
| Git tags | Created immediately | Created on PR merge |
| Customization | Plugin-based | Limited to config |
| Control | Less (automatic) | More (manual approval) |

## When to Use semantic-release

**Good for:**
- Fast iteration (release every change immediately)
- CI/CD-focused workflows
- Teams that trust automated releases
- Projects with good test coverage

**Not good for:**
- Projects requiring manual release approval
- Complex multi-package monorepos (without extra config)
- Teams preferring batched releases

## Additional Resources

- [semantic-release documentation](https://semantic-release.gitbook.io/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [npm Trusted Publishers](https://docs.npmjs.com/generating-provenance-statements)
