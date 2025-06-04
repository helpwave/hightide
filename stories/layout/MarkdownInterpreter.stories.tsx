import type { Meta, StoryObj } from '@storybook/react'
import { MarkdownInterpreter } from '../../src'

const meta = {
  title: 'Layout',
  component: MarkdownInterpreter,
} satisfies Meta<typeof MarkdownInterpreter>

export default meta
type Story = StoryObj<typeof meta>;

export const markdownInterpreter: Story = {
  args: {
    text: '\\helpwave \\i{italic} \\{Escape\\} \\\\ \\b{bold} \\u{underline} ' +
      '\\space{space-grotesk} \\newline Newline \\positive{positive} \\negative{negative} \\warn{warn} ' +
      '\\primary{primary} \\b{\\i{\\u{bold and italic and underlined \\primary{also primary}}}}',
  },
}
