import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { action } from 'storybook/actions'
import { useControllableStateStore } from '@helpwave/hightide-utils/hooks'
import { Camera, Paperclip } from 'lucide-react'
import {
  ChatMessageComposer,
  type ChatMessageComposerState
} from '../../../src/components/chat/data-input/ChatMessageComposer'
import { IconButton } from '../../../src/components/interaction/IconButton'

const meta: Meta<typeof ChatMessageComposer> = {
  component: ChatMessageComposer,
}

export default meta
type Story = StoryObj<typeof meta>

const composerActions = (
  <>
    <IconButton
      tooltip="Kamera"
      color="neutral"
      variant="foreground"
      onClick={action('onCamera')}
    >
      <Camera/>
    </IconButton>
    <IconButton
      tooltip="Anhang"
      color="neutral"
      variant="foreground"
      onClick={action('onAttachment')}
    >
      <Paperclip/>
    </IconButton>
  </>
)

export const chatMessageComposer: Story = {
  args: {
    isDisabled: false,
    onSend: action('onSend'),
    textareaProps: {
      placeholder: 'Nachricht an Dr. med. Sophie Vogt schreiben',
    },
    sendButtonProps: {
      tooltip: 'Senden',
    },
    actions: composerActions,
  },
  render: (args) => (
    <div className="w-150 max-w-full">
      <ChatMessageComposer {...args}/>
    </div>
  ),
}

export const withoutActions: Story = {
  args: {
    onSend: action('onSend'),
    textareaProps: {
      placeholder: 'Nachricht schreiben',
    },
    sendButtonProps: {
      tooltip: 'Senden',
    },
  },
  render: (args) => (
    <div className="w-150 max-w-full">
      <ChatMessageComposer {...args}/>
    </div>
  ),
}

export const composed: Story = {
  args: {
    onSend: action('onSend'),
    onStateEvent: action('onStateEvent'),
    textareaProps: {
      placeholder: 'Nachricht schreiben',
    },
    sendButtonProps: {
      tooltip: 'Senden',
    },
    actions: composerActions,
  },
  render: function Composed(args) {
    const [state, setState] = useState<ChatMessageComposerState>({
      value: args.initialValue ?? '',
    })
    const controlled = useControllableStateStore({
      state,
      onStateChange: (next) => {
        action('onStateChange')(next)
        setState(next)
      },
    })

    return (
      <div className="w-150 max-w-full">
        <ChatMessageComposer.StateManager
          state={controlled.store}
          onStateChange={controlled.onStateChange}
          onStateEvent={args.onStateEvent}
          onSend={args.onSend}
          isInvalid={args.isInvalid}
          isDisabled={args.isDisabled}
          isReadOnly={args.isReadOnly}
          isRequired={args.isRequired}
          id={args.id}
        >
          <ChatMessageComposer.Layout {...args.layoutProps}>
            <ChatMessageComposer.ActionLayout {...args.actionLayoutProps}>
              {args.actions}
            </ChatMessageComposer.ActionLayout>
            <ChatMessageComposer.Textarea {...args.textareaProps}/>
            {args.trailing}
            <ChatMessageComposer.SendButton {...args.sendButtonProps}/>
          </ChatMessageComposer.Layout>
        </ChatMessageComposer.StateManager>
      </div>
    )
  },
}
