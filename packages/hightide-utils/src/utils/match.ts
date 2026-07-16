const match = <K extends string | number | symbol, V>(key: K, values: Record<K, V>) => {
  return values[key]
}

export const MatchUtils = {
  match,
}

/** @deprecated Use MatchUtils.match instead. */
export { match }
