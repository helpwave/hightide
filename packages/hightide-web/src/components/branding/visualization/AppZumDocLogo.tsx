import type { CSSProperties, SVGProps } from 'react'
import { useId } from 'react'
import { clsx } from 'clsx'

const backStrokePath = 'M205.771 256C156.192 256 116 216.319 116 167.369V74.4951C116 33.3527 149.781 0.000152588 191.453 0C233.125 0 266.907 33.3526 266.907 74.4951V106.617C266.907 106.715 266.923 106.748 266.929 106.763C266.942 106.793 266.97 106.842 267.023 106.895C267.077 106.947 267.127 106.977 267.157 106.989C267.172 106.995 267.207 107.01 267.306 107.01H296.547C338.218 107.01 372 140.363 372 181.505C372 222.647 338.219 256 296.547 256H277V232.396H296.547C325.014 232.396 348.092 209.611 348.092 181.505C348.092 153.399 325.014 130.615 296.547 130.615H267.306C253.881 130.615 242.998 119.871 242.998 106.617V74.4951C242.998 46.3894 219.92 23.6055 191.453 23.6055C162.986 23.6056 139.909 46.3895 139.909 74.4951V167.369C139.909 203.282 169.397 232.396 205.771 232.396H211V256H205.771Z'

const frontStrokePath = 'M 166.229 116 C 215.808 116 256 155.681 256 204.631 V 297.505 C 256 338.647 222.219 372 180.547 372 C 138.875 372 105.093 338.647 105.093 297.505 V 265.383 C 105.093 265.285 105.077 265.252 105.071 265.237 C 105.058 265.207 105.03 265.158 104.977 265.105 C 104.923 265.053 104.873 265.023 104.843 265.011 C 104.828 265.005 104.793 264.99 104.694 264.99 H 75.4531 C 33.7815 264.99 0.000218873 231.637 0 190.495 C 0.00000364306 149.353 33.7814 116 75.4531 116 H 95 V 139.604 H 75.4531 C 46.9859 139.604 23.9082 162.389 23.9082 190.495 C 23.9084 218.601 46.986 241.385 75.4531 241.385 H 104.694 C 118.119 241.385 129.002 252.129 129.002 265.383 V 297.505 C 129.002 325.611 152.08 348.395 180.547 348.395 C 209.014 348.394 232.091 325.611 232.091 297.505 V 204.631 C 232.091 168.718 202.603 139.604 166.229 139.604 H 161 V 116 H 166.229 Z'

export type AppZumDocLogoProps = SVGProps<SVGSVGElement> & {
  frontColor?: string,
  backColor?: string,
  animate?: 'none' | 'loading' | 'pulse' | 'bounce',
  size?: 'sm' | 'md' | 'lg',
  animationDuration?: number,
}

export const AppZumDocLogo = ({
  frontColor = '#095763',
  backColor = '#4E97A2',
  animate = 'none',
  size,
  animationDuration = 1.7,
  ...props
}: AppZumDocLogoProps) => {
  const id = useId()
  const isLoadingAnimation = animate === 'loading'
  let svgAnimationKey = ''

  if (animate === 'pulse') {
    svgAnimationKey = 'animate-pulse'
  } else if (animate === 'bounce') {
    svgAnimationKey = 'animate-bounce'
  }

  const style = animationDuration !== undefined && isLoadingAnimation
    ? { ...props.style, '--helpwave-loading-duration': `${animationDuration}s` } as CSSProperties
    : props.style

  return (
    <svg
      {...props}
      style={style}
      viewBox="0 0 372 372"
      fill="none"
      className={clsx({
        'max-w-16 max-h-16 min-w-16 min-h-16': size === 'lg',
        'max-w-12 max-h-12 min-w-12 min-h-12': size === 'md',
        'max-w-8 max-h-8 min-w-8 min-h-8': size === 'sm',
      }, props.className)}
    >
      <g className={clsx(svgAnimationKey)}>
        {(
          <>
            <g clipPath={`url(#${id}-back)`}>
              <path
                className="animate-azd-fill-back"
                d={backStrokePath}
                fill={backColor}
                strokeWidth={7}
                strokeLinecap="round"
                pathLength={1000}
                strokeDasharray="1000 2000"
              />
            </g>
            <g clipPath={`url(#${id}-front)`}>
              <path
                className="animate-azd-fill-front"
                d={frontStrokePath}
                fill={frontColor}
                strokeWidth={7}
                strokeLinecap="round"
                pathLength={1000}
                strokeDasharray="1000 2000"
              />
            </g>
          </>
        )}
      </g>
    </svg>
  )
}
