#!/usr/bin/env node
/**
 * Keep the hightide package family on a single, lockstep version.
 *
 *   node scripts/sync-versions.mjs 0.13.0
 *
 * Updates the version of:
 *   - the web library            (root package.json, @helpwave/hightide)
 *   - every package under packages/* (tokens, native, …)
 * and rewrites internal `@helpwave/*` dependency ranges to the new version so a
 * published build always pairs with matching siblings.
 *
 * With no argument it prints the current versions and exits.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const INTERNAL_SCOPE = '@helpwave/'
const INTERNAL_NAMES = new Set(['@helpwave/hightide', '@helpwave/hightide-tokens', '@helpwave/hightide-native'])

const manifestPaths = () => {
  const paths = [join(root, 'package.json')]
  const packagesDir = join(root, 'packages')
  if (existsSync(packagesDir)) {
    for (const entry of readdirSync(packagesDir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        const manifest = join(packagesDir, entry.name, 'package.json')
        if (existsSync(manifest)) {
          paths.push(manifest)
        }
      }
    }
  }
  return paths
}

const read = (path) => JSON.parse(readFileSync(path, 'utf8'))
const write = (path, json) => writeFileSync(path, `${JSON.stringify(json, null, 2)}\n`)

const bumpDeps = (deps, targetVersion) => {
  if (!deps) return
  for (const name of Object.keys(deps)) {
    if (name.startsWith(INTERNAL_SCOPE) && INTERNAL_NAMES.has(name) && !deps[name].startsWith('file:')) {
      deps[name] = targetVersion
    }
  }
}

const main = () => {
  const targetVersion = process.argv[2]
  const paths = manifestPaths()

  if (!targetVersion) {
    for (const path of paths) {
      const pkg = read(path)
      console.info(`${pkg.name}@${pkg.version}`)
    }
    return 0
  }

  if (!/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(targetVersion)) {
    console.error(`Invalid version: ${targetVersion}`)
    return 1
  }

  for (const path of paths) {
    const pkg = read(path)
    pkg.version = targetVersion
    bumpDeps(pkg.dependencies, targetVersion)
    bumpDeps(pkg.peerDependencies, targetVersion)
    write(path, pkg)
    console.info(`set ${pkg.name} -> ${targetVersion}`)
  }
  return 0
}

process.exitCode = main()
