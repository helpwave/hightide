import type { ComponentRef, ReactNode, Ref } from 'react'
import { useCallback } from 'react'
import type { ControllableDOMInputProps } from '../../../data-input/domInput'
import { useControlledState, useStateMachineBinding } from '@helpwave/hightide-utils/hooks'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import {
  ChatMessageComposerActionLayout,
  type ChatMessageComposerActionLayoutProps
} from './ChatMessageComposerActionLayout'
import { ChatMessageComposerContext } from './ChatMessageComposerContext'
import {
  ChatMessageComposerLayout,
  type ChatMessageComposerLayoutProps
} from './ChatMessageComposerLayout'
import {
  ChatMessageComposerSendButton,
  type ChatMessageComposerSendButtonProps
} from './ChatMessageComposerSendButton'
import { ChatMessageComposerStateManager } from './ChatMessageComposerStateManager'
import type { ChatMessageComposerEvent, ChatMessageComposerState } from './ChatMessageComposerState'
import {
  ChatMessageComposerTextarea,
  type ChatMessageComposerTextareaProps
} from './ChatMessageComposerTextarea'

export type ChatMessageComposerProps = ControllableDOMInputProps<string, ChatMessageComposerEvent> & {
  onSend: (value: string) => void,
  actions?: ReactNode,
  trailing?: ReactNode,
  layoutRef?: Ref<ComponentRef<typeof ChatMessageComposerLayout>>,
  layoutProps?: ChatMessageComposerLayoutProps,
  actionLayoutRef?: Ref<ComponentRef<typeof ChatMessageComposerActionLayout>>,
  actionLayoutProps?: ChatMessageComposerActionLayoutProps,
  textareaRef?: Ref<ComponentRef<typeof ChatMessageComposerTextarea>>,
  textareaProps?: ChatMessageComposerTextareaProps,
  sendButtonRef?: Ref<ComponentRef<typeof ChatMessageComposerSendButton>>,
  sendButtonProps?: ChatMessageComposerSendButtonProps,
}

const ChatMessageComposerComponent = ({
  value,
  initialValue,
  onValueChange,
  onStateEvent,
  isInvalid,
  isDisabled,
  isReadOnly,
  isRequired,
  id,
  onSend,
  actions,
  trailing,
  layoutRef,
  layoutProps,
  actionLayoutRef,
  actionLayoutProps,
  textareaRef,
  textareaProps,
  sendButtonRef,
  sendButtonProps,
}: ChatMessageComposerProps) => {
  const [state, setState] = useControlledState<ChatMessageComposerState>({
    defaultValue: { value: initialValue ?? '' },
  })
  const binding = useStateMachineBinding<ChatMessageComposerState, string>({
    state,
    onStateChange: setState,
    onValueChange,
    value,
    inject: useCallback((next: string) => ({ value: next }), []),
    get: useCallback((current: ChatMessageComposerState) => current.value, []),
  })

  return (
    <ChatMessageComposerStateManager
      state={binding.state}
      onStateChange={binding.onStateChange}
      onStateEvent={onStateEvent}
      onSend={onSend}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      isReadOnly={isReadOnly}
      isRequired={isRequired}
      id={id}
    >
      <ChatMessageComposerLayout
        {...layoutProps}
        ref={ReactUtils.assingRefsBuilder([layoutRef])}
      >
        <ChatMessageComposerActionLayout
          {...actionLayoutProps}
          ref={ReactUtils.assingRefsBuilder([actionLayoutRef])}
        >
          {actions ?? actionLayoutProps?.children}
        </ChatMessageComposerActionLayout>
        <ChatMessageComposerTextarea
          {...textareaProps}
          ref={ReactUtils.assingRefsBuilder([textareaRef])}
        />
        {trailing}
        <ChatMessageComposerSendButton
          {...sendButtonProps}
          ref={ReactUtils.assingRefsBuilder([sendButtonRef])}
        />
      </ChatMessageComposerLayout>
    </ChatMessageComposerStateManager>
  )
}

export const ChatMessageComposer = Object.assign(ChatMessageComposerComponent, {
  StateManager: ChatMessageComposerStateManager,
  Layout: ChatMessageComposerLayout,
  ActionLayout: ChatMessageComposerActionLayout,
  Textarea: ChatMessageComposerTextarea,
  SendButton: ChatMessageComposerSendButton,
  Context: ChatMessageComposerContext,
  Provider: ChatMessageComposerContext.Provider,
  Consumer: ChatMessageComposerContext.Consumer,
})
