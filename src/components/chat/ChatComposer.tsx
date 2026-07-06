import type { HTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'
import { Camera, Paperclip, SendHorizontal } from 'lucide-react'
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
  onCamera?: () => void,
  cameraLabel?: string,
  onAttachment?: () => void,
  attachmentLabel?: string,
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
  onCamera,
  cameraLabel = 'Camera',
  onAttachment,
  attachmentLabel = 'Attach file',
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
    <div {...props} className={clsx('chat-composer', props.className)}>
      {leading}
      {onCamera && (
        <IconButton
          tooltip={cameraLabel}
          size="sm"
          color="neutral"
          coloringStyle="text"
          disabled={disabled}
          onClick={onCamera}
        >
          <Camera/>
        </IconButton>
      )}
      {onAttachment && (
        <IconButton
          tooltip={attachmentLabel}
          size="sm"
          color="neutral"
          coloringStyle="text"
          disabled={disabled}
          onClick={onAttachment}
        >
          <Paperclip/>
        </IconButton>
      )}
      <div className="chat-composer-input-container">
        <input
          className="chat-composer-input"
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
