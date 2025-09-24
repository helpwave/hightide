import type { Meta, StoryObj } from '@storybook/nextjs'
import { HelpwaveLogo } from '../../src/components/icons-and-geometry/HelpwaveLogo'

const meta = {
  title: 'Branding/Logo',
  component: HelpwaveLogo,
} satisfies Meta<typeof HelpwaveLogo>

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
