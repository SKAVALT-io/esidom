const eslintSveltePreprocess = require('./eslint-svelte-preprocess');

module.exports = {
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
                moduleDirectory: ['node_modules/', 'src/'],
            },
        },
        'svelte3/preprocess': eslintSveltePreprocess(),
        'svelte3/ignore-styles': () => true,
    },
    env: {
        browser: true,
        es2021: true,
        // 'jest/globals': true,
    },
    extends: [
        'airbnb-base',
        'plugin:jest/recommended',
        'plugin:jest/style',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint',
        'jest',
        'svelte3',
    ],
    rules: {
        indent: ['error', 4],
        'no-console': 'off',
        'no-plusplus': 'off',
        'import/extensions': 0,
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    },
    overrides: [
        {
            files: ['*.svelte'],
            processor: 'svelte3/svelte3',
            rules: {
                'import/prefer-default-export': 0,
                'import/no-mutable-exports': 0,
            },
        },
    ],
};
