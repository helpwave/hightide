import type { Meta, StoryObj } from '@storybook/nextjs'

const AllTexts = () => {
  return (
    <div className="flex-col-2">
      <span className="typography-headline-sm">headline-sm</span>
      <span className="typography-headline-md">headline-md</span>

      <span className="typography-title-xs">title-xs</span>
      <span className="typography-title-xs-bold">title-xs-bold</span>
      <span className="typography-title-md">title-md</span>
      <span className="typography-title-lg">title-lg</span>

      <span className="typography-label-xs">label-xs</span>
      <span className="typography-label-xs-semibold">label-xs-bold</span>
      <span className="typography-label-md">label-md</span>
      <span className="typography-label-md-semibold">label-md-semibold</span>
      <span className="typography-label-lg">label-lg</span>

      <span className="typography-body-xs">body-xs</span>
      <span className="typography-body-sm">body-sm</span>
    </div>
  )
}

const meta = {
  title: 'Layout',
  component: AllTexts,
} satisfies Meta<typeof AllTexts>

export default meta
type Story = StoryObj<typeof meta>;

export const all: Story = {
  args: {
  },
}
