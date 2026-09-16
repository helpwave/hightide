import { ScrollView, View } from 'react-native'
import { useTranslation } from '@helpwave/hightide-utils/context'
import { useTheme } from '../../../global-contexts/theme/ThemeContext'
import { useMemoizedTheme } from '../../../hooks/useMemoizedTheme'
import { HightideIconRegistry } from '../../../icons/HightideIconRegistry'
import { Modal } from '../../layout/Modal/Modal'
import { ListItem } from '../../list/ListItem'
import { ThemedIcon } from '../../visualization-and-display/ThemedIcon'
import { ThemedText } from '../../visualization-and-display/ThemedText'
import { Button } from '../Button'
import { IconButton } from '../IconButton'
import { useFileInputContext } from './FileInputContext'

export const FileInputMenu = () => {
  const { theme } = useTheme()
  const translation = useTranslation()
  const context = useFileInputContext()
  const fileInputTheme = theme.components.fileInput
  const canEdit = !context.disabled && !context.readOnly
  const resolvedState = {
    color: context.config.color,
    isDisabled: !!context.disabled,
    isReadonly: !!context.readOnly,
    isInvalid: !!context.invalid,
    isOpen: context.isOpen,
    hasValue: context.files.length > 0,
  }

  const resolvedOverlayStyle = useMemoizedTheme(fileInputTheme.overlay, resolvedState)
  const resolvedMenuStyle = useMemoizedTheme(fileInputTheme.menu, resolvedState)
  const resolvedMenuBodyStyle = useMemoizedTheme(fileInputTheme.menuBody, resolvedState)
  const resolvedMenuHeaderStyle = useMemoizedTheme(fileInputTheme.menuHeader, resolvedState)
  const resolvedMenuTitleStyle = useMemoizedTheme(fileInputTheme.menuTitle, resolvedState)

  return (
    <Modal
      isOpen={context.isOpen}
      onIsOpenChange={context.setIsOpen}
      backgroundProps={{ style: resolvedOverlayStyle }}
      menuProps={{ style: resolvedMenuStyle }}
    >
      <View style={[resolvedMenuBodyStyle, { minHeight: 0, flex: 1, flexDirection: 'column' }]}>
        <View style={resolvedMenuHeaderStyle}>
          <ThemedText
            accessibilityRole="header"
            style={resolvedMenuTitleStyle}
          >
            {translation('selectFiles')}
          </ThemedText>
        </View>
        <ScrollView
          style={{ flexGrow: 0, flexShrink: 0, maxHeight: theme.semantics.touchTargetSize({}) * 4.2 }}
        >
          {context.files.map((file) => (
            <ListItem
              key={file.id}
              title={file.name}
              leading={(
                <ThemedIcon icon={HightideIconRegistry.FileText} />
              )}
              trailing={canEdit ? (
                <IconButton
                  icon={HightideIconRegistry.X}
                  size="sm"
                  color={theme.colors.negative}
                  variant="foreground"
                  accessibilityLabel={translation('remove')}
                  onPress={() => context.removeFile(file.id)}
                />
              ) : undefined}
            />
          ))}
        </ScrollView>
        {canEdit && (
          <Button
            variant="foreground"
            leadingIcon={HightideIconRegistry.Plus}
            disabled={!context.canAddFiles}
            onPress={() => context.requestAddFiles()}
            style={{ justifyContent: 'flex-start' }}
          >
            {translation('addFile')}
          </Button>
        )}
        <View
          style={{
            flexGrow: 1,
            flexShrink: 1,
          }}
        />
        <Button
          variant="tonal"
          onPress={() => context.setIsOpen(!context.isOpen)}
          leadingIcon={HightideIconRegistry.Check}
          style={{ alignSelf: 'flex-end' }}
        >
          {translation('done')}
        </Button>
      </View>
    </Modal>
  )
}
