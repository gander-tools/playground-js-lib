# playground

This package was created only to test creating a multi-system module, and adding new configurations, linters, tests,
and publications on different registers. It does not contain code that you might find useful in your application, unless
you are looking for code that was created by making and solving mistakes, please learn from my git history.

```shell
bun install
bun run test
```

## Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Project overview, tech stack, and development workflow
- **[SEMANTIC_RELEASE_GUIDE.md](./SEMANTIC_RELEASE_GUIDE.md)** - Automated release workflow for maintainers
- **[.github/MERGE_COMMIT_SETUP.md](.github/MERGE_COMMIT_SETUP.md)** - GitHub merge commit configuration

## For Maintainers

This project uses semantic-release for automated per-commit releases. See the [Semantic Release Guide](./SEMANTIC_RELEASE_GUIDE.md) for:
- How semantic-release works (per-commit vs batched releases)
- Conventional commit types and version bumps
- Skipping releases
- Troubleshooting common issues
- npm Trusted Publishers configuration

**⚠️ Important:** Every qualifying commit to `master` triggers an immediate release. Use appropriate commit types (`docs:`, `chore:`, etc.) to avoid unnecessary releases.
