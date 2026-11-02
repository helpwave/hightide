import type { Meta, StoryObj } from '@storybook/react-vite'
import { Package } from 'lucide-react'
import { HorizontalNavigationBar } from '../../../src/components/interaction/navigation/HorizontalNavigationBar'
import type { NavigationItemData } from '../../../src/components/interaction/navigation/types'

const items: NavigationItemData[] = [
  {
    id: 'helpwave',
    label: 'helpwave',
    url: 'https://helpwave.de',
    external: true,
    icon: <Package className="size-5" />,
  },
  {
    id: 'products',
    label: 'helpwave products',
    items: [
      { id: 'site', label: 'helpwave', url: 'https://helpwave.de', external: true },
      { id: 'tasks', label: 'tasks', url: 'https://helpwave.de/product/tasks', external: true },
    ],
  },
  { id: 'current', label: 'current page', url: '#' },
  { id: 'label-only', label: 'section' },
]

const overflowItems: NavigationItemData[] = [
  ...items,
  { id: 'docs', label: 'docs', url: '#' },
  { id: 'blog', label: 'blog', url: '#' },
  { id: 'careers', label: 'careers', url: '#' },
  { id: 'contact', label: 'contact', url: '#' },
  { id: 'status', label: 'status', url: '#' },
  { id: 'legal', label: 'legal', url: '#' },
]

const meta = {
  component: HorizontalNavigationBar,
  args: {
    items,
    activeId: 'current',
  },
} satisfies Meta<typeof HorizontalNavigationBar>

export default meta
type Story = StoryObj<typeof meta>

export const horizontalNavigationBar: Story = {}

export const overflow: Story = {
  args: {
    items: overflowItems,
  },
  decorators: [
    (Story) => (
      <div className="w-72 max-w-full">
        <Story />
      </div>
    ),
  ],
}

export const composed: Story = {
  render: (args) => (
    <HorizontalNavigationBar.StateManager
      LinkComponent={args.LinkComponent}
      onClose={args.onClose}
      activeId={args.activeId}
    >
      <nav>
        <HorizontalNavigationBar.Bar>
          <HorizontalNavigationBar.ItemList items={args.items} />
        </HorizontalNavigationBar.Bar>
      </nav>
    </HorizontalNavigationBar.StateManager>
  ),
}
