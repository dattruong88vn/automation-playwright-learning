import simpleImportSort from 'eslint-plugin-simple-import-sort';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
    {
        ignores: ['node_modules/**', 'dist/**', 'build/**'],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        plugins: {
            'unused-imports': unusedImports,
            'simple-import-sort': simpleImportSort,
        },
        rules: {
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': 'off',

            // Tự động xóa import không sử dụng
            'unused-imports/no-unused-imports': 'error',

            // Cảnh báo biến không sử dụng
            'unused-imports/no-unused-vars': [
                'warn',
                {
                    vars: 'all',
                    varsIgnorePattern: '^_',
                    args: 'after-used',
                    argsIgnorePattern: '^_',
                    ignoreRestSiblings: true,
                },
            ],

            'simple-import-sort/imports': [
                'error',
                {
                    groups: [
                        // 0. Side-effect imports (dotenv/config, polyfills...)
                        ['^\\u0000'],

                        // 1. External packages
                        ['^node:', '^@?\\w'],

                        // 2. Components
                        ['^@/components(?:/|$)'],

                        // 3. Pages
                        ['^@/pages(?:/|$)'],

                        // 4. Hooks
                        ['^@/hooks(?:/|$)'],

                        // 5. Services / API
                        ['^@/(services|api)(?:/|$)'],

                        // 6. Utils / Helpers
                        ['^@/(utils|helpers)(?:/|$)'],

                        // 7. Constants / Config
                        ['^@/(constants|config)(?:/|$)'],

                        // 8. Types
                        ['^@/types(?:/|$)'],

                        // 9. Các internal import khác
                        ['^@/'],

                        // 10. Relative imports
                        ['^\\.'],
                    ],
                },
            ],
            'simple-import-sort/exports': 'error',
        },
    },
    prettier,
);
