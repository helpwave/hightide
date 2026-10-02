import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { FileText, Plus, X } from 'lucide-react'
import clsx from 'clsx'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { Modal } from '../../layout/Modal/Modal'
import { Button } from '../../interaction/Button'
import { Icon } from '../../visualization/Icon'
import { IconButton } from '../../interaction/IconButton'
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
    <Modal
      isOpen={context.isOpen && (context.maxFiles ?? 1) > 1}
      onClose={() => context.setIsOpen(false)}
      titleElement={translation('selectFiles')}
      description={translation('dropFilesHere')}
      panelProps={{
        ...props,
        'className': clsx('file-input-menu', className),
        'data-file-drag': context.isDragging ? '' : undefined,
        'data-drag-over': context.isDragOver ? '' : undefined,
        'onDragEnter': (event) => {
          event.preventDefault()
          if (canEdit && context.canAddFiles && isFileDataTransfer(event.dataTransfer)) {
            context.setIsDragOver(true)
          }
          props.onDragEnter?.(event)
        },
        'onDragOver': (event) => {
          event.preventDefault()
          props.onDragOver?.(event)
        },
        'onDragLeave': (event) => {
          event.preventDefault()
          const nextTarget = event.relatedTarget
          if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) {
            props.onDragLeave?.(event)
            return
          }
          context.setIsDragOver(false)
          props.onDragLeave?.(event)
        },
        'onDrop': (event) => {
          event.preventDefault()
          context.setIsDragOver(false)
          context.setIsDragging(false)
          if (canEdit && context.canAddFiles) {
            context.addFiles(createFileInputItemsFromFileList(event.dataTransfer.files))
          }
          props.onDrop?.(event)
        },
      }}
    >
      {(context.maxFiles != null || allowedFileTypes != null) && (
        <div className="file-input-menu-meta">
          {context.maxFiles != null && (
            <span className="file-input-menu-meta-text">
              {translation('maximumNumberOfFiles', { count: context.maxFiles })}
            </span>
          )}
          {allowedFileTypes != null && (
            <span className="file-input-menu-meta-text">
              {translation('allowedFileTypes', { types: allowedFileTypes })}
            </span>
          )}
        </div>
      )}
      <div className="file-input-menu-list">
        {context.files.map((file) => (
          <div key={file.id} className="file-input-menu-row">
            <Icon icon={FileText} aria-hidden={true} />
            <span className="file-input-menu-title">{file.name}</span>
            {canEdit && (
              <IconButton
                tooltip={translation('remove')}
                size="sm"
                color="negative"
                variant="foreground"
                onClick={() => context.removeFile(file.id)}
                icon={X}
              />
            )}
          </div>
        ))}
      </div>
      {canEdit && (
        <Button
          color="primary"
          variant="tonal"
          disabled={!context.canAddFiles}
          onClick={() => context.requestAddFiles()}
          leading={Plus}
        >
          {translation('addFile')}
        </Button>
      )}
      {children}
    </Modal>
  )
}
