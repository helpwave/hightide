import type { Meta, StoryObj } from '@storybook/nextjs'
import { HelpwaveLogo } from '@/src/components/branding/HelpwaveLogo'

const meta = {
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
export const helpwaveLoadingAnimationSlow: Story = {
  args: {
    color: 'currentColor',
    animate: 'loading',
    animationDuration: 3,
    width: 128,
    height: 128,
  },
}

export const helpwaveLoadingAnimationFast: Story = {
  args: {
    color: 'currentColor',
    animate: 'loading',
    animationDuration: 0.8,
    width: 128,
    height: 128,
  },
}
