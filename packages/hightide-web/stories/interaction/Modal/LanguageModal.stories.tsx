import type { Meta, StoryObj } from '@storybook/react-vite'
import { LanguageModal } from '../../../src/components/layout/Modal/premade/LanguageModal'

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
