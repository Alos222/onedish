const path = require('path');

/**
 * Shared across overrides.
 */
const commonImportRules = {
  'import/order': [
    'error',
    {
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
    },
  ],
  'sort-imports': [
    'error',
    {
      ignoreCase: true,
      ignoreDeclarationSort: true,
    },
  ],
  'no-restricted-imports': ['warn'],
};

module.exports = {
  root: true,
  globals: {
    preval: false,
  },
  extends: ['airbnb', 'airbnb/hooks', 'plugin:jest/recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2022,
  },
  env: {
    es6: true,
    browser: true,
    node: true,
    'jest/globals': true,
  },
  settings: {
    'import/resolver': {
      alias: {
        extensions: ['.ts', '.js', '.jsx', '.tsx'],
      },
    },
    react: {
      version: '18.2.0',
    },
  },
  rules: {
    ...commonImportRules,

    // temporary changes due to airbnb updates
    'default-param-last': 'warn',
    'react/no-unstable-nested-components': 'warn',
    'react/no-array-index-key': 'warn',
    'no-promise-executor-return': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'class-methods-use-this': 'warn',
    'no-unsafe-optional-chaining': 'warn',
    'no-restricted-exports': 'warn',
    'react/jsx-no-constructed-context-values': 'warn',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        mjs: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'prefer-object-spread': 'error',
    'no-underscore-dangle': 'off',
    'consistent-this': ['error', 'self'],
    'max-len': [
      'error',
      100,
      2,
      {
        ignoreUrls: true,
      },
    ], // airbnb is allowing some edge cases
    'no-console': ['error', { allow: ['error'] }], // airbnb is using warn
    'no-param-reassign': 'off', // airbnb use error

    'react/jsx-fragments': ['error', 'syntax'],
    'react/forbid-prop-types': 'off', // airbnb use error
    'react/jsx-filename-extension': [
      'error',
      { extensions: ['.js', '.jsx', '.tsx'] }, // airbnb is using .jsx
    ],
    'react/no-find-dom-node': 'off',
    'react/jsx-props-no-spreading': 'off',

    'prettier/prettier': ['error'],

    'jest/valid-expect': 'off', // for jest-expect-message
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      env: { browser: true, es6: true, node: true },
      extends: [
        'airbnb',
        'airbnb-typescript',
        'airbnb/hooks',
        'plugin:jest/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
      ],
      globals: { Atomics: 'readonly', SharedArrayBuffer: 'readonly' },
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaFeatures: { jsx: true, modules: true },
        ecmaVersion: 2019,
        sourceType: 'module',
        project: path.resolve(__dirname, './tsconfig.json'),
      },
      rules: {
        ...commonImportRules,

        // temporary adjustment due to new rules
        'no-restricted-exports': 'warn',
        '@typescript-eslint/default-param-last': 'warn',
        'react/no-unstable-nested-components': 'warn',
        'react/no-array-index-key': 'warn',
        'no-promise-executor-return': 'warn',
        'react/jsx-no-constructed-context-values': 'warn',
        'react-hooks/exhaustive-deps': 'warn',
        'prefer-regex-literals': 'warn',
        'no-unsafe-optional-chaining': 'warn',

        // causes performance issues in larger codebases
        'import/no-cycle': process.env.ESLINT_IMPORT_NO_CYCLE === 'true' ? 'warn' : 'off',

        // This rule is not able to rewrite Typescript code
        // so I am turning it off for now.
        'react/function-component-definition': 'off',

        'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],

        'react/prop-types': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react/require-default-props': 'off',
        'no-underscore-dangle': 'off',

        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/no-explicit-any': 'error',

        endOfLine: 0,
      },
    },
    {
      files: ['**/*.test.tsx', '**/*.test.ts'],
      rules: {
        ...commonImportRules,
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
};
