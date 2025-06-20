import type { Meta, StoryObj } from '@storybook/nextjs'
import { Helpwave } from '../../src'

const meta = {
  title: 'Branding/Logo',
  component: Helpwave,
} satisfies Meta<typeof Helpwave>

export default meta
type Story = StoryObj<typeof meta>;

export const helpwaveLoadingAnimation: Story = {
  args: {
    color: 'currentColor',
    animate: 'loading',
    width: 128,
    height: 128,
  },
}
