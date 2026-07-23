import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { AppZumDocLogo } from '../../src/components/branding/AppZumDocLogo'

const meta = {
  component: AppZumDocLogo,
} satisfies Meta<typeof AppZumDocLogo>

export default meta
type Story = StoryObj<typeof meta>;

export const appZumDocLogo: Story = {
  args: {
    size: 'md',
    animate: 'none',
    frontColor: '#095763',
    backColor: '#4E97A2',
    className: ''
  },
}

export const appZumDocLoadingAnimation: Story = {
  args: {
    animate: 'loading',
    width: 128,
    height: 128,
  },
}
