import type { Meta, StoryObj } from '@storybook/nextjs'
import { useRef } from 'react'
import type { UseAnchoredPositionOptions } from '@/src/hooks/useAnchoredPosition'
import type { PopUpProps } from '@/src/components/layout/popup/PopUp'
import { PopUp } from '@/src/components/layout/popup/PopUp'
import { action } from 'storybook/actions'

type StoryArgs = Omit<PopUpProps, 'options'> & UseAnchoredPositionOptions & {
  isAnchored?: boolean,
}

const meta: Meta<StoryArgs> = {
  component: PopUp,
}

export default meta
type Story = StoryObj<typeof meta>;

export const popUp: Story = {
  args: {
    isOpen: true,
    isAnchored: true,
    isPolling: true,
    verticalAlignment: 'afterEnd',
    horizontalAlignment: 'center',
    screenPadding: 16,
    gap: 4,
    pollingInterval: 100,
    onClose: action('onClose'),
    children: (
      <div className="flex-col-2 h-full w-full p-2">
        {'Test Container'}
        <span className="opacity-80">{'Description'}</span>
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
        <PopUp
          {...props}
          anchor={isAnchored ? anchorRef : undefined}
          className="w-128 h-64"
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
