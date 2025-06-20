import type { Meta, StoryObj } from '@storybook/nextjs'
import type { Language, PropsForTranslation } from '../../src'
import { useTranslation } from '../../src'

type TranslationExampleTranslation = {
  welcome: string,
  goodToSeeYou: string,
  page: (page: number) => string,
}

const defaultTranslationExampleTranslations: Record<Language, TranslationExampleTranslation> = {
  en: {
    welcome: 'Welcome',
    goodToSeeYou: 'Good to see you',
    page: (page) => `Page ${page}`
  },
  de: {
    welcome: 'Willkommen',
    goodToSeeYou: 'Schön dich zu sehen',
    page: (page) => `Seite ${page}`
  }
}

type TranslationExampleProps = {
  name: string,
}

/**
 * Simple TranslationExample component to demonstrate some translations
 */
const TranslationExample = ({
                              overwriteTranslation,
                              name
                            }: PropsForTranslation<TranslationExampleTranslation, TranslationExampleProps>) => {
  const translation = useTranslation(defaultTranslationExampleTranslations, overwriteTranslation)
  return (
    <p className="rounded bg-surface text-on-surface p-1 px-2">
      {translation.welcome}{'! '}
      {translation.goodToSeeYou}{', '}
      <span className="text-primary">{name}</span>{'. '}
      {translation.page(123)}
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
    name: 'Name'
  }
}
