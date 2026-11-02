import type { Meta, StoryObj } from '@storybook/react-vite'
import { BreadCrumbs } from '../../../src/components/interaction/navigation/BreadCrumbs'

const meta = {
  component: BreadCrumbs,
} satisfies Meta<typeof BreadCrumbs>

export default meta
type Story = StoryObj<typeof meta>

export const breadCrumbs: Story = {
  args: {
    crumbs: [
      { label: 'Organization', href: '' },
      { label: 'Ward', href: '' },
      { label: 'Bed', href: '', className: 'font-medium' },
      { label: 'Patient', href: '', style: { textDecoration: 'underline' } },
    ]
  },
}

export const composed: Story = {
  args: {
    crumbs: [
      { label: 'Organization', href: '' },
      { label: 'Ward', href: '' },
      { label: 'Bed', href: '', className: 'font-medium' },
      { label: 'Patient', href: '', style: { textDecoration: 'underline' } },
    ]
  },
  render: (args) => (
    <BreadCrumbs.Provider value={{ LinkElement: args.LinkElement }}>
      <BreadCrumbs.Layout {...args.layoutProps}>
        {args.crumbs.map(({ href, label, className, style }, index) => (
          <BreadCrumbs.Item key={index} {...args.itemProps}>
            <BreadCrumbs.Link
              {...args.linkProps}
              href={href}
              className={className}
              style={style}
            >
              {label}
            </BreadCrumbs.Link>
            <BreadCrumbs.Divider {...args.dividerProps}>
              {args.divider}
            </BreadCrumbs.Divider>
          </BreadCrumbs.Item>
        ))}
      </BreadCrumbs.Layout>
    </BreadCrumbs.Provider>
  ),
}
