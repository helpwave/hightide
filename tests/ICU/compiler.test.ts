import type { ICUASTNode, ICUCompilerValues } from '../../src/i18n/icu'
import { ICUUtil } from '../../src/i18n/icu'

type ExampleValues = {
  name: string,
  values: ICUCompilerValues,
  input: ICUASTNode,
  result: string,
}

const examples: ExampleValues[] = [
  {
    name: 'Simple Replace',
    values: { name: 'Alice' },
    input: {
      type: 'Node',
      parts: [
        { type: 'Text', value: 'Hello ' },
        { type: 'SimpleReplace', variableName: 'name' }
      ]
    },
    result: 'Hello Alice',
  },
  {
    name: 'Plural with number insertion',
    values: { count: 1 },
    input: {
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
    result: 'You have 1 apple',
  },
  {
    name: 'Select with nested replacement',
    values: { gender: 'female', name: 'Lee' },
    input: {
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
    result: 'Hello Ms. Lee',
  },
  {
    name: 'Plural and Select in succession',
    values: { count: 0, gender: 'male' },
    input: {
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
    result: 'no items and sir',
  },
  {
    name: 'Plural nested in Select',
    values: { userType: 'member', count: 3 },
    input: {
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
    result:
      'Member, 3 messages',
  },
  {
    name: 'Replace, Escape and Plural',
    values: { count: 2 },
    input: {
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
    result: 'Today is {special} and you have 2 cats',
  },
  {
    name: 'Escape sequence',
    values: {},
    input: {
      type: 'Text',
      value: "''' {}",
    },
    result: "''' {}",
  }
]


describe('ICU Compiler', () => {
  for (const example of examples) {
    test(`${example.name}`, () => {
      const result = ICUUtil.compile(example.input, example.values)
      expect(result).toEqual(example.result)
    })
  }
})
