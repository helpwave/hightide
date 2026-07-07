/**
 * @jest-environment jsdom
 */
import { useState } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { LocaleContext } from '../../src/global-contexts/LocaleContext'
import { ChatMessageBubble } from '../../src/components/chat/ChatMessageBubble'
import { ChatMessageCard } from '../../src/components/chat/ChatMessageCard'
import { ChatAttachmentCard } from '../../src/components/chat/ChatAttachmentCard'
import { ChatComposer } from '../../src/components/chat/ChatComposer'
import { ChatQuickReplyChip } from '../../src/components/chat/ChatQuickReplyChip'
import { ChatSystemLine } from '../../src/components/chat/ChatSystemLine'
import { ChatDateDivider } from '../../src/components/chat/ChatDateDivider'
import { ChatConversationRow } from '../../src/components/chat/ChatConversationRow'
import { ChatConversationList } from '../../src/components/chat/ChatConversationList'
import { ChatThreadHeader } from '../../src/components/chat/ChatThreadHeader'
import { ChatLayout, ChatThread } from '../../src/components/chat/ChatLayout'
import { ChatMessageList } from '../../src/components/chat/ChatMessageList'

describe('ChatMessageBubble', () => {
  test('renders content, timestamp and direction', () => {
    const { container } = render(
      <ChatMessageBubble direction="outgoing" timestamp="09:24">Hello</ChatMessageBubble>
    )
    expect(screen.getByText('Hello')).toBeTruthy()
    expect(screen.getByText('09:24')).toBeTruthy()
    expect(container.querySelector('.chat-message-bubble-container')!.getAttribute('data-direction')).toBe('outgoing')
    expect(container.querySelector('.chat-message-bubble')!.getAttribute('data-direction')).toBe('outgoing')
  })

  test('defaults to incoming and hides receipt when not provided', () => {
    const { container } = render(<ChatMessageBubble>Hi</ChatMessageBubble>)
    expect(container.querySelector('.chat-message-bubble')!.getAttribute('data-direction')).toBe('incoming')
    expect(container.querySelector('.chat-message-bubble-receipt')).toBeNull()
  })

  test('shows the read receipt when provided', () => {
    const { container } = render(
      <ChatMessageBubble readReceipt="Gelesen">Hi</ChatMessageBubble>
    )
    expect(screen.getByText('Gelesen')).toBeTruthy()
    expect(container.querySelector('.chat-message-bubble-receipt-icon')).toBeTruthy()
  })

  test('forwards className', () => {
    const { container } = render(<ChatMessageBubble className="custom">Hi</ChatMessageBubble>)
    expect(container.querySelector('.chat-message-bubble-container')!.classList.contains('custom')).toBe(true)
  })
})

describe('ChatMessageCard', () => {
  test('renders header, body, badge and actions', () => {
    const onAccept = jest.fn()
    const { container } = render(
      <ChatMessageCard
        title="Terminvorschlag"
        subtitle="30 Min"
        badge={<span>AUSSTEHEND</span>}
        direction="outgoing"
        color="warning"
        actions={<button onClick={onAccept}>Zusagen</button>}
      >
        <span>Mi. 8. Juli 2026</span>
      </ChatMessageCard>
    )
    expect(screen.getByText('Terminvorschlag')).toBeTruthy()
    expect(screen.getByText('30 Min')).toBeTruthy()
    expect(screen.getByText('AUSSTEHEND')).toBeTruthy()
    expect(screen.getByText('Mi. 8. Juli 2026')).toBeTruthy()
    const card = container.querySelector('.chat-message-card')!
    expect(card.getAttribute('data-direction')).toBe('outgoing')
    expect(card.getAttribute('data-color')).toBe('warning')
    fireEvent.click(screen.getByText('Zusagen'))
    expect(onAccept).toHaveBeenCalled()
  })

  test('omits optional sections', () => {
    const { container } = render(<ChatMessageCard title="Rezept"/>)
    expect(container.querySelector('.chat-message-card-body')).toBeNull()
    expect(container.querySelector('.chat-message-card-actions')).toBeNull()
    expect(container.querySelector('.chat-message-card-subtitle')).toBeNull()
    expect(container.querySelector('.chat-message-card-badge')).toBeNull()
    expect(container.querySelector('.chat-message-card-icon')).toBeNull()
  })
})

describe('ChatAttachmentCard', () => {
  test('renders name and metadata', () => {
    render(<ChatAttachmentCard name="Befund.pdf" metadata="PDF · 196 KB"/>)
    expect(screen.getByText('Befund.pdf')).toBeTruthy()
    expect(screen.getByText('PDF · 196 KB')).toBeTruthy()
  })

  test('shows the download button only when onDownload is provided', () => {
    const onDownload = jest.fn()
    const { rerender } = render(<ChatAttachmentCard name="Befund.pdf"/>)
    expect(screen.queryByRole('button')).toBeNull()
    rerender(<ChatAttachmentCard name="Befund.pdf" downloadLabel="Herunterladen" onDownload={onDownload}/>)
    fireEvent.click(screen.getByRole('button'))
    expect(onDownload).toHaveBeenCalled()
  })
})

