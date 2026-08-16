import type {
  Meta,
  StoryObj
} from '@storybook/react-native'
import { action } from 'storybook/actions'

import { SearchBar } from '@helpwave/hightide-native/components'
import { useTheme } from '@helpwave/hightide-native/global-contexts'

import {
  type ColorPairKey,
  StorybookHelper
} from '../helper'

const meta = {
  component: SearchBar,
} satisfies Meta<typeof SearchBar>

export default meta

type SearchBarArgs = {
  placeholder: string,
  disabled: boolean,
  invalid: boolean,
  color: ColorPairKey | 'default',
  initialValue: string,
}

const SearchBarDemo = ({
  placeholder,
  disabled,
  invalid,
  color,
  initialValue,
}: SearchBarArgs) => {
  const { theme } = useTheme()

  return (
    <SearchBar
      placeholder={placeholder}
      disabled={disabled}
      invalid={invalid}
      color={color === 'default' ? undefined : theme.colors[color]}
      initialValue={initialValue}
      onValueChange={action('onValueChange')}
      onSearch={action('onSearch')}
    />
  )
}

export const searchBar: StoryObj<SearchBarArgs> = {
  argTypes: {
    placeholder: {
      control: 'text',
    },
    color: {
      control: 'select',
      options: ['default', ...StorybookHelper.colorPairSelect.options],
    },
    initialValue: {
      control: 'text',
    },
  },
  args: {
    placeholder: 'Search…',
    disabled: false,
    invalid: false,
    color: 'default',
    initialValue: '',
  },
  render: (args) => (
    <SearchBarDemo {...args} />
  ),
}
