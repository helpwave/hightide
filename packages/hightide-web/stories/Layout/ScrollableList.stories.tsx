import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { ScrollableList } from '../../src/components/layout/ScrollableList'
import { Button } from '../../src/components/user-interaction/Button'

const listItems = [
  'Alpha',
  'Bravo',
  'Charlie',
  'Delta',
  'Echo',
  'Foxtrot',
  'Golf',
  'Hotel',
  'India',
  'Juliet',
]

const meta: Meta<typeof ScrollableList> = {
  component: ScrollableList,
}

export default meta
type Story = StoryObj<typeof meta>

export const scrollableList: Story = {
  args: {
    className: 'surface coloring-solid rounded-lg border border-divider',
    headerClassName: 'px-4 py-3 border-b border-divider',
    contentClassName: 'px-2 py-1',
    footerClassName: 'px-4 py-2 border-t border-divider',
    header: (
      <span className="typography-title-md text-primary">{'Items'}</span>
    ),
    footer: (
      <Button size="sm" className="w-full">{'Add item'}</Button>
    ),
  },
  render: (args) => (
    <div className="h-90 w-90">
      <ScrollableList {...args}>
        {listItems.map((item) => (
          <div
            key={item}
            className="px-2 py-2.5 rounded-md surface coloring-solid-hover"
          >
            {item}
          </div>
        ))}
      </ScrollableList>
    </div>
  ),
}

export const asNav: Story = {
  args: {
    'as': 'nav',
    'aria-label': 'Sections',
    'className': 'surface coloring-solid rounded-lg border border-divider',
    'headerClassName': 'px-4 py-3 border-b border-divider',
    'contentClassName': 'px-2 py-1',
    'header': (
      <span className="typography-title-md text-primary">{'Navigation'}</span>
    ),
  },
  render: (args) => (
    <div className="h-80 w-72">
      <ScrollableList {...args}>
        {listItems.map((item) => (
          <a
            key={item}
            href="#"
            className="block px-2 py-2.5 rounded-md surface coloring-solid-hover"
            onClick={(event) => event.preventDefault()}
          >
            {item}
          </a>
        ))}
      </ScrollableList>
    </div>
  ),
}
