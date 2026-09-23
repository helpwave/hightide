import {
  useMemo,
  type ReactNode
} from 'react'
import {
  Pressable,
  View,
  type StyleProp,
  type ViewStyle
} from 'react-native'
import { useTheme } from '../../global-contexts/theme/ThemeContext'
import { HightideIconRegistry } from '../../icons/HightideIconRegistry'
import {
  useMemoizedTheme
} from '../../hooks/useMemoizedTheme'
import type {
  ChatAttachmentMessageBubbleFileIconStyle,
  ChatAttachmentMessageBubbleFileMetadataTextStyle,
  ChatAttachmentMessageBubbleFileNameTextStyle,
  ChatAttachmentMessageBubbleState,
  PressableContainerStyle,
  PressableState
} from '../../theme/types/components/chat'
import type { ThemedPressableThemeResolvers } from '../../theme/types/components/themedPressable'
import type { StyleOverwrite } from '../../theme/types/resolver'
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

type AttachmentContentPressableResolvers = ThemedPressableThemeResolvers

import { pressableTokenContext } from '../../theme/component-contexts'

const toPressableThemeState = (
  theme: Parameters<typeof pressableTokenContext>[0],
  interaction: PressableInteractionState
) => pressableTokenContext(theme, {
  coloringStyle: 'foreground',
  coloringColorVariant: 'transparent',
  interaction: {
    isPressed: interaction.pressed,
    isHovered: !!interaction.hovered,
    isFocused: !!interaction.focused,
    isFocusVisible: !!interaction.focusVisible,
  },
})

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
  const { theme } = useTheme()
  const pressableThemeState = useMemo(() => toPressableThemeState(theme, pressableState),
    [pressableState, theme])

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
  const state = useMemo(() => ({
    config: { direction },
    state: direction === 'outgoing' ? new Set(['outgoing']) : new Set<string>(),
  }), [direction])
  const attachment = theme.components.chat.attachmentMessageBubble

  const resolvedFileIconContainerStyle = useMemoizedTheme(attachment.fileIconContainer, state)
  const resolvedFileIcon = useMemoizedTheme(attachment.fileIcon, state)
  const resolvedDownloadIconContainerStyle = useMemoizedTheme(attachment.downloadIconContainer, state)
  const resolvedDownloadIcon = useMemoizedTheme(attachment.downloadIcon, state)
  const resolvedFileNameTextStyle = useMemoizedTheme(attachment.fileNameText, state, fileNameTextStyle)
  const resolvedFileMetadataTextStyle = useMemoizedTheme(attachment.fileMetadataText, state, fileMetadataTextStyle)

  return (
    <ChatMessageBubble
      {...props}
      direction={direction}
      timestamp={timestamp}
      status={status}
      style={style}
      bodyStyle={bodyStyle}
      bodyTextStyle={bodyTextStyle}
      metaDataContainerStyle={metaDataContainerStyle}
      metaDataStatusContainerStyle={metaDataStatusContainerStyle}
      metaDataTextStyle={metaDataTextStyle}
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
            contentResolvers={theme.components.themedPressable}
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
