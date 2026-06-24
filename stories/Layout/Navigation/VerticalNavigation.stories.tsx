import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useState } from 'react'
import { action } from 'storybook/actions'
import { VerticalNavigationTree } from '@/src/components/layout/navigation/navigation-menus/VerticalNavigationTree'
import { sampleNavigationItems } from './verticalNavigationSampleItems'

const meta: Meta<typeof VerticalNavigationTree> = {
  component: VerticalNavigationTree,
}

export default meta
type Story = StoryObj<typeof meta>

export const verticalNavigation: Story = {
  args: {
    initialActiveId: 'ward-management',
    onlyOneExpandedTree: false,
    items: sampleNavigationItems,
    onActiveIdChange: action('onActiveIdChange'),
  },
  render: (args) => {
    const [activeId, setActiveId] = useState<string | null>(args.initialActiveId ?? null)

    return (
      <div className="w-64 h-96">
        <VerticalNavigationTree
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
