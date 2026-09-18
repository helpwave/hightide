import type {
  FileInputState as DesignFileInputState,
  FileInputStateValue
} from '@helpwave/hightide-design/component-token-resolvers'
import type {
  FileInputAddButtonContainerStyle,
  FileInputFileNameStyle,
  FileInputFileRowStyle,
  FileInputFilesStyle,
  FileInputIconStyle,
  FileInputMenuBodyStyle,
  FileInputMenuHeaderStyle,
  FileInputMenuStyle,
  FileInputMenuTitleStyle,
  FileInputDropHintStyle,
  FileInputOverlayStyle,
  FileInputPlaceholderStyle,
  FileInputState,
  FileInputStateLayerStyle,
  FileInputThemeResolvers,
  FileInputTriggerStyle
} from '../types/components/fileInput'
import {
  createStyleResolver,
  type ComponentThemeResolver
} from '../types/resolver'

import { StyleAdapterUtils } from '../adapters/style-adapter-utils'

type FileInputResolveState = {
  color?: FileInputState['color'],
  isDisabled?: boolean,
  isInvalid?: boolean,
  isHovered?: boolean,
  isFocused?: boolean,
  isFocusVisible?: boolean,
  isPressed?: boolean,
  isReadonly?: boolean,
  isOpen?: boolean,
  hasValue?: boolean,
}

const toDesignFileInputState = (
  state: FileInputResolveState = {}
): DesignFileInputState => {
  const active = new Set<FileInputStateValue>()

  if (state.isDisabled) {
    active.add('disabled')
  }
  if (state.isFocused) {
    active.add('focused')
  }
  if (state.isFocusVisible) {
    active.add('focusVisible')
  }
  if (state.isHovered) {
    active.add('hovered')
  }
  if (state.isPressed) {
    active.add('pressed')
  }
  if (state.isReadonly) {
    active.add('readonly')
  }
  if (state.isInvalid) {
    active.add('invalid')
  }
  if (state.isOpen) {
    active.add('open')
  }
  if (state.hasValue) {
    active.add('hasValue')
  }

  return active
}

export const toFileInputThemeResolvers: ComponentThemeResolver<FileInputThemeResolvers> = ({
  themeTokens,
  semanticTokens,
  componentTokens,
}) => {
  const resolve = (state: FileInputResolveState = {}) => componentTokens.fileInput({
    themeTokens,
    semanticResolvers: semanticTokens,
    overrides: {
      color: state.color,
    },
    state: toDesignFileInputState(state),
  })

  const toState = (state: FileInputState): FileInputResolveState => ({
    color: state.color,
    isDisabled: state.isDisabled,
    isInvalid: state.isInvalid,
    isHovered: state.isHovered,
    isFocused: state.isFocused,
    isFocusVisible: state.isFocusVisible,
    isPressed: state.isPressed,
    isReadonly: state.isReadonly,
    isOpen: state.isOpen,
    hasValue: state.hasValue,
  })

  return {
    trigger: createStyleResolver((state: FileInputState): FileInputTriggerStyle => ({
      ...StyleAdapterUtils.container(resolve(toState(state)).trigger),
      overflow: 'hidden',
    })),
    stateLayer: createStyleResolver((state: FileInputState): FileInputStateLayerStyle => ({
      ...StyleAdapterUtils.container(resolve(toState(state)).stateLayer),
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    })),
    files: createStyleResolver((state: FileInputState): FileInputFilesStyle => (
      StyleAdapterUtils.container(resolve(toState(state)).files)
    )),
    fileRow: createStyleResolver((state: FileInputState): FileInputFileRowStyle => (
      StyleAdapterUtils.container(resolve(toState(state)).fileRow)
    )),
    fileName: createStyleResolver((state: FileInputState): FileInputFileNameStyle => (
      StyleAdapterUtils.text(resolve(toState(state)).fileName)
    )),
    placeholder: createStyleResolver((state: FileInputState): FileInputPlaceholderStyle => (
      StyleAdapterUtils.text(resolve(toState(state)).placeholder)
    )),
    icon: createStyleResolver((state: FileInputState): FileInputIconStyle => (
      StyleAdapterUtils.icon(resolve(toState(state)).icon)
    )),
    fileIcon: createStyleResolver((state: FileInputState): FileInputIconStyle => (
      StyleAdapterUtils.icon(resolve(toState(state)).fileIcon)
    )),
    overlay: createStyleResolver((state: FileInputState): FileInputOverlayStyle => ({
      ...StyleAdapterUtils.container(resolve(toState(state)).overlay),
      flex: 1,
    })),
    menu: createStyleResolver((state: FileInputState): FileInputMenuStyle => (
      StyleAdapterUtils.container(resolve(toState(state)).menu)
    )),
    menuBody: createStyleResolver((state: FileInputState): FileInputMenuBodyStyle => (
      StyleAdapterUtils.container(resolve(toState(state)).menuBody)
    )),
    menuHeader: createStyleResolver((state: FileInputState): FileInputMenuHeaderStyle => (
      StyleAdapterUtils.container(resolve(toState(state)).menuHeader)
    )),
    menuTitle: createStyleResolver((state: FileInputState): FileInputMenuTitleStyle => (
      StyleAdapterUtils.text(resolve(toState(state)).menuTitle)
    )),
    dropHint: createStyleResolver((state: FileInputState): FileInputDropHintStyle => (
      StyleAdapterUtils.text(resolve(toState(state)).dropHint)
    )),
    addButtonContainer: createStyleResolver((state: FileInputState): FileInputAddButtonContainerStyle => (
      StyleAdapterUtils.container(resolve(toState(state)).addButtonContainer)
    )),
  }
}
