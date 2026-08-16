import type {
  ContainerTokens,
  TextStyleTokens
} from '@helpwave/hightide-design/component-token-resolvers'

import { toContainerStyle, toTextStyle } from '../../adapters/style-adapters'
import type {
  ChatQuickReplyChipState,
  ChatQuickReplyChipThemeResolvers,
  PressableContainerStyle,
  PressableState,
  PressableStateLayerStyle,
  PressableTextStyle
} from '../../types/components/chat'
import {
  createStyleResolver,
  createValueResolver,
  toPressableInteractionState,
  type ComponentThemeResolver
} from '../../types/resolver'

const toOptionalContainerStyle = (tokens?: ContainerTokens): PressableContainerStyle => (
  tokens === undefined ? {} : toContainerStyle(tokens)
)

const toOptionalTextStyle = (tokens?: TextStyleTokens): PressableTextStyle => (
  tokens === undefined ? {} : toTextStyle(tokens)
)

export const toChatQuickReplyChipThemeResolvers: ComponentThemeResolver<ChatQuickReplyChipThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = (isActive?: boolean) => componentTokens.chat.quickReplyChip({
    themeTokens,
    semanticResolvers: semanticTokens,
    config: { isActive },
  })

  return {
    pressable: createValueResolver((state: ChatQuickReplyChipState) => {
      const tokens = resolve(state.isActive)

      const resolvePressable = (pressableState: PressableState) => componentTokens.pressable({
        themeTokens,
        semanticResolvers: semanticTokens,
        overrides: {
          size: tokens.config.size,
          color: tokens.config.color,
          coloringStyle: tokens.config.coloringStyle,
          coloringColorVariant: tokens.config.coloringColorVariant,
          hasAdditionalHorizontalPadding: tokens.config.hasAdditionalHorizontalPadding,
        },
        state: toPressableInteractionState(pressableState),
      })

      return {
        container: createStyleResolver((pressableState: PressableState): PressableContainerStyle => ({
          ...toContainerStyle(resolvePressable(pressableState).container),
          ...toOptionalContainerStyle(tokens.container),
        })),
        stateLayer: createStyleResolver((pressableState: PressableState): PressableStateLayerStyle => ({
          ...toContainerStyle(resolvePressable(pressableState).stateLayer),
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          ...toOptionalContainerStyle(tokens.stateLayer),
        })),
        text: createStyleResolver((pressableState: PressableState): PressableTextStyle => ({
          ...toTextStyle(resolvePressable(pressableState).text),
          ...toOptionalTextStyle(tokens.text),
        })),
      }
    }),
  }
}
