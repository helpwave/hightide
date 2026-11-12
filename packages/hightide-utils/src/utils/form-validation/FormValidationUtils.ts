import { notEmpty as numberNotEmpty, range } from './number'
import { bounds, notEmpty as selectionNotEmpty } from './selection'
import { email, length, notEmpty as stringNotEmpty } from './string'

export const FormValidationUtils = {
  string: {
    notEmpty: stringNotEmpty,
    email,
    length,
  },
  number: {
    notEmpty: numberNotEmpty,
    range,
  },
  selection: {
    notEmpty: selectionNotEmpty,
    bounds,
  },
}
