import js from '@eslint/js';
import globals from 'globals';
import pluginNode from 'eslint-plugin-n';
import pluginJest from 'eslint-plugin-jest';
import pluginCypress from 'eslint-plugin-cypress';

/** @type {import('eslint').Linter.Config[]} */
export default [
  // ── Ignore generated & downloaded directories ──────────────────────────────
  {
    ignores: ['dist/**', 'temp/**', 'node_modules/**'],
  },

  // ── Règles exigeantes partagées par tous les fichiers JS/MJS ──────────────
  {
    files: ['**/*.{js,mjs}'],
    rules: {
      ...js.configs.recommended.rules,

      // Variables & portée
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' }],
      'no-shadow': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'no-use-before-define': ['error', { functions: false, classes: true, variables: true }],

      // Qualité du code
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'no-implicit-coercion': 'error',
      'no-duplicate-imports': 'error',
      'consistent-return': 'error',
      'no-param-reassign': ['error', { props: false }],
      'object-shorthand': ['error', 'always'],
      'prefer-arrow-callback': 'error',

      // Logs : géré par contexte (error frontend)
    },
  },

  // ── Backend Node.js (tout sauf frontend & e2e) ─────────────────────────────
  {
    files: ['**/*.{js,mjs}'],
    ignores: ['core/frontend/**', 'e2e/**'],
    plugins: { n: pluginNode },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.node },
    },
    rules: {
      'n/no-deprecated-api': 'error',
      'n/prefer-node-protocol': 'error',
    },
  },

  // ── Fichiers de config CJS (babel, jest, cypress) ─────────────────────────
  {
    files: ['babel.config.js', 'jest.config.js', 'e2e/cypress.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
    rules: {
      // require() est légal dans les fichiers CJS
      'no-var': 'error',
    },
  },

  // ── Frontend navigateur ────────────────────────────────────────────────────
  {
    files: ['core/frontend/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        data: 'readonly',
        graphProperties: 'readonly',
        typeList: 'readonly',
        tagList: 'readonly',
        sorting: 'readonly',
        focusIsActive: 'readonly',
        timeline: 'readonly',
      },
    },
    rules: {
      // Aucun console.* dans le code de production du navigateur
      'no-console': 'error',
    },
  },

  // ── Tests unitaires (Jest) ─────────────────────────────────────────────────
  {
    files: ['**/*.spec.js', '**/*.test.js'],
    plugins: { jest: pluginJest },
    languageOptions: {
      globals: { ...globals.jest },
    },
    rules: {
      ...pluginJest.configs['flat/recommended'].rules,
      // ...existing code...
      'jest/prefer-to-be': 'error',
      'jest/prefer-to-have-length': 'error',
      'jest/no-disabled-tests': 'error',
      'jest/no-focused-tests': 'error',
    },
  },

  // ── Tests e2e (Cypress) ────────────────────────────────────────────────────
  {
    files: ['e2e/**/*.cy.js', 'e2e/e2e-support.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        ...globals.browser,
        // Globals Cypress
        cy: 'readonly',
        Cypress: 'readonly',
        describe: 'readonly',
        context: 'readonly',
        it: 'readonly',
        before: 'readonly',
        beforeEach: 'readonly',
        after: 'readonly',
        afterEach: 'readonly',
        expect: 'readonly',
        require: 'readonly',
      },
    },
    plugins: { cypress: pluginCypress },
    rules: {
      ...pluginCypress.configs.recommended.rules,
    },
  },
];
