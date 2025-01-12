import type { Config } from "release-it";

export default {
    git: {
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
        // prettier-ignore
        'before:init': [
            'NI_DEFAULT_AGENT="npm" nr test:run',
            'NI_DEFAULT_AGENT="npm" nr test:types',
            'NI_DEFAULT_AGENT="npm" nr lint',
            'NI_DEFAULT_AGENT="npm" nr lint:format',
            'NI_DEFAULT_AGENT="npm" nr prepack',
            'NI_DEFAULT_AGENT="npm" nr lint:package',
        ],
    },
    plugins: {
        "@release-it/bumper": {
            out: {
                file: "jsr.json",
                path: "version",
            },
        },
        // "@release-it/conventional-changelog": {
        //     infile: "CHANGELOG.md",
        //     header: "# Changelog",
        //     preset: {
        //         name: "conventionalcommits",
        //     },
        // },
    },
} satisfies Config;
