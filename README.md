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
- **[RELEASE_PLEASE_MAINTAINER_GUIDE.md](./RELEASE_PLEASE_MAINTAINER_GUIDE.md)** - Release management workflow for maintainers
- **[.github/MERGE_COMMIT_SETUP.md](.github/MERGE_COMMIT_SETUP.md)** - Fix Release Please merge commit parsing errors

## For Maintainers

This project uses Release Please for automated releases. See the [Maintainer Guide](./RELEASE_PLEASE_MAINTAINER_GUIDE.md) for:
- Daily workflow with conventional commits
- How to manage Release PRs
- Version control strategies
- Troubleshooting common issues

**⚠️ Important Setup:** Configure GitHub merge settings to avoid Release Please parsing errors. See [MERGE_COMMIT_SETUP.md](.github/MERGE_COMMIT_SETUP.md).
