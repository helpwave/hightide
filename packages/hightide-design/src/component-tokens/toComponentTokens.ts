import type { HightideSemanticTokens } from '../semantic-tokens/semanticTokens'
import {
  toAvatarGroupTokens,
  toAvatarTokens,
  toButtonTokens,
  toCheckboxTokens,
  toChipTokens,
  toIconButtonTokens,
  toIconTokens,
  toInputTokens,
  toMenuTokens,
  toProgressIndicatorTokens,
  toSwitchTokens
} from './components'
import type { HightideComponentTokens } from './componentTokens'

export type ToHightideComponentTokensArgs = {
  semanticTokens: HightideSemanticTokens,
}

export const toHightideComponentTokens = ({
  semanticTokens,
}: ToHightideComponentTokensArgs): HightideComponentTokens => ({
  button: toButtonTokens(semanticTokens),
  iconButton: toIconButtonTokens(semanticTokens),
  chip: toChipTokens(semanticTokens),
  input: toInputTokens(semanticTokens),
  checkbox: toCheckboxTokens(semanticTokens),
  menu: toMenuTokens(semanticTokens),
  progressIndicator: toProgressIndicatorTokens(semanticTokens),
  switch: toSwitchTokens(semanticTokens),
  icon: toIconTokens(semanticTokens),
  avatar: toAvatarTokens(semanticTokens),
  avatarGroup: toAvatarGroupTokens(semanticTokens),
})
