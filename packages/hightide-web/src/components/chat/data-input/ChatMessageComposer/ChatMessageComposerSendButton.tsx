import type { ComponentProps } from 'react'
import { forwardRef } from 'react'
import { SendHorizontal } from 'lucide-react'
import clsx from 'clsx'
import { IconButton } from '../../../interaction/IconButton'
import { Icon } from '../../../visualization/Icon'
import { useChatMessageComposerContext } from './ChatMessageComposerContext'

export type ChatMessageComposerSendButtonProps = ComponentProps<typeof IconButton>

export const ChatMessageComposerSendButton = forwardRef<HTMLButtonElement, ChatMessageComposerSendButtonProps>(
  function ChatMessageComposerSendButton(props, forwardedRef) {
    const { state, dispatch, config } = useChatMessageComposerContext()
    const canEdit = !config.isDisabled && !config.isReadOnly
    const isEmpty = !state.value.trim()

    return (
      <IconButton
        tooltip="Send"
        color="primary"
        variant="filled"
        size="md"
        {...props}
        ref={forwardedRef}
        disabled={props.disabled || !canEdit || isEmpty}
        onClick={event => {
          props.onClick?.(event)
          if (event.defaultPrevented || !canEdit || isEmpty) {
            return
          }
          dispatch({ type: 'send', value: state.value.trim() })
        }}
        className={clsx('chat-message-composer-send-button', props.className)}
      >
        {props.children ?? <Icon icon={SendHorizontal} />}
      </IconButton>
    )
  }
)
