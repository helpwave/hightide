import type { Meta, StoryObj } from '@storybook/nextjs'

const typographies = {
  headline: [
    'typography-headline-lg',
    'typography-headline-md',
    'typography-headline-sm',
  ],
  title: [
    'typography-title-lg',
    'typography-title-md',
    'typography-title-sm',
  ], body: [
    'typography-body-lg',
    'typography-body-md',
  ], label: [
    'typography-label-lg',
    'typography-label-md',
  ], caption: [
    'typography-caption-lg',
    'typography-caption-md',
    'typography-caption-sm',
  ], button: [
    'typography-button-lg',
    'typography-button-md',
    'typography-button-sm',
  ],
}

const AllTexts = () => {
  return (
    <div className="flex-col-6">
      {Object.entries(typographies).map(([key, list]) => (
        <ul key={key}>
          <li className="typography-headline-md">
            {key}
            <ul className="pl-2">
              {list.map((item) => (<li key={item} className={item}>{item}</li>))}
            </ul>
          </li>
        </ul>
      ))}
    </div>
  )
}

const meta = {
  component: AllTexts,
} satisfies Meta<typeof AllTexts>

export default meta
type Story = StoryObj<typeof meta>;

export const all: Story = {
  args: {},
}
