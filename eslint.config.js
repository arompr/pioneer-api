import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
    // 1. Global ignores (remains as is)
    { ignores: ['dist', 'node_modules', 'bin'] },

    // 2. Wrap rules in a configuration object restricted to src
    {
        files: ['src/**/*.{ts,js,tsx,jsx}'], // This is the key change
        rules: {
            ...eslint.configs.recommended.rules,
        },
    },

    // 3. TypeScript strict rules restricted to src
    ...tseslint.configs.strictTypeChecked.map((config) => ({
        ...config,
        files: ['src/**/*.{ts,tsx}'],
    })),

    {
        files: ['src/**/*.{ts,tsx}'],
        languageOptions: {
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            '@typescript-eslint/restrict-template-expressions': [
                'error',
                {
                    allowNumber: true,
                    allowBoolean: true,
                },
            ],
            '@typescript-eslint/consistent-type-imports': 'error',
            '@typescript-eslint/no-explicit-any': 'error',
            'no-console': ['warn', { allow: ['warn', 'error'] }],
        },
    },

    // 4. Prettier (usually safe to leave global, but can also be restricted)
    eslintPluginPrettierRecommended,
];
