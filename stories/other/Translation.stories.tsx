import type { Meta, StoryObj } from '@storybook/nextjs'
import type { PropsForTranslation, Translation, TranslationPlural } from '../../src'
import { useTranslation } from '../../src'

type TranslationExampleTranslation = {
  welcome: string,
  goodToSeeYou: string,
  page: string,
  tree: TranslationPlural,
}

const defaultTranslationExampleTranslations: Translation<TranslationExampleTranslation> = {
  en: {
    welcome: 'Welcome',
    goodToSeeYou: 'Good to see you',
    page: `Dynamic value example: Page {{page}}`,
    tree: {
      one: 'Plural example: {{amount}} Tree',
      other: 'Plural example: {{amount}} Trees'
    }
  },
  de: {
    welcome: 'Willkommen',
    goodToSeeYou: 'Schön dich zu sehen',
    page: `Dynamischer Wert Beispiel: Seite {{page}}`,
    tree: {
      one: 'Plural Beispiel: {{amount}} Baum',
      other: 'Plural Beispiel: {{amount}} Bäume'
    }
  }
}

type TranslationExampleProps = {
  name: string,
  treeCount: number,
  page: number,
}

/**
 * Simple TranslationExample component to demonstrate some translations
 */
const TranslationExample = ({
                              overwriteTranslation,
                              name,
                              treeCount,
                              page,
                            }: PropsForTranslation<TranslationExampleTranslation, TranslationExampleProps>) => {
  const translation = useTranslation([defaultTranslationExampleTranslations], overwriteTranslation)
  return (
    <p className="rounded bg-surface text-on-surface p-1 px-2">
      {translation('welcome')}{'! '}
      {translation('goodToSeeYou')}{', '}
      <span className="text-primary">{name}</span>{'. '}
      <br/>
      {translation('tree', { replacements: { amount: treeCount.toString() } })}{'. '}
      <br/>
      {translation('page', { replacements: { page: page.toString() } })}
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
    treeCount: 5,
    page: 123
  }
}
