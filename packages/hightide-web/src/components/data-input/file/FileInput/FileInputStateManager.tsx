import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  useControlledState,
  useStableEvent
} from '@helpwave/hightide-utils/hooks'
import type { ControllableInputProps } from '@helpwave/hightide-utils/interfaces'
import { SafeGlobals } from '../../../../utils/safeGlobals'
import { FileInputContext, type FileInputContextType, type FileInputPickFiles } from './FileInputContext'
import {
  isFileDataTransfer,
  mergeFileInputItems,
  resolveFileInputMaxFiles,
  type FileInputItem
} from './fileInputItem'

export type FileInputEvent = { type: 'commit', value: readonly FileInputItem[] }

export interface FileInputStateManagerProps extends Omit<ControllableInputProps<readonly FileInputItem[], FileInputEvent>, 'value'> {
  value?: readonly FileInputItem[],
  initialIsOpen?: boolean,
  onClose?: () => void,
  onIsOpenChange?: (isOpen: boolean) => void,
  accept?: string[],
  maxFiles?: number,
  pickFiles?: FileInputPickFiles,
  children: ReactNode,
}

export function FileInputStateManager({
  children,
  value,
  onValueChange,
  onStateEvent,
  initialValue,
  initialIsOpen = false,
  onClose,
  onIsOpenChange,
  accept,
  maxFiles,
  pickFiles,
  isInvalid = false,
  isDisabled = false,
  isReadOnly = false,
  isRequired = false,
}: FileInputStateManagerProps) {
  const [files, setFiles] = useControlledState<readonly FileInputItem[]>({
    value,
    onValueChange,
    defaultValue: initialValue ?? [],
  })
  const [isOpen, setIsOpenState] = useControlledState<boolean>({
    defaultValue: resolveFileInputMaxFiles(maxFiles) === 1 ? false : initialIsOpen,
  })
  const [isDragging, setIsDragging] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [nativePickerRequest, setNativePickerRequest] = useState(0)

  const onStateEventStable = useStableEvent(onStateEvent)
  const onCloseStable = useStableEvent(onClose)
  const onIsOpenChangeStable = useStableEvent(onIsOpenChange)
  const pickFilesStable = useStableEvent(pickFiles)

  const commitFiles = useCallback((next: readonly FileInputItem[]) => {
    setFiles(next)
    onStateEventStable?.({ type: 'commit', value: next })
  }, [onStateEventStable, setFiles])

  const setIsOpen = useCallback((open: boolean) => {
    setIsOpenState(open)
    onIsOpenChangeStable(open)
    if (!open) {
      setIsDragging(false)
      setIsDragOver(false)
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

  useEffect(() => {
    if (!isOpen || isDisabled || isReadOnly || !canAddFiles) {
      setIsDragging(false)
      setIsDragOver(false)
      return
    }

    const win = SafeGlobals.window('FileInputStateManager')
    if (win == null) {
      return
    }

    let dragDepth = 0

    const onDragEnter = (event: DragEvent) => {
      if (!isFileDataTransfer(event.dataTransfer)) {
        return
      }
      dragDepth += 1
      setIsDragging(true)
    }

    const onDragOver = (event: DragEvent) => {
      if (!isFileDataTransfer(event.dataTransfer)) {
        return
      }
      event.preventDefault()
    }

    const onDragLeave = (event: DragEvent) => {
      if (!isFileDataTransfer(event.dataTransfer)) {
        return
      }
      dragDepth = Math.max(0, dragDepth - 1)
      if (dragDepth === 0) {
        setIsDragging(false)
        setIsDragOver(false)
      }
    }

    const onDrop = () => {
      dragDepth = 0
      setIsDragging(false)
      setIsDragOver(false)
    }

    win.addEventListener('dragenter', onDragEnter)
    win.addEventListener('dragover', onDragOver)
    win.addEventListener('dragleave', onDragLeave)
    win.addEventListener('drop', onDrop)

    return () => {
      win.removeEventListener('dragenter', onDragEnter)
      win.removeEventListener('dragover', onDragOver)
      win.removeEventListener('dragleave', onDragLeave)
      win.removeEventListener('drop', onDrop)
    }
  }, [canAddFiles, isDisabled, isOpen, isReadOnly])

  const requestNativePicker = useCallback(() => {
    setNativePickerRequest((current) => current + 1)
  }, [])

  const requestAddFiles = useCallback(() => {
    if (isDisabled || isReadOnly) {
      return
    }
    if (!isSingleFile && !canAddFiles) {
      return
    }
    const customPicker = pickFilesStable()
    if (customPicker) {
      void customPicker.then((picked) => {
        if (picked == null) {
          return
        }
        addFiles(picked)
      })
      return
    }
    requestNativePicker()
  }, [addFiles, canAddFiles, isDisabled, isSingleFile, pickFilesStable, isReadOnly, requestNativePicker])

  const toggleIsOpen = useCallback(() => {
    if (isSingleFile) {
      requestAddFiles()
      return
    }
    setIsOpen(!isOpen)
  }, [isOpen, isSingleFile, requestAddFiles, setIsOpen])

  const contextValue = useMemo((): FileInputContextType => ({
    isInvalid,
    isDisabled,
    isReadOnly,
    isRequired,
    files: files ?? [],
    isOpen: isSingleFile ? false : isOpen,
    isDragging,
    isDragOver,
    accept,
    maxFiles,
    canAddFiles,
    nativePickerRequest,
    setIsOpen,
    toggleIsOpen,
    setIsDragging,
    setIsDragOver,
    addFiles,
    removeFile,
    requestAddFiles,
  }), [
    accept,
    addFiles,
    canAddFiles,
    isDisabled,
    files,
    isInvalid,
    isDragging,
    isDragOver,
    isOpen,
    isSingleFile,
    maxFiles,
    nativePickerRequest,
    isReadOnly,
    removeFile,
    requestAddFiles,
    isRequired,
    setIsOpen,
    toggleIsOpen,
  ])

  return (
    <FileInputContext.Provider value={contextValue}>
      {children}
    </FileInputContext.Provider>
  )
}
