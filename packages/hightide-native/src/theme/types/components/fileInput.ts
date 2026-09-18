import type {
  TextStyle,
  ViewStyle
} from 'react-native'

import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'

import type {
  InteractionState,
  StyleResolverFunction
} from '../resolver'
import type { IconStyle } from '../../../icons/types'

export type FileInputState = InteractionState & {
  color?: ColorPairToken,
  isOpen?: boolean,
  hasValue?: boolean,
}

export type FileInputTriggerStyle = ViewStyle

export type FileInputStateLayerStyle = ViewStyle

export type FileInputFilesStyle = ViewStyle

export type FileInputFileRowStyle = ViewStyle

export type FileInputFileNameStyle = TextStyle

export type FileInputPlaceholderStyle = TextStyle

export type FileInputIconStyle = IconStyle

export type FileInputOverlayStyle = ViewStyle

export type FileInputMenuStyle = ViewStyle

export type FileInputMenuBodyStyle = ViewStyle

export type FileInputMenuHeaderStyle = ViewStyle

export type FileInputMenuTitleStyle = TextStyle

export type FileInputDropHintStyle = TextStyle

export type FileInputAddButtonContainerStyle = ViewStyle

export type FileInputThemeResolvers = {
  trigger: StyleResolverFunction<FileInputState, FileInputTriggerStyle>,
  stateLayer: StyleResolverFunction<FileInputState, FileInputStateLayerStyle>,
  files: StyleResolverFunction<FileInputState, FileInputFilesStyle>,
  fileRow: StyleResolverFunction<FileInputState, FileInputFileRowStyle>,
  fileName: StyleResolverFunction<FileInputState, FileInputFileNameStyle>,
  placeholder: StyleResolverFunction<FileInputState, FileInputPlaceholderStyle>,
  icon: StyleResolverFunction<FileInputState, FileInputIconStyle>,
  fileIcon: StyleResolverFunction<FileInputState, FileInputIconStyle>,
  overlay: StyleResolverFunction<FileInputState, FileInputOverlayStyle>,
  menu: StyleResolverFunction<FileInputState, FileInputMenuStyle>,
  menuBody: StyleResolverFunction<FileInputState, FileInputMenuBodyStyle>,
  menuHeader: StyleResolverFunction<FileInputState, FileInputMenuHeaderStyle>,
  menuTitle: StyleResolverFunction<FileInputState, FileInputMenuTitleStyle>,
  dropHint: StyleResolverFunction<FileInputState, FileInputDropHintStyle>,
  addButtonContainer: StyleResolverFunction<FileInputState, FileInputAddButtonContainerStyle>,
}
