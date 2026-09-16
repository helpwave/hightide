import {
  createFileInputItemsFromFileList,
  type FileInputItem
} from './fileInputItem'

export type PickFileInputItemsOptions = {
  accept?: string,
  multiple: boolean,
}

export const pickFileInputItems = (
  options: PickFileInputItemsOptions
): Promise<readonly FileInputItem[] | null> => {
  const doc = globalThis.document
  if (doc == null) {
    return Promise.resolve(null)
  }

  return new Promise((resolve) => {
    const input = doc.createElement('input')
    input.type = 'file'
    input.multiple = options.multiple
    const accept = options.accept
    if (accept != null && accept !== '') {
      input.accept = accept
    }
    input.hidden = true

    const finish = (files: readonly FileInputItem[] | null) => {
      input.remove()
      resolve(files)
    }

    input.addEventListener('change', () => {
      if (input.files == null || input.files.length === 0) {
        finish(null)
        return
      }
      finish(createFileInputItemsFromFileList(input.files))
    })
    input.addEventListener('cancel', () => {
      finish(null)
    })

    doc.body.appendChild(input)
    input.click()
  })
}
