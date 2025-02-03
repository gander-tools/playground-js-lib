import type { Config } from "release-it";

export default {
    git: {
        changelog: "bun run git-cliff --unreleased",
        commit: true,
        commitArgs: ["-S"],
        tag: true,
        tagArgs: ["-s"],
        push: true,
    },
    github: {
        release: false,
    },
    npm: {
        publish: false,
    },
    hooks: {
        "before:init": ["bun run test:run", "bun run test:types", "bun run check", "bun run prepack", "bun run publint"],
        "after:bump": "bun run git-cliff --output CHANGELOG.md --tag ${version}",
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
