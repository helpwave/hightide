import type {
  Meta,
  StoryObj
} from '@storybook/react-native'
import { View } from 'react-native'

import { iconSizes } from '@helpwave/hightide-design/theme-tokens'
import { HightideIconRegistry } from '@helpwave/hightide-native/icons'
import { ThemedIcon } from '@helpwave/hightide-native/components'
import { useTheme } from '@helpwave/hightide-native/global-contexts'

const iconAppearances = ['normal', 'subtle', 'faded'] as const

const meta = {
  component: ThemedIcon,
  argTypes: {
    size: {
      control: 'select',
      options: [...iconSizes],
    },
    appearance: {
      control: 'select',
      options: iconAppearances,
    },
  },
} satisfies Meta<typeof ThemedIcon>

export default meta
type Story = StoryObj<typeof meta>

const ThemedIconDemo = ({
  appearance,
}: {
  appearance: typeof iconAppearances[number],
}) => {
  const { theme } = useTheme()

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.lg }}>
      {iconSizes.map((size) => (
        <ThemedIcon
          key={size}
          icon={HightideIconRegistry.Plus}
          size={size}
          appearance={appearance}
          color={theme.colors.background.onColor}
        />
      ))}
    </View>
  )
}

export const themedIcon: Story = {
  args: {
    icon: HightideIconRegistry.Plus,
    size: 'md',
    appearance: 'normal',
  },
  render: ({ appearance }) => (
    <ThemedIconDemo
      appearance={(appearance ?? 'normal') as typeof iconAppearances[number]}
    />
  ),
}
