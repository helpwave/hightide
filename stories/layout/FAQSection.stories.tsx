import type { StoryFn } from '@storybook/nextjs'
import { FAQSection, Helpwave } from '../../src'

const meta = {
  title: 'Layout',
  component: FAQSection,
}

export default meta

export const FAQSectionExample: StoryFn = () => (
  <FAQSection
    entries={[
      { id: 'question1', title: 'A Very Good Question?', content: { type: 'markdown', value: '\\negative{NO.}' } },
      {
        id: 'question2',
        title: 'What is the first paragraph of the lorem ipsum?',
        content: {
          type: 'markdown',
          value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eget suscipit ex. In vitae leo metus.' +
            ' Fusce gravida urna et magna consectetur mollis. Lorem ipsum dolor sit amet, consectetur adipiscing elit.' +
            ' Etiam ac tellus purus. Integer vel sollicitudin leo. Integer nec interdum nisl. Nunc bibendum tellus vel' +
            ' mollis cursus. Mauris eu luctus ipsum. Vivamus euismod nisi at odio tristique volutpat. Cras sed' +
            ' facilisis neque, ac sagittis turpis. Maecenas et libero facilisis dui porta suscipit et in quam.' +
            ' In hac habitasse platea dictumst. Donec nec sodales nibh, a pellentesque purus.'
        }
      },
      {
        id: 'question3',
        title: 'Can I click this?',
        content: {
          type: 'markdown',
          value: '\\positive{\\b{Yes, you can.}}'
        }
      },
      {
        id: 'question4',
        title: 'What does the helpwave logo look like?',
        content: {
          type: 'custom',
          value: (<div className="flex-row-2 justify-center"><Helpwave/></div>)
        }
      },
    ]}
  />
)
