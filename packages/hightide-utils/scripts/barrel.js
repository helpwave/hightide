#!/usr/bin/env node
import fs from 'fs'
import path from 'path'

const ROOT = path.resolve('src') // or "dist"
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx']

// Paths (relative to ROOT) to exclude
const EXCLUDE = ['style', 'storybook']

// Check for --clean flag
const CLEAN = process.argv.includes('--clean')
const CHECK = process.argv.includes('--check')
const WITH_ROOT = process.argv.includes('--with-root')

const expectedBarrels = new Set()

function isExcluded(relativePath) {
  return EXCLUDE.some(ex => relativePath === ex || relativePath.startsWith(ex + '/'))
}

function collectExportsForDir(dir, relativeDir = '') {
  const files = fs.readdirSync(dir, { withFileTypes: true })
  const exports = []

  for (const f of files) {
    const rel = path.join(relativeDir, f.name)

    if (isExcluded(rel)) continue

    if (f.isDirectory()) {
      exports.push(`export * from './${f.name}'`)
    } else if (EXTENSIONS.includes(path.extname(f.name))) {
      const base = path.basename(f.name, path.extname(f.name))
      if (base !== 'index') exports.push(`export * from './${base}'`)
    }
  }

  return exports
}

function checkBarrel(dir, relativeDir = '', results = { failed: false }) {
  const files = fs.readdirSync(dir, { withFileTypes: true })

  for (const f of files) {
    const full = path.join(dir, f.name)
    const rel = path.join(relativeDir, f.name)

    if (isExcluded(rel)) continue

    if (f.isDirectory()) {
      checkBarrel(full, rel, results)
    }
  }

  const exports = collectExportsForDir(dir, relativeDir)
  const barrelPath = path.join(dir, 'index.ts')

  if (exports.length && relativeDir !== '') {
    expectedBarrels.add(barrelPath)
    const expected = exports.join('\n') + '\n'

    if (!fs.existsSync(barrelPath)) {
      console.error('❌ Missing barrel:', barrelPath)
      results.failed = true
      return
    }

    const actual = fs.readFileSync(barrelPath, 'utf8')
    if (actual !== expected) {
      console.error('❌ Out of date barrel:', barrelPath)
      console.error('Expected:\n' + expected)
      console.error('Actual:\n' + actual)
      results.failed = true
    }
  }
}

function findOrphanBarrels(dir, relativeDir = '', results = { failed: false }) {
  const files = fs.readdirSync(dir, { withFileTypes: true })

  for (const f of files) {
    const full = path.join(dir, f.name)
    const rel = path.join(relativeDir, f.name)

    if (isExcluded(rel)) continue

    if (f.isDirectory()) {
      findOrphanBarrels(full, rel, results)
    } else if (f.isFile() && f.name === 'index.ts' && !expectedBarrels.has(full)) {
      console.error('❌ Unexpected barrel (remove or regenerate):', full)
      results.failed = true
    }
  }
}

function cleanBarrels(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true })
  for (const f of files) {
    const full = path.join(dir, f.name)
    if (f.isDirectory()) {
      cleanBarrels(full)
    } else if (f.isFile() && f.name === 'index.ts') {
      fs.unlinkSync(full)
      console.info('🧹 Removed barrel:', full)
    }
  }
}

function generateBarrel(dir, relativeDir = '') {
  const files = fs.readdirSync(dir, { withFileTypes: true })

  for (const f of files) {
    const full = path.join(dir, f.name)
    const rel = path.join(relativeDir, f.name)

    if (isExcluded(rel)) continue

    if (f.isDirectory()) {
      generateBarrel(full, rel)
    }
  }

  const exports = collectExportsForDir(dir, relativeDir)

  // Skip the package root barrel; only folder-level exports are published.
  if (exports.length && (relativeDir !== '' || WITH_ROOT)) {
    const barrelPath = path.join(dir, 'index.ts')
    fs.writeFileSync(barrelPath, exports.join('\n') + '\n')
    console.info('✔ Generated barrel:', barrelPath)
  }
}

if (CLEAN) {
  console.info('🧹 Cleaning all barrel files...')
  cleanBarrels(ROOT)
  console.info('✅ All barrels removed.')
} else if (CHECK) {
  const results = { failed: false }
  checkBarrel(ROOT, '', results)
  findOrphanBarrels(ROOT, '', results)

  if (results.failed) {
    console.error('Barrel check failed. Run: pnpm run barrel')
    process.exit(1)
  }

  console.info('✅ All barrels are up to date.')
} else {
  generateBarrel(ROOT)
}
