import type { Meta, StoryObj } from '@storybook/nextjs'
import { useRef, useState } from 'react'
import { InputUncontrolled } from '@/src/components/user-interaction/input/Input'
import { FocusTrapWrapper } from '@/src/components/utils/FocusTrap'
import { clsx } from 'clsx'
import { Dialog } from '@/src/components/layout/dialog/Dialog'
import { Button } from '@/src/components/user-interaction/Button'

type StoryArgs = unknown

const meta: Meta<StoryArgs> = {}

export default meta
type Story = StoryObj<typeof meta>;

export const focusTrap: Story = {
  render: () => {
    const ref = useRef<HTMLButtonElement>(null)
    const ref2 = useRef<HTMLInputElement>(null)
    const [active, setActive] = useState<boolean>(true)
    const [innerActive, setInnerActive] = useState<boolean>(false)
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const [showDialog2, setShowDialog2] = useState<boolean>(false)

    return (
      <>
        <Dialog
          isOpen={showDialog}
          titleElement="Dialog 1"
          description="This is the second dialog trap"
          onClose={() => setShowDialog(false)}
        >
          <Button onClick={() => setShowDialog2(true)}>
          Open next
          </Button>
          <Button onClick={() => setShowDialog(false)} color="negative">
          Close
          </Button>
        </Dialog>
        <Dialog
          isOpen={showDialog2}
          titleElement="Dialog 2"
          description="This is the second dialog trap"
          onClose={() => setShowDialog2(false)}
        />
        <div className="flex-col-4">
          <FocusTrapWrapper
            active={active}
            initialFocus={ref}
            className={clsx(
              'flex-col-2 rounded-md p-2',
              {
                'bg-primary/30': active,
                'bg-surface text-on-surface': !active,
              }
            )}
          >
            <span>{`FocusTrap ${active ? 'active' : 'inactive'}`}</span>
            <Button ref={ref} onClick={() => setActive(prevState => !prevState)}>
              {'Toggle Focus Trap'}
            </Button>
            <FocusTrapWrapper
              active={innerActive}
              initialFocus={ref2}
              className={clsx(
                'flex-col-2 rounded-md p-2',
                {
                  'bg-primary/30': innerActive,
                  'bg-surface text-on-surface': !innerActive,
                }
              )}
            >
              <span>{`Inner FocusTrap ${innerActive ? 'active' : 'inactive'}`}</span>
              <Button onClick={() => setInnerActive(prevState => !prevState)}>
                {'Toggle Inner Focus Trap'}
              </Button>
              <InputUncontrolled ref={ref2} />
            </FocusTrapWrapper>
          </FocusTrapWrapper>
          <span>This part is not reachable with keyboard navigation when the traps are active</span>
          <Button onClick={() => setShowDialog(true)} >
            {'Open dialog trap'}
          </Button>
        </div>
      </>
    )
  }
}
