import type { ForwardedRef, HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useEffect, useRef } from 'react'
import { useMultiSelectContext } from './MultiSelectContext'
import type { MultiSelectRootProps } from './MultiSelectRoot'
import { MultiSelectRoot } from './MultiSelectRoot'
import type { MultiSelectContentProps } from './MultiSelectContent'
import { MultiSelectContent } from './MultiSelectContent'
import { IconButton } from '@/src/components/user-interaction/IconButton'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import { XIcon, Plus } from 'lucide-react'
import { ReactUtils } from '@helpwave/hightide-utils/utils'

export type MultiSelectChipDisplayButtonProps = HTMLAttributes<HTMLDivElement> & {
  'disabled'?: boolean,
  'placeholder'?: ReactNode,
  'data-name'?: string,
}

export const MultiSelectChipDisplayButton = forwardRef<
  HTMLDivElement,
  MultiSelectChipDisplayButtonProps
>(function MultiSelectChipDisplayButton({ id, ...props }, ref: ForwardedRef<HTMLDivElement>) {
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
      onClick={(event) => {
        props.onClick?.(event)
        if (event.defaultPrevented) return
        if (!hasInteractions) return
        context.toggleIsOpen()
      }}
      data-name={props['data-name'] ?? 'multi-select-chip-display-button'}
      data-value={context.value.length > 0 ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      data-readonly={readOnly ? '' : undefined}
      data-invalid={invalid ? '' : undefined}
      aria-invalid={invalid}
      aria-disabled={disabled}
      aria-readonly={readOnly}
    >
      {selectedOptions.map((opt) => (
        <div key={opt.id} data-name="multi-select-chip-display-chip">
          {opt.display}
          <IconButton
            tooltip={translation('remove')}
            disabled={!hasInteractions}
            onClick={(e) => {
              context.toggleSelection(opt.id, false)
              e.preventDefault()
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
        onClick={(event) => {
          event.stopPropagation()
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
        className="size-9"
      >
        <Plus />
      </IconButton>
    </div>
  )
})

export type MultiSelectChipDisplayProps<T = string> = MultiSelectRootProps<T> & {
  contentPanelProps?: MultiSelectContentProps,
  chipDisplayProps?: MultiSelectChipDisplayButtonProps,
};

export const MultiSelectChipDisplay = forwardRef(
  function MultiSelectChipDisplay<T = string>(
    {
      children,
      contentPanelProps,
      chipDisplayProps,
      ...props
    }: MultiSelectChipDisplayProps<T>,
    ref: React.ForwardedRef<HTMLDivElement>
  ) {
    return (
      <MultiSelectRoot<T> {...props}>
        <MultiSelectChipDisplayButton ref={ref} {...chipDisplayProps} />
        <MultiSelectContent {...contentPanelProps}>{children}</MultiSelectContent>
      </MultiSelectRoot>
    )
  }
)
