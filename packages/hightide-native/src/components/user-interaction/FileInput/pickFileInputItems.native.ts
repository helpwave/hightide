import {
  errorCodes,
  isErrorWithCode,
  pick,
  types
} from '@react-native-documents/picker'

import {
  createFileInputItem,
  type FileInputItem
} from './fileInputItem'

export type PickFileInputItemsOptions = {
  accept?: string,
  multiple: boolean,
}

const acceptedTypes = (accept?: string): string[] => {
  if (accept == null || accept === '') {
    return []
  }
  return accept
    .split(',')
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
}

export const pickFileInputItems = async (
  options: PickFileInputItemsOptions
): Promise<readonly FileInputItem[] | null> => {
  try {
    const type = acceptedTypes(options.accept)
    const results = await pick({
      allowMultiSelection: options.multiple,
      type: type.length === 0 ? [types.allFiles] : type,
    })

    return results.map((result) => createFileInputItem({
      name: result.name ?? 'file',
      size: result.size ?? undefined,
      mimeType: result.type ?? undefined,
      uri: result.uri,
    }))
  } catch (error) {
    if (isErrorWithCode(error) && error.code === errorCodes.OPERATION_CANCELED) {
      return null
    }
    throw error
  }
}
