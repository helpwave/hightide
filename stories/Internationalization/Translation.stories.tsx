import type { Meta, StoryObj } from '@storybook/nextjs'
import { useHightideTranslation } from '../../src/i18n/useHightideTranslation'

type StoryArgs = {
  name: string,
  gender: 'male' | 'female' | 'other',
  min: number,
  max: number,
}

const meta: Meta<StoryArgs> = {}

export default meta
type Story = StoryObj<typeof meta>;

export const translation: Story = {
  args: {
    name: 'Name',
    gender: 'other',
    min: 1,
    max: 2
  },
  render: ({ name, gender, min, max }) => {
    const translation = useHightideTranslation()
    return (
      <p className="rounded bg-surface text-on-surface p-1 px-2">
        {translation('welcome')}{'! '}
        {translation('goodToSeeYou')}{', '}
        <span className="text-primary">{name}</span>{'. '}
        <br/>
        {translation('gender', { gender }) + '. '}
        <br/>
        {translation('outOfRangeString', { min, max })}
      </p>
    )
  },
  parameters: {
    docs: {
      source: {
        code: `
const translation = useHightideTranslation()
return (
  <p className="rounded bg-surface text-on-surface p-1 px-2">
    {translation('welcome')}{'! '}
    {translation('goodToSeeYou')}{', '}
    <span className="text-primary">{name}</span>{'. '}
    <br/>
    {translation('gender', { gender }) + '. '}
    <br/>
    {translation('outOfRangeString', { min, max })}
  </p>
)
        `.trim(),
        language: 'tsx',
      },
    },
  },
}
