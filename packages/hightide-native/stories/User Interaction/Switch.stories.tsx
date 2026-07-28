import type {
  Meta,
  StoryObj
} from '@storybook/react-native-web-vite'
import { action } from 'storybook/actions'

import { Switch } from '../../src/components/user-interaction/Switch'

const meta = {
  component: Switch,
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const switchComponent: Story = {
  name: 'Switch',
  args: {
    initialValue: true,
    disabled: false,
    invalid: false,
    onValueChange: action('onValueChange'),
    onEditComplete: action('onEditComplete'),
  },
}
