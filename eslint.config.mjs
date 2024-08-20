// @ts-nocheck

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';
import stylistic from '@stylistic/eslint-plugin';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,

    {
        ...playwright.configs['flat/recommended'],
        files: ['tests/**'],
    },
    {
        files: ['tests/**'],
        rules: {
            // Customize Playwright rules
            "playwright/no-conditional-expect": "off",
            "playwright/no-conditional-in-test": "off",
        },
    },
    {
        plugins: {
            '@stylistic': stylistic
        },
        rules: {
            "@stylistic/quotes": [
                "error",
                "single",
                {
                    "avoidEscape": true,
                    "allowTemplateLiterals": true
                }
            ],
            "@stylistic/arrow-spacing": [
                "error",
                {
                    "before": true,
                    "after": true
                }
            ],
            "@stylistic/brace-style": [
                "error",
                "1tbs"
            ],
            "@stylistic/comma-dangle": [
                "error",
                "only-multiline"
            ],
            "@stylistic/semi": [
                "error", 
                "always"
            ],
            "@stylistic/comma-spacing": [
                "error"
            ]
        }
    }
);





