import type { ReactNode } from 'react'
import { useCallback, useMemo } from 'react'

import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'
import {
  useControlledState,
  useEventCallbackStabilizer
} from '@helpwave/hightide-utils/hooks'

import type {
  FormFieldDataHandling,
  FormFieldInteractionStates
} from '../../../types/formField'
import {
  FileInputContext,
  type FileInputContextType,
  type FileInputPickFiles
} from './FileInputContext'
import {
  mergeFileInputItems,
  resolveFileInputMaxFiles,
  type FileInputItem
} from './fileInputItem'
import { pickFileInputItems } from './pickFileInputItems'

export type FileInputRootProps = Partial<FormFieldDataHandling<readonly FileInputItem[]>>
  & Partial<FormFieldInteractionStates>
  & {
    value?: readonly FileInputItem[],
    initialValue?: readonly FileInputItem[],
    initialIsOpen?: boolean,
    onClose?: () => void,
    onIsOpenChange?: (isOpen: boolean) => void,
    accept?: string[],
    maxFiles?: number,
    pickFiles?: FileInputPickFiles,
    color?: ColorPairToken,
    children: ReactNode,
  }

export function FileInputRoot({
  children,
  value,
  onValueChange,
  onEditComplete,
  initialValue,
  initialIsOpen = false,
  onClose,
  onIsOpenChange,
  accept,
  maxFiles,
  pickFiles,
  color,
  invalid = false,
  disabled = false,
  readOnly = false,
  required = false,
}: FileInputRootProps) {
  const [files, setFiles] = useControlledState<readonly FileInputItem[]>({
    value,
    onValueChange,
    defaultValue: initialValue ?? [],
  })
  const [isOpen, setIsOpenState] = useControlledState<boolean>({
    defaultValue: resolveFileInputMaxFiles(maxFiles) === 1 ? false : initialIsOpen,
  })

  const onEditCompleteStable = useEventCallbackStabilizer(onEditComplete)
  const onCloseStable = useEventCallbackStabilizer(onClose)
  const onIsOpenChangeStable = useEventCallbackStabilizer(onIsOpenChange)
  const pickFilesStable = useEventCallbackStabilizer(pickFiles)

  const commitFiles = useCallback((next: readonly FileInputItem[]) => {
    setFiles(next)
    onEditCompleteStable(next)
  }, [onEditCompleteStable, setFiles])

  const setIsOpen = useCallback((open: boolean) => {
    setIsOpenState(open)
    onIsOpenChangeStable(open)
    if (!open) {
      onCloseStable()
    }
  }, [onCloseStable, onIsOpenChangeStable, setIsOpenState])

  const addFiles = useCallback((incoming: readonly FileInputItem[]) => {
    if (incoming.length === 0) {
      return
    }
    commitFiles(mergeFileInputItems(files ?? [], incoming, maxFiles))
  }, [commitFiles, files, maxFiles])

  const removeFile = useCallback((id: string) => {
    commitFiles((files ?? []).filter((file) => file.id !== id))
  }, [commitFiles, files])

  const maxFileCount = resolveFileInputMaxFiles(maxFiles)
  const isSingleFile = maxFileCount === 1
  const canAddFiles = (files ?? []).length < maxFileCount
  const remainingFileSlots = Math.max(maxFileCount - (files ?? []).length, 0)

  const requestAddFiles = useCallback(() => {
    if (disabled || readOnly) {
      return
    }
    if (!isSingleFile && !canAddFiles) {
      return
    }

    const allowMultiple = remainingFileSlots > 1

    const applyPicked = (picked: readonly FileInputItem[] | null | undefined) => {
      if (picked == null) {
        return
      }
      addFiles(picked)
    }

    const customPicker = pickFilesStable()
    if (customPicker != null) {
      void Promise.resolve(customPicker).then(applyPicked)
      return
    }

    void pickFileInputItems({
      accept,
      multiple: allowMultiple,
    }).then(applyPicked)
  }, [
    accept,
    addFiles,
    canAddFiles,
    disabled,
    isSingleFile,
    pickFilesStable,
    readOnly,
    remainingFileSlots,
  ])

  const toggleIsOpen = useCallback(() => {
    if (isSingleFile) {
      requestAddFiles()
      return
    }
    setIsOpen(!isOpen)
  }, [isOpen, isSingleFile, requestAddFiles, setIsOpen])

  const contextValue = useMemo((): FileInputContextType => ({
    invalid,
    disabled,
    readOnly,
    required,
    files: files ?? [],
    isOpen: isSingleFile ? false : !!isOpen,
    accept,
    maxFiles,
    canAddFiles,
    config: {
      color,
    },
    setIsOpen,
    toggleIsOpen,
    addFiles,
    removeFile,
    requestAddFiles,
  }), [
    accept,
    addFiles,
    canAddFiles,
    color,
    disabled,
    files,
    invalid,
    isOpen,
    isSingleFile,
    maxFiles,
    readOnly,
    removeFile,
    requestAddFiles,
    required,
    setIsOpen,
    toggleIsOpen,
  ])

  return (
    <FileInputContext.Provider value={contextValue}>
      {children}
    </FileInputContext.Provider>
  )
}
