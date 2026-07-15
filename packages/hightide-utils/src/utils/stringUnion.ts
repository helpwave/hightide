function isUnionValue<T extends string>(value: unknown, allowedValues: readonly T[]) : value is T {
  if(typeof value === 'string') {
    const result = allowedValues.some(item => item === value)
    return result
  }
  return false
}

export const StringUnionUtils = {
  isUnionValue
}