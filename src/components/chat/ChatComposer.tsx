import type { HTMLAttributes, ReactNode } from 'react'
import { SendHorizontal } from 'lucide-react'
import { IconButton } from '../user-interaction/IconButton'
import { useControlledState } from '@/src/hooks/useControlledState'

export type ChatComposerProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  value?: string,
  initialValue?: string,
  onValueChange?: (value: string) => void,
  onSend: (value: string) => void,
  placeholder?: string,
  sendLabel?: string,
  disabled?: boolean,
  leading?: ReactNode,
  trailing?: ReactNode,
}

export const ChatComposer = ({
  value: controlledValue,
  initialValue,
  onValueChange,
  onSend,
  placeholder,
  sendLabel = 'Send',
  disabled = false,
  leading,
  trailing,
  ...props
}: ChatComposerProps) => {
  const [value, setValue] = useControlledState({
    value: controlledValue,
    onValueChange,
    defaultValue: initialValue ?? '',
  })

  const send = () => {
    const trimmed = (value ?? '').trim()
    if (!trimmed) {
      return
    }
    onSend(trimmed)
    setValue('')
  }

  return (
    <div {...props} data-name="chat-composer">
      {leading}
      <div data-name="chat-composer-input-container">
        <input
          data-name="chat-composer-input"
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
        {trailing}
      </div>
      <IconButton
        tooltip={sendLabel}
        color="primary"
        coloringStyle="solid"
        disabled={disabled || !(value ?? '').trim()}
        onClick={send}
        className="chat-composer-send-button"
      >
        <SendHorizontal/>
      </IconButton>
    </div>
  )
}
