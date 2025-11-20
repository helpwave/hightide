const escapeCharacter = "'"

/////////////
// Lexer
/////////////

// TODO treat # as a special case
// TODO consider ' the escape character as a special case
export type ICUToken =
  | { type: 'LBRACE' }
  | { type: 'RBRACE' }
  | { type: 'COMMA' }
  | { type: 'WHITESPACE', value: string }
  | { type: 'TEXT', value: string }

type LexerContext = {
  buffer: string,
  state: 'whitespace' | 'escape' | 'normal',
  lastWasEscape: boolean,
}

/**
 * ICU uses single quotes to quote literal text. This means:
 * '' -> '
 * '...anything...' -> literal anything (but two single quotes inside become one)
 */
function lex(input: string): ICUToken[] {
  const tokens: ICUToken[] = []

  const context: LexerContext = {
    buffer: '',
    state: 'normal',
    lastWasEscape: false,
  }

  function resetContext() {
    context.buffer = ''
    context.state = 'normal'
    context.lastWasEscape = false
  }

  function pushText(text: string) {
    if (tokens.length > 0) {
      const last = tokens[tokens.length - 1]
      if (last.type === 'TEXT') {
        last.value += text
      } else {
        tokens.push({ type: 'TEXT', value: text })
      }
    } else {
      tokens.push({ type: 'TEXT', value: text })
    }
  }

  function inNormal(character: string) {
    switch (character) {
      case '{':
        tokens.push({ type: 'LBRACE' })
        break
      case '}':
        tokens.push({ type: 'RBRACE' })
        break
      case ',':
        tokens.push({ type: 'COMMA' })
        break
      case ' ':
        context.state = 'whitespace'
        context.buffer += character
        break
      case escapeCharacter:
        context.lastWasEscape = true
        context.state = 'escape'
        break
      default:
        pushText(character)
        break
    }
  }

  function inEscape(character: string) {
    switch (character) {
      case escapeCharacter: {
        const text = context.lastWasEscape ? escapeCharacter : context.buffer
        pushText(text)
        resetContext()
        break
      }
      default:
        context.buffer += character
        context.lastWasEscape = false
        break
    }
  }

  function inWhitespace(character: string) {
    switch (character) {
      case ' ':
        context.buffer += character
        break
      default:
        tokens.push({ type: 'WHITESPACE', value: context.buffer })
        resetContext()
        inNormal(character)
        break
    }
  }

  for (let index = 0; index < input.length; index++) {
    const character = input[index]
    if (context.state === 'escape') {
      inEscape(character)
    } else if (context.state === 'whitespace') {
      inWhitespace(character)
    } else {
      inNormal(character)
    }
  }

  // Handle final states
  if (context.state === 'whitespace') {
    tokens.push({ type: 'WHITESPACE', value: context.buffer })
  } else if (context.state === 'escape') {
    // The escape might not be closed here (should be solved in parser)
    pushText(context.buffer)
  }

  return tokens
}

/////////////
// Parser -> AST
/////////////

export type ICUASTNode =
  | { type: 'Node', parts: ICUASTNode[] }
  | { type: 'Text', value: string }
  | { type: 'SimpleReplace', variableName: string } // {name}
  | { type: 'OptionReplace', operatorName: string, variableName: string, options: Record<string, ICUASTNode> } // {var, select, key{msg} ...}

type ParserContext = {
  subTree: ICUToken[],
  openBrackets: number,
}

type ParserReplaceContext = {
  subTree: ICUToken[],
  openBrackets: number,
  variableName?: string,
  variableComma: boolean,
  operatorName?: string,
  operatorComma: boolean,
  optionName?: string,
  options: Record<string, ICUASTNode>,
}

