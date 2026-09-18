import {
  errorCodes,
  isErrorWithCode,
  pick,
  types
} from '@react-native-documents/picker'

import {
  createFileInputItem,
  normalizeFileInputAccept,
  type FileInputItem
} from './fileInputItem'

export type PickFileInputItemsOptions = {
  accept?: string[],
  multiple: boolean,
}

export const pickFileInputItems = async (
  options: PickFileInputItemsOptions
): Promise<readonly FileInputItem[] | null> => {
  try {
    const type = normalizeFileInputAccept(options.accept)
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
