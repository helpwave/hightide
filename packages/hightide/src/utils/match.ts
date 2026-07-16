export const match = <K extends string | number | symbol, V>(key: K, values: Record<K, V>) => {
  return values[key]
}