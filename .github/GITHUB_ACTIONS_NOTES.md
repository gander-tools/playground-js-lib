# GitHub Actions Implementation Notes

## Implemented Actions

This repository uses the following GitHub Actions to automate workflows:

### 1. **srvaroa/labeler** (v1.13.0)
- **Purpose**: Automatically labels PRs and issues based on file paths, branch names, and content
- **Configuration**: `.github/labeler.yml`
- **Workflow**: `.github/workflows/labeler.yml`
- **Why chosen**: More powerful than `actions/labeler` with regex support and advanced conditions

### 2. **actions/stale** (v10.1.0)
- **Purpose**: Manages stale issues and PRs by marking and closing inactive items
- **Configuration**: Inline in workflow
- **Workflow**: `.github/workflows/stale.yml`
- **Schedule**: Daily at 00:00 UTC

### 3. **dorny/paths-filter** (v3.0.2)
- **Purpose**: Detects which files changed in PRs for conditional workflow execution
- **Integration**: Enhanced `test-and-build.yml` workflow
- **Benefit**: Optimizes CI/CD by skipping unnecessary jobs based on file changes

### 4. **pascalgn/automerge-action** (v0.16.4)
- **Purpose**: Automatically merges PRs labeled with `automerge` when checks pass
- **Configuration**: Inline in workflow
- **Workflow**: `.github/workflows/automerge.yml`
- **Merge method**: Squash merge

### 5. **hmarr/auto-approve-action** (v4.0.0)
- **Purpose**: Auto-approves PRs from Dependabot or with `auto-approve` label
- **Workflow**: `.github/workflows/auto-approve.yml`
- **Use case**: Streamlines trusted automated PRs

### 6. **peter-evans/create-pull-request** (v7.0.9)
- **Purpose**: Creates PRs from workflow changes
- **Example**: `.github/workflows/update-dependencies.yml`
- **Use case**: Automated dependency updates, code formatting, etc.

### 7. **peter-evans/create-or-update-comment** (v5.0.0)
- **Purpose**: Creates or updates comments on PRs/issues by ID
- **Example**: `.github/workflows/pr-comment.yml`
- **Use case**: Coverage reports, build status, etc.

### 8. **marocchino/sticky-pull-request-comment** (v2.9.4)
- **Purpose**: Creates/updates "sticky" comments that persist across PR updates
- **Example**: `.github/workflows/pr-size-check.yml`
- **Use case**: PR size metrics, continuous status updates

## Release Automation

### semantic-release
**Status**: ✅ Implemented

**Implementation**: This project uses **semantic-release** for automated per-commit releases. semantic-release is run directly via `npx semantic-release` in the workflow (not using a GitHub Action wrapper).

**Features**:
- Automated version bumping based on Conventional Commits
- Changelog generation from commit messages
- GitHub releases and tags
- npm publishing with Trusted Publishers (OIDC)
- JSR publishing

**Configuration**:
- `.releaserc.json` - semantic-release configuration
- `.github/workflows/semantic-release.yml` - GitHub Actions workflow
- Runs on every push to `master` branch
- Publishes immediately for qualifying commits (`feat:`, `fix:`, `perf:`, `refactor:`)

**Migration from Release Please**: Completed
- ✅ Removed `.github/workflows/release-please.yml`
- ✅ Removed `release-please-config.json` and `.release-please-manifest.json`
- ✅ Installed semantic-release and plugins
- ✅ Created `.releaserc.json` configuration
- ✅ Updated documentation

**Key differences from Release Please**:
- **Per-commit releases** vs batched release PRs
- **Immediate publishing** vs manual PR merge approval
- **More automated** vs more control

## Version Pinning Strategy

All GitHub Actions use SHA-pinned versions for security:

```yaml
uses: actions/checkout@1af3b93b6815bc44a9784bd300feb67ff0d1eeb3 # v6.0.0
```

This ensures:
- Reproducible builds
- Protection against supply chain attacks
- No unexpected breaking changes from action updates

## Duplicate Actions Resolution

During implementation, the following duplicates were identified and resolved:

| Action Type | Options | Chosen | Reason |
|-------------|---------|--------|--------|
| Labeler | `actions/labeler` vs `srvaroa/labeler` | `srvaroa/labeler` | More features, regex support, condition-based labeling |
| PR Validation | Already using `amannn/action-semantic-pull-request` | Kept existing | Already configured, working well |
| Comments | `peter-evans/create-or-update-comment` vs `marocchino/sticky-pull-request-comment` | Both | Different use cases: ID-based vs marker-based updates |

## Workflow Naming Convention

Workflows follow consistent naming:
- **Hyphenated filenames**: `pr-size-check.yml`, `update-dependencies.yml`
- **Title case names**: `name: PR Size Check`, `name: Update Dependencies`
- **Conventional commit types**: All commits use `ci:` type for workflow changes

## References

- [GitHub Actions Security Best Practices](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [Release Please Documentation](https://github.com/googleapis/release-please)
- [Conventional Commits](https://www.conventionalcommits.org/)
