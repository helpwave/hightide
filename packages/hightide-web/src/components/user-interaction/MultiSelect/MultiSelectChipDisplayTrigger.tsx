import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useEffect, useRef } from 'react'
import { useMultiSelectContext } from './MultiSelectContext'
import { IconButton } from '../IconButton'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { XIcon, Plus } from 'lucide-react'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import clsx from 'clsx'

export type MultiSelectChipDisplayTriggerProps = HTMLAttributes<HTMLDivElement> & {
  disabled?: boolean,
  placeholder?: ReactNode,
}

export const MultiSelectChipDisplayTrigger = forwardRef<
  HTMLDivElement,
  MultiSelectChipDisplayTriggerProps
>(function MultiSelectChipDisplayTrigger({ id, ...props }, ref: ForwardedRef<HTMLDivElement>) {
  const translation = useHightideTranslation()
  const context = useMultiSelectContext<unknown>()
  const { config, layout } = context
  const { setIds } = config
  const { registerTrigger } = layout

  useEffect(() => {
    if (id) setIds((prev) => ({ ...prev, trigger: id }))
  }, [id, setIds])

  const innerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const unregister = registerTrigger(innerRef)
    return () => unregister()
  }, [registerTrigger])

  const disabled = !!props?.disabled || !!context.disabled
  const readOnly = !!context.readOnly
  const invalid = context.invalid
  const hasInteractions = !readOnly && !disabled
  const selectedOptions = context.selectedIds
    .map((oid) => context.idToOptionMap[oid])
    .filter(Boolean)

  return (
    <div
      {...props}
      ref={ReactUtils.assingRefsBuilder([innerRef, ref])}
      className={clsx('multi-select-chip-display-container')}
      data-value={context.value.length > 0 ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      data-readonly={readOnly ? '' : undefined}
      data-invalid={invalid ? '' : undefined}
      aria-invalid={invalid}
      aria-disabled={disabled}
      aria-readonly={readOnly}
    >
      <div
        onClick={() => {
          console.log('clicked')
          if (!hasInteractions) return
          context.toggleIsOpen()
        }}
        className="multi-select-chip-display-button"
      />
      {selectedOptions.map((opt) => (
        <div key={opt.value.id} className="multi-select-chip-display-chip">
          {opt.display}
          <IconButton
            tooltip={translation('remove')}
            disabled={!hasInteractions}
            onClick={() => {
              context.toggleSelection(opt.value.id, false)
            }}
            size="sm"
            color="negative"
            coloringStyle="text"
            className="flex-row-0 items-center size-7 p-1"
          >
            <XIcon className="size-5" />
          </IconButton>
        </div>
      ))}
      <IconButton
        id={context.config.ids.trigger}
        disabled={!hasInteractions}
        onClick={() => {
          if (!hasInteractions) return
          context.toggleIsOpen()
        }}
        onKeyDown={(event) => {
          if (!hasInteractions) return
          switch (event.key) {
          case 'ArrowDown':
            context.setIsOpen(true, 'first')
            break
          case 'ArrowUp':
            context.setIsOpen(true, 'last')
          }
        }}
        tooltip={translation('changeSelection')}
        size="md"
        color="neutral"
        aria-invalid={invalid}
        aria-disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={context.isOpen}
        aria-controls={
          context.isOpen ? context.config.ids.content : undefined
        }
        className="multi-select-chip-display-add-button"
      >
        <Plus />
      </IconButton>
    </div>
  )
})
