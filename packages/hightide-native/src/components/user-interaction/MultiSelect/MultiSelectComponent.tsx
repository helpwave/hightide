import type { ReactNode } from 'react'
import { View, type StyleProp, type ViewStyle } from 'react-native'

import type { MultiSelectRootProps } from './MultiSelectRoot'
import { MultiSelectRoot } from './MultiSelectRoot'
import type { MultiSelectOptionType } from './MultiSelectContext'
import { MultiSelectMenu, type MultiSelectMenuProps } from './MultiSelectMenu'
import { MultiSelectTrigger, type MultiSelectTriggerProps } from './MultiSelectTrigger'

export type MultiSelectProps<T = string> = Omit<MultiSelectRootProps<T>, 'children'> & {
  children?: ReactNode,
  placeholder?: MultiSelectTriggerProps<T>['placeholder'],
  selectedDisplay?: (options: ReadonlyArray<MultiSelectOptionType<T>>) => ReactNode,
  triggerProps?: MultiSelectTriggerProps<T>,
  menuProps?: Omit<MultiSelectMenuProps, 'children'>,
  style?: StyleProp<ViewStyle>,
}

export const MultiSelectComponent = <T,>({
  children,
  placeholder,
  selectedDisplay,
  triggerProps,
  menuProps,
  style,
  ...props
}: MultiSelectProps<T>) => {
  return (
    <MultiSelectRoot<T> {...props}>
      <View style={[{ width: '100%' }, style]}>
        <MultiSelectTrigger<T>
          placeholder={placeholder}
          selectedDisplay={selectedDisplay}
          {...triggerProps}
        />
        <MultiSelectMenu {...menuProps}>{children}</MultiSelectMenu>
      </View>
    </MultiSelectRoot>
  )
}
