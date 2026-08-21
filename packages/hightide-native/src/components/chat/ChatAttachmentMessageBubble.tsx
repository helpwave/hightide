import {
  useMemo,
  type ReactNode
} from 'react'
import {
  View,
  type StyleProp,
  type ViewStyle
} from 'react-native'
import { HightideIconRegistry } from '../../icons/HightideIconRegistry'
import { ThemedIcon } from '../visualization-and-display/ThemedIcon'
import { ThemedText } from '../visualization-and-display/ThemedText'
import { ThemedPressable } from '../user-interaction/ThemedPressable'
import { useTheme } from '../../global-contexts/theme/ThemeContext'
import type {
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
  PressableState
} from '../../theme/types/components/chat'
import type { StyleOverwrite } from '../../theme/types/resolver'
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

const mergeBubbleStyleOverwrite = <TStyle extends StyleProp<ViewStyle> | object>(
  tokenOverride: TStyle,
  userOverwrite?: StyleOverwrite<ChatMessageBubbleState, TStyle>
): StyleOverwrite<ChatMessageBubbleState, TStyle> => (
    (prev, state) => {
      const withTokenOverride = {
        ...(prev as object),
        ...(tokenOverride as object),
      } as TStyle

      if (userOverwrite === undefined) {
        return withTokenOverride
      }

      if (typeof userOverwrite === 'function') {
        return userOverwrite(withTokenOverride, state)
      }

      return {
        ...(withTokenOverride as object),
        ...(userOverwrite as object),
      } as TStyle
    }
  )

export const ChatAttachmentMessageBubble = ({
  children,
  name,
  metadata,
  icon,
  direction,
  downloadLabel = 'Download',
  onDownload,
  timestamp,
  readReceipt,
  style,
  containerStyle,
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
  const contentResolvers = useMemo(
    () => attachment.contentContainer(state),
    [attachment, state]
  )

  const resolvedFileIconContainerStyle = useMemo(
    () => attachment.fileIconContainer(state),
    [attachment, state]
  )
  const resolvedFileIcon = useMemo(
    () => attachment.fileIcon(state),
    [attachment, state]
  )
  const resolvedDownloadIconContainerStyle = useMemo(
    () => attachment.downloadIconContainer(state),
    [attachment, state]
  )
  const resolvedDownloadIcon = useMemo(
    () => attachment.downloadIcon(state),
    [attachment, state]
  )
  const resolvedFileNameTextStyle = useMemo(
    () => attachment.fileNameText(state, fileNameTextStyle),
    [attachment, state, fileNameTextStyle]
  )
  const resolvedFileMetadataTextStyle = useMemo(
    () => attachment.fileMetadataText(state, fileMetadataTextStyle),
    [attachment, state, fileMetadataTextStyle]
  )

  const resolvedContainerStyle = useMemo(
    () => mergeBubbleStyleOverwrite<ChatMessageBubbleContainerStyle>(
      bubbleOverrides.container(state),
      containerStyle
    ),
    [bubbleOverrides, state, containerStyle]
  )
  const resolvedBodyStyle = useMemo(
    () => mergeBubbleStyleOverwrite<ChatMessageBubbleBodyStyle>(
      bubbleOverrides.body(state),
      bodyStyle
    ),
    [bubbleOverrides, state, bodyStyle]
  )
  const resolvedBodyTextStyle = useMemo(
    () => mergeBubbleStyleOverwrite<ChatMessageBubbleBodyTextStyle>(
      bubbleOverrides.bodyText(state),
      bodyTextStyle
    ),
    [bubbleOverrides, state, bodyTextStyle]
  )
  const resolvedMetaDataContainerStyle = useMemo(
    () => mergeBubbleStyleOverwrite<ChatMessageBubbleMetaDataContainerStyle>(
      bubbleOverrides.metaDataContainer(state),
      metaDataContainerStyle
    ),
    [bubbleOverrides, state, metaDataContainerStyle]
  )
  const resolvedMetaDataStatusContainerStyle = useMemo(
    () => mergeBubbleStyleOverwrite<ChatMessageBubbleMetaDataStatusContainerStyle>(
      bubbleOverrides.metaDataStatusContainer(state),
      metaDataStatusContainerStyle
    ),
    [bubbleOverrides, state, metaDataStatusContainerStyle]
  )
  const resolvedMetaDataTextStyle = useMemo(
    () => mergeBubbleStyleOverwrite<ChatMessageBubbleMetaDataTextStyle>(
      bubbleOverrides.metaDataText(state),
      metaDataTextStyle
    ),
    [bubbleOverrides, state, metaDataTextStyle]
  )

  return (
    <ChatMessageBubble
      {...props}
      direction={direction}
      timestamp={timestamp}
      readReceipt={readReceipt}
      style={style}
      containerStyle={resolvedContainerStyle}
      bodyStyle={resolvedBodyStyle}
      bodyTextStyle={resolvedBodyTextStyle}
      metaDataContainerStyle={resolvedMetaDataContainerStyle}
      metaDataStatusContainerStyle={resolvedMetaDataStatusContainerStyle}
      metaDataTextStyle={resolvedMetaDataTextStyle}
    >
      {children}
      <ThemedPressable
        accessibilityLabel={downloadLabel}
        disabled={onDownload == null}
        onPress={onDownload}
        style={(_, pressableState) => (
          contentResolvers.container(pressableState, contentContainerStyle)
        )}
        stateLayerStyle={(_, pressableState) => (
          contentResolvers.stateLayer(pressableState)
        )}
        textStyle={(_, pressableState) => (
          contentResolvers.text(pressableState)
        )}
        iconStyle={(_, pressableState) => (
          contentResolvers.icon(pressableState)
        )}
      >
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
        <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
          {typeof name === 'string' || typeof name === 'number' ? (
            <ThemedText style={resolvedFileNameTextStyle} numberOfLines={1}>{name}</ThemedText>
          ) : (
            name
          )}
          {metadata != null && (
            typeof metadata === 'string' || typeof metadata === 'number' ? (
              <ThemedText appearance="description" style={resolvedFileMetadataTextStyle}>
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
      </ThemedPressable>
    </ChatMessageBubble>
  )
}
