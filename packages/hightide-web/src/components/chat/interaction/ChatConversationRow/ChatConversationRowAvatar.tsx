import { forwardRef } from 'react'
import { Avatar } from '../../../visualization/Avatar/Avatar'
import type { AvatarProps } from '../../../visualization/Avatar/AvatarComponent'

export type ChatConversationRowAvatarProps = AvatarProps

export const ChatConversationRowAvatar = forwardRef<HTMLSpanElement, ChatConversationRowAvatarProps>(
  function ChatConversationRowAvatar(props, forwardedRef) {
    return (
      <span ref={forwardedRef} className="contents">
        <Avatar
          size="md"
          {...props}
          hasStatusIndicator={props.hasStatusIndicator ?? true}
        />
      </span>
    )
  }
)
