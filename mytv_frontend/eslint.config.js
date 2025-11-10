import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Ignore built assets
  globalIgnores(['dist']),

  // Node environment overrides for config/build scripts
  {
    files: ['vite.config.js', 'eslint.config.js', '*.config.js', '**/*.config.js', 'scripts/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node, // allow process, __dirname, module, etc.
      },
    },
    rules: {
      // Keep base safety rules
      'no-const-assign': 'error',
      'no-dupe-keys': 'error',
      'no-dupe-args': 'error',
      'no-duplicate-case': 'error',
      'constructor-super': 'error',
    },
  },

  // App source (browser)
  {
    files: ['**/*.{js,jsx}'],
    ignores: ['vite.config.js', 'eslint.config.js', '**/*.config.js', 'scripts/**/*.js'],
    extends: [
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-undef': 'error',
      'no-const-assign': 'error',
      'no-dupe-keys': 'error',
      'no-dupe-args': 'error',
      'no-duplicate-case': 'error',
      'constructor-super': 'error',
      // Guardrail: prevent accidental hard reloads in app code
      'no-restricted-properties': ['warn', {
        object: 'window',
        property: 'location',
        message: 'Avoid forcing reloads (window.location.*). Use router navigation instead.'
      }],
    },
  },
])
