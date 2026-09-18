import type { FileInputItem } from './fileInputItem'

export type PickFileInputItemsOptions = {
  accept?: string[],
  multiple: boolean,
}

export declare const pickFileInputItems: (
  options: PickFileInputItemsOptions
) => Promise<readonly FileInputItem[] | null>