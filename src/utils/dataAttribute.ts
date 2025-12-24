function bool(isActive: boolean) {
  return isActive ? '' : undefined
}

function name(name: string, props?: Record<string, unknown>) : string {
  return (props && props['data-name']) ? String(props['data-name']) : name
}

export const DataAttributesUtil = {
  bool,
  name,
}