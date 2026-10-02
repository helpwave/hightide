import type { Meta, StoryObj  } from '@storybook/nextjs-vite'
import { ThemeModal } from '../../../src/components/layout/Modal/premade/ThemeModal'

const meta: Meta = {
  component: ThemeModal,
}

export default meta
type Story = StoryObj<typeof meta>;

export const themeModal: Story = {
  args: {
    isOpen: true,
  }
}
