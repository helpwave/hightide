import type { ReactNode } from 'react'
import { Text, View, type StyleProp, type TextStyle, type ViewProps, type ViewStyle } from 'react-native'
import { Download, FileText } from 'lucide-react-native'
import { useTheme } from '../../global-contexts/theme'
import type {
  ChatAttachmentCardStyle,
  ChatMessageDirection
} from '../../theme'
import { IconButton } from '../user-interaction'

export type ChatAttachmentCardProps = Omit<ViewProps, 'style'> & {
  name: ReactNode,
  metadata?: ReactNode,
  icon?: ReactNode,
  direction?: ChatMessageDirection,
  downloadLabel?: string,
  onDownload?: () => void,
  style?: StyleProp<ViewStyle>,
  cardStyle?: StyleProp<ViewStyle> | ((style: ChatAttachmentCardStyle) => StyleProp<ViewStyle>),
  nameStyle?: StyleProp<TextStyle>,
  metadataStyle?: StyleProp<TextStyle>,
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
  const state = { direction }
  const resolvedCard = theme.components.chat.attachmentCard(state)
  const resolvedIcon = theme.components.chat.attachmentCardIcon({})
  const resolvedIconColor = theme.components.chat.attachmentCardIconColor({})
  const resolvedName = theme.components.chat.attachmentCardName({})
  const resolvedMetadata = theme.components.chat.attachmentCardMetadata({})

  const appliedCard = typeof cardStyle === 'function'
    ? cardStyle(resolvedCard)
    : [resolvedCard, cardStyle]

  return (
    <View {...props} style={[appliedCard, style]}>
      <View style={resolvedIcon}>
        {icon ?? <FileText size={22} color={resolvedIconColor.color} />}
      </View>
      <View style={{ flex: 1, minWidth: 0, gap: 2 }}>
        {typeof name === 'string' || typeof name === 'number' ? (
          <Text style={[resolvedName, nameStyle]} numberOfLines={1}>{name}</Text>
        ) : (
          name
        )}
        {metadata != null && (
          typeof metadata === 'string' || typeof metadata === 'number' ? (
            <Text style={[resolvedMetadata, metadataStyle]}>{metadata}</Text>
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
