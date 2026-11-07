import type { Config } from "release-it";

export default {
    git: {
        changelog: "npx git-cliff --unreleased",
        commit: true,
        tag: true,
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
        "before:init": ["npm run prepack", "npm run publint"],
        "after:bump": [
            // biome-ignore lint/suspicious/noTemplateCurlyInString: ${version} is a release-it template variable
            "npx git-cliff --output CHANGELOG.md --tag ${version}",
            "npm run check:fix",
        ],
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
