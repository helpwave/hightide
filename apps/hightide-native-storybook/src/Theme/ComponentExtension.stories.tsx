import { useMemo, useState } from 'react'
import {
  View,
  type TextStyle,
  type ViewStyle
} from 'react-native'
import type {
  Meta,
  StoryObj
} from '@storybook/react-native'

import type { ContainerTokens, TextTokens } from '@helpwave/hightide-design/component-tokens'
import { hightideDesignSystem } from '@helpwave/hightide-design/design-system'
import { resolveContainerTokens, resolveTextTokens } from '@helpwave/hightide-design/resolver'
import type { ThemeTokens } from '@helpwave/hightide-design/theme-tokens'
import { TokenBuilder } from '@helpwave/hightide-design/utils'

import {
  Checkbox,
  ThemedText
} from '@helpwave/hightide-native/components'
import {
  HightideConfigUtils,
  useTheme,
  ThemeProvider,
  type ThemeContextValue
} from '@helpwave/hightide-native/global-contexts'
import { useMemoizedTheme } from '@helpwave/hightide-native/hooks'
import {
  bindTokenContext,
  StyleAdapterUtils,
  themes,
  type StyleLeaf,
  type TokenContextInput
} from '@helpwave/hightide-native/theme'
import type { HightideTheme } from '@helpwave/hightide-native/theme'
import { interactionConfig } from '../../../../packages/hightide-native/src/theme/token-context'
import {
  ThemeSelect,
  ThemeStoryFrame
} from './themeStoryHelpers'

type CalloutTheme = {
  container: StyleLeaf<ViewStyle>,
  text: StyleLeaf<TextStyle>,
}

type ExtendedTheme = HightideTheme & {
  components: HightideTheme['components'] & {
    callout: CalloutTheme,
  },
}

type ExtendedThemeContextValue = Omit<ThemeContextValue, 'theme'> & {
  theme: ExtendedTheme,
}

const calloutTokens = {
  container: {
    type: 'container',
    backgroundColor: TokenBuilder.stateful(
      TokenBuilder.colorValueRef('semantics.color.coloring.background')
    ),
    opacity: TokenBuilder.stateful(
      TokenBuilder.numberValue(TokenBuilder.number(1)),
      [
        TokenBuilder.whenState(['disabled'], TokenBuilder.numberValue(TokenBuilder.number(0.6))),
      ]
    ),
    borderRadius: TokenBuilder.borderRadius({
      value: TokenBuilder.numberRef('theme.borderRadius.md'),
    }),
    padding: TokenBuilder.padding({
      horizontal: TokenBuilder.numberRef('theme.padding.xl'),
      vertical: TokenBuilder.numberRef('theme.padding.lg'),
    }),
  },
  text: {
    type: 'textStyle',
    color: TokenBuilder.stateful(
      TokenBuilder.colorValueRef('semantics.color.coloring.foreground')
    ),
    fontSize: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.label.md.fontSize')),
    fontWeight: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.label.md.fontWeight')),
    fontFamily: TokenBuilder.stateful(TokenBuilder.fontFamilyRef('theme.typography.label.md.fontFamily')),
    lineHeight: TokenBuilder.stateful(TokenBuilder.numberRef('theme.typography.label.md.lineHeight')),
  },
} as const satisfies {
  container: ContainerTokens,
  text: TextTokens,
}

const createCalloutTheme = (themeTokens: ThemeTokens): CalloutTheme => {
  const bind = bindTokenContext(themeTokens)

  return {
    container: (context) => StyleAdapterUtils.container(
      resolveContainerTokens(calloutTokens.container, bind(context))
    ),
    text: (context) => StyleAdapterUtils.text(
      resolveTextTokens(calloutTokens.text, bind(context))
    ),
  }
}

const extendTheme = (base: HightideTheme, themeTokens: ThemeTokens): ExtendedTheme => ({
  ...base,
  components: {
    ...base.components,
    callout: createCalloutTheme(themeTokens),
  },
})

const extendedSupportedThemes = {
  light: {
    ...HightideConfigUtils.defaultSupportedThemes.light,
    theme: extendTheme(themes.light, hightideDesignSystem.themes.light),
  },
  dark: {
    ...HightideConfigUtils.defaultSupportedThemes.dark,
    theme: extendTheme(themes.dark, hightideDesignSystem.themes.dark),
  },
}

const useExtendedTheme = (): ExtendedThemeContextValue => {
  return useTheme() as ExtendedThemeContextValue
}

const CalloutStateCheckbox = ({
  label,
  value,
  onValueChange,
}: {
  label: string,
  value: boolean,
  onValueChange: (value: boolean) => void,
}) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
    <Checkbox value={value} onValueChange={onValueChange} />
    <ThemedText>{label}</ThemedText>
  </View>
)

const CalloutDemo = () => {
  const { theme } = useExtendedTheme()
  const [isWarning, setIsWarning] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)
  const color = isWarning ? theme.colors.warning : theme.colors.primary
  const context: TokenContextInput = useMemo(() => ({
    params: {
      colors: {
        color: color.color,
        onColor: color.onColor,
      },
    },
    config: {
      variant: 'tonal',
      coloringStyle: 'filled',
      coloringColorVariant: 'tonal',
      ...interactionConfig({ isDisabled }),
    },
  }), [color.color, color.onColor, isDisabled])
  const containerStyle = useMemoizedTheme(theme.components.callout.container, context)
  const textStyle = useMemoizedTheme(theme.components.callout.text, context)

  return (
    <View style={{ gap: theme.spacing.xxl }}>
      <View style={{ gap: theme.spacing.xl }}>
        <CalloutStateCheckbox
          label="Warning tone"
          value={isWarning}
          onValueChange={setIsWarning}
        />
        <CalloutStateCheckbox
          label="Disabled"
          value={isDisabled}
          onValueChange={setIsDisabled}
        />
      </View>
      <View style={containerStyle}>
        <ThemedText style={textStyle}>
            Callout styles come from theme.components.callout
        </ThemedText>
      </View>
    </View>
  )
}

const ComponentExtensionDemo = () => (
  <ThemeProvider
    fallbackTheme="light"
    supportedThemes={extendedSupportedThemes}
  >
    <ThemeStoryFrame>
      <ThemeSelect />
      <CalloutDemo />
    </ThemeStoryFrame>
  </ThemeProvider>
)

const meta = {
  component: ComponentExtensionDemo,
} satisfies Meta<typeof ComponentExtensionDemo>

export default meta
type Story = StoryObj<typeof meta>

export const componentExtension: Story = {
  render: () => <ComponentExtensionDemo />,
}
