import type { Meta, StoryObj } from '@storybook/nextjs'
import { SolidButton } from '@/src/components/user-action/Button'
import { useRef, useState } from 'react'
import { InputUncontrolled } from '../../../src/components/user-action/input/Input'
import { FocusTrap } from '@/src/components/utils/FocusTrap'
import { clsx } from 'clsx'
import { createPortal } from 'react-dom'

const Example = () => {
  const ref = useRef<HTMLButtonElement>(null)
  const [active, setActive] = useState<boolean>(true)
  const [innerActive, setInnerActive] = useState<boolean>(false)
  const [showDialog, setShowDialog] = useState<boolean>(false)
  const [showDialog2, setShowDialog2] = useState<boolean>(false)

  return (
    <>
      {showDialog && (
        createPortal(
          <FocusTrap
            className="fixed top-1/2 left-1/2 -translate-1/2 flex-col-2 p-2 bg-overlay-background text-overlay-text rounded-lg shadow-hw-bottom"
          >
            <span>This is the first dialog trap</span>
            <div className="flex-row-4 justify-end">
              <SolidButton onClick={() => setShowDialog2(true)}>
                Open next
              </SolidButton>
              <SolidButton onClick={() => setShowDialog(false)} color="negative">
                Close
              </SolidButton>
            </div>
          </FocusTrap>,
          document.body
        )
      )}
      {showDialog2 && (
        createPortal(
          <FocusTrap
            className="fixed top-16 left-1/2 -translate-x-1/2 flex-col-2 p-2 bg-overlay-background text-overlay-text rounded-lg shadow-hw-bottom"
          >
            <span>This is the second dialog trap</span>
            <div className="flex-row-4 justify-end">
              <SolidButton onClick={() => setShowDialog2(false)} color="negative">
                Ok
              </SolidButton>
            </div>
          </FocusTrap>,
          document.body
        )
      )}
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
