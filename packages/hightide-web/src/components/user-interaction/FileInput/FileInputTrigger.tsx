import clsx from 'clsx'
import type React from 'react'
import type { ComponentPropsWithoutRef, ForwardedRef, ReactNode } from 'react'
import { forwardRef } from 'react'
import { FileText, Pencil, Plus } from 'lucide-react'
import { Icon } from '../../display-and-visualization/Icon'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { useFileInputContext } from './FileInputContext'
import { splitVisibleFileInputItems } from './fileInputItem'

export interface FileInputTriggerProps extends ComponentPropsWithoutRef<'div'> {
  placeholder?: ReactNode,
  maxVisualFiles?: number,
}

type FileInputTriggerComponent = (
  props: FileInputTriggerProps & {
    ref?: React.ForwardedRef<HTMLDivElement>,
  }
) => React.ReactElement | null

const FileInputTriggerImpl = forwardRef<HTMLDivElement, FileInputTriggerProps>(function FileInputTrigger(
  {
    placeholder,
    maxVisualFiles,
    ...props
  },
  ref: ForwardedRef<HTMLDivElement>
) {
  const translation = useHightideTranslation()
  const context = useFileInputContext()
  const disabled = !!context.disabled
  const readOnly = !!context.readOnly
  const invalid = context.invalid
  const hasFiles = context.files.length > 0
  const { visible, hiddenCount } = splitVisibleFileInputItems(context.files, maxVisualFiles)
  const hasInteractions = !readOnly && !disabled
  const resolvedPlaceholder = placeholder ?? translation('noFilesSelected')

  // todo consider converting to a button

  return (
    <div
      {...props}
      ref={ReactUtils.assingRefsBuilder([ref])}
      onClick={(event) => {
        if (!hasInteractions) return
        props.onClick?.(event)
        context.toggleIsOpen()
      }}
      onKeyDown={(event) => {
        props.onKeyDown?.(event)
        if (!hasInteractions) return
        if (event.key === 'Enter' || event.key === ' ') {
          context.toggleIsOpen()
          event.preventDefault()
        }
      }}
      className={clsx('file-input-trigger', props.className)}
      data-value={hasFiles ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      data-readonly={readOnly ? '' : undefined}
      data-invalid={invalid ? '' : undefined}
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-invalid={invalid}
      aria-disabled={disabled}
      aria-readonly={readOnly}
      aria-haspopup={(context.maxFiles ?? 1) > 1 ? 'dialog' : undefined}
      aria-expanded={(context.maxFiles ?? 1) > 1 ? context.isOpen : undefined}>
      <div className="file-input-files">
        {hasFiles ? (
          <>
            {visible.map((file) => (
              <div key={file.id} className="file-input-file-row">
                <Icon icon={FileText} aria-hidden={true} />
                <span className="file-input-file-name">{file.name}</span>
              </div>
            ))}
            {hiddenCount > 0 && (
              <span className="file-input-more-files">
                {translation('nMoreFiles', { count: hiddenCount })}
              </span>
            )}
          </>
        ) : resolvedPlaceholder}
      </div>
      <Icon icon={hasFiles ? Pencil : Plus} aria-hidden={true} />
    </div>
  )
})

export const FileInputTrigger = FileInputTriggerImpl as FileInputTriggerComponent
