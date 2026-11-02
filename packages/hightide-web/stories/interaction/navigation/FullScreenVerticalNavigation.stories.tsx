import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Package, Settings } from 'lucide-react'
import { Button } from '../../../src/components/interaction/Button'
import { FullScreenVerticalNavigation } from '../../../src/components/interaction/navigation/FullScreenVerticalNavigation'
import type { NavigationItemData } from '../../../src/components/interaction/navigation/types'

const items: NavigationItemData[] = [
  {
    id: 'products',
    label: 'Products',
    icon: <Package className="size-5" />,
    items: [
      { id: 'tasks', label: 'Tasks', url: 'https://helpwave.de/product/tasks', external: true },
      { id: 'staff', label: 'Staff', url: 'https://helpwave.de/product/staff', external: true },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="size-5" />,
    url: '#',
  },
  { id: 'section', label: 'Section' },
]

const meta = {
  component: FullScreenVerticalNavigation,
  args: {
    items,
    activeId: 'settings',
  },
} satisfies Meta<typeof FullScreenVerticalNavigation>

export default meta
type Story = StoryObj<typeof meta>

export const fullScreenVerticalNavigation: Story = {}

export const composed: Story = {
  args: {
    showTrigger: false,
  },
  render: function ComposedFullScreenVerticalNavigation(args) {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <div className="flex-col-2">
        <Button onClick={() => setIsOpen(true)}>
          Open navigation
        </Button>
        <FullScreenVerticalNavigation
          {...args}
          isOpen={isOpen}
          onIsOpenChange={setIsOpen}
          showTrigger={false}
        />
      </div>
    )
  },
}
