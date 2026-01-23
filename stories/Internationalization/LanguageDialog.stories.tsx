import type { Meta, StoryObj } from '@storybook/nextjs'
import { LanguageDialog } from '@/src/components/layout/dialog/premade/LanguageDialog'

const meta: Meta = {
  component: LanguageDialog,
}

export default meta
type Story = StoryObj<typeof meta>;

export const languageDialog: Story = {
  args: {
    isOpen: true,
  }
}
