import type { TextareaHTMLAttributes } from 'react'
import { forwardRef, useCallback, useLayoutEffect, useRef } from 'react'
import clsx from 'clsx'
import { ReactUtils } from '@helpwave/hightide-utils/utils'
import { useWindowResizeObserver } from '../../../../hooks/useWindowResizeObserver'
import { PropsUtil } from '../../../../utils/propsUtil'
import { useChatMessageComposerContext } from './ChatMessageComposerContext'

const MAX_INPUT_LINES = 7

export type ChatMessageComposerTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export const ChatMessageComposerTextarea = forwardRef<HTMLTextAreaElement, ChatMessageComposerTextareaProps>(
  function ChatMessageComposerTextarea(props, forwardedRef) {
    const { state, dispatch, config } = useChatMessageComposerContext()
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const canEdit = !config.isDisabled && !config.isReadOnly

    const syncTextareaHeight = useCallback(() => {
      const textarea = textareaRef.current
      if (!textarea) {
        return
      }
      textarea.style.height = '0px'
      const lineHeight = Number.parseFloat(getComputedStyle(textarea).lineHeight)
      const maxHeight = Number.isFinite(lineHeight) ? lineHeight * MAX_INPUT_LINES : textarea.scrollHeight
      textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`
    }, [])

    useLayoutEffect(() => {
      syncTextareaHeight()
    }, [state.value, syncTextareaHeight])

    useWindowResizeObserver(syncTextareaHeight)

    return (
      <textarea
        {...props}
        ref={ReactUtils.assingRefsBuilder([textareaRef, forwardedRef])}
        className={clsx('chat-message-composer-input', props.className)}
        id={props.id ?? config.id}
        rows={props.rows ?? 1}
        value={state.value}
        disabled={config.isDisabled}
        readOnly={config.isReadOnly}
        required={config.isRequired}
        onChange={event => {
          props.onChange?.(event)
          if (!canEdit) {
            return
          }
          dispatch({ type: 'change', value: event.target.value })
        }}
        onBlur={event => {
          props.onBlur?.(event)
          dispatch({ type: 'blur' })
        }}
        onKeyDown={event => {
          props.onKeyDown?.(event)
          if (event.defaultPrevented) {
            return
          }
          if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            if (!canEdit) {
              return
            }
            const trimmed = state.value.trim()
            if (!trimmed) {
              return
            }
            dispatch({ type: 'send', value: trimmed })
          }
        }}
        {...PropsUtil.dataAttributes.interactionStates({
          invalid: config.isInvalid,
          disabled: config.isDisabled,
          readOnly: config.isReadOnly,
          required: config.isRequired,
        })}
        {...PropsUtil.aria.interactionStates({
          invalid: config.isInvalid,
          disabled: config.isDisabled,
          readOnly: config.isReadOnly,
          required: config.isRequired,
        })}
      />
    )
  }
)
