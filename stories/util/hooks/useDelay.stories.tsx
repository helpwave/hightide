import type { Meta, StoryObj } from '@storybook/nextjs'
import { action } from 'storybook/actions'
import { useDelay } from '@/src/hooks/useDelay'
import { Button } from '../../../src/components/user-action/Button'

type UseDelayExampleProps = {
  delay: number,
  timerCallback: () => void,
}

const UseDelayExample = ({ delay, timerCallback }: UseDelayExampleProps) => {
  const { clearTimer, restartTimer, hasActiveTimer } = useDelay({ delay })

  return (
    <div className="flex-col-2 items-center justify-center">
      <Button onClick={() => restartTimer(timerCallback)}>
        {'Press me'}
      </Button>
      <span className="mt-12">{`Has an active timer: ${hasActiveTimer}`}</span>
      <Button coloringStyle="text" onClick={ clearTimer} color="negative" disabled={!hasActiveTimer}>
        {'Clear'}
      </Button>
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