function parse(tokens: ICUToken[]): ICUASTNode {
  const result: ICUASTNode[] = []

  // Closing and opening brackets are already removed
  function parseReplace(tokens: ICUToken[]): ICUASTNode {
    if (tokens.length === 0) {
      return { type: 'Text', value: '' }
    } else if (
      tokens.every(value => value.type === 'TEXT' || value.type === 'WHITESPACE') &&
      tokens.filter(value => value.type === 'TEXT').length === 1
    ) {
      return {
        type: 'SimpleReplace',
        variableName: tokens.filter(value => value.type === 'TEXT')[0].value
      }
    }

    const context: ParserReplaceContext = {
      subTree: [],
      openBrackets: 0,
      options: {},
      variableComma: false,
      operatorComma: false,
    }
    for (let index = 0; index < tokens.length; index++) {
      const token = tokens[index]
      switch (token.type) {
        case 'TEXT': {
          if (context.openBrackets > 0) {
            context.subTree.push(token)
          } else if (!context.variableName) {
            context.variableName = token.value
          } else if (!context.operatorName && context.variableComma) {
            context.operatorName = token.value
          } else if (!context.optionName && context.operatorComma) {
            context.optionName = token.value
          } else {
            throw Error(`ICU Parse: Encountered unexpected ${token.type} token`)
          }
          break
        }
        case 'COMMA': {
          if (context.openBrackets > 0) {
            context.subTree.push(token)
          } else if (context.operatorName && !context.operatorComma) {
            context.operatorComma = true
          } else if (context.variableName && !context.variableComma) {
            context.variableComma = true
          } else {
            throw Error(`ICU Parse: Encountered unexpected ${token.type} token`)
          }
          break
        }
        case 'WHITESPACE': {
          if (context.openBrackets > 0) {
            context.subTree.push(token)
          }
          break
        }
        case 'LBRACE': {
          if (context.optionName) {
            if (context.openBrackets > 0) {
              context.subTree.push(token)
            }
            context.openBrackets++
          } else {
            throw Error(`ICU Parse: Encountered unexpected ${token.type} token`)
          }
          break
        }
        case 'RBRACE': {
          if (context.optionName) {
            context.openBrackets--
            if (context.openBrackets < 0) {
              throw new Error('ICU Parse: Mismatching amount of closing and opening brackets')
            }
            if (context.openBrackets === 0) {
              context.options[context.optionName] = parse(context.subTree)
              context.subTree = []
              context.optionName = undefined
            } else {
              context.subTree.push(token)
            }
          } else {
            throw Error(`ICU Parse: Encountered unexpected ${token.type} token`)
          }
          break
        }
      }
    }
    if (context.openBrackets > 0) {
      throw new Error('ICU Parse: Mismatching amount of closing and opening brackets')
    }
    if (!context.operatorName && !context.variableName && Object.keys(context.options).length === 0) {
      throw new Error('ICU Parse: Not a valid OptionReplace')
    }
    return {
      type: 'OptionReplace',
      operatorName: context.operatorName,
      variableName: context.variableName,
      options: context.options,
    }
  }

  const context: ParserContext = {
    openBrackets: 0,
    subTree: []
  }
  for (let index = 0; index < tokens.length; index++) {
    const token = tokens[index]
    if (token.type === 'TEXT' || token.type === 'WHITESPACE' || token.type === 'COMMA') {
      if (context.openBrackets > 0) {
        context.subTree.push(token)
      } else {
        let text = ''
        if (token.type === 'TEXT' || token.type === 'WHITESPACE') {
          text += token.value
        } else if (token.type === 'COMMA') {
          text += ','
        }
        if (result.length > 0 && result[result.length - 1].type === 'Text') {
          (result[result.length - 1] as { type: 'Text', value: string }).value += text
        } else {
          result.push({ type: 'Text', value: text })
        }
      }
    } else if (token.type === 'RBRACE') {
      context.openBrackets--
      if (context.openBrackets < 0) {
        throw Error(`ICU Parse: Encountered "}" without a prior "{"`)
      } else if (context.openBrackets === 0) {
        result.push(parseReplace(context.subTree))
        context.subTree = []
      } else if (context.openBrackets > 0) {
        context.subTree.push(token)
      }
    } else if (token.type === 'LBRACE') {
      if (context.openBrackets > 0) {
        context.subTree.push(token)
      }
      context.openBrackets++
    }
  }
  if (context.openBrackets > 0) {
    throw Error(`ICU Parse: Encountered unclosed "{"`)
  }
  return result.length !== 1 ? { type: 'Node', parts: result } : result[0]
}

/////////////
// Compiler
/////////////

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ICUCompilerValues = Record<string, any>

function compile(node: ICUASTNode, values: ICUCompilerValues): string {
  switch (node.type) {
    case 'Node': {
      return node.parts.map(p => compile(p, values)).join('')
    }
    case 'Text':
      return node.value
    case 'SimpleReplace': {
      const name = node.variableName
      if (values && values[name] !== undefined) return String(values[name])
      console.warn(`ICU Compile: missing value for ${name}`)
      return `{${name}}`
    }
    case 'OptionReplace': {
      const name = node.variableName
      const operation = node.operatorName
      const val = values ? values[name] : undefined
      switch (operation) {
        case 'plural': {
          const num = Number(val)
          if (isNaN(num)) {
            console.warn(`ICU Compile: plural expected numeric value for ${name}, got ${val}`)
            return `{${name}}`
          }
          const pluralKey =
            num === 0 ? '=0' :
              num === 1 ? '=1' :
                num === 2 ? '=2' :
                  num > 2 && num < 5 ? 'few' :
                    num >= 5 ? 'many' : 'other'

          const chosen = node.options[pluralKey] ?? node.options['other']
          if (!chosen) {
            console.warn(`ICU Compile: plural for ${name} could not find key ${pluralKey} and no other`)
            return `{${name}}`
          }
          const result = compile(chosen, values)
          return result.replace(/#/g, String(num))
        }
        case 'select': {
          if (val === undefined) {
            console.warn(`ICU Compile: missing value for select ${name}`)
            const other = node.options['other']
            return other ? compile(other, values) : `{${name}}`
          }
          const chosen = node.options[String(val)] ?? node.options['other']
          if (!chosen) {
            console.warn(`ICU Compile: select ${name} chose undefined option "${val}" and no "other" provided`)
            return `{${name}}`
          }
          return compile(chosen, values)
        }
        default: {
          return `{${name}, ${operation}}`
        }
      }
    }
    default: {
      return ''
    }
  }
}

function interpret(message: string, values: ICUCompilerValues): string {
  return compile(parse(lex(message)), values)
}

export const ICUUtil = {
  lex,
  parse,
  compile,
  interpret
}
