import config from '@helpwave/eslint-config'

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
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
