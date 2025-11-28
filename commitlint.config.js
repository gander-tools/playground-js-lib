module.exports = {
    extends: ["@commitlint/config-conventional"],
    rules: {
        // Enforce conventional commit types
        "type-enum": [
            2,
            "always",
            [
                "feat", // New feature
                "fix", // Bug fix
                "docs", // Documentation changes
                "style", // Code style changes (formatting, missing semicolons, etc.)
                "refactor", // Code refactoring
                "perf", // Performance improvements
                "test", // Adding or updating tests
                "build", // Build system or external dependencies
                "ci", // CI configuration changes
                "chore", // Other changes that don't modify src or test files
                "revert", // Revert a previous commit
            ],
        ],
        // Subject (commit message) should not be empty
        "subject-empty": [2, "never"],
        // Subject should not end with a period
        "subject-full-stop": [2, "never", "."],
        // Subject should be lowercase (warning, not error)
        "subject-case": [1, "always", "lower-case"],
        // Body should have a blank line before it
        "body-leading-blank": [2, "always"],
        // Footer should have a blank line before it (disabled)
        "footer-leading-blank": [0, "always"],
    },
};
