import type { Meta, StoryObj } from '@storybook/nextjs'

const typographies = {
  headline: [
    'typography-headline-lg-bold',
    'typography-headline-md-semibold',
    'typography-headline-sm-bold',
  ],
  title: [
    'typography-title-lg-semibold',
    'typography-title-md-semibold',
    'typography-title-sm-medium',
    'typography-title-sm-semibold',
  ], body: [
    'typography-body-lg-semibold',
    'typography-body-lg-medium',
    'typography-body-lg-regular',
    'typography-body-md-bold',
    'typography-body-md-medium',
    'typography-body-md-regular',
    'typography-body-md-light',
  ], label: [
    'typography-label-lg-bold',
    'typography-label-lg-semibold',
    'typography-label-lg-regular',
    'typography-label-md-bold',
    'typography-label-md-medium',
    'typography-label-md-regular',
  ], caption: [
    'typography-caption-lg-regular',
    'typography-caption-md-bold',
    'typography-caption-md-medium',
    'typography-caption-sm-medium',
    'typography-caption-sm-regular',
  ], button: [
    'typography-button-lg-semibold',
    'typography-button-md-semibold',
    'typography-button-sm-semibold',
    'typography-button-sm-regular',
  ],
}

const AllTexts = () => {
  return (
    <div className="flex-col-6">
      {Object.entries(typographies).map(([key, list]) => (
        <ul key={key}>
          <li className="typography-headline-md-semibold">
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
  title: 'Typography',
  component: AllTexts,
} satisfies Meta<typeof AllTexts>

export default meta
type Story = StoryObj<typeof meta>;

export const all: Story = {
  args: {},
}
