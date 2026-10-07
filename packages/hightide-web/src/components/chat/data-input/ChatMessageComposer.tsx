import type { HTMLAttributes, ReactNode } from 'react'
import { forwardRef, useCallback, useLayoutEffect, useRef } from 'react'
import clsx from 'clsx'
import { SendHorizontal } from 'lucide-react'
import { useControlledState, useStableEvent } from '@helpwave/hightide-utils/hooks'

import { useWindowResizeObserver } from '../../../hooks/useWindowResizeObserver'
import type { InputComponentInterface } from '../../data-input/input/Input'
import { IconButton } from '../../interaction/IconButton'
import { Icon } from '../../visualization/Icon'
import { PropsUtil } from '../../../utils/propsUtil'

const MAX_INPUT_LINES = 7

export type ChatMessageComposerProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>
  & InputComponentInterface<string>
  & {
    onSend: (value: string) => void,
    placeholder?: string,
    sendLabel?: string,
    actions?: ReactNode,
    trailing?: ReactNode,
  }

export const ChatMessageComposer = forwardRef<HTMLDivElement, ChatMessageComposerProps>(function ChatMessageComposer({
  value: controlledValue,
  initialValue,
  onValueUpdate: onValueChange,
  onValueCommit: onEditComplete,
  invalid = false,
  disabled = false,
  readOnly = false,
  required = false,
  onSend,
  placeholder,
  sendLabel = 'Send',
  actions,
  trailing,
  ...props
}, ref) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [value, setValue] = useControlledState({
    value: controlledValue,
    onValueChange,
    defaultValue: initialValue ?? '',
  })
  const onEditCompleteStable = useStableEvent(onEditComplete)
  const canEdit = !disabled && !readOnly

  const syncTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) {
      return
    }
    textarea.style.height = '0px'
    const lineHeight = Number.parseFloat(getComputedStyle(textarea).lineHeight)
    const maxHeight = Number.isFinite(lineHeight) ? lineHeight * MAX_INPUT_LINES : textarea.scrollHeight
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`
  }, [])

  useLayoutEffect(() => {
    syncTextareaHeight()
  }, [value, syncTextareaHeight])

  useWindowResizeObserver(syncTextareaHeight)

  const send = () => {
    if (!canEdit) {
      return
    }
    const trimmed = (value ?? '').trim()
    if (!trimmed) {
      return
    }
    onEditCompleteStable(trimmed)
    onSend(trimmed)
    setValue('')
  }

  return (
    <div
      {...props}
      ref={ref}
      className={clsx('chat-message-composer', props.className)}
      {...PropsUtil.dataAttributes.interactionStates({ invalid, disabled, readOnly, required })}
    >
      {actions && (
        <div className="chat-message-composer-actions">
          {actions}
        </div>
      )}
      <textarea
        ref={textareaRef}
        className="chat-message-composer-input"
        rows={1}
        value={value ?? ''}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        onChange={event => {
          if (!canEdit) {
            return
          }
          setValue(event.target.value)
        }}
        onBlur={event => {
          onEditCompleteStable(event.target.value)
        }}
        onKeyDown={event => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            send()
          }
        }}
        {...PropsUtil.aria.interactionStates({ invalid, disabled, readOnly, required })}
      />
      {trailing}
      <IconButton
        tooltip={sendLabel}
        color="primary"
        variant="filled"
        disabled={disabled || readOnly || !(value ?? '').trim()}
        size="md"
        onClick={send}
        className="chat-message-composer-send-button"
      >
        <Icon icon={SendHorizontal} />
      </IconButton>
    </div>
  )
})
