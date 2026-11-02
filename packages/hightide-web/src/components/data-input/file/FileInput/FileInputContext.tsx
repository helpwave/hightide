import { createContext, useContext } from 'react'
import type { FileInputItem } from './fileInputItem'

export type FileInputPickFiles = () => Promise<readonly FileInputItem[] | null | undefined>

export type FileInputContextType = {
  isInvalid: boolean,
  isDisabled: boolean,
  isReadOnly: boolean,
  isRequired: boolean,
  id?: string,
  files: readonly FileInputItem[],
  isOpen: boolean,
  isDragging: boolean,
  isDragOver: boolean,
  accept?: string[],
  maxFiles?: number,
  canAddFiles: boolean,
  nativePickerRequest: number,
  setIsOpen: (open: boolean) => void,
  toggleIsOpen: () => void,
  setIsDragging: (isDragging: boolean) => void,
  setIsDragOver: (isDragOver: boolean) => void,
  addFiles: (files: readonly FileInputItem[]) => void,
  removeFile: (id: string) => void,
  requestAddFiles: () => void,
}

export const FileInputContext = createContext<FileInputContextType | null>(null)

export function useFileInputContext(): FileInputContextType {
  const ctx = useContext(FileInputContext)
  if (!ctx) throw new Error('useFileInputContext must be used inside a FileInput.StateManager')
  return ctx
}
