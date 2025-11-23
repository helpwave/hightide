import type { Meta, StoryObj } from '@storybook/nextjs'
import { useHightideTranslation } from '../../src/i18n/useHightideTranslation'

type TranslationExampleProps = {
  name: string,
  gender: 'male' | 'female' | 'other',
  min: number,
  max: number,
}

/**
 * Simple TranslationExample component to demonstrate some translations
 */
const TranslationExample = ({
                              name,
                              gender,
                              min,
                              max
                            }: TranslationExampleProps) => {
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
}

const meta = {
  title: 'Other/Translation',
  component: TranslationExample,
} satisfies Meta<typeof TranslationExample>

export default meta
type Story = StoryObj<typeof meta>;

export const translationExample: Story = {
  args: {
    name: 'Name',
    gender: 'other',
    min: 1,
    max: 2
  }
}
