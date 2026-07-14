import type { DecoratorFunction } from 'storybook/internal/types'
import { ThemeProvider } from '@helpwave/hightide-native'
import { View } from 'react-native'

export const isReactNativeStory = (title: string): boolean => {
  return title.startsWith('React Native/')
}

export const ReactNativeDecorator: DecoratorFunction = (Story, context) => {
  const background = context.globals.backgrounds?.value
  const mode = background === 'dark' || background === '#000000' ? 'dark' : 'light'

  return (
    <ThemeProvider mode={mode}>
      <View style={{ padding: 16, alignSelf: 'flex-start' }}>
        <Story />
      </View>
    </ThemeProvider>
  )
}
