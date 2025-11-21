import type { CSSProperties, PropsWithChildren } from 'react'
import { useState } from 'react'
import { clsx } from 'clsx'
import { writeToClipboard } from '@/src/utils/writeToClipboard'
import { CheckIcon, Copy } from 'lucide-react'
import { useTranslation } from '@/src/i18n/useTranslation'

type Position = 'top' | 'bottom' | 'left' | 'right'

export type CopyToClipboardWrapperProps = PropsWithChildren<{
  textToCopy: string,
  /**
   * Class names of additional styling properties for the tooltip
   */
  tooltipClassName?: string,
  /**
   * Class names of additional styling properties for the container from which the tooltip will be created
   */
  containerClassName?: string,
  position?: Position,
  zIndex?: number,
}>

/**
 * A Component for showing a tooltip when hovering over Content
 * @param tooltip The tooltip to show can be a text or any ReactNode
 * @param children The Content for which the tooltip should be created
 * @param tooltipClassName Additional ClassNames for the Container of the tooltip
 * @param containerClassName Additional ClassNames for the Container holding the content
 * @param position The direction of the tooltip relative to the Container
 * @param zIndex The z Index of the tooltip (you may require this when stacking modal)
 * @constructor
 */
export const CopyToClipboardWrapper = ({
                                         children,
                                         textToCopy,
                                         tooltipClassName = '',
                                         containerClassName = '',
                                         position = 'bottom',
                                         zIndex = 10,
                                       }: CopyToClipboardWrapperProps) => {
  const translation = useTranslation()
  const [isShowingIndication, setIsShowingIndication] = useState(false)
  const [isShowingConfirmation, setIsShowingConfirmation] = useState(false)

  const positionClasses = {
    top: `bottom-full left-1/2 -translate-x-1/2 mb-[6px]`,
    bottom: `top-full left-1/2 -translate-x-1/2 mt-[6px]`,
    left: `right-full top-1/2 -translate-y-1/2 mr-[6px]`,
    right: `left-full top-1/2 -translate-y-1/2 ml-[6px]`
  }

  const triangleSize = 6
  const triangleClasses = {
    top: `top-full left-1/2 -translate-x-1/2 border-t-tooltip-background border-l-transparent border-r-transparent`,
    bottom: `bottom-full left-1/2 -translate-x-1/2 border-b-tooltip-background border-l-transparent border-r-transparent`,
    left: `left-full top-1/2 -translate-y-1/2 border-l-tooltip-background border-t-transparent border-b-transparent`,
    right: `right-full top-1/2 -translate-y-1/2 border-r-tooltip-background border-t-transparent border-b-transparent`
  }

  const triangleStyle: Record<Position, CSSProperties> = {
    top: { borderWidth: `${triangleSize}px ${triangleSize}px 0 ${triangleSize}px` },
    bottom: { borderWidth: `0 ${triangleSize}px ${triangleSize}px ${triangleSize}px` },
    left: { borderWidth: `${triangleSize}px 0 ${triangleSize}px ${triangleSize}px` },
    right: { borderWidth: `${triangleSize}px ${triangleSize}px ${triangleSize}px 0` }
  }

  return (
    <div
      className={clsx('relative inline-block cursor-copy', containerClassName)}
      onMouseEnter={() => {
        setIsShowingIndication(true)
      }}
      onMouseLeave={() => {
        setIsShowingIndication(false)
        setIsShowingConfirmation(false)
      }}
      onClick={() => {
        writeToClipboard(textToCopy).catch(console.error)
        setIsShowingIndication(false)
        setIsShowingConfirmation(true)
      }}
    >
      {children}
      <div
        className={clsx(
          `absolute text-xs font-semibold text-tooltip-text px-2 py-1 rounded whitespace-nowrap
           shadow-around-md bg-tooltip-background cursor-default pointer-events-none`,
          'transition-opacity duration-200',
          positionClasses[position],
          tooltipClassName
        )}
        style={{
          zIndex,
          opacity: (isShowingIndication || isShowingConfirmation) ? 1 : 0,
        }}
      >
        {isShowingConfirmation && (
          <div className="flex-row-1">
            <CheckIcon size={16} className="text-positive"/>
            {translation('copied')}
          </div>
        )}
        {isShowingIndication && (
          <div className="flex-row-1 text-description">
            <Copy size={16}/>
            {translation('clickToCopy')}
          </div>
        )}
        <div
          className={clsx(`absolute w-0 h-0`, triangleClasses[position])}
          style={{ ...triangleStyle[position], zIndex: zIndex + 1 }}
        />
      </div>
    </div>
  )
}
