import config from '@helpwave/eslint-config'

export default [
  {
    ignores: ['dist/**', 'packages/**', 'node_modules/**'],
  },
  ...config.recommended,
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
