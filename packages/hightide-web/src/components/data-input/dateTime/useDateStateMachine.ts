import type { DOMInputConfig } from '../domInput'

export function dateInputConfig({
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
  id,
}: Partial<DOMInputConfig> = {}): DOMInputConfig {
  return {
    isInvalid,
    isDisabled,
    isReadOnly,
    isRequired,
    id,
  }
}
