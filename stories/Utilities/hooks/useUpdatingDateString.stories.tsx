import type { Meta, StoryObj } from '@storybook/nextjs'
import type { HightideTranslationLocales } from '@/src/i18n/translations'
import { useUpdatingDateString } from '@/src/hooks/useUpdatingDateString'

type StoryArgs = {
  date: Date,
  absoluteFormat: 'date' | 'time' | 'dateTime',
  localeOverride: HightideTranslationLocales,
}

const meta: Meta<StoryArgs> = {}

export default meta
type Story = StoryObj<typeof meta>

function UpdatingDateTimeDisplay({ date, absoluteFormat, localeOverride }: StoryArgs) {
  const { absolute, relative } = useUpdatingDateString({
    date,
    absoluteFormat,
    localeOverride,
  })

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="typography-label-lg">{'absolute'}</div>
        <div>{absolute}</div>
      </div>
      <div>
        <div className="typography-label-lg">{'relative'}</div>
        <div>{relative}</div>
      </div>
    </div>
  )
}

export const UseUpdatingDateString: Story = {
  name: 'useUpdatingDateTime',
  args: {
    date: new Date(),
    absoluteFormat: 'dateTime',
  },
  render: (args) => <UpdatingDateTimeDisplay {...args} />,
}
