import {
  useMemo,
  type ReactNode
} from 'react'
import {
  Text,
  View
} from 'react-native'
import type {
  Meta,
  StoryObj
} from '@storybook/react-native-web-vite'
import { useLocalization } from '@helpwave/hightide-utils/context/localization'

import { Select } from '../../src/components/user-interaction/Select'
import { HightideProvider } from '../../src/global-contexts/HightideProvider'
import { HightideConfigUtils } from '../../src/global-contexts/hightide-config/HightideConfigUtils'
import { useTheme } from '../../src/global-contexts/theme/ThemeContext'
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

const LocaleSelect = () => {
  const {
    locale,
    setLocale,
    supportedLocales,
  } = useLocalization()
  const { theme } = useTheme()

  const options = useMemo(
    () => Object.entries(supportedLocales).map(([id, info]) => ({
      id,
      label: info.localName,
    })),
    [supportedLocales]
  )

  return (
    <View style={{ gap: 8, maxWidth: 320 }}>
      <Text style={{ color: theme.semantic.onBackground }}>Locale</Text>
      <Select
        options={options}
        value={locale}
        showSearch={false}
        onValueChange={(value) => setLocale(value)}
      />
    </View>
  )
}

const DemoStrings = ({ showWelcome = false }: { showWelcome?: boolean }) => {
  const translation = useExtendedTranslation()
  const { theme } = useTheme()

  return (
    <View
      style={{
        gap: 8,
        backgroundColor: theme.semantic.surface,
        borderRadius: 8,
        padding: 12,
      }}
    >
      <Text style={{ color: theme.semantic.onSurface, fontWeight: '600' }}>
        {translation('featureTitle')}
      </Text>
      <Text style={{ color: theme.semantic.onSurface }}>
        {translation('featureHint')}
      </Text>
      {showWelcome ? (
        <Text style={{ color: theme.semantic.primary }}>
          {translation('welcome')}
        </Text>
      ) : null}
    </View>
  )
}

const StoryFrame = ({ children }: { children: ReactNode }) => {
  const { theme } = useTheme()

  return (
    <View
      style={{
        gap: 16,
        maxWidth: 420,
        backgroundColor: theme.semantic.background,
        borderRadius: 12,
        padding: 16,
      }}
    >
      {children}
    </View>
  )
}

const ExtendTranslationsDemo = () => (
  <HightideProvider
    locale={{ fallbackLocale: 'en-US' }}
    translation={{ translation: demoTranslations }}
  >
    <StoryFrame>
      <LocaleSelect />
      <DemoStrings />
    </StoryFrame>
  </HightideProvider>
)

const NewLocaleDemo = () => (
  <HightideProvider
    locale={{
      fallbackLocale: 'fr-FR',
      supportedLocales: demoSupportedLocales,
    }}
    translation={{
      translation: [demoTranslations, frenchTranslations],
    }}
  >
    <StoryFrame>
      <LocaleSelect />
      <DemoStrings showWelcome />
    </StoryFrame>
  </HightideProvider>
)

const meta = {
  component: ExtendTranslationsDemo,
} satisfies Meta<typeof ExtendTranslationsDemo>

export default meta
type Story = StoryObj<typeof meta>

export const extendTranslations: Story = {
  render: () => <ExtendTranslationsDemo />,
}

export const newLocale: Story = {
  render: () => <NewLocaleDemo />,
}
