import type {
  ChatMessageDirection
} from '@helpwave/hightide-design/component-token-resolvers'

import type {
  ChatAttachmentMessageBubbleDownloadIconContainerStyle,
  ChatAttachmentMessageBubbleDownloadIconStyle,
  ChatAttachmentMessageBubbleFileIconContainerStyle,
  ChatAttachmentMessageBubbleFileIconStyle,
  ChatAttachmentMessageBubbleFileMetadataTextStyle,
  ChatAttachmentMessageBubbleFileNameTextStyle,
  ChatAttachmentMessageBubbleState,
  ChatAttachmentMessageBubbleThemeResolvers,
  ChatMessageBubbleBodyStyle,
  ChatMessageBubbleBodyTextStyle,
  ChatMessageBubbleContainerStyle,
  ChatMessageBubbleMetaDataContainerStyle,
  ChatMessageBubbleMetaDataIconStyle,
  ChatMessageBubbleMetaDataStatusContainerStyle,
  ChatMessageBubbleMetaDataTextStyle,
  PressableContainerStyle,
  PressableIconStyle,
  PressableState,
  PressableStateLayerStyle,
  PressableTextStyle
} from '../../types/components/chat'
import {
  createStyleResolver,
  toPressableInteractionState,
  type ComponentThemeResolver
} from '../../types/resolver'

import { StyleAdapterUtils } from '../../adapters'

export const toChatAttachmentMessageBubbleThemeResolvers: ComponentThemeResolver<
  ChatAttachmentMessageBubbleThemeResolvers
> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = (direction?: ChatMessageDirection) => componentTokens.chat.attachmentMessageBubble({
    themeTokens,
    semanticResolvers: semanticTokens,
    config: { direction },
  })

  return {
    chatMessageBubbleOverrides: {
      container: createStyleResolver((state: ChatAttachmentMessageBubbleState): ChatMessageBubbleContainerStyle => (
        StyleAdapterUtils.container(resolve(state.direction).chatMessageBubbleOverrides.container ?? {})
      )),
      body: createStyleResolver((state: ChatAttachmentMessageBubbleState): ChatMessageBubbleBodyStyle => (
        StyleAdapterUtils.container(resolve(state.direction).chatMessageBubbleOverrides.body ?? {})
      )),
      bodyText: createStyleResolver((state: ChatAttachmentMessageBubbleState): ChatMessageBubbleBodyTextStyle => (
        StyleAdapterUtils.text(resolve(state.direction).chatMessageBubbleOverrides.bodyText = {})
      )),
      metaDataContainer: createStyleResolver((
        state: ChatAttachmentMessageBubbleState
      ): ChatMessageBubbleMetaDataContainerStyle => (
        StyleAdapterUtils.container(resolve(state.direction).chatMessageBubbleOverrides.metaDataContainer = {})
      )),
      metaDataStatusContainer: createStyleResolver((
        state: ChatAttachmentMessageBubbleState
      ): ChatMessageBubbleMetaDataStatusContainerStyle => (
        StyleAdapterUtils.container(resolve(state.direction).chatMessageBubbleOverrides.metaDataStatusContainer = {})
      )),
      metaDataText: createStyleResolver((
        state: ChatAttachmentMessageBubbleState
      ): ChatMessageBubbleMetaDataTextStyle => (
        StyleAdapterUtils.text(resolve(state.direction).chatMessageBubbleOverrides.metaDataText = {})
      )),
      metaDataIcon: createStyleResolver((
        state: ChatAttachmentMessageBubbleState
      ): ChatMessageBubbleMetaDataIconStyle => (
        StyleAdapterUtils.icon(resolve(state.direction).chatMessageBubbleOverrides.metaDataIcon = {})
      )),
    },
    contentContainer: createStyleResolver((state: ChatAttachmentMessageBubbleState) => {
      const contentContainer = resolve(state.direction).contentContainer

      const resolvePressable = (pressableState: PressableState) => componentTokens.pressable({
        themeTokens,
        semanticResolvers: semanticTokens,
        overrides: {
          size: contentContainer.config.size,
          color: contentContainer.config.color,
          coloringStyle: contentContainer.config.coloringStyle,
          coloringColorVariant: contentContainer.config.coloringColorVariant,
          hasAdditionalHorizontalPadding: contentContainer.config.hasAdditionalHorizontalPadding,
        },
        state: toPressableInteractionState(pressableState),
      })

      return {
        container: createStyleResolver((pressableState: PressableState): PressableContainerStyle => ({
          ...StyleAdapterUtils.container(resolvePressable(pressableState).container),
          ...StyleAdapterUtils.container(contentContainer.container = {}),
        })),
        stateLayer: createStyleResolver((pressableState: PressableState): PressableStateLayerStyle => ({
          ...StyleAdapterUtils.container(resolvePressable(pressableState).stateLayer),
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          ...StyleAdapterUtils.container(contentContainer.stateLayer = {}),
        })),
        text: createStyleResolver((pressableState: PressableState): PressableTextStyle => ({
          ...StyleAdapterUtils.text(resolvePressable(pressableState).text),
          ...StyleAdapterUtils.text(contentContainer.text = {}),
        })),
        icon: createStyleResolver((pressableState: PressableState): PressableIconStyle => (
          StyleAdapterUtils.icon(resolvePressable(pressableState).icon)
        )),
      }
    }),
    fileIconContainer: createStyleResolver((
      state: ChatAttachmentMessageBubbleState
    ): ChatAttachmentMessageBubbleFileIconContainerStyle => (
      StyleAdapterUtils.container(resolve(state.direction).fileIconContainer)
    )),
    fileIcon: createStyleResolver((
      state: ChatAttachmentMessageBubbleState
    ): ChatAttachmentMessageBubbleFileIconStyle => (
      StyleAdapterUtils.icon(resolve(state.direction).fileIcon)
    )),
    downloadIconContainer: createStyleResolver((
      state: ChatAttachmentMessageBubbleState
    ): ChatAttachmentMessageBubbleDownloadIconContainerStyle => (
      StyleAdapterUtils.container(resolve(state.direction).downloadIconContainer)
    )),
    downloadIcon: createStyleResolver((
      state: ChatAttachmentMessageBubbleState
    ): ChatAttachmentMessageBubbleDownloadIconStyle => (
      StyleAdapterUtils.icon(resolve(state.direction).downloadIcon)
    )),
    fileNameText: createStyleResolver((
      state: ChatAttachmentMessageBubbleState
    ): ChatAttachmentMessageBubbleFileNameTextStyle => (
      StyleAdapterUtils.text(resolve(state.direction).fileNameText)
    )),
    fileMetadataText: createStyleResolver((
      state: ChatAttachmentMessageBubbleState
    ): ChatAttachmentMessageBubbleFileMetadataTextStyle => (
      StyleAdapterUtils.text(resolve(state.direction).fileMetadataText)
    )),
  }
}
