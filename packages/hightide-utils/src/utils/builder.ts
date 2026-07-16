const builder = <T>(value: T, update: (value: T) => void): T => {
  update(value)
  return value
}

export const BuilderUtils = {
  builder,
}

/** @deprecated Use BuilderUtils.builder instead. */
export { builder }
