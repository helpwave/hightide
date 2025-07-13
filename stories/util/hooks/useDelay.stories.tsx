import type { Meta, StoryObj } from '@storybook/nextjs'
import { SolidButton, TextButton, useDelay } from '../../../src'
import { action } from 'storybook/actions'

type UseDelayExampleProps = {
  delay: number,
  timerCallback: () => void,
}

const UseDelayExample = ({ delay, timerCallback }: UseDelayExampleProps) => {
  const { clearTimer, restartTimer, hasActiveTimer } = useDelay({ delay })

  return (
    <div className="flex-col-2 items-center justify-center">
      <SolidButton onClick={() => restartTimer(timerCallback)}>
        {'Press me'}
      </SolidButton>
      <span className="mt-12">{`Has an active timer: ${hasActiveTimer}`}</span>
      <TextButton onClick={ clearTimer} color="negative" disabled={!hasActiveTimer}>
        {'Clear'}
      </TextButton>
    </div>
  )
}

const meta = {
  title: 'Util/hooks',
  component: UseDelayExample,
} satisfies Meta<typeof UseDelayExample>

export default meta
type Story = StoryObj<typeof meta>;

export const story: Story = {
  name: 'useDelay',
  args: {
    delay: 500,
    timerCallback:  action('Timer callback')
  },
}
