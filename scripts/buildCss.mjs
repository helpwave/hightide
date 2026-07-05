import fs from 'node:fs/promises'
import path from 'node:path'
import postcss from 'postcss'
import postcssLoadConfig from 'postcss-load-config'

export async function buildCss({ input, output, cwd }) {
  const config = await postcssLoadConfig({ cwd })
  const css = await fs.readFile(input, 'utf8')
  const result = await postcss(config.plugins).process(css, {
    from: input,
    to: output,
  })

  if (output) {
    await fs.mkdir(path.dirname(output), { recursive: true })
    await fs.writeFile(output, result.css)
  }

  return result.css
}
