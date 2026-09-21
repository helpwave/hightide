import type {
  Meta,
  StoryObj
} from '@storybook/nextjs-vite'

import { LanguageSelect } from '../../src/components/layout/dialog/premade/LanguageDialog'
import { HightideProvider } from '../../src/global-contexts/HightideProvider'
import { HightideConfigUtils } from '../../src/global-contexts/hightide-config/HightideConfigUtils'
import {
  type DemoTranslationEntries,
  useExtendedTranslation
} from './useExtendedTranslation'

const demoTranslations = {
  'en-US': {
    featureTitle: 'Feature title',
    featureHint: 'This string comes from a story translation overlay.',
  },
  'de-DE': {
    featureTitle: 'Feature-Titel',
    featureHint: 'Dieser Text kommt aus einem Story-Übersetzungs-Overlay.',
  },
} as const satisfies Record<string, DemoTranslationEntries>

const frenchTranslations = {
  'fr-FR': {
    featureTitle: 'Titre de la fonctionnalité',
    featureHint: 'Cette chaîne vient d’une couche de traduction Storybook.',
    welcome: 'Bienvenue',
    filterOptions: 'Filtrer les options',
    nResultsFound: '{count, plural, =1{# résultat trouvé} other{# résultats trouvés}}',
    searchResults: 'Résultats de recherche',
  },
} as const satisfies Record<string, DemoTranslationEntries>

const demoSupportedLocales = {
  ...HightideConfigUtils.defaultSupportedLocales,
  'fr-FR': { localName: 'Français' },
}

const DemoStrings = () => {
  const translation = useExtendedTranslation()

  return (
    <div className="flex-col-2 rounded bg-surface text-on-surface p-3 max-w-md">
      <p className="font-semibold">{translation('featureTitle')}</p>
      <p>{translation('featureHint')}</p>
    </div>
  )
}

const NewLocaleDemoStrings = () => {
  const translation = useExtendedTranslation()

  return (
    <div className="flex-col-2 rounded bg-surface text-on-surface p-3 max-w-md">
      <p className="font-semibold">{translation('featureTitle')}</p>
      <p>{translation('featureHint')}</p>
      <p className="text-primary">{translation('welcome')}</p>
    </div>
  )
}

const meta: Meta = {}

export default meta
type Story = StoryObj<typeof meta>

export const extendTranslations: Story = {
  render: () => (
    <HightideProvider
      translation={{ translation: demoTranslations }}
    >
      <div className="flex-col-4 max-w-md">
        <LanguageSelect />
        <DemoStrings />
      </div>
    </HightideProvider>
  ),
  parameters: {
    docs: {
      source: {
        code: `
const useExtendedTranslation = () => {
  return useTranslation<string, DemoTranslationEntries>()
}

<HightideProvider translation={{ translation: demoTranslations }}>
  <LanguageSelect />
  {/* const translation = useExtendedTranslation() */}
</HightideProvider>
        `.trim(),
        language: 'tsx',
      },
    },
  },
}

export const newLocale: Story = {
  render: () => (
    <HightideProvider
      locale={{
        fallbackLocale: 'fr-FR',
        supportedLocales: demoSupportedLocales,
      }}
      translation={{
        translation: [demoTranslations, frenchTranslations],
      }}
    >
      <div className="flex-col-4 max-w-md">
        <LanguageSelect />
        <NewLocaleDemoStrings />
      </div>
    </HightideProvider>
  ),
  parameters: {
    docs: {
      source: {
        code: `
const useExtendedTranslation = () => {
  return useTranslation<string, DemoTranslationEntries>()
}

<HightideProvider
  locale={{
    fallbackLocale: 'fr-FR',
    supportedLocales: {
      ...HightideConfigUtils.defaultSupportedLocales,
      'fr-FR': { localName: 'Français' },
    },
  }}
  translation={{ translation: [demoTranslations, frenchTranslations] }}
>
  <LanguageSelect />
  {/* const translation = useExtendedTranslation() */}
</HightideProvider>
        `.trim(),
        language: 'tsx',
      },
    },
  },
}
