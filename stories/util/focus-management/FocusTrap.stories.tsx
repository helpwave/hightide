import type { Meta, StoryObj } from '@storybook/nextjs'
import { SolidButton } from '@/src/components/user-action/Button'
import { useRef, useState } from 'react'
import { InputUncontrolled } from '../../../src/components/user-action/input/Input'
import { FocusTrap } from '@/src/components/utils/FocusTrap'
import { clsx } from 'clsx'
import { Dialog } from '../../../src/components/dialog'

const Example = () => {
  const ref = useRef<HTMLButtonElement>(null)
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
        <SolidButton onClick={() => setShowDialog2(true)}>
          Open next
        </SolidButton>
        <SolidButton onClick={() => setShowDialog(false)} color="negative">
          Close
        </SolidButton>
      </Dialog>
      <Dialog
        isOpen={showDialog2}
        titleElement="Dialog 2"
        description="This is the second dialog trap"
        onClose={() => setShowDialog2(false)}
      />
      <div className="flex-col-4">
        <FocusTrap
          active={active}
          initialFocus={ref}
          className={clsx(
            'flex-col-2 rounded-md p-2',
            {
              'bg-surface text-on-surface': active,
              'bg-surface-warning text-on-surface': !active,
            }
          )}
        >
          <span>{`FocusTrap ${active ? 'active' : 'inactive'}`}</span>
          <SolidButton ref={ref} onClick={() => setActive(prevState => !prevState)} className="w-min">
            {'Toggle Focus Trap'}
          </SolidButton>
          <FocusTrap
            active={innerActive}
            initialFocus={ref}
            className={clsx(
              'flex-col-2 rounded-md p-2',
              {
                'bg-surface-variant text-on-surface': innerActive,
                'bg-surface-warning text-on-surface': !innerActive,
              }
            )}
          >
            <span>{`Inner FocusTrap ${innerActive ? 'active' : 'inactive'}`}</span>
            <SolidButton ref={ref} onClick={() => setInnerActive(prevState => !prevState)} className="w-min">
              {'Toggle Inner Focus Trap'}
            </SolidButton>
            <InputUncontrolled className="w-min"/>
          </FocusTrap>
        </FocusTrap>
        <span>This part is not reachable with keyboard navigation when the traps are active</span>
        <SolidButton onClick={() => setShowDialog(true)} className="w-min">
          {'Open dialog trap'}
        </SolidButton>
      </div>
    </>
  )
}

const meta = {
  title: 'Util/Focus Management',
  component: Example,
} satisfies Meta<typeof Example>

export default meta
type Story = StoryObj<typeof meta>;

export const focusTrap: Story = {}
