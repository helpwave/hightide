// barrel.js
import fs from 'fs'
import path from 'path'

const ROOT = path.resolve('src') // or "dist"
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx']

// Paths (relative to ROOT) to exclude
const EXCLUDE = [
  'style',
  'storybook',
]

function isExcluded(relativePath) {
  return EXCLUDE.some(ex => {
    return relativePath === ex || relativePath.startsWith(ex + '/')
  })
}

function generateBarrel(dir, relativeDir = '') {
  const files = fs.readdirSync(dir, { withFileTypes: true })
  let exports = []

  for (const f of files) {
    const full = path.join(dir, f.name)
    const rel = path.join(relativeDir, f.name)

    if (isExcluded(rel)) continue

    if (f.isDirectory()) {
      generateBarrel(full, rel)
      exports.push(`export * from './${f.name}'`)
    } else if (EXTENSIONS.includes(path.extname(f.name))) {
      const base = path.basename(f.name, path.extname(f.name))
      if (base !== 'index') {
        exports.push(`export * from './${base}'`)
      }
    }
  }

  if (exports.length) {
    const barrelPath = path.join(dir, 'index.ts')
    fs.writeFileSync(barrelPath, exports.join('\n') + '\n')
    console.info('✔ Generated barrel:', barrelPath)
  }
}

generateBarrel(ROOT)
