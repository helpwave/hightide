import type {
  Meta,
  StoryObj
} from '@storybook/react-native-web-vite'
import { Minus } from 'lucide-react-native'
import { action } from 'storybook/actions'

import { ButtonUtil } from '@/src/components/user-interaction/Button'
import { IconButton } from '@/src/components/user-interaction/IconButton'

const meta = {
  component: IconButton,
  argTypes: {
    color: {
      control: 'select',
      options: ButtonUtil.colors,
    },
  },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const iconButton: Story = {
  args: {
    disabled: false,
    color: 'primary',
    size: 'md',
    coloringStyle: 'solid',
    accessibilityLabel: 'Subtract',
    icon: Minus,
    onPress: action('Pressed'),
  },
}
