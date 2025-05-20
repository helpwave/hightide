import { useEffect, useState } from 'react'
import type { CheckboxPropertyProps } from '../../src/components/properties/CheckboxProperty'
import { CheckboxProperty } from '../../src/components/properties/CheckboxProperty'

export type CheckboxPropertyExampleProps = Omit<CheckboxPropertyProps, 'onChange' | 'onRemove'> & {
  readOnly: boolean,
}

/**
 * Example for using the CheckboxProperty
 */
export const CheckboxPropertyExample = ({
  value = false,
  ...restProps
}: CheckboxPropertyExampleProps) => {
  const [usedValue, setUsedValue] = useState<boolean>(value)

  useEffect(() => {
    setUsedValue(value)
  }, [value])

  return (
    <CheckboxProperty
      {...restProps}
      onChange={setUsedValue}
      value={usedValue}
    />
  )
}
