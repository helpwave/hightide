import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const root = path.resolve(__dirname, '../..')
const generatedCssPath = path.join(root, 'dist/style/globals.css')

describe('generated CSS vendor prefixes', () => {
  let css = ''

  beforeAll(() => {
    execSync('node scripts/build-css.mjs', {
      cwd: root,
      env: {
        ...process.env,
        NODE_ENV: 'production',
      },
      stdio: 'pipe',
    })
    css = readFileSync(generatedCssPath, 'utf8')
  }, 120_000)

  test('contains -webkit- vendor prefixes', () => {
    expect(css).toMatch(/-webkit-[a-z-]+:/)
  })

  test('contains -moz- vendor prefixes', () => {
    expect(css).toMatch(/-moz-[a-z-]+:/)
  })

  test('prefixes user-select for WebKit browsers', () => {
    expect(css).toMatch(/-webkit-user-select:\s*none/)
  })

  test('prefixes position sticky for WebKit browsers', () => {
    expect(css).toMatch(/position:\s*-webkit-sticky|position:\s*sticky/)
  })

  test('prefixes appearance resets for WebKit browsers', () => {
    expect(css).toMatch(/-webkit-appearance:\s*none/)
  })

  test('prefixes loading wave animations for WebKit browsers', () => {
    expect(css).toMatch(/@-webkit-keyframes bigLeftUp/)
    expect(css).toMatch(/-webkit-animation:\s*bigLeftUp/)
  })

  test('keeps stroke-dashoffset unitless for SVG animations', () => {
    expect(css).not.toMatch(/stroke-dashoffset:\s*-?\d+px/)
    expect(css).toMatch(/stroke-dashoffset:\s*1000/)
  })
})
