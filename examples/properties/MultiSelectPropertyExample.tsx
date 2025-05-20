import { useEffect, useState } from 'react'
import type { MultiSelectOption } from '../../src/components/user-input/MultiSelect'
import type { MultiSelectPropertyProps } from '../../src/components/properties/MultiSelectProperty'
import { MultiSelectProperty } from '../../src/components/properties/MultiSelectProperty'

export type MultiSelectPropertyExample = Omit<MultiSelectPropertyProps<string>, 'onChange' | 'onRemove' | 'search' | 'selectedDisplay' > & {
  enableSearch: boolean,
}

/**
 * Example for using the MultiSelectProperty
 */
export const MultiSelectPropertyExample = ({
  options,
  hintText,
  enableSearch,
  ...restProps
}: MultiSelectPropertyExample) => {
  const [usedOptions, setUsedOptions] = useState<MultiSelectOption<string>[]>(options)

  useEffect(() => {
    setUsedOptions(options)
  }, [options])

  useEffect(() => {
    setUsedOptions(options.map(value => ({ ...value, selected: false })))
  }, [hintText, options])

  return (
    <MultiSelectProperty
      {...restProps}
      options={usedOptions}
      search={enableSearch ? { initialSearch: '', searchMapping: value => [value.label] } : undefined}
      onChange={setUsedOptions}
      onRemove={() => setUsedOptions(usedOptions.map(value => ({ ...value, selected: false })))}
      hintText={hintText}
    />
  )
}
