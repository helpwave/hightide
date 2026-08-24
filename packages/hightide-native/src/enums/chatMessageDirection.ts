import type { EnumUtilsType } from '@helpwave/hightide-utils/utils'

const chatMessageDirectionValues = ['incoming', 'outgoing'] as const
export type ChatMessageDirection = (typeof chatMessageDirectionValues)[number]
const allowedChatMessageDirectionValues: ReadonlySet<string> = new Set(
  chatMessageDirectionValues
)
function isChatMessageDirectionValue(value: unknown): value is ChatMessageDirection {
  if (typeof value !== 'string') {
    return false
  }
  return allowedChatMessageDirectionValues.has(value)
}
export const ChatMessageDirectionUtils: EnumUtilsType<ChatMessageDirection> = {
  values: chatMessageDirectionValues,
  set: allowedChatMessageDirectionValues,
  isValue: isChatMessageDirectionValue,
}
