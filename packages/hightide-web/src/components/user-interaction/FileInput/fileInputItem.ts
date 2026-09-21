export type FileInputItem = {
  id: string,
  name: string,
  size?: number,
  mimeType?: string,
  uri?: string,
  file?: File,
}

const createFileInputItemId = (name: string): string => {
  const randomUUID = globalThis.crypto?.randomUUID
  if (typeof randomUUID === 'function') {
    return randomUUID.call(globalThis.crypto)
  }
  return `${name}-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export const createFileInputItem = (
  item: Omit<FileInputItem, 'id'> & { id?: string }
): FileInputItem => ({
  id: item.id ?? createFileInputItemId(item.name),
  name: item.name,
  size: item.size,
  mimeType: item.mimeType,
  uri: item.uri,
  file: item.file,
})

export const createFileInputItemsFromFileList = (
  fileList: FileList | File[] | null | undefined
): FileInputItem[] => {
  if (fileList == null) {
    return []
  }
  return Array.from(fileList).map((file) => createFileInputItem({
    name: file.name,
    size: file.size,
    mimeType: file.type,
    file,
  }))
}

export const resolveFileInputMaxFiles = (maxFiles?: number): number => {
  if (maxFiles == null || maxFiles <= 1) {
    return 1
  }
  return maxFiles
}

export const normalizeFileInputAccept = (accept?: readonly string[]): string[] => {
  if (accept == null) {
    return []
  }
  return accept
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
}

export const formatFileInputAccept = (accept?: readonly string[]): string | undefined => {
  const types = normalizeFileInputAccept(accept)
  if (types.length === 0) {
    return undefined
  }
  return types.join(', ')
}

type FileInputFileLike = {
  name?: string,
  size?: number,
  lastModified?: number,
  type?: string,
}

const isFileInputFileLike = (value: unknown): value is FileInputFileLike => {
  return typeof value === 'object' && value != null
}

const fileInputItemName = (item: FileInputItem): string => {
  const file = isFileInputFileLike(item.file) ? item.file : undefined
  return file?.name ?? item.name
}

const fileInputItemSize = (item: FileInputItem): number | undefined => {
  const file = isFileInputFileLike(item.file) ? item.file : undefined
  return file?.size ?? item.size
}

const fileInputItemLastModified = (item: FileInputItem): number | undefined => {
  const file = isFileInputFileLike(item.file) ? item.file : undefined
  return file?.lastModified
}

export const fileInputItemsAreDuplicate = (
  left: FileInputItem,
  right: FileInputItem
): boolean => {
  if (fileInputItemName(left) !== fileInputItemName(right)) {
    return false
  }

  const leftSize = fileInputItemSize(left)
  const rightSize = fileInputItemSize(right)
  if (leftSize != null && rightSize != null && leftSize !== rightSize) {
    return false
  }

  const leftModified = fileInputItemLastModified(left)
  const rightModified = fileInputItemLastModified(right)
  if (
    typeof leftModified === 'number'
    && typeof rightModified === 'number'
    && leftModified !== rightModified
  ) {
    return false
  }

  return true
}

export const mergeFileInputItems = (
  current: readonly FileInputItem[],
  incoming: readonly FileInputItem[],
  maxFiles?: number
): FileInputItem[] => {
  const limit = resolveFileInputMaxFiles(maxFiles)
  if (limit === 1) {
    return incoming.slice(-1)
  }

  const merged: FileInputItem[] = []

  for (const item of [...current, ...incoming]) {
    if (merged.some((existing) => fileInputItemsAreDuplicate(existing, item))) {
      continue
    }
    merged.push(item)
    if (limit != null && merged.length >= limit) {
      break
    }
  }

  return merged
}

export const isFileDataTransfer = (
  dataTransfer?: {
    types?: ArrayLike<string> | null,
    files?: ArrayLike<unknown> | null,
  } | null
): boolean => {
  if (dataTransfer == null) {
    return false
  }
  if (dataTransfer.types != null && Array.from(dataTransfer.types).includes('Files')) {
    return true
  }
  return (dataTransfer.files?.length ?? 0) > 0
}

export const splitVisibleFileInputItems = (
  files: readonly FileInputItem[],
  maxVisualFiles?: number
): {
  visible: readonly FileInputItem[],
  hiddenCount: number,
} => {
  if (maxVisualFiles == null || maxVisualFiles < 1 || files.length <= maxVisualFiles) {
    return {
      visible: files,
      hiddenCount: 0,
    }
  }
  const visibleCount = maxVisualFiles - 1
  return {
    visible: files.slice(0, visibleCount),
    hiddenCount: files.length - visibleCount,
  }
}
