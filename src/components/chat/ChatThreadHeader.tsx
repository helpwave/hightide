import type { HTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'
import { ChevronLeft, Phone, UserRoundPlus } from 'lucide-react'
import type { AvatarWithStatusProps } from '../display-and-visualization/Avatar'
import { AvatarWithStatus } from '../display-and-visualization/Avatar'
import { IconButton } from '../user-interaction/IconButton'

export type ChatThreadHeaderProps = HTMLAttributes<HTMLDivElement> & {
  avatar?: AvatarWithStatusProps,
  title: ReactNode,
  subtitle?: ReactNode,
  onBack?: () => void,
  backLabel?: string,
  onCall?: () => void,
  callLabel?: string,
  onAddContact?: () => void,
  addContactLabel?: string,
  leading?: ReactNode,
  trailing?: ReactNode,
}

export const ChatThreadHeader = ({
  avatar,
  title,
  subtitle,
  onBack,
  backLabel = 'Back',
  onCall,
  callLabel = 'Call',
  onAddContact,
  addContactLabel = 'Add to contacts',
  leading,
  trailing,
  ...props
}: ChatThreadHeaderProps) => {
  return (
    <div {...props} className={clsx('chat-thread-header', props.className)}>
      {onBack && (
        <IconButton
          tooltip={backLabel}
          size="sm"
          color="neutral"
          coloringStyle="text"
          className="chat-thread-header-back"
          onClick={onBack}
        >
          <ChevronLeft/>
        </IconButton>
      )}
      {leading}
      {avatar && (<AvatarWithStatus size="md" {...avatar}/>)}
      <span className="chat-thread-header-info">
        <span className="chat-thread-header-title">{title}</span>
        {subtitle && (
          <span className="chat-thread-header-subtitle">{subtitle}</span>
        )}
      </span>
      {(onCall || onAddContact || trailing) && (
        <span className="chat-thread-header-trailing">
          {onCall && (
            <IconButton
              tooltip={callLabel}
              size="sm"
              color="neutral"
              coloringStyle="text"
              onClick={onCall}
            >
              <Phone/>
            </IconButton>
          )}
          {onAddContact && (
            <IconButton
              tooltip={addContactLabel}
              size="sm"
              color="neutral"
              coloringStyle="text"
              onClick={onAddContact}
            >
              <UserRoundPlus/>
            </IconButton>
          )}
          {trailing}
        </span>
      )}
    </div>
  )
}
