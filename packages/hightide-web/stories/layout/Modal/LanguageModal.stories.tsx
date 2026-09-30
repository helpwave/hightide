import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { LanguageModal } from '../../../src/components/layout/Modal/LanguageModal'

const meta: Meta = {
  component: LanguageModal,
}

export default meta
type Story = StoryObj<typeof meta>;

export const languageModal: Story = {
  args: {
    isOpen: true,
  }
}
