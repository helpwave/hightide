import config from '@helpwave/eslint-config'

export default [
    {
        ignores: ['dist/**'],
    },
    ...config.recommended
]