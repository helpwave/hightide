import type { ICUCompilerValues } from '../../src/i18n/icu'
import { ICUUtil } from '../../src/i18n/icu'

type TestValues = {
  name: string,
  message: string,
  values: ICUCompilerValues,
  result: string,
}

const tests: TestValues[] = [
  {
    name: 'Simple Replace',
    message: 'Hello {name}',
    values: { name: 'Alice' },
    result: 'Hello Alice',
  },
  {
    name: 'Plural with number insertion',
    message: 'You have {count, plural, =1{# apple} other{# apples}}',
    values: { count: 1 },
    result: 'You have 1 apple',
  },
  {
    name: 'Select with nested replacement',
    message: '{gender, select, male{Hello Mr. {name}} female{Hello Ms. {name}} other{Hello {name}}}',
    values: { gender: 'female', name: 'Lee' },
    result: 'Hello Ms. Lee',
  },
  {
    name: 'Plural and Select in succession',
    message: '{count, plural, =0{no items} =1{one item} other{# items}} and {gender, select, male{sir} other{friend}}',
    values: { count: 0, gender: 'male' },
    result: 'no items and sir',
  },
  {
    name: 'Plural nested in Select',
    message: '{userType, select, admin{{count, plural, =1{Admin, 1 message} other{Admin, # messages}}} member{{count, plural, =1{Member, 1 message} other{Member, # messages}}} other{Guest}}',
    values: { userType: 'member', count: 3 },
    result: 'Member, 3 messages',
  },
  {
    name: 'Replace, Escape and Plural',
    message: "Today is '{'special'}' and you have {count, plural, =1{# cat} other{# cats}}",
    values: { count: 2 },
    result: 'Today is {special} and you have 2 cats',
  },
  {
    name: 'Escape sequence',
    message: "'''''' '{}'",
    values: {},
    result: "''' {}",
  }
]

describe('ICU Interpreter', () => {
  for (const example of tests) {
    test(`${example.name}: ${example.message}`, () => {
      const result = ICUUtil.interpret(example.message, example.values)
      expect(result).toEqual(example.result)
    })
  }
})
