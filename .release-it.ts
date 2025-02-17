import type { Config } from "release-it";

export default {
    git: {
        changelog: "npx git-cliff --unreleased",
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
        "before:init": ["npm run test:run", "npm run test:types", "npm run check", "npm run prepack", "npm run publint"],
        "after:bump": ["npx git-cliff --output CHANGELOG.md --tag ${version}", "npm run check --write"],
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
