module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  globalSetup: '<rootDir>/tests/setup/generateTranslations.cjs',
  testMatch: ['**/tests/**/*.test.ts', '**/tests/**/*.test.tsx'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true
      }
    ]
  }
}
