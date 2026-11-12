import type { ComponentRef, ReactNode, Ref } from 'react'
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
import { ChatMessageComposerStateManager, type ChatMessageComposerStateManagerProps } from './ChatMessageComposerStateManager'
import {
  ChatMessageComposerTextarea,
  type ChatMessageComposerTextareaProps
} from './ChatMessageComposerTextarea'

export type ChatMessageComposerProps = Omit<ChatMessageComposerStateManagerProps, 'children'> & {
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
  ...props
}: ChatMessageComposerProps) => {
  return (
    <ChatMessageComposerStateManager
      {...props}
      onSend={onSend}
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
