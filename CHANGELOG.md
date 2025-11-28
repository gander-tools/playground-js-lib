# Changelog

## [0.10.9](https://github.com/gander-tools/playground-js-lib/compare/v0.10.8...v0.10.9) (2025-11-28)


### Features

* add actionlint workflow for github actions validation ([05133e5](https://github.com/gander-tools/playground-js-lib/commit/05133e512357d361a013771d54e2d550a78ca4c2))
* add codecov for code coverage reporting ([ed5b73e](https://github.com/gander-tools/playground-js-lib/commit/ed5b73ecde84a8877b48826a01f313c047ebac1f))
* add codeql security scanning workflow ([da0a48f](https://github.com/gander-tools/playground-js-lib/commit/da0a48fd0376428f99c05e609c62e01f8a4d68f3))
* add dependency review for vulnerability detection ([9dc9e9f](https://github.com/gander-tools/playground-js-lib/commit/9dc9e9f9d42e23a551d54c5529f90b5196d81de9))
* add gitleaks for automated secrets detection ([467d8f7](https://github.com/gander-tools/playground-js-lib/commit/467d8f7d783aa6ebee710451b37d64a76b5b84e5))
* add markdownlint for markdown file validation ([195c419](https://github.com/gander-tools/playground-js-lib/commit/195c4193f8e035c12656e59d478df0392f8e58cb))
* add openssf scorecard for supply chain security ([5bcb1f7](https://github.com/gander-tools/playground-js-lib/commit/5bcb1f77f2597414904e0593d1bddd164990c4cc))
* add sbom generation for supply chain transparency ([01d40df](https://github.com/gander-tools/playground-js-lib/commit/01d40dfe38629c94c27e6bc668e51f023c6d3b41))
* add semgrep for advanced static security analysis ([4a311ac](https://github.com/gander-tools/playground-js-lib/commit/4a311ac313cb0acf0a64d7b22f4c435fda1f606e))
* add step-security/harden-runner to critical workflows ([a06cbf9](https://github.com/gander-tools/playground-js-lib/commit/a06cbf9f4d9a8e47a6421da33c7b1eef8179184f))
* add trivy for comprehensive vulnerability scanning ([4c750e0](https://github.com/gander-tools/playground-js-lib/commit/4c750e06ca2c1c1931b77e2d86d6f0ad75014dbf))


### Bug Fixes

* enable actionlint to block ci on workflow errors ([96f4562](https://github.com/gander-tools/playground-js-lib/commit/96f456262637082d1dccbb15d90853ad9d383c75))
* group output redirects to resolve shellcheck sc2129 ([a606bc6](https://github.com/gander-tools/playground-js-lib/commit/a606bc65f540837bc8c23521cce0adef21762345))
* make actionlint non-blocking for pre-existing shellcheck issues ([a94bf86](https://github.com/gander-tools/playground-js-lib/commit/a94bf86269da9d4df8d7001a7db968922e549a29))
* relax markdownlint rules for existing markdown files ([9d69eff](https://github.com/gander-tools/playground-js-lib/commit/9d69eff048c270f3d45f723f823a220f8d86badc))
* remove codeql workflow conflicting with default setup ([61b9e8c](https://github.com/gander-tools/playground-js-lib/commit/61b9e8c7ba8a5d059c0d360a4a086f14dcf2c1d1))
* remove gitleaks workflow ([14886ac](https://github.com/gander-tools/playground-js-lib/commit/14886acda58427215e3f2fd50a12278b0b2548ff))
* remove semgrep workflow due to sarif generation issues ([e9c5f0a](https://github.com/gander-tools/playground-js-lib/commit/e9c5f0a661e2cea64ae802429ba829bcb8b6c975))
* remove trivy workflow due to nested action sha pinning issues ([ce5d450](https://github.com/gander-tools/playground-js-lib/commit/ce5d450e580dfa73db99bde84f8613eacd9fe5aa))
* replace invalid sha references with version tags ([1a5a027](https://github.com/gander-tools/playground-js-lib/commit/1a5a027412cb16ebf781f7864be1a5cad02e9662))
* resolve all shellcheck issues in workflow files ([2f1e78a](https://github.com/gander-tools/playground-js-lib/commit/2f1e78a88cc59848462854bebf7e8c11e0e7638a))
* update all actions to use valid commit sha pinning ([d75b330](https://github.com/gander-tools/playground-js-lib/commit/d75b3300c300917d72c683262d2eb6c2296c1793))
* update gitleaks action to valid sha reference ([77718ef](https://github.com/gander-tools/playground-js-lib/commit/77718efab72ef4a604e89e9703442bfa0e3fe40a))
* use npm instead of bun in lefthook pre-commit hook ([69a4bf6](https://github.com/gander-tools/playground-js-lib/commit/69a4bf6a0374375deed60ec083b358b9cb3e650c))
* use npm instead of bun in lefthook pre-commit hook ([#127](https://github.com/gander-tools/playground-js-lib/issues/127)) ([9b3dd2b](https://github.com/gander-tools/playground-js-lib/commit/9b3dd2bbe788dbc660fa4b149cac247cba204f15))

## [0.10.8](https://github.com/gander-tools/playground-js-lib/compare/v0.10.7...v0.10.8) (2025-11-28)


### Bug Fixes

* Update condition for format-files job ([0d7b748](https://github.com/gander-tools/playground-js-lib/commit/0d7b748b911150bf2d1a08c8ee3f1798b0970369))
* Update condition for format-files job ([#123](https://github.com/gander-tools/playground-js-lib/issues/123)) ([e5456e5](https://github.com/gander-tools/playground-js-lib/commit/e5456e539bc9067a5ab02559a8fe648d46afa86e))

## [0.10.7](https://github.com/gander-tools/playground-js-lib/compare/v0.10.6...v0.10.7) (2025-11-27)


### Features

* add auto-format workflow for release please prs ([be1a07f](https://github.com/gander-tools/playground-js-lib/commit/be1a07fa6349c2981fa2d8d8ff55e01cdb6dcd30))
* add auto-format workflow for release please prs ([#121](https://github.com/gander-tools/playground-js-lib/issues/121)) ([75a696f](https://github.com/gander-tools/playground-js-lib/commit/75a696fd34658a6aea5581d5ade277cbb1d4ac86))


### Bug Fixes

* correct yaml syntax in format-release-pr workflow ([434acb6](https://github.com/gander-tools/playground-js-lib/commit/434acb6f438cf1b10fece53216562a9fe11fca13))
* exclude release please prs from automerge workflow ([ad67252](https://github.com/gander-tools/playground-js-lib/commit/ad67252c468e035830a4cb7d82bdf008dd11834f))
* exclude release please prs from automerge workflow ([#120](https://github.com/gander-tools/playground-js-lib/issues/120)) ([f33d0de](https://github.com/gander-tools/playground-js-lib/commit/f33d0decda5291c8f73073a4b17f8bce239ced38))


### Documentation

* add github actions implementation notes and semantic-release incompatibility explanation ([9881034](https://github.com/gander-tools/playground-js-lib/commit/9881034a5c876076cd3dcbbba99abf1aa01da32d))

## [0.10.6](https://github.com/gander-tools/playground-js-lib/compare/v0.10.5...v0.10.6) (2025-11-27)


### Bug Fixes

* update denoland/setup-deno to correct v2.0.3 SHA ([b1b379f](https://github.com/gander-tools/playground-js-lib/commit/b1b379ffca0148e3b07d448d82f03262d0518e0e))
* update denoland/setup-deno to correct v2.0.3 SHA ([#112](https://github.com/gander-tools/playground-js-lib/issues/112)) ([27fbdb6](https://github.com/gander-tools/playground-js-lib/commit/27fbdb656ddb1767aba7e632ab98fd9ce6160ad4))

## [0.10.5](https://github.com/gander-tools/playground-js-lib/compare/v0.10.4...v0.10.5) (2025-11-27)


### Documentation

* add first-time publish limitation for trusted publishers ([fa8a1be](https://github.com/gander-tools/playground-js-lib/commit/fa8a1be9a9770333cd5cba55ebc56ef9f88ed75a))
* add npm trusted publishers configuration to CLAUDE.md ([34bddd4](https://github.com/gander-tools/playground-js-lib/commit/34bddd474d33c3bbe85034aa03affb04a31e1403))
* add npm trusted publishers configuration to CLAUDE.md ([#107](https://github.com/gander-tools/playground-js-lib/issues/107)) ([70b0908](https://github.com/gander-tools/playground-js-lib/commit/70b09086203a4c374efb4f3a8bde45a7a1a4aa6e))
* fix trusted publisher troubleshooting info in claude.md ([26d2571](https://github.com/gander-tools/playground-js-lib/commit/26d2571c3eb24138fc70633f28676e8b8eae68d6))

## [0.10.4](https://github.com/gander-tools/playground-js-lib/compare/v0.10.3...v0.10.4) (2025-11-27)


### Documentation

* add merge commit configuration guide for release please ([927e7e2](https://github.com/gander-tools/playground-js-lib/commit/927e7e206687030c66ddeb03a8cf816e4f6c8d3b))
* add merge commit configuration guide for release please ([#103](https://github.com/gander-tools/playground-js-lib/issues/103)) ([a23cda4](https://github.com/gander-tools/playground-js-lib/commit/a23cda4cfb1d0dd0d4a31f7db37fbe150a2644b4))

## [0.10.3](https://github.com/gander-tools/playground-js-lib/compare/v0.10.2...v0.10.3) (2025-11-27)


### Documentation

* compact claude.md and prioritize conventional commits section ([9dfdf48](https://github.com/gander-tools/playground-js-lib/commit/9dfdf4809032a9733148436572cd1d8ef048cdf7))
* compact claude.md and prioritize conventional commits section ([a0d7554](https://github.com/gander-tools/playground-js-lib/commit/a0d755495334db2c92bedcfb5f4663d19cfbddd8))

## [0.10.2](https://github.com/gander-tools/playground-js-lib/compare/v0.10.1...v0.10.2) (2025-11-27)


### Features

* add claude code hooks configuration ([#97](https://github.com/gander-tools/playground-js-lib/issues/97)) ([e4303d9](https://github.com/gander-tools/playground-js-lib/commit/e4303d940352bb0203097410d4a9176a9421f600))

## [0.10.1](https://github.com/gander-tools/playground-js-lib/compare/v0.10.0...v0.10.1) (2025-11-27)


### Bug Fixes

* add NODE_AUTH_TOKEN to npm publish step in release workflow ([d2d12a7](https://github.com/gander-tools/playground-js-lib/commit/d2d12a77d7611b78c5fba1ce7119d795649eb327))
* add NODE_AUTH_TOKEN to npm publish step in release workflow ([9786ee1](https://github.com/gander-tools/playground-js-lib/commit/9786ee18abe6924d026cb29670d241042bee2696))
* resolve formatting error in jsr.json blocking Release Please publishing ([50c778e](https://github.com/gander-tools/playground-js-lib/commit/50c778e5ab8f1645d6be8baaf672060961c97651))


### Documentation

* add branch protection configuration guide to prevent broken releases ([6474c1f](https://github.com/gander-tools/playground-js-lib/commit/6474c1ff111e0484ec3f18d7f6454a0b6e4535f5))
* add branch protection configuration guide to prevent broken releases ([0dab8b5](https://github.com/gander-tools/playground-js-lib/commit/0dab8b5a4b5e5e98caf5819787f7757e818a9147))

## [0.10.0](https://github.com/gander-tools/playground-js-lib/compare/v0.9.0...v0.10.0) (2025-11-27)


### ⚠ BREAKING CHANGES

* Release process now requires Conventional Commits format

### Features

* add auto PR creation workflow for Claude branches ([fb212c3](https://github.com/gander-tools/playground-js-lib/commit/fb212c38457bd9f83f5cc2ecf6c01a8b97d62634))
* add auto PR creation workflow for Claude branches ([7045cbb](https://github.com/gander-tools/playground-js-lib/commit/7045cbb02f29615a42e8fc892379a79dd8477c81))
* add controlled versioning strategy to Release Please ([026d6b2](https://github.com/gander-tools/playground-js-lib/commit/026d6b238ead65bbaacce20195f1f2437b173477))
* add controlled versioning strategy to Release Please ([dd36ce9](https://github.com/gander-tools/playground-js-lib/commit/dd36ce9e15d10ab60998c4be3e388ca208811869))
* add Release Please automated release workflow ([1197d15](https://github.com/gander-tools/playground-js-lib/commit/1197d15c4895f6f6b5a88188900621e40c9f4827))
* add Release Please automated release workflow ([c39305a](https://github.com/gander-tools/playground-js-lib/commit/c39305ab58dedd7b0a9723038f18b4c3f67f29c9))
* change changelog ([6243276](https://github.com/gander-tools/playground-js-lib/commit/6243276b1c21c8d85487e5b4e95f5cd3b80f2f8d))
* change changelog again ([9be29dc](https://github.com/gander-tools/playground-js-lib/commit/9be29dcfa51f235f4e05b5016f04d863f5e3215a))
* **dep:** trying new dependabot bun support ([9745c47](https://github.com/gander-tools/playground-js-lib/commit/9745c47c7c63c90be959c57859f36a1d81cd87aa))
* git-cliff ([f8cff8f](https://github.com/gander-tools/playground-js-lib/commit/f8cff8fa64e0c62f411a123725779a34df96681b))
* release:dry ([170408d](https://github.com/gander-tools/playground-js-lib/commit/170408d82380783800c8dd2ceda9596bc4a66dea)), closes [#4](https://github.com/gander-tools/playground-js-lib/issues/4)
* remote.github ([893d252](https://github.com/gander-tools/playground-js-lib/commit/893d25232ca20bfde49561d89c5100a615040a6a))
* sandbox ([3ae89a7](https://github.com/gander-tools/playground-js-lib/commit/3ae89a733621e8f4bb71a201dd2cdabe2056a558))
* try something... ([22c264f](https://github.com/gander-tools/playground-js-lib/commit/22c264f1b749abd2d48b8f443a720c53165f9c1e))
* use first commit message as PR title ([febc2b2](https://github.com/gander-tools/playground-js-lib/commit/febc2b2150c3aee338b8561071884648f8b47255))


### Bug Fixes

* add pkg.pr.new uses bun ([ddd8f5d](https://github.com/gander-tools/playground-js-lib/commit/ddd8f5de0439da35d216281e08427293735d94d4))
* add robust error handling to auto-pr workflow ([409d6c1](https://github.com/gander-tools/playground-js-lib/commit/409d6c132ae20cf497ab19fb1972b3ed4dac8248))
* add robust error handling to auto-pr workflow ([60b2e8a](https://github.com/gander-tools/playground-js-lib/commit/60b2e8a4f18be155e41c796c00fc63776ed4e74e))
* breh ([36cc095](https://github.com/gander-tools/playground-js-lib/commit/36cc095a6029df04b2a6b270421ef136b54f0714))
* bun run pkg-pr-new ([218b44d](https://github.com/gander-tools/playground-js-lib/commit/218b44d0ab9f5d4b7bea3d97a7ff6b3ed3323a83))
* bunx pkg-pr-new ([88e20c9](https://github.com/gander-tools/playground-js-lib/commit/88e20c915d2450bde0f645c33667666475e8fdca))
* change base branch from main to master in auto-pr workflow ([f5c592d](https://github.com/gander-tools/playground-js-lib/commit/f5c592d17aedf0ff7b7452caa3b76a3d8862fd0f))
* change release-please trigger branch from main to master ([908e0e2](https://github.com/gander-tools/playground-js-lib/commit/908e0e2e3b2cf5809a513f8d7f1afe27667fa209))
* change release-please trigger branch from main to master ([606ba79](https://github.com/gander-tools/playground-js-lib/commit/606ba79f18a013e5a60b89b87d76607eab9e430c))
* changelog fix [#10](https://github.com/gander-tools/playground-js-lib/issues/10) ([50bf122](https://github.com/gander-tools/playground-js-lib/commit/50bf1220750c747e54f56e9853750b799fefd0de))
* changelog test ([0e71437](https://github.com/gander-tools/playground-js-lib/commit/0e7143778742ae2e83dae82b63f39f40bec583e0))
* CHANGELOG.md ([0da2fe3](https://github.com/gander-tools/playground-js-lib/commit/0da2fe3b812721a65ee9eccf1760812f3d9e1387))
* correct biome.json config and format build test ([#86](https://github.com/gander-tools/playground-js-lib/issues/86)) ([2d93429](https://github.com/gander-tools/playground-js-lib/commit/2d9342983f2fdeac071d209aad0d66fea4eba1d0))
* index.ts ([5d8e00f](https://github.com/gander-tools/playground-js-lib/commit/5d8e00f8d5daaaad3503fa707625fa3caac15c3d))
* JSR ([9b5d3e4](https://github.com/gander-tools/playground-js-lib/commit/9b5d3e4b5868f0484e11c0c95a46c54771cd3748))
* naaah ([6051799](https://github.com/gander-tools/playground-js-lib/commit/6051799a594213c02eaf31123df1d21cbc05a2f5))
* nope changelog ([d8e9b3d](https://github.com/gander-tools/playground-js-lib/commit/d8e9b3dc347d5338f2bcabf3ebeb9999d34c618b))
* npm pkg fix ([3bd5fed](https://github.com/gander-tools/playground-js-lib/commit/3bd5fedb17bf242fd0dd3413f0329c1e60ceabbf))
* package script name ([c44b8f6](https://github.com/gander-tools/playground-js-lib/commit/c44b8f6c29b8f387917cac77afbd024bce01e5aa))
* package.json schema ([c7f9902](https://github.com/gander-tools/playground-js-lib/commit/c7f9902308a783393d150a04b90e0162b0613fe8))
* pin actions/checkout to commit SHA in auto-pr workflow ([b5b681f](https://github.com/gander-tools/playground-js-lib/commit/b5b681f9261b120aa41312eb01abbcb6dfdfbf2b))
* pin actions/checkout to commit SHA in auto-pr workflow ([0a1cb4e](https://github.com/gander-tools/playground-js-lib/commit/0a1cb4e23f2536152143403503a2a8fde18eed2d))
* pre-commit ([551b6cc](https://github.com/gander-tools/playground-js-lib/commit/551b6cc4a19d054b8248cd1c8e91a18f76b68edf))
* prettier ignore CHANGELOG.md ([954eb05](https://github.com/gander-tools/playground-js-lib/commit/954eb05917acce591a8f96d3576cfd113c194ab6))
* publish uses bun ([0cb2b18](https://github.com/gander-tools/playground-js-lib/commit/0cb2b18bf9280f21a8880df67dce8f722fb57913))
* release changelog generation command ([3fa81dd](https://github.com/gander-tools/playground-js-lib/commit/3fa81dda09db8927275caef5531e650508aa5f04))
* release hooks ([8850cc5](https://github.com/gander-tools/playground-js-lib/commit/8850cc58e76b2c9568d05b82aebbfa8bb8871065))
* remove component prefix from release tags ([#90](https://github.com/gander-tools/playground-js-lib/issues/90)) ([a123503](https://github.com/gander-tools/playground-js-lib/commit/a12350302ab643240da7ec51a9b58adb559a5c36))
* remove console.log ([7837174](https://github.com/gander-tools/playground-js-lib/commit/78371747a5cf0f9790be9a24143769838e8b520b))
* remove invalid package-name input from release-please workflow ([f063e7a](https://github.com/gander-tools/playground-js-lib/commit/f063e7ace93e731f5d461a194e9cd9e31ce7dc7f))
* remove invalid package-name input from release-please workflow ([bfe3818](https://github.com/gander-tools/playground-js-lib/commit/bfe3818f78f266a4691286c980a23ef72704feac))
* remove NPM_TOKEN from npm publish step for Trusted Publishing ([cd03f1d](https://github.com/gander-tools/playground-js-lib/commit/cd03f1d545056532400780dab5648643ceae0cc4))
* remove NPM_TOKEN from npm publish step for Trusted Publishing ([f700bd8](https://github.com/gander-tools/playground-js-lib/commit/f700bd8dcef22eb694775a90e5961930ab5ec0c8))
* remove NPM_TOKEN from npm publish step for Trusted Publishing ([52fc92a](https://github.com/gander-tools/playground-js-lib/commit/52fc92a1cce30acef83bed6a89ea2a20b0b3b94a))
* remove NPM_TOKEN from npm publish step for Trusted Publishing ([1d40cac](https://github.com/gander-tools/playground-js-lib/commit/1d40cace978b0f6f1b2ffb0da4cc919cbab87345))
* rozwiązanie ([8b1b45b](https://github.com/gander-tools/playground-js-lib/commit/8b1b45beea66d59ec318b3f00eef45df82cd4ad6))
* strip Release commits ([bc3079e](https://github.com/gander-tools/playground-js-lib/commit/bc3079e3a061b3fa840462fd4c33c73f5fb0eeb3))
* update publint validation test to use npx and check for success message ([fdf4243](https://github.com/gander-tools/playground-js-lib/commit/fdf4243b3fd9270c22fa977ba42147c30445eba6))
* update publint validation test to use npx and check for success message ([8d79c59](https://github.com/gander-tools/playground-js-lib/commit/8d79c593ab2c7d38b535b63878c00e1576493f9f))


### Documentation

* add CLAUDE.md with project documentation ([0b054b9](https://github.com/gander-tools/playground-js-lib/commit/0b054b97e33748e4aafb10067ba5a14c0b96ce68))
* add CLAUDE.md with project documentation ([abb8041](https://github.com/gander-tools/playground-js-lib/commit/abb804131d249e43c0ac4eb30384014b6ea9ea9f))
* add comprehensive maintainer guide for Release Please ([7ac5771](https://github.com/gander-tools/playground-js-lib/commit/7ac57719e6ad401fca1c88b817eeab48ca0b0f31))
* add comprehensive Release Please control documentation ([84894ab](https://github.com/gander-tools/playground-js-lib/commit/84894abcef7454436a055cfd793c44ed13c13d17))
* add npm usage instructions for Claude Code ([5f8b215](https://github.com/gander-tools/playground-js-lib/commit/5f8b215d705c6e2a96e7e43fe732d0008b92bd8b))
* add npm usage instructions for Claude Code ([49c4185](https://github.com/gander-tools/playground-js-lib/commit/49c4185c7af8b78cbe495eb6a2ec206da1eb1ec8))
* poprawki ([0677b1e](https://github.com/gander-tools/playground-js-lib/commit/0677b1e1e4cf4b2330242e7d0090c6d8342fe79c))
* README ([4ce8657](https://github.com/gander-tools/playground-js-lib/commit/4ce86570a2862513d5965bca1a1bcb979d544c38))
* README ([3869c29](https://github.com/gander-tools/playground-js-lib/commit/3869c2943dd10bbc5a05ac408fd425bdff29af0a))


### Code Refactoring

* .release-it.ts ([92dedeb](https://github.com/gander-tools/playground-js-lib/commit/92dedeb673e41628048d5f7ee63c9b2610692177))
* .release-it.ts ([d214720](https://github.com/gander-tools/playground-js-lib/commit/d214720c559b855634d178da9a95287be7dd44e5))
* .release-it.ts ([a981dd1](https://github.com/gander-tools/playground-js-lib/commit/a981dd18bc2bc980b61b3abec2fad27333b125e0))
* .release-it.ts ([54e30ac](https://github.com/gander-tools/playground-js-lib/commit/54e30ac3aa8db5f5626acf8440a4492e830145b2))
* .release-it.ts ([020f4a8](https://github.com/gander-tools/playground-js-lib/commit/020f4a8d95211ee9bdc4277fbf8e891fa584062f))
* pre-commit ([81580dc](https://github.com/gander-tools/playground-js-lib/commit/81580dc7d62a1b98620794557d633402521dbc70))

## [0.9.0](https://github.com/gander-tools/playground-js-lib/compare/playground-v0.8.0...playground-v0.9.0) (2025-11-27)


### ⚠ BREAKING CHANGES

* Release process now requires Conventional Commits format

### Features

* add auto PR creation workflow for Claude branches ([fb212c3](https://github.com/gander-tools/playground-js-lib/commit/fb212c38457bd9f83f5cc2ecf6c01a8b97d62634))
* add auto PR creation workflow for Claude branches ([7045cbb](https://github.com/gander-tools/playground-js-lib/commit/7045cbb02f29615a42e8fc892379a79dd8477c81))
* add controlled versioning strategy to Release Please ([026d6b2](https://github.com/gander-tools/playground-js-lib/commit/026d6b238ead65bbaacce20195f1f2437b173477))
* add controlled versioning strategy to Release Please ([dd36ce9](https://github.com/gander-tools/playground-js-lib/commit/dd36ce9e15d10ab60998c4be3e388ca208811869))
* add Release Please automated release workflow ([1197d15](https://github.com/gander-tools/playground-js-lib/commit/1197d15c4895f6f6b5a88188900621e40c9f4827))
* add Release Please automated release workflow ([c39305a](https://github.com/gander-tools/playground-js-lib/commit/c39305ab58dedd7b0a9723038f18b4c3f67f29c9))
* change changelog ([6243276](https://github.com/gander-tools/playground-js-lib/commit/6243276b1c21c8d85487e5b4e95f5cd3b80f2f8d))
* change changelog again ([9be29dc](https://github.com/gander-tools/playground-js-lib/commit/9be29dcfa51f235f4e05b5016f04d863f5e3215a))
* **dep:** trying new dependabot bun support ([9745c47](https://github.com/gander-tools/playground-js-lib/commit/9745c47c7c63c90be959c57859f36a1d81cd87aa))
* git-cliff ([f8cff8f](https://github.com/gander-tools/playground-js-lib/commit/f8cff8fa64e0c62f411a123725779a34df96681b))
* release:dry ([170408d](https://github.com/gander-tools/playground-js-lib/commit/170408d82380783800c8dd2ceda9596bc4a66dea)), closes [#4](https://github.com/gander-tools/playground-js-lib/issues/4)
* remote.github ([893d252](https://github.com/gander-tools/playground-js-lib/commit/893d25232ca20bfde49561d89c5100a615040a6a))
* sandbox ([3ae89a7](https://github.com/gander-tools/playground-js-lib/commit/3ae89a733621e8f4bb71a201dd2cdabe2056a558))
* try something... ([22c264f](https://github.com/gander-tools/playground-js-lib/commit/22c264f1b749abd2d48b8f443a720c53165f9c1e))
* use first commit message as PR title ([febc2b2](https://github.com/gander-tools/playground-js-lib/commit/febc2b2150c3aee338b8561071884648f8b47255))


### Bug Fixes

* add pkg.pr.new uses bun ([ddd8f5d](https://github.com/gander-tools/playground-js-lib/commit/ddd8f5de0439da35d216281e08427293735d94d4))
* add robust error handling to auto-pr workflow ([409d6c1](https://github.com/gander-tools/playground-js-lib/commit/409d6c132ae20cf497ab19fb1972b3ed4dac8248))
* add robust error handling to auto-pr workflow ([60b2e8a](https://github.com/gander-tools/playground-js-lib/commit/60b2e8a4f18be155e41c796c00fc63776ed4e74e))
* breh ([36cc095](https://github.com/gander-tools/playground-js-lib/commit/36cc095a6029df04b2a6b270421ef136b54f0714))
* bun run pkg-pr-new ([218b44d](https://github.com/gander-tools/playground-js-lib/commit/218b44d0ab9f5d4b7bea3d97a7ff6b3ed3323a83))
* bunx pkg-pr-new ([88e20c9](https://github.com/gander-tools/playground-js-lib/commit/88e20c915d2450bde0f645c33667666475e8fdca))
* change base branch from main to master in auto-pr workflow ([f5c592d](https://github.com/gander-tools/playground-js-lib/commit/f5c592d17aedf0ff7b7452caa3b76a3d8862fd0f))
* change release-please trigger branch from main to master ([908e0e2](https://github.com/gander-tools/playground-js-lib/commit/908e0e2e3b2cf5809a513f8d7f1afe27667fa209))
* change release-please trigger branch from main to master ([606ba79](https://github.com/gander-tools/playground-js-lib/commit/606ba79f18a013e5a60b89b87d76607eab9e430c))
* changelog fix [#10](https://github.com/gander-tools/playground-js-lib/issues/10) ([50bf122](https://github.com/gander-tools/playground-js-lib/commit/50bf1220750c747e54f56e9853750b799fefd0de))
* changelog test ([0e71437](https://github.com/gander-tools/playground-js-lib/commit/0e7143778742ae2e83dae82b63f39f40bec583e0))
* CHANGELOG.md ([0da2fe3](https://github.com/gander-tools/playground-js-lib/commit/0da2fe3b812721a65ee9eccf1760812f3d9e1387))
* correct biome.json config and format build test ([#86](https://github.com/gander-tools/playground-js-lib/issues/86)) ([2d93429](https://github.com/gander-tools/playground-js-lib/commit/2d9342983f2fdeac071d209aad0d66fea4eba1d0))
* index.ts ([5d8e00f](https://github.com/gander-tools/playground-js-lib/commit/5d8e00f8d5daaaad3503fa707625fa3caac15c3d))
* JSR ([9b5d3e4](https://github.com/gander-tools/playground-js-lib/commit/9b5d3e4b5868f0484e11c0c95a46c54771cd3748))
* naaah ([6051799](https://github.com/gander-tools/playground-js-lib/commit/6051799a594213c02eaf31123df1d21cbc05a2f5))
* nope changelog ([d8e9b3d](https://github.com/gander-tools/playground-js-lib/commit/d8e9b3dc347d5338f2bcabf3ebeb9999d34c618b))
* npm pkg fix ([3bd5fed](https://github.com/gander-tools/playground-js-lib/commit/3bd5fedb17bf242fd0dd3413f0329c1e60ceabbf))
* package script name ([c44b8f6](https://github.com/gander-tools/playground-js-lib/commit/c44b8f6c29b8f387917cac77afbd024bce01e5aa))
* package.json schema ([c7f9902](https://github.com/gander-tools/playground-js-lib/commit/c7f9902308a783393d150a04b90e0162b0613fe8))
* pin actions/checkout to commit SHA in auto-pr workflow ([b5b681f](https://github.com/gander-tools/playground-js-lib/commit/b5b681f9261b120aa41312eb01abbcb6dfdfbf2b))
* pin actions/checkout to commit SHA in auto-pr workflow ([0a1cb4e](https://github.com/gander-tools/playground-js-lib/commit/0a1cb4e23f2536152143403503a2a8fde18eed2d))
* pre-commit ([551b6cc](https://github.com/gander-tools/playground-js-lib/commit/551b6cc4a19d054b8248cd1c8e91a18f76b68edf))
* prettier ignore CHANGELOG.md ([954eb05](https://github.com/gander-tools/playground-js-lib/commit/954eb05917acce591a8f96d3576cfd113c194ab6))
* publish uses bun ([0cb2b18](https://github.com/gander-tools/playground-js-lib/commit/0cb2b18bf9280f21a8880df67dce8f722fb57913))
* release changelog generation command ([3fa81dd](https://github.com/gander-tools/playground-js-lib/commit/3fa81dda09db8927275caef5531e650508aa5f04))
* release hooks ([8850cc5](https://github.com/gander-tools/playground-js-lib/commit/8850cc58e76b2c9568d05b82aebbfa8bb8871065))
* remove console.log ([7837174](https://github.com/gander-tools/playground-js-lib/commit/78371747a5cf0f9790be9a24143769838e8b520b))
* remove invalid package-name input from release-please workflow ([f063e7a](https://github.com/gander-tools/playground-js-lib/commit/f063e7ace93e731f5d461a194e9cd9e31ce7dc7f))
* remove invalid package-name input from release-please workflow ([bfe3818](https://github.com/gander-tools/playground-js-lib/commit/bfe3818f78f266a4691286c980a23ef72704feac))
* remove NPM_TOKEN from npm publish step for Trusted Publishing ([cd03f1d](https://github.com/gander-tools/playground-js-lib/commit/cd03f1d545056532400780dab5648643ceae0cc4))
* remove NPM_TOKEN from npm publish step for Trusted Publishing ([f700bd8](https://github.com/gander-tools/playground-js-lib/commit/f700bd8dcef22eb694775a90e5961930ab5ec0c8))
* remove NPM_TOKEN from npm publish step for Trusted Publishing ([52fc92a](https://github.com/gander-tools/playground-js-lib/commit/52fc92a1cce30acef83bed6a89ea2a20b0b3b94a))
* remove NPM_TOKEN from npm publish step for Trusted Publishing ([1d40cac](https://github.com/gander-tools/playground-js-lib/commit/1d40cace978b0f6f1b2ffb0da4cc919cbab87345))
* rozwiązanie ([8b1b45b](https://github.com/gander-tools/playground-js-lib/commit/8b1b45beea66d59ec318b3f00eef45df82cd4ad6))
* strip Release commits ([bc3079e](https://github.com/gander-tools/playground-js-lib/commit/bc3079e3a061b3fa840462fd4c33c73f5fb0eeb3))
* update publint validation test to use npx and check for success message ([fdf4243](https://github.com/gander-tools/playground-js-lib/commit/fdf4243b3fd9270c22fa977ba42147c30445eba6))
* update publint validation test to use npx and check for success message ([8d79c59](https://github.com/gander-tools/playground-js-lib/commit/8d79c593ab2c7d38b535b63878c00e1576493f9f))


### Documentation

* add CLAUDE.md with project documentation ([0b054b9](https://github.com/gander-tools/playground-js-lib/commit/0b054b97e33748e4aafb10067ba5a14c0b96ce68))
* add CLAUDE.md with project documentation ([abb8041](https://github.com/gander-tools/playground-js-lib/commit/abb804131d249e43c0ac4eb30384014b6ea9ea9f))
* add comprehensive maintainer guide for Release Please ([7ac5771](https://github.com/gander-tools/playground-js-lib/commit/7ac57719e6ad401fca1c88b817eeab48ca0b0f31))
* add comprehensive Release Please control documentation ([84894ab](https://github.com/gander-tools/playground-js-lib/commit/84894abcef7454436a055cfd793c44ed13c13d17))
* add npm usage instructions for Claude Code ([5f8b215](https://github.com/gander-tools/playground-js-lib/commit/5f8b215d705c6e2a96e7e43fe732d0008b92bd8b))
* add npm usage instructions for Claude Code ([49c4185](https://github.com/gander-tools/playground-js-lib/commit/49c4185c7af8b78cbe495eb6a2ec206da1eb1ec8))
* poprawki ([0677b1e](https://github.com/gander-tools/playground-js-lib/commit/0677b1e1e4cf4b2330242e7d0090c6d8342fe79c))
* README ([4ce8657](https://github.com/gander-tools/playground-js-lib/commit/4ce86570a2862513d5965bca1a1bcb979d544c38))
* README ([3869c29](https://github.com/gander-tools/playground-js-lib/commit/3869c2943dd10bbc5a05ac408fd425bdff29af0a))


### Code Refactoring

* .release-it.ts ([92dedeb](https://github.com/gander-tools/playground-js-lib/commit/92dedeb673e41628048d5f7ee63c9b2610692177))
* .release-it.ts ([d214720](https://github.com/gander-tools/playground-js-lib/commit/d214720c559b855634d178da9a95287be7dd44e5))
* .release-it.ts ([a981dd1](https://github.com/gander-tools/playground-js-lib/commit/a981dd18bc2bc980b61b3abec2fad27333b125e0))
* .release-it.ts ([54e30ac](https://github.com/gander-tools/playground-js-lib/commit/54e30ac3aa8db5f5626acf8440a4492e830145b2))
* .release-it.ts ([020f4a8](https://github.com/gander-tools/playground-js-lib/commit/020f4a8d95211ee9bdc4277fbf8e891fa584062f))
* pre-commit ([81580dc](https://github.com/gander-tools/playground-js-lib/commit/81580dc7d62a1b98620794557d633402521dbc70))

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
