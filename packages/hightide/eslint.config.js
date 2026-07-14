import config from '@helpwave/eslint-config'

export default [
  {
    ignores: ['dist/**', 'packages/**', 'node_modules/**'],
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
      indent: ['warn', 2]
    }
  }
]
