import type { RefObject } from 'react'
import { createContext, useContext } from 'react'
import type { FormFieldInteractionStates } from '../../form/FieldLayout'
import type { FileInputItem } from './fileInputItem'

export type FileInputPickFiles = () => Promise<readonly FileInputItem[] | null | undefined>

export type FileInputContextType = Partial<FormFieldInteractionStates> & {
  files: readonly FileInputItem[],
  isOpen: boolean,
  isDragging: boolean,
  isDragOver: boolean,
  accept?: string,
  multiple: boolean,
  maxFiles?: number,
  canAddFiles: boolean,
  fileInputRef: RefObject<HTMLInputElement | null>,
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
  if (!ctx) throw new Error('useFileInputContext must be used within FileInputRoot')
  return ctx
}
