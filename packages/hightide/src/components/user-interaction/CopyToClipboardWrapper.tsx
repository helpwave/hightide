import { useState } from 'react'
import { clsx } from 'clsx'
import { writeToClipboard } from '@/src/utils/writeToClipboard'
import { CheckIcon, Copy } from 'lucide-react'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import { TooltipDisplay, TooltipRoot, TooltipTrigger, type TooltipProps } from './Tooltip'

export interface CopyToClipboardWrapperProps extends Omit<TooltipProps, 'tooltip'> {
  textToCopy: string,
}

/**
 * A Component for showing a tooltip when hovering over Content
 */
export const CopyToClipboardWrapper = ({
  children,
  textToCopy,
  isInitiallyShown = false,
  appearDelay = 0,
  disabled = false,
  containerClassName,
  alignment,
  isAnimated,
  ...props
}: CopyToClipboardWrapperProps) => {
  const translation = useHightideTranslation()
  const [isShowingConfirmation, setIsShowingConfirmation] = useState(false)

  return (
    <TooltipRoot
      isInitiallyShown={isInitiallyShown}
      appearDelay={appearDelay}
      disabled={disabled}
      onIsShownChange={isShown => {
        if(!isShown) {
          setIsShowingConfirmation(false)
        }
      }}
    >
      <TooltipTrigger>
        {({ props, callbackRef, disabled }) => (
          <div
            ref={callbackRef}
            className={clsx('w-fit hover:cursor-copy', containerClassName)}
            {...(disabled ? undefined : props)}
            onClick={() => {
              if(disabled) return
              props.onClick?.()
              writeToClipboard(textToCopy).catch(console.error)
              setIsShowingConfirmation(true)
            }}
          >
            {children}
          </div>
        )}
      </TooltipTrigger>
      <TooltipDisplay
        alignment={alignment}
        isAnimated={isAnimated}
        {...props}
      >
        {isShowingConfirmation ? (
          <div className="flex-row-1">
            <CheckIcon size={16} className="text-positive"/>
            {translation('copied')}
          </div>
        ) : (
          <div className="flex-row-1 text-description">
            <Copy size={16}/>
            {translation('clickToCopy')}
          </div>
        )}
      </TooltipDisplay>
    </TooltipRoot>
  )
}
