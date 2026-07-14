import config from '@helpwave/eslint-config'

export default [
  {
    ignores: ['node_modules/**'],
  },
  ...config.recommended,
  {
    rules: {
      indent: ['warn', 2]
    }
  }
]
