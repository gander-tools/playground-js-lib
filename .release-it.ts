import type { Config } from "release-it";

export default {
    git: {
        commit: true,
        commitArgs: ["-S"],
        tag: true,
        tagArgs: ["-s"],
        push: true,
        changelog: "NI_DEFAULT_AGENT='npm' nlx auto-changelog --stdout --commit-limit false -u",
    },
    github: {
        release: false,
    },
    npm: {
        publish: false,
    },
    hooks: {
        "before:init": [
            //prettier-ignore
            "NI_DEFAULT_AGENT='npm' nr test:run",
            "NI_DEFAULT_AGENT='npm' nr test:types",
            "NI_DEFAULT_AGENT='npm' nr lint",
            "NI_DEFAULT_AGENT='npm' nr lint:format",
            "NI_DEFAULT_AGENT='npm' nr prepack",
            "NI_DEFAULT_AGENT='npm' nr lint:package",
        ],
        "after:bump": "NI_DEFAULT_AGENT='npm' nlx auto-changelog -p",
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
