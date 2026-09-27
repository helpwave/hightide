import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { FileText, Plus, X } from 'lucide-react'
import clsx from 'clsx'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { Dialog } from '../../layout/dialog/Dialog'
import { Button } from '../Button'
import { IconButton } from '../IconButton'
import { useFileInputContext } from './FileInputContext'
import {
  createFileInputItemsFromFileList,
  formatFileInputAccept,
  isFileDataTransfer
} from './fileInputItem'

export type FileInputMenuProps = Omit<ComponentPropsWithoutRef<'div'>, 'title'> & {
  children?: ReactNode,
}

export const FileInputMenu = ({
  children,
  className,
  ...props
}: FileInputMenuProps) => {
  const translation = useHightideTranslation()
  const context = useFileInputContext()
  const canEdit = !context.disabled && !context.readOnly
  const allowedFileTypes = formatFileInputAccept(context.accept)

  return (
    <Dialog
      {...props}
      isOpen={context.isOpen && (context.maxFiles ?? 1) > 1}
      onClose={() => context.setIsOpen(false)}
      titleElement={translation('selectFiles')}
      description={translation('dropFilesHere')}
      className={clsx('file-input-menu', className)}
      data-file-drag={context.isDragging ? '' : undefined}
      data-drag-over={context.isDragOver ? '' : undefined}
      onDragEnter={(event) => {
        event.preventDefault()
        if (canEdit && context.canAddFiles && isFileDataTransfer(event.dataTransfer)) {
          context.setIsDragOver(true)
        }
        props.onDragEnter?.(event)
      }}
      onDragOver={(event) => {
        event.preventDefault()
        props.onDragOver?.(event)
      }}
      onDragLeave={(event) => {
        event.preventDefault()
        const nextTarget = event.relatedTarget
        if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) {
          props.onDragLeave?.(event)
          return
        }
        context.setIsDragOver(false)
        props.onDragLeave?.(event)
      }}
      onDrop={(event) => {
        event.preventDefault()
        context.setIsDragOver(false)
        context.setIsDragging(false)
        if (canEdit && context.canAddFiles) {
          context.addFiles(createFileInputItemsFromFileList(event.dataTransfer.files))
        }
        props.onDrop?.(event)
      }}
    >
      {(context.maxFiles != null || allowedFileTypes != null) && (
        <div data-name="file-input-menu-meta">
          {context.maxFiles != null && (
            <span data-name="file-input-menu-meta-text">
              {translation('maximumNumberOfFiles', { count: context.maxFiles })}
            </span>
          )}
          {allowedFileTypes != null && (
            <span data-name="file-input-menu-meta-text">
              {translation('allowedFileTypes', { types: allowedFileTypes })}
            </span>
          )}
        </div>
      )}
      <div data-name="file-input-menu-list">
        {context.files.map((file) => (
          <div key={file.id} data-name="file-input-menu-row">
            <FileText aria-hidden={true} />
            <span data-name="file-input-menu-title">{file.name}</span>
            {canEdit && (
              <IconButton
                tooltip={translation('remove')}
                size="sm"
                color="negative"
                coloringStyle="text"
                onClick={() => context.removeFile(file.id)}
              >
                <X />
              </IconButton>
            )}
          </div>
        ))}
      </div>
      {canEdit && (
        <Button
          color="primary"
          coloringStyle="tonal"
          disabled={!context.canAddFiles}
          onClick={() => context.requestAddFiles()}
        >
          <Plus />
          {translation('addFile')}
        </Button>
      )}
      {children}
    </Dialog>
  )
}
