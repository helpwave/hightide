import type { ReactNode } from 'react'
import { Modal, Pressable, ScrollView, View } from 'react-native'

import { useTranslation } from '@helpwave/hightide-utils/context'

import { useTheme } from '../../../global-contexts/theme/ThemeContext'
import { useMemoizedTheme } from '../../../hooks/useMemoizedTheme'
import { ThemedText } from '../../visualization-and-display/ThemedText'
import { SearchBar } from '../SearchBar'
import { useMultiSelectContext } from './MultiSelectContext'

export type MultiSelectMenuProps = {
  children?: ReactNode,
}

export const MultiSelectMenu = ({ children }: MultiSelectMenuProps) => {
  const { theme } = useTheme()
  const translation = useTranslation()
  const context = useMultiSelectContext()
  const multiSelectTheme = theme.components.multiSelect
  const isSearchVisible = context.search.hasSearch
  const visibleCount = context.visibleOptionIds.length
  const showEmptySearchResults = isSearchVisible
    && context.search.searchQuery.trim().length > 0
    && visibleCount === 0

  const resolvedOverlayStyle = useMemoizedTheme(multiSelectTheme.overlay, {})
  const resolvedMenuStyle = useMemoizedTheme(multiSelectTheme.menu, { hasSearch: isSearchVisible })
  const resolvedHeaderStyle = useMemoizedTheme(multiSelectTheme.header, {})
  const resolvedEmptyTextStyle = useMemoizedTheme(multiSelectTheme.emptyText, {})

  return (
    <>
      {!context.isOpen && (
        <View
          collapsable={false}
          pointerEvents="none"
          style={{ width: 0, height: 0, overflow: 'hidden' }}
        >
          {children}
        </View>
      )}
      <Modal
        visible={context.isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => context.setIsOpen(false)}
      >
        <Pressable
          style={resolvedOverlayStyle}
          onPress={() => context.setIsOpen(false)}
        >
          <Pressable
            style={resolvedMenuStyle}
            onPress={(event) => event.stopPropagation()}
          >
            {isSearchVisible && (
              <View style={resolvedHeaderStyle}>
                <SearchBar
                  value={context.search.searchQuery}
                  onValueChange={context.search.setSearchQuery}
                  onSearch={context.search.setSearchQuery}
                />
              </View>
            )}
            {showEmptySearchResults && (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ThemedText style={resolvedEmptyTextStyle}>
                  {translation('nothingFound')}
                </ThemedText>
              </View>
            )}
            <ScrollView
              style={showEmptySearchResults ? { height: 0, overflow: 'hidden' } : { flex: 1 }}
            >
              {children}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  )
}
