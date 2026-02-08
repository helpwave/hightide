import type { CSSProperties, SVGProps } from 'react'
import { clsx } from 'clsx'

export type HelpwaveProps = SVGProps<SVGSVGElement> & {
  color?: string,
  animate?: 'none' | 'loading' | 'pulse' | 'bounce',
  size?: 'sm' | 'md' | 'lg',
  animationDuration?: number,
}

/**
 * The helpwave loading spinner based on the svg logo.
 */
export const HelpwaveLogo = ({
  color = 'currentColor',
  size,
  animate = 'none',
  animationDuration = 1.7,
  ...props
}: HelpwaveProps) => {
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
      viewBox="0 0 1024 1024"
      fill="none"
      strokeLinecap="round"
      strokeWidth={65}
      className={clsx({
        'max-w-16 max-h-16': size === 'lg',
        'max-w-12 max-h-12': size === 'md',
        'max-w-8 max-h-8': size === 'sm',
      }, props.className)}
    >
      <g className={clsx(svgAnimationKey)}>
        <path className={clsx({ 'animate-wave-big-left-up': isLoadingAnimation })}
          d="M146 644.214C146 498.088 253.381 379.629 385.843 379.629" stroke={color} strokeDasharray="1000"/>
        <path className={clsx({ 'animate-wave-big-right-down': isLoadingAnimation })}
          d="M625.686 645.272C493.224 645.272 385.843 526.813 385.843 380.687" stroke={color}
          strokeDasharray="1000"/>
        <path className={clsx({ 'animate-wave-small-left-up': isLoadingAnimation })}
          d="M533.585 613.522C533.585 508.895 610.47 424.079 705.312 424.079" stroke={color}
          strokeDasharray="1000"/>
        <path className={clsx({ 'animate-wave-small-right-down': isLoadingAnimation })}
          d="M878 615.639C782.628 615.639 705.313 530.822 705.313 426.196" stroke={color}
          strokeDasharray="1000"/>
      </g>
    </svg>
  )
}
