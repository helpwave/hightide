import type { Meta, StoryObj } from '@storybook/nextjs'
import type { FloatingContainerProps } from '../../src/components/layout/FloatingContainer'
import { FloatingContainer } from '../../src/components/layout/FloatingContainer'
import { useRef } from 'react'

type StoryArgs = Omit<FloatingContainerProps, 'children'> & {
  isAnchored?: boolean,
  hasBackgroundOverlay?: boolean,
}

const meta: Meta<StoryArgs> = {
  component: FloatingContainer,
}

export default meta
type Story = StoryObj<typeof meta>;

export const floatingContainer: Story = {
  args: {
    isAnchored: true,
    hasBackgroundOverlay: false,
    isPolling: true,
    verticalAlignment: 'afterEnd',
    horizontalAlignment: 'center',
    screenPadding: 16,
    gap: 4,
    pollingInterval: 100,
    backgroudOverlay: (<div className="fixed inset-0 bg-overlay-shadow"/>),
    children: (
      <div className="flex-col-2 h-full w-full bg-primary text-on-primary rounded-md p-2">
          Test Container
        <span className="opacity-80">Description</span>
      </div>
    ),
  },
  decorators: (Story) => {
    return (
      <div className="relative w-screen h-screen border-4 border-dashed border-primary rounded-lg">
        <style>
          {'main { padding: 0 !important;}'}
        </style>
        <Story/>
      </div>
    )
  },
  render: ({
    isAnchored,
    hasBackgroundOverlay,
    ...props
  }) => {
    const anchorRef = useRef<HTMLDivElement>(null)
    return (
      <>
        <div className="flex-col-0 items-center h-full overflow-scroll">
          <div className="min-h-9/10"></div>
          <div
            ref={anchorRef}
            className="p-2 rounded-md bg-secondary text-on-secondary w-min"
          >
            {'Anchor'}
          </div>
          <div className="min-h-9/10"></div>
        </div>
        <FloatingContainer
          {...props}
          anchor={isAnchored ? anchorRef : undefined}
          className="w-128 h-64"
          backgroundOverlay={hasBackgroundOverlay ? props.backgroudOverlay : undefined}
        />
      </>
    )
  }
}
