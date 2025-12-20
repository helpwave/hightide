import type { Meta, StoryObj } from '@storybook/nextjs'
import { FAQSection } from '../../src/components/layout/FAQSection'
import { HelpwaveLogo } from '../../src/components/icons-and-geometry/HelpwaveLogo'
import { action } from 'storybook/actions'
import { MarkdownInterpreter } from '../../src/components/layout/MarkdownInterpreter'

const meta = {
  title: 'Layout',
  component: FAQSection,
} satisfies Meta<typeof FAQSection>

export default meta
type Story = StoryObj<typeof meta>;

export const faqSection: Story = {
  args: {
    entries: [
      {
        title: 'A Very Good Question?',
        content: (
          <MarkdownInterpreter
            text={'\\warn{\\b{Maybe not}}'}
          />
        )
      },
      {
        title: 'What is the first paragraph of the lorem ipsum?',
        content: (
          <MarkdownInterpreter
            text={
              'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eget suscipit ex. In vitae leo metus.' +
              ' Fusce gravida urna et magna consectetur mollis. Lorem ipsum dolor sit amet, consectetur adipiscing elit.' +
              ' Etiam ac tellus purus. Integer vel sollicitudin leo. Integer nec interdum nisl. Nunc bibendum tellus vel' +
              ' mollis cursus. Mauris eu luctus ipsum. Vivamus euismod nisi at odio tristique volutpat. Cras sed' +
              ' facilisis neque, ac sagittis turpis. Maecenas et libero facilisis dui porta suscipit et in quam.' +
              ' In hac habitasse platea dictumst. Donec nec sodales nibh, a pellentesque purus.'
            }>
          </MarkdownInterpreter>
        )
      },
      {
        title: 'Can I click this?',
        content: (
          <MarkdownInterpreter
            text={'\\positive{\\b{Yes}}, you can'}
          />
        )
      },
      {
        title: 'What does the helpwave logo look like?',
        content: (
          <div className="flex-row-2 justify-center"><HelpwaveLogo size="lg" /></div>
        )
      },
    ]
  },
}
