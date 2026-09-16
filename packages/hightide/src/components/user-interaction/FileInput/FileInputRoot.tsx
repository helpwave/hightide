import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  useControlledState,
  useEventCallbackStabilizer
} from '@helpwave/hightide-utils/hooks'
import type { FormFieldDataHandling } from '../../form/FormField'
import type { FormFieldInteractionStates } from '../../form/FieldLayout'
import { SafeGlobals } from '../../../utils/safeGlobals'
import { FileInputContext, type FileInputContextType, type FileInputPickFiles } from './FileInputContext'
import {
  createFileInputItemsFromFileList,
  isFileDataTransfer,
  mergeFileInputItems,
  resolveFileInputMaxFiles,
  type FileInputItem
} from './fileInputItem'

export interface FileInputRootProps extends Omit<Partial<FormFieldDataHandling<readonly FileInputItem[]>>, 'value'>, Partial<FormFieldInteractionStates> {
  value?: readonly FileInputItem[],
  initialValue?: readonly FileInputItem[],
  initialIsOpen?: boolean,
  onClose?: () => void,
  onIsOpenChange?: (isOpen: boolean) => void,
  accept?: string,
  multiple?: boolean,
  maxFiles?: number,
  pickFiles?: FileInputPickFiles,
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
  multiple = true,
  maxFiles,
  pickFiles,
  invalid = false,
  disabled = false,
  readOnly = false,
  required = false,
}: FileInputRootProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useControlledState<readonly FileInputItem[]>({
    value,
    onValueChange,
    defaultValue: initialValue ?? [],
  })
  const [isOpen, setIsOpenState] = useControlledState<boolean>({
    defaultValue: initialIsOpen,
  })
  const [isDragging, setIsDragging] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

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
      setIsDragging(false)
      setIsDragOver(false)
      onCloseStable()
    }
  }, [onCloseStable, onIsOpenChangeStable, setIsOpenState])

  const toggleIsOpen = useCallback(() => {
    setIsOpen(!isOpen)
  }, [isOpen, setIsOpen])

  const addFiles = useCallback((incoming: readonly FileInputItem[]) => {
    if (incoming.length === 0) {
      return
    }
    commitFiles(mergeFileInputItems(files ?? [], incoming, multiple, maxFiles))
  }, [commitFiles, files, maxFiles, multiple])

  const removeFile = useCallback((id: string) => {
    commitFiles((files ?? []).filter((file) => file.id !== id))
  }, [commitFiles, files])

  const maxFileCount = resolveFileInputMaxFiles(multiple, maxFiles)
  const canAddFiles = maxFileCount == null || (files ?? []).length < maxFileCount
  const remainingFileSlots = maxFileCount == null
    ? undefined
    : Math.max(maxFileCount - (files ?? []).length, 0)

  useEffect(() => {
    if (!isOpen || disabled || readOnly || !canAddFiles) {
      setIsDragging(false)
      setIsDragOver(false)
      return
    }

    const win = SafeGlobals.window('FileInputRoot')
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
  }, [canAddFiles, disabled, isOpen, readOnly])

  const openNativePicker = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const requestAddFiles = useCallback(() => {
    if (!canAddFiles) {
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
    openNativePicker()
  }, [addFiles, canAddFiles, openNativePicker, pickFilesStable])

  const contextValue = useMemo((): FileInputContextType => ({
    invalid,
    disabled,
    readOnly,
    required,
    files: files ?? [],
    isOpen,
    isDragging,
    isDragOver,
    accept,
    multiple,
    maxFiles,
    canAddFiles,
    fileInputRef,
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
    disabled,
    files,
    invalid,
    isDragging,
    isDragOver,
    isOpen,
    maxFiles,
    multiple,
    readOnly,
    removeFile,
    requestAddFiles,
    required,
    setIsOpen,
    toggleIsOpen,
  ])

  return (
    <FileInputContext.Provider value={contextValue}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={remainingFileSlots == null ? multiple : remainingFileSlots > 1}
        hidden={true}
        tabIndex={-1}
        disabled={disabled || readOnly || !canAddFiles}
        onChange={(event) => {
          addFiles(createFileInputItemsFromFileList(event.target.files))
          event.target.value = ''
        }}
      />
      {children}
    </FileInputContext.Provider>
  )
}
