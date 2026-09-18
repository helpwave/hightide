import { createContext, useContext } from 'react'

import type { ColorPairToken } from '@helpwave/hightide-design/theme-tokens'

import type { FormFieldInteractionStates } from '../../../types/formField'
import type { FileInputItem } from './fileInputItem'

export type FileInputPickFiles = () => Promise<readonly FileInputItem[] | null | undefined>

export type FileInputContextType = Partial<FormFieldInteractionStates> & {
  files: readonly FileInputItem[],
  isOpen: boolean,
  accept?: string[],
  maxFiles?: number,
  canAddFiles: boolean,
  config: {
    color?: ColorPairToken,
  },
  setIsOpen: (open: boolean) => void,
  toggleIsOpen: () => void,
  addFiles: (files: readonly FileInputItem[]) => void,
  removeFile: (id: string) => void,
  requestAddFiles: () => void,
}

export const FileInputContext = createContext<FileInputContextType | null>(null)

export function useFileInputContext(): FileInputContextType {
  const context = useContext(FileInputContext)
  if (!context) {
    throw new Error('useFileInputContext must be used within FileInputRoot')
  }
  return context
}
