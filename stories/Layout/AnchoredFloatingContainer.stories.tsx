import type { Meta, StoryObj } from '@storybook/nextjs'
import type { AnchoredFloatingContainerProps } from '@/src/components/layout/AnchoredFloatingContainer'
import { AnchoredFloatingContainer } from '@/src/components/layout/AnchoredFloatingContainer'
import { useRef } from 'react'
import { action } from 'storybook/actions'
import type { UseAnchoredPositionOptions } from '@/src'

type StoryArgs = Omit<AnchoredFloatingContainerProps, 'options'> & UseAnchoredPositionOptions & {
  isAnchored?: boolean,
  hasBackgroundOverlay?: boolean,
}

const meta: Meta<StoryArgs> = {
  component: AnchoredFloatingContainer,
}

export default meta
type Story = StoryObj<typeof meta>;

export const anchoredFloatingContainer: Story = {
  args: {
    isAnchored: true,
    hasBackgroundOverlay: false,
    isPolling: true,
    verticalAlignment: 'afterEnd',
    horizontalAlignment: 'center',
    screenPadding: 16,
    gap: 4,
    pollingInterval: 100,
    onBackgroundOverlayClick: action('onBackgroundOverlayClick'),
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
    isPolling,
    verticalAlignment,
    horizontalAlignment,
    screenPadding,
    gap,
    pollingInterval,
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
        <AnchoredFloatingContainer
          {...props}
          anchor={isAnchored ? anchorRef : undefined}
          className="w-128 h-64"
          hasBackgroundOverlay={hasBackgroundOverlay}
          options={{
            isPolling,
            verticalAlignment,
            horizontalAlignment,
            screenPadding,
            gap,
            pollingInterval,
          }}
        />
      </>
    )
  }
}
