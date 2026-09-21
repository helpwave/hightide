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
  normalizeFileInputAccept,
  resolveFileInputMaxFiles,
  type FileInputItem
} from './fileInputItem'

export interface FileInputRootProps extends Omit<Partial<FormFieldDataHandling<readonly FileInputItem[]>>, 'value'>, Partial<FormFieldInteractionStates> {
  value?: readonly FileInputItem[],
  initialValue?: readonly FileInputItem[],
  initialIsOpen?: boolean,
  onClose?: () => void,
  onIsOpenChange?: (isOpen: boolean) => void,
  accept?: string[],
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
    defaultValue: resolveFileInputMaxFiles(maxFiles) === 1 ? false : initialIsOpen,
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
    if (disabled || readOnly) {
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
    openNativePicker()
  }, [addFiles, canAddFiles, disabled, isSingleFile, openNativePicker, pickFilesStable, readOnly])

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
    isOpen: isSingleFile ? false : isOpen,
    isDragging,
    isDragOver,
    accept,
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
      <input
        ref={fileInputRef}
        type="file"
        accept={normalizeFileInputAccept(accept).join(',') || undefined}
        multiple={remainingFileSlots > 1}
        hidden={true}
        tabIndex={-1}
        disabled={disabled || readOnly || (!isSingleFile && !canAddFiles)}
        onChange={(event) => {
          addFiles(createFileInputItemsFromFileList(event.target.files))
          event.target.value = ''
        }}
      />
      {children}
    </FileInputContext.Provider>
  )
}
