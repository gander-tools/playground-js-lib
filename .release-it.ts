import type { Config } from "release-it";

export default {
    git: {
        changelog: "bunx git-cliff --unreleased",
        commit: true,
        commitArgs: ["-S"],
        tag: true,
        tagArgs: ["-s"],
        push: true,
    },
    github: {
        release: true,
        releaseNotes: "echo 'See the [CHANGELOG.md](CHANGELOG.md)'",
    },
    npm: {
        publish: false,
    },
    hooks: {
        "before:init": ["bun run test:run", "bun run test:types", "bun run check", "bun run prepack", "bun run publint"],
        "after:bump": ["bunx git-cliff --output CHANGELOG.md --tag ${version}", "bun run check:fix"],
    },
    plugins: {
        "@release-it/bumper": {
            out: {
                file: "jsr.json",
                path: "version",
            },
        },
    },
} satisfies Config;
