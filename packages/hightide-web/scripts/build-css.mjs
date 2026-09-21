import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildCss } from './buildCss.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

await buildCss({
  input: path.join(root, 'src/style/globals.css'),
  output: path.join(root, 'dist/style/globals.css'),
  cwd: root,
})
