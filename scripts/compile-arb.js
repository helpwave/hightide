#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import readline from 'readline'

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// --- Command-line args ---
const args = process.argv.slice(2)
let inputDir = args.find(arg => !arg.startsWith('-')) || path.resolve(__dirname, '../locales')
let outputDir = args.find(arg => arg !== inputDir && !arg.startsWith('-')) || path.resolve(__dirname, './i18n')
const force = args.includes('-f') || args.includes('--force')

const OUTPUT_FILE = path.join(outputDir, 'translations.ts')

// Prompt helper
function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  return new Promise(resolve => rl.question(query, ans => {
    rl.close()
    resolve(ans)
  }))
}

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

// Helper to convert string to single-quoted and escape inner quotes
function toSingleQuote(str) {
  if (typeof str !== 'string') return str
  return `'${str.replace(/'/g, "\\'")}'`
}

let locales = new Set()

// Recursively read ARB files and merge into nested structure
function readARBDir(dir, prefix = '') {
  const result = {}

  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    const fullPath = path.join(dir, entry.name)

    // --- Folders → accumulate prefix ---
    if (entry.isDirectory()) {
      const newPrefix = prefix ? `${prefix}.${entry.name}` : entry.name
      const values = readARBDir(fullPath, newPrefix)
      for (let locale of locales) {
        Object.assign(result[locale], values[locale])
      }
      return
    }

    // --- ARB file ---
    if (!entry.isFile() || !entry.name.endsWith('.arb')) return

    const locale = path.basename(entry.name, '.arb')
    locales.add(locale)

    const content = JSON.parse(fs.readFileSync(fullPath, 'utf-8'))
    if (!result[locale]) {
      result[locale] = {}
    }

    Object.entries(content).forEach(([key, value]) => {
      if (key.startsWith('@')) return

      const meta = content[`@${key}`]
      const flatKey = prefix ? `${prefix}.${key}` : key
      const entry = {}

      if (meta?.placeholders) {
        // --- ICU function case ---
        const params = Object.entries(meta.placeholders).map(([name, def]) => {
          let typing = def?.type
          if (!typing) {
            if (['count', 'amount', 'length', 'number'].includes(name)) {
              typing = 'number'
            } else if (['date', 'dateTime'].includes(name)) {
              typing = 'Date'
            } else {
              typing = 'string'
            }
          }
          return { name, typing }
        })

        entry['type'] = 'func'
        entry['params'] = params
        entry['value'] = `(values): string => interpretICU(${toSingleQuote(value)}, values)`
      } else {
        // --- Plain text case ---
        entry['type'] = 'text'
        entry['value'] = value
      }
      result[locale][flatKey] = entry
    })
  })

  return result
}


// Generate recursively
function generateCode(obj, indentLevel = 1) {
  const indent = '  '.repeat(indentLevel)
  const entries = Object.entries(obj).sort((a, b) => a[0].localeCompare(b[0]))

  let str = ''

  entries.forEach(([key, entry], index) => {
    const isLast = index === entries.length - 1
    const quotedKey = `'${key}'`
    const comma = isLast ? '' : ','

    if (entry?.type === 'func') {
      str += `${indent}${quotedKey}: ${entry.value}${comma}\n`
    } else if (entry?.type === 'text') {
      str += `${indent}${quotedKey}: ${toSingleQuote(entry.value)}${comma}\n`
    } else {
      // nested
      str += `${indent}${quotedKey}: {\n`
      str += generateCode(entry, indentLevel + 1)
      str += `${indent}}${comma}\n`
    }
  })

  return str
}

// Generate recursively
function generateType(obj) {
  const indent = '  '
  let fullObject = {}
  const completedLocales = []
  for (const locale of locales) {
    const localizedEntries = Object.entries(obj[locale]).sort((a, b) => a[0].localeCompare(b[0]))
    for (let [name, entry] of localizedEntries) {
      if (fullObject[name]) {
        // sanity check
        if (fullObject[name].type !== entry.type) {
          console.warn(`miss matching ${name} entry in locale ${locale} compared to ${completedLocales.join(', ')}`)
        } else if (entry.type === 'func') {
          const hasSameParameter = entry.params.length === fullObject[name].params.length && entry.params.every(param => fullObject[name].params.some(otherParam => param.name === otherParam.name && param.typing === otherParam.typing))
          if (!hasSameParameter) {
            const paramString = fullObject[name].params.map(({ name, typing }) => `${name}: ${typing}`).join(', ')
            console.warn(
              `miss matching parameter typings or names for "${name}" in locale ${locale} compared to ${completedLocales.join(', ')}:\n`
              + `  - ${locale}: { ${entry.params.map(({ name, typing }) => `${name}: ${typing}`).join(', ')} }\n`
              + `  - ${completedLocales.join(', ')}: { ${paramString} }\n`
            )
          }
        }
      } else {
        fullObject[name] = entry
      }
    }
    completedLocales.push(locale)
  }

  const entries = Object.entries(fullObject).sort((a, b) => a[0].localeCompare(b[0]))

  let str = ''

  entries.forEach(([key, entry]) => {
    const quotedKey = `'${key}'`

    if (entry?.type === 'func') {
      str += `${indent}${quotedKey}: (values: { ${entry.params.map(param => `${param.name}: ${param.typing}`).join(', ')} }) => string,\n`
    } else if (entry?.type === 'text') {
      str += `${indent}${quotedKey}: string,\n`
    }
  })

  return str
}


// Main async function
async function main() {
  const translationData = readARBDir(inputDir)
  let output = `// AUTO-GENERATED. DO NOT EDIT.\n\n`

  output += '//The translations expect an ICU (International Components for Unicode) interpreter\n'
  output += 'import { interpretICU } from \'./interpretICU\'\n\n'

  output += `export const supportedLocales = [${[...locales.values()].map(value => `'${value}'`).join(', ')}] as const\n\n`

  output += `export type SupportedLocale = typeof supportedLocales[number]\n\n`

  output += `export type GeneratedTranslationEntries = {\n${generateType(translationData)}}\n\n`

  output += `export const generatedTranslations: Record<SupportedLocale, Partial<GeneratedTranslationEntries>> = {\n${generateCode(translationData)}}\n\n`

  // Check if file exists
  if (fs.existsSync(OUTPUT_FILE) && !force) {
    const answer = await askQuestion(`File "${OUTPUT_FILE}" already exists. Overwrite? (y/N): `)
    if (!['y', 'yes'].includes(answer.trim().toLowerCase())) {
      console.info('Aborted.')
      return
    }
  }

  fs.writeFileSync(OUTPUT_FILE, output)
  console.info(`✅ Translations compiled to ${OUTPUT_FILE}`)
  console.info(`Input folder: ${inputDir}`)
  console.info(`Output folder: ${outputDir}`)
}

main()
