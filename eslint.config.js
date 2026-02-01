import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
    { ignores: ['dist', 'node_modules', 'bin'] },

    eslint.configs.recommended,
    ...tseslint.configs.strictTypeChecked,

    {
        languageOptions: {
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            '@typescript-eslint/consistent-type-imports': 'error',
            '@typescript-eslint/no-explicit-any': 'error',
            'no-console': ['warn', { allow: ['warn', 'error'] }],
        },
    },

    // This MUST be last
    eslintPluginPrettierRecommended,
];
