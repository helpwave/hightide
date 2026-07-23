import { useState } from 'react'
import {
  Text,
  View,
  type TextStyle,
  type ViewStyle
} from 'react-native'
import type {
  Meta,
  StoryObj
} from '@storybook/react-native-vite'

import { Checkbox } from '../../src/components/user-interaction/Checkbox'
import { HightideConfigUtils } from '../../src/global-contexts/hightide-config/HightideConfigUtils'
import {
  useTheme,
  type ThemeContextValue
} from '../../src/global-contexts/theme/ThemeContext'
import { ThemeProvider } from '../../src/global-contexts/theme/ThemeProvider'
import { themes } from '../../src/theme/themes/hightideThemes'
import type { HightideTheme } from '../../src/theme/types/theme'
import {
  createStyleResolver,
  type InteractionState,
  type StyleResolverFunction
} from '../../src/theme/types/resolver'
import {
  ThemeSelect,
  ThemeStoryFrame
} from './themeStoryHelpers'

type CalloutState = InteractionState & {
  tone?: 'info' | 'warning',
}

type CalloutTheme = {
  container: StyleResolverFunction<CalloutState, ViewStyle>,
  text: StyleResolverFunction<CalloutState, TextStyle>,
}

type ExtendedTheme = HightideTheme & {
  components: HightideTheme['components'] & {
    callout: CalloutTheme,
  },
}

type ExtendedThemeContextValue = Omit<ThemeContextValue, 'theme'> & {
  theme: ExtendedTheme,
}

const createCalloutTheme = (theme: HightideTheme): CalloutTheme => {
  const resolveState = (state: CalloutState) => {
    const tone = state.tone ?? 'info'
    const backgroundColor = tone === 'warning'
      ? theme.semantic.surfaceWarning
      : theme.components.coloring.primary.tonalBackground
        ?? theme.semantic.surfaceVariant
    const color = tone === 'warning'
      ? theme.semantic.onSurfaceWarning
      : theme.components.coloring.primary.tonalText
        ?? theme.semantic.primary

    const container: ViewStyle = {
      backgroundColor,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 10,
      opacity: state.isDisabled ? 0.6 : 1,
    }

    const text: TextStyle = {
      color,
      fontSize: 14,
      fontWeight: '600',
    }

    return {
      container,
      text,
    }
  }

  return {
    container: createStyleResolver((state) => resolveState(state).container),
    text: createStyleResolver((state) => resolveState(state).text),
  }
}

const extendTheme = (base: HightideTheme): ExtendedTheme => ({
  ...base,
  components: {
    ...base.components,
    callout: createCalloutTheme(base),
  },
})

const extendedSupportedThemes = {
  light: {
    ...HightideConfigUtils.defaultSupportedThemes.light,
    theme: extendTheme(themes.light),
  },
  dark: {
    ...HightideConfigUtils.defaultSupportedThemes.dark,
    theme: extendTheme(themes.dark),
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
}) => {
  const { theme } = useExtendedTheme()

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Checkbox value={value} onValueChange={onValueChange} />
      <Text style={{ color: theme.semantic.onBackground }}>{label}</Text>
    </View>
  )
}

const CalloutDemo = () => {
  const { theme } = useExtendedTheme()
  const [isWarning, setIsWarning] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)

  const state: CalloutState = {
    tone: isWarning ? 'warning' : 'info',
    isDisabled,
  }
  const containerStyle = theme.components.callout.container(state)
  const textStyle = theme.components.callout.text(state)

  return (
    <View style={{ gap: 12 }}>
      <View style={{ gap: 8 }}>
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
        <Text style={textStyle}>
          Callout styles come from theme.components.callout
        </Text>
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
