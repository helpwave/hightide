import {
  useMemo,
  type ReactNode
} from 'react'
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle
} from 'react-native'
import { useTheme } from '../../global-contexts/theme/ThemeContext'
import { HightideIconRegistry } from '../../icons/HightideIconRegistry'
import {
  useMemoizedTheme,
  useMemoizedThemeFactory
} from '../../hooks/useMemoizedTheme'
import type {
  ChatAttachmentMessageBubbleFileIconStyle,
  ChatAttachmentMessageBubbleFileMetadataTextStyle,
  ChatAttachmentMessageBubbleFileNameTextStyle,
  ChatAttachmentMessageBubbleState,
  ChatMessageBubbleBodyStyle,
  ChatMessageBubbleBodyTextStyle,
  ChatMessageBubbleContainerStyle,
  ChatMessageBubbleMetaDataContainerStyle,
  ChatMessageBubbleMetaDataStatusContainerStyle,
  ChatMessageBubbleMetaDataTextStyle,
  ChatMessageBubbleState,
  PressableContainerStyle,
  PressableIconStyle,
  PressableState,
  PressableStateLayerStyle,
  PressableTextStyle
} from '../../theme/types/components/chat'
import type { StyleOverwrite, StyleResolverFunction } from '../../theme/types/resolver'
import type { PressableInteractionState } from '../../utils/pressableInteraction'
import { ThemedIcon } from '../visualization-and-display/ThemedIcon'
import { ThemedText } from '../visualization-and-display/ThemedText'
import {
  ChatMessageBubble,
  type ChatMessageBubbleProps
} from './ChatMessageBubble'

export type ChatAttachmentMessageBubbleProps = Omit<ChatMessageBubbleProps, 'children'> & {
  children?: ReactNode,
  name: ReactNode,
  metadata?: ReactNode,
  icon?: ReactNode,
  downloadLabel?: string,
  onDownload?: () => void,
  style?: ChatMessageBubbleProps['style'],
  contentContainerStyle?: StyleOverwrite<
    PressableState,
    PressableContainerStyle
  >,
  fileNameTextStyle?: StyleOverwrite<
    ChatAttachmentMessageBubbleState,
    ChatAttachmentMessageBubbleFileNameTextStyle
  >,
  fileMetadataTextStyle?: StyleOverwrite<
    ChatAttachmentMessageBubbleState,
    ChatAttachmentMessageBubbleFileMetadataTextStyle
  >,
}

type AttachmentContentPressableResolvers = {
  container: StyleResolverFunction<PressableState, PressableContainerStyle>,
  stateLayer: StyleResolverFunction<PressableState, PressableStateLayerStyle>,
  text: StyleResolverFunction<PressableState, PressableTextStyle>,
  icon: StyleResolverFunction<PressableState, PressableIconStyle>,
}

const toPressableThemeState = (interaction: PressableInteractionState): PressableState => ({
  isPressed: interaction.pressed,
  isHovered: !!interaction.hovered,
  isFocused: !!interaction.focused,
  isFocusVisible: !!interaction.focusVisible,
})

const mergeBubbleStyleOverwrite = <TStyle extends StyleProp<ViewStyle> | object>(
  tokenOverride: TStyle,
  userOverwrite?: StyleOverwrite<ChatMessageBubbleState, TStyle>
): StyleOverwrite<ChatMessageBubbleState, TStyle> => (
    (state, prev) => {
      const withTokenOverride = {
        ...(prev as object),
        ...(tokenOverride as object),
      } as TStyle

      if (userOverwrite === undefined) {
        return withTokenOverride
      }

      if (typeof userOverwrite === 'function') {
        return userOverwrite(state, withTokenOverride)
      }

      return {
        ...(withTokenOverride as object),
        ...(userOverwrite as object),
      } as TStyle
    }
  )

