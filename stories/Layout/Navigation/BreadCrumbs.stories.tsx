import type { Meta, StoryObj } from '@storybook/nextjs'
import { BreadCrumbs } from '../../../src/components/layout/navigation/BreadCrumbs'

const meta = {
  component: BreadCrumbs,
} satisfies Meta<typeof BreadCrumbs>

export default meta
type Story = StoryObj<typeof meta>;

export const breadCrumbs: Story = {
  args: {
    crumbs: [
      { label: 'Organization', href: '' },
      { label: 'Ward', href: '' },
      { label: 'Bed', href: '' },
      { label: 'Patient', href: '' },
    ]
  },
}
