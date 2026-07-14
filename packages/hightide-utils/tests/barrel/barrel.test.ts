import { execSync } from 'node:child_process'

describe('barrel', () => {
  test('index.ts files are up to date', () => {
    try {
      execSync('node scripts/barrel.js --check', {
        cwd: process.cwd(),
        encoding: 'utf8',
      })
    } catch (error) {
      const execError = error as { stdout?: string, stderr?: string }
      const output = [execError.stdout, execError.stderr].filter(Boolean).join('\n')
      throw new Error(output || 'Barrel check failed. Run: pnpm run barrel')
    }
  })
})
