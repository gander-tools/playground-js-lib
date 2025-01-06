import type {Config} from 'release-it';

export default {
    git: {
        requireBranch: 'master',
        commit: true,
        commitMessage: 'chore: release v${version}',
        tag: true,
        tagName: 'v${version}',
        push: true,
    },
    github: {
        release: false,
    },
    npm: {
        publish: false,
    },
    hooks: {
        'before:init': 'bun run prepack',
    },
    plugins: {
        '@release-it/bumper': {
            out: {
                file: 'jsr.json',
                path: 'version',
            },
        },
    },
} satisfies Config;