type AttachmentDownloadContentProps = {
  pressableState: PressableInteractionState,
  contentResolvers: AttachmentContentPressableResolvers,
  contentContainerStyle?: StyleOverwrite<PressableState, PressableContainerStyle>,
  name: ReactNode,
  metadata?: ReactNode,
  icon?: ReactNode,
  resolvedFileIconContainerStyle: StyleProp<ViewStyle>,
  resolvedFileIcon: ChatAttachmentMessageBubbleFileIconStyle,
  resolvedDownloadIconContainerStyle: StyleProp<ViewStyle>,
  resolvedDownloadIcon: ChatAttachmentMessageBubbleFileIconStyle,
  resolvedFileNameTextStyle: StyleProp<ViewStyle>,
  resolvedFileMetadataTextStyle: StyleProp<ViewStyle>,
  spacingXs: number,
}

const AttachmentDownloadContent = ({
  pressableState,
  contentResolvers,
  contentContainerStyle,
  name,
  metadata,
  icon,
  resolvedFileIconContainerStyle,
  resolvedFileIcon,
  resolvedDownloadIconContainerStyle,
  resolvedDownloadIcon,
  resolvedFileNameTextStyle,
  resolvedFileMetadataTextStyle,
  spacingXs,
}: AttachmentDownloadContentProps) => {
  const pressableThemeState = useMemo(() => toPressableThemeState(pressableState),
    [pressableState])

  const resolvedContainerStyle = useMemoizedTheme(contentResolvers.container, pressableThemeState, contentContainerStyle)
  const resolvedStateLayerStyle = useMemoizedTheme(contentResolvers.stateLayer, pressableThemeState)
  const resolvedTextStyle = useMemoizedTheme(contentResolvers.text, pressableThemeState)

  return (
    <View style={resolvedContainerStyle}>
      <View pointerEvents="none" style={resolvedStateLayerStyle} />
      <View style={resolvedFileIconContainerStyle}>
        {icon ?? (
          <ThemedIcon
            icon={HightideIconRegistry.FileText}
            size={resolvedFileIcon.size}
            strokeWidth={resolvedFileIcon.strokeWidth}
            color={resolvedFileIcon.color}
          />
        )}
      </View>
      <View style={{ gap: spacingXs }}>
        {typeof name === 'string' || typeof name === 'number' ? (
          <ThemedText style={[resolvedFileNameTextStyle, resolvedTextStyle]} numberOfLines={1}>{name}</ThemedText>
        ) : (
          name
        )}
        {metadata != null && (
          typeof metadata === 'string' || typeof metadata === 'number' ? (
            <ThemedText appearance="description" style={[resolvedFileMetadataTextStyle, resolvedTextStyle]}>
              {metadata}
            </ThemedText>
          ) : (
            metadata
          )
        )}
      </View>
      <View style={resolvedDownloadIconContainerStyle}>
        <ThemedIcon
          icon={HightideIconRegistry.Download}
          size={resolvedDownloadIcon.size}
          strokeWidth={resolvedDownloadIcon.strokeWidth}
          color={resolvedDownloadIcon.color}
        />
      </View>
    </View>
  )
}

