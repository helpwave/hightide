import type { EnumUtilsType } from '@helpwave/hightide-utils/utils'

const chatMessageStatusValues = ['sent', 'sending', 'received', 'read'] as const
export type ChatMessageStatus = (typeof chatMessageStatusValues)[number]
const allowedChatMessageStatusValues: ReadonlySet<string> = new Set(
  chatMessageStatusValues
)
function isChatMessageStatusValue(value: unknown): value is ChatMessageStatus {
  if (typeof value !== 'string') {
    return false
  }
  return allowedChatMessageStatusValues.has(value)
}
export const ChatMessageStatusUtils: EnumUtilsType<ChatMessageStatus> = {
  values: chatMessageStatusValues,
  set: allowedChatMessageStatusValues,
  isValue: isChatMessageStatusValue,
}
