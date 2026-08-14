import type {
  ChatMessageDirection,
  ContainerTokens,
  IconTokens,
  TextStyleTokens
} from '@helpwave/hightide-design/component-token-resolvers'

import { toContainerStyle, toTextStyle } from '../../adapters/style-adapters'
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

const toOptionalContainerStyle = (tokens?: ContainerTokens): ChatMessageBubbleContainerStyle => (
  tokens === undefined ? {} : toContainerStyle(tokens)
)

const toOptionalTextStyle = (tokens?: TextStyleTokens): ChatMessageBubbleBodyTextStyle => (
  tokens === undefined ? {} : toTextStyle(tokens)
)

const toOptionalIconStyle = (tokens?: IconTokens): ChatMessageBubbleMetaDataIconStyle => (
  tokens === undefined
    ? {}
    : {
      size: tokens.size,
      strokeWidth: tokens.strokeWidth,
      color: tokens.color,
    }
)

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
        toOptionalContainerStyle(resolve(state.direction).chatMessageBubbleOverrides.container)
      )),
      body: createStyleResolver((state: ChatAttachmentMessageBubbleState): ChatMessageBubbleBodyStyle => (
        toOptionalContainerStyle(resolve(state.direction).chatMessageBubbleOverrides.body)
      )),
      bodyText: createStyleResolver((state: ChatAttachmentMessageBubbleState): ChatMessageBubbleBodyTextStyle => (
        toOptionalTextStyle(resolve(state.direction).chatMessageBubbleOverrides.bodyText)
      )),
      metaDataContainer: createStyleResolver((
        state: ChatAttachmentMessageBubbleState
      ): ChatMessageBubbleMetaDataContainerStyle => (
        toOptionalContainerStyle(resolve(state.direction).chatMessageBubbleOverrides.metaDataContainer)
      )),
      metaDataStatusContainer: createStyleResolver((
        state: ChatAttachmentMessageBubbleState
      ): ChatMessageBubbleMetaDataStatusContainerStyle => (
        toOptionalContainerStyle(resolve(state.direction).chatMessageBubbleOverrides.metaDataStatusContainer)
      )),
      metaDataText: createStyleResolver((
        state: ChatAttachmentMessageBubbleState
      ): ChatMessageBubbleMetaDataTextStyle => (
        toOptionalTextStyle(resolve(state.direction).chatMessageBubbleOverrides.metaDataText)
      )),
      metaDataIcon: createValueResolver((
        state: ChatAttachmentMessageBubbleState
      ): ChatMessageBubbleMetaDataIconStyle => (
        toOptionalIconStyle(resolve(state.direction).chatMessageBubbleOverrides.metaDataIcon)
      )),
    },
    contentContainer: createValueResolver((state: ChatAttachmentMessageBubbleState) => {
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
          ...toContainerStyle(resolvePressable(pressableState).container),
          ...toOptionalContainerStyle(contentContainer.container),
        })),
        stateLayer: createStyleResolver((pressableState: PressableState): PressableStateLayerStyle => ({
          ...toContainerStyle(resolvePressable(pressableState).stateLayer),
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          ...toOptionalContainerStyle(contentContainer.stateLayer),
        })),
        text: createStyleResolver((pressableState: PressableState): PressableTextStyle => ({
          ...toTextStyle(resolvePressable(pressableState).text),
          ...toOptionalTextStyle(contentContainer.text),
        })),
      }
    }),
    fileIconContainer: createStyleResolver((
      state: ChatAttachmentMessageBubbleState
    ): ChatAttachmentMessageBubbleFileIconContainerStyle => (
      toContainerStyle(resolve(state.direction).fileIconContainer)
    )),
    fileIcon: createValueResolver((
      state: ChatAttachmentMessageBubbleState
    ): ChatAttachmentMessageBubbleFileIconStyle => {
      const { fileIcon } = resolve(state.direction)

      return {
        size: fileIcon.size,
        strokeWidth: fileIcon.strokeWidth,
        color: fileIcon.color,
      }
    }),
    downloadIconContainer: createStyleResolver((
      state: ChatAttachmentMessageBubbleState
    ): ChatAttachmentMessageBubbleDownloadIconContainerStyle => (
      toContainerStyle(resolve(state.direction).downloadIconContainer)
    )),
    downloadIcon: createValueResolver((
      state: ChatAttachmentMessageBubbleState
    ): ChatAttachmentMessageBubbleDownloadIconStyle => {
      const { downloadIcon } = resolve(state.direction)

      return {
        size: downloadIcon.size,
        strokeWidth: downloadIcon.strokeWidth,
        color: downloadIcon.color,
      }
    }),
    fileNameText: createStyleResolver((
      state: ChatAttachmentMessageBubbleState
    ): ChatAttachmentMessageBubbleFileNameTextStyle => (
      toTextStyle(resolve(state.direction).fileNameText)
    )),
    fileMetadataText: createStyleResolver((
      state: ChatAttachmentMessageBubbleState
    ): ChatAttachmentMessageBubbleFileMetadataTextStyle => (
      toTextStyle(resolve(state.direction).fileMetadataText)
    )),
  }
}
