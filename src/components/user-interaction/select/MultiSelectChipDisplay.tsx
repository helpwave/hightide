import type { MultiSelectRootProps } from './SelectContext'
import { MultiSelectRoot, useSelectContext } from './SelectContext'
import type { HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { useOverwritableState } from '@/src/hooks/useOverwritableState'
import { Chip } from '@/src/components/display-and-visualization/Chip'
import { XIcon, Plus } from 'lucide-react'
import { MultiSelectContent, type MultiSelectContentProps } from './SelectComponents'
import { IconButton } from '../IconButton'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'

///
/// MultiSelectChipDisplay
///
type MultiSelectChipDisplayButtonProps = HTMLAttributes<HTMLDivElement> & {
    disabled?: boolean,
    placeholder?: ReactNode,
  }

export const MultiSelectChipDisplayButton = forwardRef<HTMLDivElement, MultiSelectChipDisplayButtonProps>(function MultiSelectChipDisplayButton({
  id,
  ...props
}, ref) {
  const translation = useHightideTranslation()
  const { state, trigger, item, ids, setIds } = useSelectContext()
  const { register, unregister, toggleOpen } = trigger

  useEffect(() => {
    if(id) {
      setIds(prev => ({
        ...prev,
        trigger: id,
      }))
    }
  }, [id, setIds])
  const innerRef = useRef<HTMLDivElement>(null)
  useImperativeHandle(ref, () => innerRef.current)

  useEffect(() => {
    register(innerRef)
    return () => unregister()
  }, [register, unregister])

  const disabled = !!props?.disabled || !!state.disabled
  const invalid = state.invalid

  return (
    <div
      {...props}
      ref={innerRef}

      onClick={(event) => {
        toggleOpen()
        props.onClick?.(event)
      }}

      data-name={props['data-name'] ?? 'select-button-chips'}
      data-value={state.value.length > 0 ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
      data-invalid={invalid ? '' : undefined}

      aria-invalid={invalid}
      aria-disabled={disabled}
    >
      {state.selectedOptions.map(({ value, label }) => (
        <Chip key={value} className="gap-x-2">
          {label}
          <IconButton
            tooltip={translation('remove')}
            onClick={() => {
              item.toggleSelection(value, false)
            }}
            size="xs"
            color="negative"
            coloringStyle="text"
            className="flex-row-0 items-center"
          >
            <XIcon className="size-5"/>
          </IconButton>
        </Chip>
      ))}
      <IconButton
        id={ids.trigger}
        onClick={(event) => {
          event.stopPropagation()
          toggleOpen()
        }}
        onKeyDown={event => {
          switch (event.key) {
          case 'ArrowDown':
            toggleOpen(true, { highlightStartPositionBehavior: 'first' })
            break
          case 'ArrowUp':
            toggleOpen(true, { highlightStartPositionBehavior: 'last' })
          }
        }}
        tooltip={translation('changeSelection')}
        size="sm"
        color="neutral"

        aria-invalid={invalid}
        aria-disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={state.isOpen}
        aria-controls={state.isOpen ? ids.content : undefined}

        className="size-9"
      >
        <Plus/>
      </IconButton>
    </div>
  )
})


//
// MultiSelectChipDisplay
//
export type MultiSelectChipDisplayProps = MultiSelectRootProps & {
    contentPanelProps?: MultiSelectContentProps,
    chipDisplayProps?: MultiSelectChipDisplayButtonProps,
  }

export const MultiSelectChipDisplay = forwardRef<HTMLDivElement, MultiSelectChipDisplayProps>(function MultiSelectChipDisplay({
  children,
  contentPanelProps,
  chipDisplayProps,
  ...props
}, ref) {
  return (
    <MultiSelectRoot {...props} >
      <MultiSelectChipDisplayButton ref={ref} {...chipDisplayProps} />
      <MultiSelectContent {...contentPanelProps}>{children}</MultiSelectContent>
    </MultiSelectRoot>
  )
})


export type MultiSelectChipDisplayUncontrolledProps = MultiSelectChipDisplayProps
export const MultiSelectChipDisplayUncontrolled = forwardRef<HTMLDivElement, MultiSelectChipDisplayUncontrolledProps>(function MultiSelectChipDisplayUncontrolled({
  value: initialValue,
  onValueChange,
  ...props
}, ref) {
  const [value, setValue] = useOverwritableState(initialValue, onValueChange)

  return (
    <MultiSelectChipDisplay
      {...props}
      ref={ref}
      value={value}
      onValueChange={setValue}
    />
  )
})