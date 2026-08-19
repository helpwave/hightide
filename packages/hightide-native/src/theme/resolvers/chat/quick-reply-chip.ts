import type {
  ChatQuickReplyChipState,
  ChatQuickReplyChipThemeResolvers,
  PressableContainerStyle,
  PressableIconStyle,
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

import { StyleAdapterUtils } from '../../adapters'

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
          ...StyleAdapterUtils.container(resolvePressable(pressableState).container),
          ...StyleAdapterUtils.container(tokens.container = {}),
        })),
        stateLayer: createStyleResolver((pressableState: PressableState): PressableStateLayerStyle => ({
          ...StyleAdapterUtils.container(resolvePressable(pressableState).stateLayer),
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          ...StyleAdapterUtils.container(tokens.stateLayer = {}),
        })),
        text: createStyleResolver((pressableState: PressableState): PressableTextStyle => ({
          ...StyleAdapterUtils.text(resolvePressable(pressableState).text),
          ...StyleAdapterUtils.text(tokens.text = {}),
        })),
        icon: createValueResolver((pressableState: PressableState): PressableIconStyle => ({
          ...StyleAdapterUtils.icon(resolvePressable(pressableState).icon),
          ...StyleAdapterUtils.icon(tokens.icon = {}),
        })),
      }
    }),
  }
}
