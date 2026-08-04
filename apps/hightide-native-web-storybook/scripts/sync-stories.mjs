#!/usr/bin/env node
import { watch } from 'node:fs'
import { access, cp, mkdir, readdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageRoot = path.resolve(__dirname, '..')
const sourceDir = path.resolve(packageRoot, '../hightide-native-storybook/src')
const destDir = path.resolve(packageRoot, 'src')
const watchMode = process.argv.includes('--watch')
const debounceMs = 100

const ensureSourceExists = async () => {
  try {
    await access(sourceDir)
  } catch {
    console.error(`Source stories directory not found: ${sourceDir}`)
    process.exit(1)
  }
}

const clearDestContents = async () => {
  await mkdir(destDir, { recursive: true })

  const entries = await readdir(destDir, { withFileTypes: true })

  await Promise.all(
    entries.map(async (entry) => {
      if (entry.name === '.gitkeep') {
        return
      }

      await rm(path.join(destDir, entry.name), { recursive: true, force: true })
    }),
  )
}

const syncStories = async () => {
  await ensureSourceExists()
  await clearDestContents()
  await cp(sourceDir, destDir, { recursive: true })
  console.log(`Synced stories from ${sourceDir} to ${destDir}`)
}

await syncStories()

if (!watchMode) {
  process.exit(0)
}

let debounceTimer = null
let syncing = false
let pending = false

const runWatchedSync = async () => {
  if (syncing) {
    pending = true
    return
  }

  syncing = true

  try {
    await syncStories()
  } catch (error) {
    console.error('Failed to sync stories:', error)
  } finally {
    syncing = false

    if (pending) {
      pending = false
      await runWatchedSync()
    }
  }
}

console.log(`Watching ${sourceDir} for changes...`)

watch(sourceDir, { recursive: true }, () => {
  if (debounceTimer !== null) {
    clearTimeout(debounceTimer)
  }

  debounceTimer = setTimeout(() => {
    debounceTimer = null
    void runWatchedSync()
  }, debounceMs)
})
