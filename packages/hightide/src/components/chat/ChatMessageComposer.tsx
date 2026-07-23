import type { HTMLAttributes, ReactNode } from 'react'
import { useCallback, useLayoutEffect, useRef } from 'react'
import clsx from 'clsx'
import { SendHorizontal } from 'lucide-react'
import { IconButton } from '../user-interaction/IconButton'
import { useControlledState } from '@helpwave/hightide-utils/hooks'
import { useWindowResizeObserver } from '../../hooks/useWindowResizeObserver'

const MAX_INPUT_LINES = 7

export type ChatMessageComposerProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  value?: string,
  initialValue?: string,
  onValueChange?: (value: string) => void,
  onSend: (value: string) => void,
  placeholder?: string,
  sendLabel?: string,
  disabled?: boolean,
  actions?: ReactNode,
  trailing?: ReactNode,
}

export const ChatMessageComposer = ({
  value: controlledValue,
  initialValue,
  onValueChange,
  onSend,
  placeholder,
  sendLabel = 'Send',
  disabled = false,
  actions,
  ...props
}: ChatMessageComposerProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [value, setValue] = useControlledState({
    value: controlledValue,
    onValueChange,
    defaultValue: initialValue ?? '',
  })

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
    const trimmed = (value ?? '').trim()
    if (!trimmed) {
      return
    }
    onSend(trimmed)
    setValue('')
  }

  return (
    <div {...props} className={clsx('chat-message-composer', props.className)}>
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
        onChange={event => setValue(event.target.value)}
        onKeyDown={event => {
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            send()
          }
        }}
      />
      <IconButton
        tooltip={sendLabel}
        color="primary"
        coloringStyle="solid"
        disabled={disabled || !(value ?? '').trim()}
        size="md"
        onClick={send}
        className="chat-message-composer-send-button"
      >
        <SendHorizontal/>
      </IconButton>
    </div>
  )
}
