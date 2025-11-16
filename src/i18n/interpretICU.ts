export function interpretICU(
  msg: string,
  values?: object
): string {
  const missingValues: Record<string, string> = {}
  const maxDepth = 32

  function resolve(message: string, depth: number): string {
    if (depth > maxDepth) {
      if (Object.entries(missingValues).length > 0) {
        console.warn(`interpretICU: Message "${msg}" has missing parameter values:`, missingValues)
        return msg
      }

      console.warn(`interpretICU: Message "${msg}" exceeded more than ${maxDepth} recursive replacements.`)
      return message
    }

    // Escape single quotes: '' -> '
    message = message.replace(/''/g, "'")

    // Handle select
    // In order: variable name, operation, message
    // "{gender, select, male{Hello Mr. {name}} female{Hello Ms. {name}} other{Hello {name}}}",
    message = message.replace(/\{(\w+),\s*select,(.*)}$/s, (_, varName, optionsStr) => {
      const selectedValue = values[varName]
      if (selectedValue === undefined) {
        missingValues[varName] = 'string'
        return `{${varName}}`
      }

      // parse options
      const selectionValues: Record<string, string> = {}
      const optionRegex = /(\w+)\{([^}]*)}/g
      let match
      while ((match = optionRegex.exec(optionsStr)) !== null) {
        selectionValues[match[1].trim()] = match[2].trim()
      }

      let chosen = selectionValues[selectedValue as string]
      if (!chosen) {
        console.warn(`interpretICU: Message "${message}" selected the undefined option "${selectedValue}"`)
        chosen = selectionValues['other'] ?? `{${varName}}`
      }

      return resolve(chosen, depth + 1)
    })


    // Handle plural with ICU categories
    message = message.replace(/\{(\w+),\s*plural,(.*)}$/s, (_, varName, optionsStr) => {
      const val = Number(values[varName])
      if (isNaN(val)) {
        missingValues[varName] = 'number'
        return `{${varName}}`
      }

      // parse options
      const optionMapping: Record<string, string> = {}
      const regex = /(\w+)\{([^}]*)}/g
      let match
      while ((match = regex.exec(optionsStr)) !== null) {
        optionMapping[match[1].trim()] = match[2].trim()
      }

      const pluralKey =
        val === 0 ? 'zero' :
          val === 1 ? 'one' :
            val === 2 ? 'two' :
              val > 2 && val < 5 ? 'few' :
                val >= 5 ? 'many' : 'other'

      let replaced = optionMapping[pluralKey]
      if (!replaced) {
        console.warn(`interpretICU: Message "${message}" plural key "${pluralKey}" could not be found and "other" not provided`)
        replaced = optionMapping['other'] ?? `{${varName}}`
      }

      return resolve(replaced.replace(/#/g, String(val)), depth + 1)
    })


    // Handle simple placeholders
    message = message.replace(/\{(\w+)}/g, (_, name) => {
      if(values[name] !== undefined) {
        return String(values[name])
      } else {
        missingValues[name] = 'replacement string'
        return `{${name}}`
      }
    })

    // Handle literal escaped braces: '{' -> { , '}' -> }
    message = message.replace(/'\{'/g, '{').replace(/'}'/g, '}')

    // Handle literal escaped #: '#' -> #
    message = message.replace(/'#'/g, '#')

    if (Object.entries(missingValues).length > 0) {
      console.warn(`interpretICU: Message "${msg}" has missing parameter values:`, missingValues)
      return msg
    }

    return message
  }

  return resolve(msg, 0)
}
