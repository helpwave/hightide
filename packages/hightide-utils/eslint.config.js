import config from '@helpwave/eslint-config'
import importPlugin from 'eslint-plugin-import'

export default [
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/no-internal-modules': [
        'error',
        {
          forbid: ['**/index', '**/index.ts', '**/index.tsx'],
        },
      ],
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  ...config.recommended,
  {
    ignores: ['src/i18n/translations.ts'],
  },
  {
    files: ['**/*.cjs'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    rules: {
      indent: ['warn', 2],
    },
  },
]
