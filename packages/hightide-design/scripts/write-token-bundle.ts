import { mkdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { componentTokens } from '../src/component-tokens/component-tokens.ts'
import { semanticTokens } from '../src/semantic-tokens/semantic-tokens.ts'
import {
  hightideDarkThemeTokens,
  hightideLightThemeTokens
} from '../src/theme-tokens/hightide.ts'

const toJsonValue = (_key: string, value: unknown): unknown => {
  if (value instanceof Set) {
    return [...value]
  }

  if (value instanceof Map) {
    return Object.fromEntries(value)
  }

  return value
}

const bundle = {
  'semantic-tokens': semanticTokens,
  'component-tokens': componentTokens,
  themes: {
    light: hightideLightThemeTokens,
    dark: hightideDarkThemeTokens,
  },
}

const outputPath = resolve(
  process.argv[2]
    ?? fileURLToPath(new URL('../token-bundle.json', import.meta.url))
)

mkdirSync(dirname(outputPath), { recursive: true })
writeFileSync(outputPath, `${JSON.stringify(bundle, toJsonValue, 2)}\n`)

const sizeKb = statSync(outputPath).size / 1024

process.stdout.write(`ComponentTokenSize: ${sizeKb.toFixed(1)}kb\n`)
