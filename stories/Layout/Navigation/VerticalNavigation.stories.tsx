import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { action } from 'storybook/actions'
import {
  VerticalNavigation,
  type NavigationItemData
} from '@/src/components/layout/navigation/vertical-navigation/VerticalNavigation'

const sampleItems: NavigationItemData[] = [
  {
    id: 'products',
    label: 'Products',
    items: [
      {
        id: 'clinical',
        label: 'Clinical',
        items: [
          { id: 'ward-management', label: 'Ward management', url: '#' },
          { id: 'patient-overview', label: 'Patient overview', url: '#' },
        ],
      },
      {
        id: 'operations',
        label: 'Operations',
        items: [
          { id: 'task-board', label: 'Task board', url: 'https://helpwave.de/product/tasks', external: true },
          { id: 'staff-planning', label: 'Staff planning', url: 'https://helpwave.de/product/staff', external: true },
        ],
      },
    ],
  },
  {
    id: 'organization',
    label: 'Organization',
    items: [
      {
        id: 'sites',
        label: 'Sites',
        items: [
          { id: 'site-berlin', label: 'Berlin', url: '#' },
          { id: 'site-munich', label: 'Munich', url: '#' },
        ],
      },
      {
        id: 'teams',
        label: 'Teams',
        items: [
          { id: 'team-nursing', label: 'Nursing', url: '#' },
          { id: 'team-administration', label: 'Administration', url: '#' },
        ],
      },
    ],
  },
  {
    id: 'company',
    label: 'Company',
    items: [
      { id: 'about', label: 'About', url: '#' },
      { id: 'careers', label: 'Careers', url: '#' },
    ],
  },
  { id: 'contact', label: 'Contact', url: '#' },
]

const meta: Meta<typeof VerticalNavigation> = {
  component: VerticalNavigation,
}

export default meta
type Story = StoryObj<typeof meta>

export const verticalNavigation: Story = {
  args: {
    initialActiveId: 'ward-management',
    isNextLooping: true,
    onlyOneExpandedTree: true,
    header: (
      <div className="typography-label-lg font-semibold px-2 py-1">
        Navigation
      </div>
    ),
    footer: (
      <div className="typography-label-md text-description px-2 py-1">
        helpwave
      </div>
    ),
    items: sampleItems,
    onActiveIdChange: action('onActiveIdChange'),
  },
  render: (args) => {
    const [activeId, setActiveId] = useState<string | null>(args.initialActiveId ?? null)

    return (
      <div className="w-64">
        <VerticalNavigation
          {...args}
          activeId={activeId}
          onActiveIdChange={(id) => {
            args.onActiveIdChange?.(id)
            setActiveId(id)
          }}
        />
      </div>
    )
  },
}
