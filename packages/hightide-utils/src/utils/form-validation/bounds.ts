export type FormValidationBounds = [number | undefined, number | undefined]

export type BoundsValidationResult = 'lower' | 'upper' | 'range' | 'none'

export const boundsValidation = (length: number | undefined, bounds: FormValidationBounds): BoundsValidationResult => {
  const [min, max] = bounds

  if (min !== undefined && max !== undefined && (length === undefined || length < min || length > max)) {
    return 'range'
  }

  if (min !== undefined && (length === undefined || length < min)) {
    return 'lower'
  }

  if (max !== undefined && length !== undefined && length > max) {
    return 'upper'
  }

  return 'none'
}