describe('ChatComposer', () => {
  test('sends the trimmed value on enter and clears the input', () => {
    const onSend = jest.fn()
    render(<ChatComposer onSend={onSend} placeholder="Nachricht"/>)
    const input = screen.getByPlaceholderText('Nachricht') as HTMLInputElement
    fireEvent.change(input, { target: { value: '  Hallo  ' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onSend).toHaveBeenCalledWith('Hallo')
    expect(input.value).toBe('')
  })

  test('does not send empty values', () => {
    const onSend = jest.fn()
    render(<ChatComposer onSend={onSend} placeholder="Nachricht"/>)
    const input = screen.getByPlaceholderText('Nachricht')
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onSend).not.toHaveBeenCalled()
  })

  test('sends via the send button', () => {
    const onSend = jest.fn()
    render(<ChatComposer onSend={onSend} placeholder="Nachricht"/>)
    fireEvent.change(screen.getByPlaceholderText('Nachricht'), { target: { value: 'Hi' } })
    fireEvent.click(screen.getAllByRole('button').at(-1)!)
    expect(onSend).toHaveBeenCalledWith('Hi')
  })

  test('renders camera and attachment buttons only when handlers exist', () => {
    const onCamera = jest.fn()
    const onAttachment = jest.fn()
    const { rerender } = render(<ChatComposer onSend={() => {}} placeholder="Nachricht"/>)
    expect(screen.getAllByRole('button')).toHaveLength(1)
    rerender(
      <ChatComposer
        onSend={() => {}}
        placeholder="Nachricht"
        onCamera={onCamera}
        onAttachment={onAttachment}
      />
    )
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(3)
    fireEvent.click(buttons[0]!)
    expect(onCamera).toHaveBeenCalled()
    fireEvent.click(buttons[1]!)
    expect(onAttachment).toHaveBeenCalled()
  })

  test('supports controlled usage', () => {
    const onValueChange = jest.fn()
    const Wrapper = () => {
      const [value, setValue] = useState('start')
      return (
        <ChatComposer
          value={value}
          onValueChange={(next) => {
            onValueChange(next)
            setValue(next)
          }}
          onSend={() => {}}
          placeholder="Nachricht"
        />
      )
    }
    render(<Wrapper/>)
    const input = screen.getByPlaceholderText('Nachricht') as HTMLInputElement
    expect(input.value).toBe('start')
    fireEvent.change(input, { target: { value: 'changed' } })
    expect(onValueChange).toHaveBeenCalledWith('changed')
    expect(input.value).toBe('changed')
  })
})

describe('ChatQuickReplyChip', () => {
  test('sets the active state and handles clicks', () => {
    const onClick = jest.fn()
    const { rerender } = render(<ChatQuickReplyChip onClick={onClick}>Termin</ChatQuickReplyChip>)
    const chip = screen.getByRole('button')
    expect(chip.getAttribute('data-active')).toBeNull()
    fireEvent.click(chip)
    expect(onClick).toHaveBeenCalled()
    rerender(<ChatQuickReplyChip isActive={true}>Termin</ChatQuickReplyChip>)
    expect(chip.getAttribute('data-active')).toBe('')
  })
})

describe('ChatSystemLine', () => {
  test('renders content with color', () => {
    const { container } = render(<ChatSystemLine color="positive">Termin bestätigt</ChatSystemLine>)
    expect(screen.getByText('Termin bestätigt')).toBeTruthy()
    expect(container.querySelector('.chat-system-line')!.getAttribute('data-color')).toBe('positive')
  })
})

describe('ChatDateDivider', () => {
  test('renders content', () => {
    render(<ChatDateDivider>Heute</ChatDateDivider>)
    expect(screen.getByText('Heute')).toBeTruthy()
  })
})

describe('ChatConversationRow', () => {
  test('renders row data and handles clicks', () => {
    const onClick = jest.fn()
    render(
      <ChatConversationRow
        avatar={{ name: 'Jonas Wellermann' }}
        title="Jonas Wellermann"
        timestamp="14:22"
        preview="Bis Mittwoch!"
        unreadCount={2}
        isUnread={true}
        onClick={onClick}
      />
    )
    expect(screen.getByText('Jonas Wellermann')).toBeTruthy()
    expect(screen.getByText('14:22')).toBeTruthy()
    expect(screen.getByText('Bis Mittwoch!')).toBeTruthy()
    expect(screen.getByText('2')).toBeTruthy()
    const row = screen.getByRole('button')
    expect(row.getAttribute('data-unread')).toBe('')
    expect(row.getAttribute('data-selected')).toBeNull()
    fireEvent.click(row)
    expect(onClick).toHaveBeenCalled()
  })

  test('shows the sent indicator and selection state', () => {
    const { container } = render(
      <ChatConversationRow
        avatar={{ name: 'Miriam Otte' }}
        title="Miriam Otte"
        hasSentIndicator={true}
        isSelected={true}
      />
    )
    expect(container.querySelector('.chat-conversation-row-sent-indicator')).toBeTruthy()
    expect(screen.getByRole('button').getAttribute('data-selected')).toBe('')
    expect(container.querySelector('.chat-conversation-row-unread-count')).toBeNull()
  })
})

describe('ChatConversationList', () => {
  test('renders no header without header content', () => {
    const { container } = render(
      <ChatConversationList>
        <span>row</span>
      </ChatConversationList>
    )
    expect(container.querySelector('.chat-conversation-list-header')).toBeNull()
    expect(screen.getByText('row')).toBeTruthy()
  })

  test('renders title, create button and search when configured', () => {
    const onCreate = jest.fn()
    const onSearch = jest.fn()
    render(
      <LocaleContext.Provider value={{ locale: 'de-DE', setLocale: () => {} }}>
        <ChatConversationList
          title="Chats"
          onCreate={onCreate}
          hasSearch={true}
          searchPlaceholder="Patient suchen"
          onSearch={onSearch}
        />
      </LocaleContext.Provider>
    )
    expect(screen.getByText('Chats')).toBeTruthy()
    const search = screen.getByPlaceholderText('Patient suchen')
    fireEvent.change(search, { target: { value: 'Otte' } })
    expect(onSearch).toHaveBeenCalledWith('Otte')
    fireEvent.click(screen.getAllByRole('button')[0]!)
    expect(onCreate).toHaveBeenCalled()
  })

  test('hides the search bar when hasSearch is false', () => {
    render(<ChatConversationList title="Chats"/>)
    expect(screen.queryByRole('textbox')).toBeNull()
  })
})

describe('ChatThreadHeader', () => {
  test('renders title and subtitle without action buttons by default', () => {
    render(<ChatThreadHeader title="Jonas Wellermann" subtitle="GKV"/>)
    expect(screen.getByText('Jonas Wellermann')).toBeTruthy()
    expect(screen.getByText('GKV')).toBeTruthy()
    expect(screen.queryByRole('button')).toBeNull()
  })

  test('renders back, call and add-contact buttons only when handlers exist', () => {
    const onBack = jest.fn()
    const onCall = jest.fn()
    const onAddContact = jest.fn()
    render(
      <ChatThreadHeader
        title="Jonas Wellermann"
        onBack={onBack}
        onCall={onCall}
        onAddContact={onAddContact}
      />
    )
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(3)
    fireEvent.click(buttons[0]!)
    expect(onBack).toHaveBeenCalled()
    fireEvent.click(buttons[1]!)
    expect(onCall).toHaveBeenCalled()
    fireEvent.click(buttons[2]!)
    expect(onAddContact).toHaveBeenCalled()
  })
})

describe('ChatLayout', () => {
  test('renders both panes with state attributes', () => {
    const { container } = render(
      <ChatLayout conversationList={<span>list</span>} isConversationOpen={true} listPosition="right">
        <span>thread</span>
      </ChatLayout>
    )
    const layout = container.querySelector('.chat-layout')!
    expect(layout.getAttribute('data-conversation-open')).toBe('')
    expect(layout.getAttribute('data-list-position')).toBe('right')
    expect(screen.getByText('list')).toBeTruthy()
    expect(screen.getByText('thread')).toBeTruthy()
  })

  test('defaults to left position and closed conversation', () => {
    const { container } = render(
      <ChatLayout conversationList={<span>list</span>}/>
    )
    const layout = container.querySelector('.chat-layout')!
    expect(layout.getAttribute('data-conversation-open')).toBeNull()
    expect(layout.getAttribute('data-list-position')).toBe('left')
  })
})

describe('ChatThread', () => {
  test('renders header, content and footer in order', () => {
    const { container } = render(
      <ChatThread header={<span>header</span>} footer={<span>footer</span>}>
        <span>content</span>
      </ChatThread>
    )
    const texts = Array.from(container.querySelector('.chat-thread')!.children).map(child => child.textContent)
    expect(texts).toEqual(['header', 'content', 'footer'])
  })
})

describe('ChatMessageList', () => {
  test('renders children', () => {
    render(
      <ChatMessageList autoScroll={false}>
        <span>message</span>
      </ChatMessageList>
    )
    expect(screen.getByText('message')).toBeTruthy()
  })
})
