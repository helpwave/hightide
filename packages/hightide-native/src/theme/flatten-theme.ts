const isRecord = (value: unknown): value is Record<string, unknown> => (
  typeof value === 'object' && value !== null && !Array.isArray(value)
)

export const flattenThemeTokens = (value: unknown): unknown => {
  if (value === null || value === undefined || typeof value !== 'object') {
    return value
  }

  if (Array.isArray(value)) {
    return value.map(flattenThemeTokens)
  }

  if (!isRecord(value)) {
    return value
  }

  if (typeof value.type === 'string' && 'value' in value) {
    return flattenThemeTokens(value.value)
  }

  const result: Record<string, unknown> = {}

  for (const key of Object.keys(value)) {
    result[key] = flattenThemeTokens(value[key])
  }

  return result
}
