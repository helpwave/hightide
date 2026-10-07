import { notEmpty as numberNotEmpty, range } from './number'
import { bounds, notEmpty as selectionNotEmpty } from './selection'
import { email, length, notEmpty as stringNotEmpty } from './string'
import { mapNumberTranslation, mapSelectionTranslation, mapStringTranslation } from './translation'

export const FormValidationUtils = {
  string: {
    notEmpty: stringNotEmpty,
    email,
    length,
    mapTranslation: mapStringTranslation,
  },
  number: {
    notEmpty: numberNotEmpty,
    range,
    mapTranslation: mapNumberTranslation,
  },
  selection: {
    notEmpty: selectionNotEmpty,
    bounds,
    mapTranslation: mapSelectionTranslation,
  },
}
