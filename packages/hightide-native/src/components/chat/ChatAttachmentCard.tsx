import {
  useMemo,
  type ReactNode
} from 'react'
import {
  Text,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle
} from 'react-native'
import {
  Download,
  FileText
} from 'lucide-react-native'

import { IconButton } from '@/src/components/user-interaction/IconButton'
import { useTheme } from '@/src/global-contexts/theme/ThemeContext'
import type {
  ChatAttachmentCardMetadataStyle,
  ChatAttachmentCardNameStyle,
  ChatAttachmentCardState,
  ChatAttachmentCardStyle,
  ChatMessageDirection
} from '@/src/theme/types/components/chat'
import type { StyleOverwrite } from '@/src/theme/types/resolver'

export type ChatAttachmentCardProps = Omit<ViewProps, 'style'> & {
  name: ReactNode,
  metadata?: ReactNode,
  icon?: ReactNode,
  direction?: ChatMessageDirection,
  downloadLabel?: string,
  onDownload?: () => void,
  style?: StyleProp<ViewStyle>,
  cardStyle?: StyleOverwrite<ChatAttachmentCardState, ChatAttachmentCardStyle>,
  nameStyle?: StyleOverwrite<Record<string, never>, ChatAttachmentCardNameStyle>,
  metadataStyle?: StyleOverwrite<Record<string, never>, ChatAttachmentCardMetadataStyle>,
}

export const ChatAttachmentCard = ({
  name,
  metadata,
  icon,
  direction = 'incoming',
  downloadLabel = 'Download',
  onDownload,
  style,
  cardStyle,
  nameStyle,
  metadataStyle,
  ...props
}: ChatAttachmentCardProps) => {
  const { theme } = useTheme()
  const state = useMemo(() => ({ direction }), [direction])
  const staticState = useMemo(() => ({}), [])

  const resolvedCardStyle = useMemo(
    () => theme.components.chat.attachmentCard.container(state, cardStyle),
    [theme, state, cardStyle]
  )
  const resolvedIconStyle = useMemo(
    () => theme.components.chat.attachmentCard.icon(staticState),
    [theme, staticState]
  )
  const resolvedIconColor = useMemo(
    () => theme.components.chat.attachmentCard.iconColor(staticState),
    [theme, staticState]
  )
  const resolvedNameStyle = useMemo(
    () => theme.components.chat.attachmentCard.name(staticState, nameStyle),
    [theme, staticState, nameStyle]
  )
  const resolvedMetadataStyle = useMemo(
    () => theme.components.chat.attachmentCard.metadata(staticState, metadataStyle),
    [theme, staticState, metadataStyle]
  )

  return (
    <View {...props} style={[resolvedCardStyle, style]}>
      <View style={resolvedIconStyle}>
        {icon ?? <FileText size={22} color={resolvedIconColor.color} />}
      </View>
      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        {typeof name === 'string' || typeof name === 'number' ? (
          <Text style={resolvedNameStyle} numberOfLines={1}>{name}</Text>
        ) : (
          name
        )}
        {metadata != null && (
          typeof metadata === 'string' || typeof metadata === 'number' ? (
            <Text style={resolvedMetadataStyle}>{metadata}</Text>
          ) : (
            metadata
          )
        )}
      </View>
      {onDownload && (
        <IconButton
          accessibilityLabel={downloadLabel}
          size="sm"
          color="primary"
          coloringStyle="text"
          onPress={onDownload}
          icon={Download}
        />
      )}
    </View>
  )
}
