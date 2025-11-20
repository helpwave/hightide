import type { ICUASTNode, ICUToken } from '../../src/i18n/icu'
import { ICUUtil } from '../../src/i18n/icu'

type ExampleValues = {
  name: string,
  input: ICUToken[],
  result: ICUASTNode,
}

const examples: ExampleValues[] = [
  {
    name: 'Simple Replace',
    input: [
      { type: 'TEXT', value: 'Hello' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'LBRACE' },
      { type: 'TEXT', value: 'name' },
      { type: 'RBRACE' }
    ],
    result: {
      type: 'Node',
      parts: [
        { type: 'Text', value: 'Hello ' },
        { type: 'SimpleReplace', variableName: 'name' }
      ]
    },
  },
  {
    name: 'Plural with number insertion',
    input: [
      { type: 'TEXT', value: 'You' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'have' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'LBRACE' },
      { type: 'TEXT', value: 'count' },
      { type: 'COMMA' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'plural' },
      { type: 'COMMA' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: '=1' },
      { type: 'LBRACE' },
      { type: 'TEXT', value: '#' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'apple' },
      { type: 'RBRACE' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'other' },
      { type: 'LBRACE' },
      { type: 'TEXT', value: '#' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'apples' },
      { type: 'RBRACE' },
      { type: 'RBRACE' }
    ],
    result: {
      type: 'Node',
      parts: [
        { type: 'Text', value: 'You have ' },
        {
          type: 'OptionReplace',
          operatorName: 'plural',
          variableName: 'count',
          options: {
            '=1': { type: 'Text', value: '# apple' },
            'other': { type: 'Text', value: '# apples' }
          }
        }
      ]
    },
  },
  {
    name: 'Select with nested replacement',
    input: [
      { type: 'LBRACE' },
      { type: 'TEXT', value: 'gender' },
      { type: 'COMMA' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'select' },
      { type: 'COMMA' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'male' },
      { type: 'LBRACE' },
      { type: 'TEXT', value: 'Hello' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'Mr.' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'LBRACE' },
      { type: 'TEXT', value: 'name' },
      { type: 'RBRACE' },
      { type: 'RBRACE' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'female' },
      { type: 'LBRACE' },
      { type: 'TEXT', value: 'Hello' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'Ms.' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'LBRACE' },
      { type: 'TEXT', value: 'name' },
      { type: 'RBRACE' },
      { type: 'RBRACE' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'other' },
      { type: 'LBRACE' },
      { type: 'TEXT', value: 'Hello' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'LBRACE' },
      { type: 'TEXT', value: 'name' },
      { type: 'RBRACE' },
      { type: 'RBRACE' },
      { type: 'RBRACE' }
    ],
    result: {
      type: 'OptionReplace',
      operatorName: 'select',
      variableName: 'gender',
      options: {
        male: {
          type: 'Node',
          parts: [
            { type: 'Text', value: 'Hello Mr. ' },
            { type: 'SimpleReplace', variableName: 'name' }
          ]
        },
        female: {
          type: 'Node',
          parts: [
            { type: 'Text', value: 'Hello Ms. ' },
            { type: 'SimpleReplace', variableName: 'name' }
          ]
        },
        other: {
          type: 'Node',
          parts: [
            { type: 'Text', value: 'Hello ' },
            { type: 'SimpleReplace', variableName: 'name' }
          ]
        }
      }
    },
  },
  {
    name: 'Plural and Select in succession',
    input: [
      { type: 'LBRACE' },
      { type: 'TEXT', value: 'count' },
      { type: 'COMMA' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'plural' },
      { type: 'COMMA' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: '=0' },
      { type: 'LBRACE' },
      { type: 'TEXT', value: 'no' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'items' },
      { type: 'RBRACE' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: '=1' },
      { type: 'LBRACE' },
      { type: 'TEXT', value: 'one' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'item' },
      { type: 'RBRACE' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'other' },
      { type: 'LBRACE' },
      { type: 'TEXT', value: '#' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'items' },
      { type: 'RBRACE' },
      { type: 'RBRACE' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'and' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'LBRACE' },
      { type: 'TEXT', value: 'gender' },
      { type: 'COMMA' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'select' },
      { type: 'COMMA' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'male' },
      { type: 'LBRACE' },
      { type: 'TEXT', value: 'sir' },
      { type: 'RBRACE' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'other' },
      { type: 'LBRACE' },
      { type: 'TEXT', value: 'friend' },
      { type: 'RBRACE' },
      { type: 'RBRACE' }
    ],
    result: {
      type: 'Node',
      parts: [
        {
          type: 'OptionReplace',
          operatorName: 'plural',
          variableName: 'count',
          options: {
            '=0': { type: 'Text', value: 'no items' },
            '=1': { type: 'Text', value: 'one item' },
            'other': { type: 'Text', value: '# items' }
          }
        },
        { type: 'Text', value: ' and ' },
        {
          type: 'OptionReplace',
          operatorName: 'select',
          variableName: 'gender',
          options: {
            male: { type: 'Text', value: 'sir' },
            other: { type: 'Text', value: 'friend' }
          }
        }
      ]
    },
  },
  {
    name: 'Plural nested in Select',
    input: [
      { type: 'LBRACE' },
      { type: 'TEXT', value: 'userType' },
      { type: 'COMMA' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'select' },
      { type: 'COMMA' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'admin' },
      { type: 'LBRACE' },
      { type: 'LBRACE' },
      { type: 'TEXT', value: 'count' },
      { type: 'COMMA' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'plural' },
      { type: 'COMMA' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: '=1' },
      { type: 'LBRACE' },
      { type: 'TEXT', value: 'Admin' },
      { type: 'COMMA' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: '1' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'message' },
      { type: 'RBRACE' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'other' },
      { type: 'LBRACE' },
      { type: 'TEXT', value: 'Admin' },
      { type: 'COMMA' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: '#' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'messages' },
      { type: 'RBRACE' },
      { type: 'RBRACE' },
      { type: 'RBRACE' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'member' },
      { type: 'LBRACE' },
      { type: 'LBRACE' },
      { type: 'TEXT', value: 'count' },
      { type: 'COMMA' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'plural' },
      { type: 'COMMA' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: '=1' },
      { type: 'LBRACE' },
      { type: 'TEXT', value: 'Member' },
      { type: 'COMMA' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: '1' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'message' },
      { type: 'RBRACE' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'other' },
      { type: 'LBRACE' },
      { type: 'TEXT', value: 'Member' },
      { type: 'COMMA' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: '#' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'messages' },
      { type: 'RBRACE' },
      { type: 'RBRACE' },
      { type: 'RBRACE' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'other' },
      { type: 'LBRACE' },
      { type: 'TEXT', value: 'Guest' },
      { type: 'RBRACE' },
      { type: 'RBRACE' }
    ],
    result: {
      type: 'OptionReplace',
      operatorName: 'select',
      variableName: 'userType',
      options: {
        admin: {
          type: 'OptionReplace',
          operatorName: 'plural',
          variableName: 'count',
          options: {
            '=1': { type: 'Text', value: 'Admin, 1 message' },
            'other': { type: 'Text', value: 'Admin, # messages' }
          }
        },
        member: {
          type: 'OptionReplace',
          operatorName: 'plural',
          variableName: 'count',
          options: {
            '=1': { type: 'Text', value: 'Member, 1 message' },
            'other': { type: 'Text', value: 'Member, # messages' }
          }
        },
        other: { type: 'Text', value: 'Guest' }
      }
    },
  },
  {
    name: 'Replace, Escape and Plural',
    input: [
      { type: 'TEXT', value: 'Today' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'is' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: '{special}' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'and' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'you' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'have' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'LBRACE' },
      { type: 'TEXT', value: 'count' },
      { type: 'COMMA' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'plural' },
      { type: 'COMMA' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: '=1' },
      { type: 'LBRACE' },
      { type: 'TEXT', value: '#' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'cat' },
      { type: 'RBRACE' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'other' },
      { type: 'LBRACE' },
      { type: 'TEXT', value: '#' },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: 'cats' },
      { type: 'RBRACE' },
      { type: 'RBRACE' }
    ],
    result: {
      type: 'Node',
      parts: [
        { type: 'Text', value: 'Today is {special} and you have ' },
        {
          type: 'OptionReplace',
          operatorName: 'plural',
          variableName: 'count',
          options: {
            '=1': { type: 'Text', value: '# cat' },
            'other': { type: 'Text', value: '# cats' }
          }
        }
      ]
    },
  },
  {
    name: 'Escape sequence',
    input: [
      { type: 'TEXT', value: "'''" },
      { type: 'WHITESPACE', value: ' ' },
      { type: 'TEXT', value: '{}' },
    ],
    result: {
      type: 'Text',
      value: "''' {}",
    },
  }
]

describe('ICU Parser', () => {
  for (const example of examples) {
    test(`${example.name}:`, () => {
      const result = ICUUtil.parse(example.input)
      expect(result).toEqual(example.result)
    })
  }
})
