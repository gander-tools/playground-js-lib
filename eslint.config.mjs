// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
    {
        ignores: ["dist/**", "node_modules/**", "coverage/**"],
    },
    eslint.configs.recommended,
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    eslintConfigPrettier,
    {
        languageOptions: {
            parserOptions: {
                projectService: {
                    allowDefaultProject: ["eslint.config.mjs", ".release-it.ts"],
                },
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
);
