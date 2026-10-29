import type { ComponentPropsWithoutRef } from 'react'
import { forwardRef, useEffect, useRef } from 'react'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { useFileInputContext } from './FileInputContext'
import { createFileInputItemsFromFileList, normalizeFileInputAccept, resolveFileInputMaxFiles } from './fileInputItem'

export type FileInputInputProps = Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'accept' | 'multiple' | 'disabled' | 'hidden' | 'onChange'>

export const FileInputInput = forwardRef<HTMLInputElement, FileInputInputProps>(function FileInputInput(
  props,
  forwardedRef
) {
  const context = useFileInputContext()
  const inputRef = useRef<HTMLInputElement>(null)
  const seenPickerRequestRef = useRef(context.nativePickerRequest)
  const maxFileCount = resolveFileInputMaxFiles(context.maxFiles)
  const isSingleFile = maxFileCount === 1
  const remainingFileSlots = Math.max(maxFileCount - context.files.length, 0)

  useEffect(() => {
    if (context.nativePickerRequest === seenPickerRequestRef.current) {
      return
    }
    seenPickerRequestRef.current = context.nativePickerRequest
    inputRef.current?.click()
  }, [context.nativePickerRequest])

  return (
    <input
      {...props}
      ref={ReactUtils.assingRefsBuilder([forwardedRef, inputRef])}
      type="file"
      accept={normalizeFileInputAccept(context.accept).join(',') || undefined}
      multiple={remainingFileSlots > 1}
      hidden={true}
      tabIndex={-1}
      disabled={context.isDisabled || context.isReadOnly || (!isSingleFile && !context.canAddFiles)}
      onChange={(event) => {
        context.addFiles(createFileInputItemsFromFileList(event.target.files))
        event.target.value = ''
      }}
    />
  )
})