export const ChatAttachmentMessageBubble = ({
  children,
  name,
  metadata,
  icon,
  direction,
  downloadLabel = 'Download',
  onDownload,
  timestamp,
  status,
  style,
  bodyStyle,
  bodyTextStyle,
  metaDataContainerStyle,
  metaDataStatusContainerStyle,
  metaDataTextStyle,
  contentContainerStyle,
  fileNameTextStyle,
  fileMetadataTextStyle,
  ...props
}: ChatAttachmentMessageBubbleProps) => {
  const { theme } = useTheme()
  const state = useMemo(() => ({ direction }), [direction])
  const attachment = theme.components.chat.attachmentMessageBubble
  const bubbleOverrides = attachment.chatMessageBubbleOverrides
  const contentResolvers = useMemoizedThemeFactory<
    ChatAttachmentMessageBubbleState,
    AttachmentContentPressableResolvers
  >(attachment.contentContainer, state)

  const resolvedFileIconContainerStyle = useMemoizedTheme(attachment.fileIconContainer, state)
  const resolvedFileIcon = useMemoizedTheme<
    ChatAttachmentMessageBubbleState,
    ChatAttachmentMessageBubbleFileIconStyle
  >(attachment.fileIcon, state)
  const resolvedDownloadIconContainerStyle = useMemoizedTheme(attachment.downloadIconContainer, state)
  const resolvedDownloadIcon = useMemoizedTheme<
    ChatAttachmentMessageBubbleState,
    ChatAttachmentMessageBubbleFileIconStyle
  >(attachment.downloadIcon, state)
  const resolvedFileNameTextStyle = useMemoizedTheme(attachment.fileNameText, state, fileNameTextStyle)
  const resolvedFileMetadataTextStyle = useMemoizedTheme(attachment.fileMetadataText, state, fileMetadataTextStyle)

  const resolvedContainerStyle = useMemo(
    () => mergeBubbleStyleOverwrite<ChatMessageBubbleContainerStyle>(
      StyleSheet.flatten(bubbleOverrides.container(state)) as ChatMessageBubbleContainerStyle,
      style
    ),
    [bubbleOverrides, state, style]
  )
  const resolvedBodyStyle = useMemo(
    () => mergeBubbleStyleOverwrite<ChatMessageBubbleBodyStyle>(
      StyleSheet.flatten(bubbleOverrides.body(state)) as ChatMessageBubbleBodyStyle,
      bodyStyle
    ),
    [bubbleOverrides, state, bodyStyle]
  )
  const resolvedBodyTextStyle = useMemo(
    () => mergeBubbleStyleOverwrite<ChatMessageBubbleBodyTextStyle>(
      StyleSheet.flatten(bubbleOverrides.bodyText(state)) as ChatMessageBubbleBodyTextStyle,
      bodyTextStyle
    ),
    [bubbleOverrides, state, bodyTextStyle]
  )
  const resolvedMetaDataContainerStyle = useMemo(
    () => mergeBubbleStyleOverwrite<ChatMessageBubbleMetaDataContainerStyle>(
      StyleSheet.flatten(bubbleOverrides.metaDataContainer(state)) as ChatMessageBubbleMetaDataContainerStyle,
      metaDataContainerStyle
    ),
    [bubbleOverrides, state, metaDataContainerStyle]
  )
  const resolvedMetaDataStatusContainerStyle = useMemo(
    () => mergeBubbleStyleOverwrite<ChatMessageBubbleMetaDataStatusContainerStyle>(
      StyleSheet.flatten(bubbleOverrides.metaDataStatusContainer(state)) as ChatMessageBubbleMetaDataStatusContainerStyle,
      metaDataStatusContainerStyle
    ),
    [bubbleOverrides, state, metaDataStatusContainerStyle]
  )
  const resolvedMetaDataTextStyle = useMemo(
    () => mergeBubbleStyleOverwrite<ChatMessageBubbleMetaDataTextStyle>(
      StyleSheet.flatten(bubbleOverrides.metaDataText(state)) as ChatMessageBubbleMetaDataTextStyle,
      metaDataTextStyle
    ),
    [bubbleOverrides, state, metaDataTextStyle]
  )

  return (
    <ChatMessageBubble
      {...props}
      direction={direction}
      timestamp={timestamp}
      status={status}
      style={resolvedContainerStyle}
      bodyStyle={resolvedBodyStyle}
      bodyTextStyle={resolvedBodyTextStyle}
      metaDataContainerStyle={resolvedMetaDataContainerStyle}
      metaDataStatusContainerStyle={resolvedMetaDataStatusContainerStyle}
      metaDataTextStyle={resolvedMetaDataTextStyle}
    >
      {children}
      <Pressable
        accessibilityLabel={downloadLabel}
        disabled={onDownload == null}
        onPress={onDownload}
      >
        {(pressableState) => (
          <AttachmentDownloadContent
            pressableState={pressableState as PressableInteractionState}
            contentResolvers={contentResolvers}
            contentContainerStyle={contentContainerStyle}
            name={name}
            metadata={metadata}
            icon={icon}
            resolvedFileIconContainerStyle={resolvedFileIconContainerStyle}
            resolvedFileIcon={resolvedFileIcon}
            resolvedDownloadIconContainerStyle={resolvedDownloadIconContainerStyle}
            resolvedDownloadIcon={resolvedDownloadIcon}
            resolvedFileNameTextStyle={resolvedFileNameTextStyle}
            resolvedFileMetadataTextStyle={resolvedFileMetadataTextStyle}
            spacingXs={theme.spacing.xs}
          />
        )}
      </Pressable>
    </ChatMessageBubble>
  )
}
