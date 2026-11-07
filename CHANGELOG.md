# Changelog

## [0.10.12](https://github.com/gander-tools/playground-js-lib/compare/v0.10.11..0.10.12) - 2026-11-07

### 🐛 Bug Fixes

- *(release)* Fix build under typescript 7, use npm stage publish (#302)

### ⚙️ Miscellaneous Tasks

- *(workflows)* Replace action tag aliases with full versions
- *(workflows)* Replace action tag aliases with full versions (#262)
- Add auto-assign workflow
- Pin auto-assign action to commit SHA
- Add auto-assign workflow (#260)
- Manual runs and scheduled slow/informational workflows (#264)
- Pin runners to ubuntu-24.04
- Pin runners to ubuntu-24.04 (#268)
- Add actionlint config for ubuntu-26.04 runner label
- Add actionlint config for ubuntu-26.04 runner label (#270)
- *(renovate)* Lock node and typescript version lines
- *(renovate)* Lock node and typescript version lines (#272)
- *(renovate)* Replace the deprecated defaults preset with base
- *(renovate)* Replace the deprecated defaults preset with base (#287)
- *(renovate)* Extend the default preset to enable automerge
- Remove non-security workflows and release-please
- *(release)* Add manual release workflow driven by release-it
- *(release)* Pin jsr cli version
- *(renovate)* Pin node to 26 and typescript to 7

## [0.10.11](https://github.com/gander-tools/playground-js-lib/compare/v0.10.10..v0.10.11) - 2026-01-28

### 🚀 Features

- Add subtract function
- Add subtract function (#162)

### ⚙️ Miscellaneous Tasks

- Configure Renovate (#134)
- Update Renovate configuration to use new defaults
- Update Renovate configuration to use new defaults (#142)
- Format json files
- *(master)* Release 0.10.11
- *(master)* Release 0.10.11 (#163)

## [0.10.10](https://github.com/gander-tools/playground-js-lib/compare/v0.10.9..v0.10.10) - 2025-11-28

### 📚 Documentation

- Add npm trusted publishers troubleshooting guide
- Add npm trusted publishers troubleshooting guide (#130)
- Add claude code hooks troubleshooting section
- Add conventional commits enforcement troubleshooting section
- Add comprehensive code validation and security tools overview
- Fix table of contents after merge with master
- Reorganize troubleshooting guide for readability
- Add comprehensive troubleshooting guide with all solved issues (#132)
- Document lefthook prepare script and npm ci behavior in CI/CD (#133)

### 🧪 Testing

- Add comprehensive typescript output format validation
- Add comprehensive typescript output format validation (#129)

### ⚙️ Miscellaneous Tasks

- *(master)* Release 0.10.10
- *(master)* Release 0.10.10 (#131)

## [0.10.9](https://github.com/gander-tools/playground-js-lib/compare/v0.10.8..v0.10.9) - 2025-11-28

### 🚀 Features

- Add actionlint workflow for github actions validation
- Add markdownlint for markdown file validation
- Add gitleaks for automated secrets detection
- Add step-security/harden-runner to critical workflows
- Add codeql security scanning workflow
- Add openssf scorecard for supply chain security
- Add dependency review for vulnerability detection
- Add trivy for comprehensive vulnerability scanning
- Add sbom generation for supply chain transparency
- Add codecov for code coverage reporting
- Add semgrep for advanced static security analysis

### 🐛 Bug Fixes

- Use npm instead of bun in lefthook pre-commit hook
- Relax markdownlint rules for existing markdown files
- Update gitleaks action to valid sha reference
- Remove codeql workflow conflicting with default setup
- Replace invalid sha references with version tags
- Update all actions to use valid commit sha pinning
- Remove gitleaks workflow
- Remove semgrep workflow due to sarif generation issues
- Remove trivy workflow due to nested action sha pinning issues
- Make actionlint non-blocking for pre-existing shellcheck issues
- Resolve all shellcheck issues in workflow files
- Enable actionlint to block ci on workflow errors
- Group output redirects to resolve shellcheck sc2129
- Use npm instead of bun in lefthook pre-commit hook (#127)

### 🧪 Testing

- Add comprehensive unit tests for add and addRef functions (#125)

### ⚙️ Miscellaneous Tasks

- Disable footer-leading-blank commitlint rule (#126)
- *(master)* Release 0.10.9
- *(master)* Release 0.10.9 (#128)

## [0.10.8](https://github.com/gander-tools/playground-js-lib/compare/v0.10.7..v0.10.8) - 2025-11-28

### 🐛 Bug Fixes

- Update condition for format-files job
- Update condition for format-files job (#123)

### ⚙️ Miscellaneous Tasks

- *(master)* Release 0.10.8
- *(master)* Release 0.10.8 (#124)

## [0.10.7](https://github.com/gander-tools/playground-js-lib/compare/v0.10.6..v0.10.7) - 2025-11-27

### 🚀 Features

- Add auto-format workflow for release please prs
- Add auto-format workflow for release please prs (#121)

### 🐛 Bug Fixes

- Correct yaml syntax in format-release-pr workflow
- Exclude release please prs from automerge workflow
- Exclude release please prs from automerge workflow (#120)

### 📚 Documentation

- Add github actions implementation notes and semantic-release incompatibility explanation

### ⚙️ Miscellaneous Tasks

- Update npm publishing for trusted publishers compatibility (#115)
- Refactor workflow names and job identifiers for clarity
- Refactor workflow names and job identifiers for clarity (#116)
- Add srvaroa/labeler workflow for automated PR and issue labeling
- Add stale workflow to manage inactive issues and prs
- Add paths-filter to optimize test workflow execution
- Add automerge workflow for labeled pull requests
- Add auto-approve workflow for dependabot and labeled prs
- Add automated dependency update workflow using create-pull-request
- Add pr comment workflow for coverage reports
- Add pr size check workflow with sticky comments
- Add srvaroa/labeler workflow for automated PR and issue labeling (#118)
- Add AI-powered PR review workflow with qodo-ai/pr-agent
- Add AI-powered PR review workflow with qodo-ai/pr-agent (#117)
- *(master)* Release 0.10.7
- *(master)* Release 0.10.7 (#119)

## [0.10.6](https://github.com/gander-tools/playground-js-lib/compare/v0.10.5..v0.10.6) - 2025-11-27

### 🐛 Bug Fixes

- Update denoland/setup-deno to correct v2.0.3 SHA
- Update denoland/setup-deno to correct v2.0.3 SHA (#112)

### 📚 Documentation

- Update standard actions SHA in CLAUDE.md

### ⚙️ Miscellaneous Tasks

- Replace npm ci with npm install in release-please workflow
- Replace npm ci with npm install in release-please workflow (#111)
- Update github actions to latest v4 versions
- Update github actions to latest v4 versions (#114)
- *(master)* Release 0.10.6
- *(master)* Release 0.10.6 (#113)

## [0.10.5](https://github.com/gander-tools/playground-js-lib/compare/v0.10.4..v0.10.5) - 2025-11-27

### 📚 Documentation

- Add npm trusted publishers configuration to CLAUDE.md
- Add first-time publish limitation for trusted publishers
- Fix trusted publisher troubleshooting info in claude.md
- Add npm trusted publishers configuration to CLAUDE.md (#107)

### ⚙️ Miscellaneous Tasks

- Remove publish workflow
- Remove publish workflow (#106)
- Use npm instead of bun in publish workflow for consistency
- Replace bun with npm in ci workflow
- Replace bun with npm in ci workflow (#109)
- Replace npm ci with npm install in ci workflow
- Replace npm ci with npm install in ci workflow (#110)
- *(master)* Release 0.10.5
- *(master)* Release 0.10.5 (#108)

## [0.10.4](https://github.com/gander-tools/playground-js-lib/compare/v0.10.3..v0.10.4) - 2025-11-27

### 📚 Documentation

- Add merge commit configuration guide for release please
- Add merge commit configuration guide for release please (#103)

### ⚙️ Miscellaneous Tasks

- Simplify npm publish workflow to only run lint check
- *(master)* Release 0.10.4
- *(master)* Release 0.10.4 (#104)

## [0.10.3](https://github.com/gander-tools/playground-js-lib/compare/v0.10.2..v0.10.3) - 2025-11-27

### 📚 Documentation

- Compact claude.md and prioritize conventional commits section

### ⚙️ Miscellaneous Tasks

- Remove format from lint checks in CI (#99)
- *(master)* Release 0.10.3

## [0.10.2](https://github.com/gander-tools/playground-js-lib/compare/v0.10.1..v0.10.2) - 2025-11-27

### 🚀 Features

- Add claude code hooks configuration (#97)

### 🎨 Styling

- Format jsr.json with biome

### ⚙️ Miscellaneous Tasks

- *(master)* Release 0.10.2

## [0.10.1](https://github.com/gander-tools/playground-js-lib/compare/v0.10.0..v0.10.1) - 2025-11-27

### 🐛 Bug Fixes

- Add NODE_AUTH_TOKEN to npm publish step in release workflow
- Resolve formatting error in jsr.json blocking Release Please publishing

### 📚 Documentation

- Add branch protection configuration guide to prevent broken releases

### ⚙️ Miscellaneous Tasks

- Enforce conventional commits with lefthook and github actions
- *(master)* Release 0.10.1

## [0.10.0](https://github.com/gander-tools/playground-js-lib/compare/playground-v0.9.0..v0.10.0) - 2025-11-27

### 🐛 Bug Fixes

- Remove component prefix from release tags (#90)

### ⚙️ Miscellaneous Tasks

- *(master)* Release 0.10.0

## [playground-v0.9.0](https://github.com/gander-tools/playground-js-lib/compare/v0.8.0..playground-v0.9.0) - 2025-11-27

### 🚀 Features

- Add auto PR creation workflow for Claude branches
- [**breaking**] Add Release Please automated release workflow
- Use first commit message as PR title
- Add controlled versioning strategy to Release Please

### 🐛 Bug Fixes

- Bun run pkg-pr-new
- Bunx pkg-pr-new
- Pin actions/checkout to commit SHA in auto-pr workflow
- Change base branch from main to master in auto-pr workflow
- Remove NPM_TOKEN from npm publish step for Trusted Publishing
- Remove NPM_TOKEN from npm publish step for Trusted Publishing
- Add robust error handling to auto-pr workflow
- Change release-please trigger branch from main to master
- Remove invalid package-name input from release-please workflow
- Correct biome.json config and format build test (#86)
- Update publint validation test to use npx and check for success message

### 📚 Documentation

- Add CLAUDE.md with project documentation
- Add comprehensive Release Please control documentation
- Add comprehensive maintainer guide for Release Please
- Add npm usage instructions for Claude Code

### 🧪 Testing

- Add build and publish simulation test (#85)

### ⚙️ Miscellaneous Tasks

- Add hourly cleanup workflow for old package versions
- Add version and auth status check to cleanup workflow
- Add token authentication to cleanup workflow
- Remove pkg.pr.new workflow
- Pin versions in dependencies and CI workflows
- Bump dev dependencies to latest major versions
- Simplify auto-pr workflow template
- Update all dependencies to latest versions with version pinning
- Add SHA version pinning to release-please workflow and document requirement
- Rename CI workflow to Tests
- Rename CI workflow to Tests (#87)
- *(master)* Release playground 0.9.0

## [0.7.2](https://github.com/gander-tools/playground-js-lib/compare/v0.7.1..v0.7.2) - 2025-02-24

### 🐛 Bug Fixes

- Package script name
- Add pkg.pr.new uses bun
- Release hooks
- Release changelog generation command

## [0.7.1](https://github.com/gander-tools/playground-js-lib/compare/v0.7.0..v0.7.1) - 2025-02-24

### 🐛 Bug Fixes

- Publish uses bun

## [0.7.0](https://github.com/gander-tools/playground-js-lib/compare/v0.6.1..v0.7.0) - 2025-02-17

### 🚜 Refactor

- Pre-commit

### ⚙️ Miscellaneous Tasks

- Replace npm by bun
- Drop some

## [0.6.1](https://github.com/gander-tools/playground-js-lib/compare/v0.5.1..v0.6.1) - 2025-02-17

### 🚜 Refactor

- .release-it.ts
- .release-it.ts
- .release-it.ts
- .release-it.ts

## [0.5.1](https://github.com/gander-tools/playground-js-lib/compare/v0.5.0..v0.5.1) - 2025-02-17

### 🚜 Refactor

- .release-it.ts

## [0.5.0](https://github.com/gander-tools/playground-js-lib/compare/v0.4.2..v0.5.0) - 2025-02-17

### 🚀 Features

- Sandbox

### ⚙️ Miscellaneous Tasks

- Cleanup

## [0.4.2](https://github.com/gander-tools/playground-js-lib/compare/v0.4.1..v0.4.2) - 2025-02-17

### ⚙️ Miscellaneous Tasks

- Play with history and changelog
- Play with history and changelog
- Nie zapisuje się changelog
- Play with history and changelog
- Co jest?
- Play with history and changelog

## [0.4.1](https://github.com/gander-tools/playground-js-lib/compare/v0.4.0..v0.4.1) - 2025-02-11

### 🐛 Bug Fixes

- Strip Release commits
- Breh
- Nope changelog
- Pre-commit
- CHANGELOG.md

## [0.4.0](https://github.com/gander-tools/playground-js-lib/compare/v0.3.6..v0.4.0) - 2025-02-11

### ⚙️ Miscellaneous Tasks

- Try some changelog
- Add CHANGELOG.md link only to release message

## [0.3.6](https://github.com/gander-tools/playground-js-lib/compare/v0.3.5..v0.3.6) - 2025-02-11

### 🐛 Bug Fixes

- Npm pkg fix

### ⚙️ Miscellaneous Tasks

- Check3 publishing
- Check4 publishing
- Whats wrong

## [0.3.5](https://github.com/gander-tools/playground-js-lib/compare/v0.3.4..v0.3.5) - 2025-02-11

### ⚙️ Miscellaneous Tasks

- Check2 publishing

## [0.3.4](https://github.com/gander-tools/playground-js-lib/compare/v0.3.3..v0.3.4) - 2025-02-11

### ⚙️ Miscellaneous Tasks

- Check publishing

## [0.3.3](https://github.com/gander-tools/playground-js-lib/compare/v0.3.2..v0.3.3) - 2025-02-08

### ⚙️ Miscellaneous Tasks

- Changelog note
- Changelog note

## [0.3.2](https://github.com/gander-tools/playground-js-lib/compare/v0.3.1..v0.3.2) - 2025-02-08

### ⚙️ Miscellaneous Tasks

- Changelog experiments failed

## [0.3.1](https://github.com/gander-tools/playground-js-lib/compare/v0.3.0..v0.3.1) - 2025-02-08

### 💼 Other

- Ci config
- Ci config

### ⚙️ Miscellaneous Tasks

- Changelog experiments
- Configure lefthook

## [0.3.0](https://github.com/gander-tools/playground-js-lib/compare/v0.2.4..v0.3.0) - 2025-02-03

### ⚙️ Miscellaneous Tasks

- Set node version ^22
- PeerDependencies optional

## [0.2.4](https://github.com/gander-tools/playground-js-lib/compare/v0.2.3..v0.2.4) - 2025-02-03

### ⚙️ Miscellaneous Tasks

- Biome reformat

## [0.2.3](https://github.com/gander-tools/playground-js-lib/compare/v0.2.2..v0.2.3) - 2025-02-03

### 🚀 Features

- *(dep)* Trying new dependabot bun support

### 💼 Other

- Replace eslint and prettier by biome

### ⚙️ Miscellaneous Tasks

- Update configs
- Biome reformat

## [0.2.2](https://github.com/gander-tools/playground-js-lib/compare/v0.2.1..v0.2.2) - 2025-01-13

### ⚙️ Miscellaneous Tasks

- Sprawdzam 2

## [0.2.1](https://github.com/gander-tools/playground-js-lib/compare/v0.2.0..v0.2.1) - 2025-01-13

### 🚀 Features

- Remote.github

### ⚙️ Miscellaneous Tasks

- Sprawdzam

## [0.2.0](https://github.com/gander-tools/playground-js-lib/compare/v0.1.3..v0.2.0) - 2025-01-13

### 🚀 Features

- Git-cliff

### ⚙️ Miscellaneous Tasks

- Remove script version

## [0.1.3](https://github.com/gander-tools/playground-js-lib/compare/v0.1.2..v0.1.3) - 2025-01-13

### 🚀 Features

- Change changelog again

## [0.1.2](https://github.com/gander-tools/playground-js-lib/compare/v0.1.1..v0.1.2) - 2025-01-13

### 🚀 Features

- Change changelog

### 🐛 Bug Fixes

- Naaah

## [0.1.1](https://github.com/gander-tools/playground-js-lib/compare/v0.1.0..v0.1.1) - 2025-01-13

### 🚀 Features

- Try something...

### 🐛 Bug Fixes

- Prettier ignore CHANGELOG.md

## [0.1.0](https://github.com/gander-tools/playground-js-lib/compare/v0.0.11..v0.1.0) - 2025-01-13

### 🚀 Features

- Release:dry

### 🐛 Bug Fixes

- Changelog fix #10
- Changelog test

## [0.0.6](https://github.com/gander-tools/playground-js-lib/compare/v0.0.5..v0.0.6) - 2025-01-12

### 💼 Other

- Publish on tag push

## [0.0.5](https://github.com/gander-tools/playground-js-lib/compare/v0.0.4..v0.0.5) - 2025-01-06

### 💼 Other

- Reduce config; disable releases

### ⚙️ Miscellaneous Tasks

- Release v0.0.5

## [0.0.4](https://github.com/gander-tools/playground-js-lib/compare/v0.0.3..v0.0.4) - 2025-01-05

### 💼 Other

- Npm-run-all2

### ⚙️ Miscellaneous Tasks

- Release v0.0.4

## [0.0.3](https://github.com/gander-tools/playground-js-lib/compare/v0.0.2..v0.0.3) - 2025-01-04

### 📚 Documentation

- README

### ⚙️ Miscellaneous Tasks

- Release v0.0.3

## [0.0.2](https://github.com/gander-tools/playground-js-lib/compare/v0.0.1..v0.0.2) - 2025-01-04

### 📚 Documentation

- README

### ⚙️ Miscellaneous Tasks

- Release v0.0.2

## [0.0.1] - 2025-01-04

### 🐛 Bug Fixes

- Index.ts
- JSR
- Remove console.log
- Rozwiązanie
- Package.json schema

### 💼 Other

- Npm publish config fix
- Npm publish config fix
- Publish
- Publish
- Release to registry when published
- Publish on push tag
- Publish on push tag
- Release config
- Release config
- Create release draft
- Create release comments
- Fix no draft
- Publint strict
- Pkg-pr-new
- Remove  --frozen-lockfile
- Fix
- Pkg.pr.new

### 📚 Documentation

- Poprawki

### 🎨 Styling

- Reformat

### ⚙️ Miscellaneous Tasks

- Release v0.8.0
- Release v0.9.0
- Publish on release
- Release v0.9.1
- Release v0.9.2
- Release v0.9.3
- Release v0.0.1

<!-- generated by git-cliff -->
