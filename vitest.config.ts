import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    test: {
        root: '.',

        include: ['**/*.{spec,test}.ts', '**/*.e2e-spec.ts'],

        environment: 'node',

        // Coverage settings
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            reportsDirectory: '../coverage',
            include: ['./src/**/*.{ts,tsx}'],
            exclude: ['./src/main.ts'],
        },
    },
    plugins: [
        tsconfigPaths(),
        // magic part that handles NestJS decorators
        swc.vite({
            module: { type: 'es6' },
        }),
    ],
});
