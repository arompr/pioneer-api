import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';

export default defineConfig({
    test: {
        root: '.',

        include: ['**/*.{spec,test}.ts'],

        environment: 'node',

        // Coverage settings
        coverage: {
            provider: 'v8', // or 'istanbul'
            reporter: ['text', 'json', 'html'],
            reportsDirectory: '../coverage',
            include: ['**/*.(t|j)s'],
        },
    },
    plugins: [
        // magic part that handles NestJS decorators
        swc.vite({
            module: { type: 'es6' },
        }),
    ],
});
