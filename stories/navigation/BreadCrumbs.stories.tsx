import type { Meta, StoryObj } from '@storybook/nextjs'
import { BreadCrumb } from '../../src/components/navigation/BreadCrumb'

const meta = {
  title: 'Navigation',
  component: BreadCrumb,
} satisfies Meta<typeof BreadCrumb>

export default meta
type Story = StoryObj<typeof meta>;

export const breadCrumb: Story = {
  args: {
    crumbs: [
      { display: 'Organization', link: '' },
      { display: 'Ward', link: '' },
      { display: 'Bed', link: '' },
      { display: 'Patient', link: '' },
    ]
  },
}
