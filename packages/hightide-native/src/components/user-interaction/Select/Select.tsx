import type { ReactNode } from 'react'
import { View, type StyleProp, type ViewStyle } from 'react-native'

import type { SelectRootProps } from './SelectRoot'
import { SelectRoot } from './SelectRoot'
import type { SelectOptionType } from './SelectContext'
import { SelectMenu, type SelectMenuProps } from './SelectMenu'
import { SelectTrigger, type SelectTriggerProps } from './SelectTrigger'

export type SelectProps<T = string> = Omit<SelectRootProps<T>, 'children'> & {
  children?: ReactNode,
  placeholder?: SelectTriggerProps<T>['placeholder'],
  selectedDisplay?: (option: SelectOptionType<T> | null) => ReactNode,
  triggerProps?: SelectTriggerProps<T>,
  menuProps?: Omit<SelectMenuProps, 'children'>,
  style?: StyleProp<ViewStyle>,
}

export const Select = <T,>({
  children,
  placeholder,
  selectedDisplay,
  triggerProps,
  menuProps,
  style,
  ...props
}: SelectProps<T>) => {
  return (
    <SelectRoot<T> {...props}>
      <View style={style}>
        <SelectTrigger<T>
          placeholder={placeholder}
          selectedDisplay={selectedDisplay}
          {...triggerProps}
        />
        <SelectMenu {...menuProps}>{children}</SelectMenu>
      </View>
    </SelectRoot>
  )
}
