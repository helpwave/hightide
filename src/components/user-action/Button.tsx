import type { ButtonHTMLAttributes, PropsWithChildren, ReactNode } from 'react'
import { forwardRef } from 'react'
import clsx from 'clsx'


export const ButtonColorUtil = {
  solid: ['primary', 'secondary', 'tertiary', 'positive', 'warning', 'negative', 'neutral'] as const,
  text: ['primary', 'negative', 'neutral'] as const,
  outline: ['primary'] as const,
}

export const IconButtonUtil = {
  icon: [...ButtonColorUtil.solid, 'transparent'] as const,
}


/**
 * The allowed colors for the SolidButton and IconButton
 */
export type SolidButtonColor = typeof ButtonColorUtil.solid[number]
/**
 * The allowed colors for the OutlineButton
 */
export type OutlineButtonColor = typeof ButtonColorUtil.outline[number]
/**
 * The allowed colors for the TextButton
 */
export type TextButtonColor = typeof ButtonColorUtil.text[number]
/**
 * The allowed colors for the IconButton
 */
export type IconButtonColor = typeof IconButtonUtil.icon[number]


/**
 * The different sizes for a button
 */
type ButtonSizes = 'small' | 'medium' | 'large'

type IconButtonSize = 'tiny' | 'small' | 'medium' | 'large'

/**
 * The shard properties between all button types
 */
export type ButtonProps = PropsWithChildren<{
  /**
   * @default 'medium'
   */
  size?: ButtonSizes,
}> & ButtonHTMLAttributes<Element>

const paddingMapping: Record<ButtonSizes, string> = {
  small: 'btn-sm',
  medium: 'btn-md',
  large: 'btn-lg'
}

const iconPaddingMapping: Record<IconButtonSize, string> = {
  tiny: 'icon-btn-xs',
  small: 'icon-btn-sm',
  medium: 'icon-btn-md',
  large: 'icon-btn-lg'
}

export const ButtonUtil = {
  paddingMapping,
  iconPaddingMapping
}

type ButtonWithIconsProps = ButtonProps & {
  startIcon?: ReactNode,
  endIcon?: ReactNode,
}

export type SolidButtonProps = ButtonWithIconsProps & {
  color?: SolidButtonColor,
}

export type OutlineButtonProps = ButtonWithIconsProps & {
  color?: OutlineButtonColor,
}

export type TextButtonProps = ButtonWithIconsProps & {
  color?: TextButtonColor,
  coloredHoverBackground?: boolean,
}

/**
 * The shard properties between all button types
 */
export type IconButtonProps = PropsWithChildren<{
  /**
   * @default 'medium'
   */
  size?: IconButtonSize,
  color?: IconButtonColor,
}> & ButtonHTMLAttributes<Element>

/**
 * A button with a solid background and different sizes
 */
const SolidButton = forwardRef<HTMLButtonElement, SolidButtonProps>(function SolidButton({
                                                                                           children,
                                                                                           color = 'primary',
                                                                                           size = 'medium',
                                                                                           startIcon,
                                                                                           endIcon,
                                                                                           onClick,
                                                                                           className,
                                                                                           ...restProps
                                                                                         }, ref) {
  const colorClasses = {
    primary: 'not-disabled:bg-button-solid-primary-background not-disabled:text-button-solid-primary-text',
    secondary: 'not-disabled:bg-button-solid-secondary-background not-disabled:text-button-solid-secondary-text',
    tertiary: 'not-disabled:bg-button-solid-tertiary-background not-disabled:text-button-solid-tertiary-text',
    positive: 'not-disabled:bg-button-solid-positive-background not-disabled:text-button-solid-positive-text',
    warning: 'not-disabled:bg-button-solid-warning-background not-disabled:text-button-solid-warning-text',
    negative: 'not-disabled:bg-button-solid-negative-background not-disabled:text-button-solid-negative-text',
    neutral: 'not-disabled:bg-button-solid-neutral-background not-disabled:text-button-solid-neutral-text',
  }[color]

  const iconColorClasses = {
    primary: 'not-group-disabled:text-button-solid-primary-icon',
    secondary: 'not-group-disabled:text-button-solid-secondary-icon',
    tertiary: 'not-group-disabled:text-button-solid-tertiary-icon',
    positive: 'not-group-disabled:text-button-solid-positive-icon',
    warning: 'not-group-disabled:text-button-solid-warning-icon',
    negative: 'not-group-disabled:text-button-solid-negative-icon',
    neutral: 'not-group-disabled:text-button-solid-neutral-icon',
  }[color]

  return (
    <button
      ref={ref}
      onClick={onClick}
      className={clsx(
        'group font-semibold',
        colorClasses,
        'not-disabled:hover:brightness-90',
        'disabled:text-disabled-text disabled:bg-disabled-background',
        ButtonUtil.paddingMapping[size],
        className
      )}
      {...restProps}
    >
      {startIcon && (
        <span
          className={clsx(
            iconColorClasses,
            'group-disabled:text-disabled-icon'
          )}
        >
          {startIcon}
        </span>
      )}
      {children}
      {endIcon && (
        <span
          className={clsx(
            iconColorClasses,
            'group-disabled:text-disabled-icon'
          )}
        >
          {endIcon}
        </span>
      )}
    </button>
  )
})

/**
 * A button with an outline border and different sizes
 */
const OutlineButton = ({
                         children,
                         color = 'primary',
                         size = 'medium',
                         startIcon,
                         endIcon,
                         onClick,
                         className,
                         ...restProps
                       }: OutlineButtonProps) => {
  const colorClasses = {
    primary: 'not-disabled:border-button-outline-primary-text not-disabled:text-button-outline-primary-text',
  }[color]

  const iconColorClasses = {
    primary: 'not-group-disabled:text-button-outline-primary-icon',
  }[color]
  return (
    <button
      onClick={onClick}
      className={clsx(
        'group font-semibold bg-transparent border-2 ',
        'not-disabled:hover:brightness-80',
        colorClasses,
        'disabled:text-disabled-text disabled:border-disabled-outline',
        ButtonUtil.paddingMapping[size],
        className
      )}
      {...restProps}
    >
      {startIcon && (
        <span
          className={clsx(
            iconColorClasses,
            'group-disabled:text-disabled-icon'
          )}
        >
          {startIcon}
        </span>
      )}
      {children}
      {endIcon && (
        <span
          className={clsx(
            iconColorClasses,
            'group-disabled:text-disabled-icon'
          )}
        >
          {endIcon}
        </span>
      )}
    </button>
  )
}

/**
 * A text that is a button that can have different sizes
 */
const TextButton = ({
                      children,
                      color = 'neutral',
                      size = 'medium',
                      startIcon,
                      endIcon,
                      onClick,
                      coloredHoverBackground = true,
                      className,
                      ...restProps
                    }: TextButtonProps) => {
  const colorClasses = {
    primary: 'not-disabled:bg-transparent not-disabled:text-button-text-primary-text',
    negative: 'not-disabled:bg-transparent not-disabled:text-button-text-negative-text',
    neutral: 'not-disabled:bg-transparent not-disabled:text-button-text-neutral-text',
  }[color]

  const backgroundColor = {
    primary: 'not-disabled:hover:bg-button-text-primary-text/20',
    negative: 'not-disabled:hover:bg-button-text-negative-text/20',
    neutral: 'not-disabled:hover:bg-button-text-neutral-text/20',
  }[color]

  const iconColorClasses = {
    primary: 'not-group-disabled:text-button-text-primary-icon',
    negative: 'not-group-disabled:text-button-text-negative-icon',
    neutral: 'not-group-disabled:text-button-text-neutral-icon',
  }[color]

  return (
    <button
      onClick={onClick}
      className={clsx(
        'group font-semibold',
        'disabled:text-disabled-text',
        colorClasses,
        {
          [backgroundColor]: coloredHoverBackground,
          'not-disabled:hover:bg-button-text-hover-background': !coloredHoverBackground,
        },
        ButtonUtil.paddingMapping[size],
        className
      )}
      {...restProps}
    >
      {startIcon && (
        <span
          className={clsx(
            iconColorClasses,
            'group-disabled:text-disabled-icon'
          )}
        >
          {startIcon}
        </span>
      )}
      {children}
      {endIcon && (
        <span
          className={clsx(
            iconColorClasses,
            'group-disabled:text-disabled-icon'
          )}
        >
          {endIcon}
        </span>
      )}
    </button>
  )
}


/**
 * A button for icons with a solid background and different sizes
 */
const IconButton = ({
                      children,
                      color = 'primary',
                      size = 'medium',
                      className,
                      ...restProps
                    }: IconButtonProps) => {
  const colorClasses = {
    primary: 'not-disabled:bg-button-solid-primary-background not-disabled:text-button-solid-primary-text',
    secondary: 'not-disabled:bg-button-solid-secondary-background not-disabled:text-button-solid-secondary-text',
    tertiary: 'not-disabled:bg-button-solid-tertiary-background not-disabled:text-button-solid-tertiary-text',
    positive: 'not-disabled:bg-button-solid-positive-background not-disabled:text-button-solid-positive-text',
    warning: 'not-disabled:bg-button-solid-warning-background not-disabled:text-button-solid-warning-text',
    negative: 'not-disabled:bg-button-solid-negative-background not-disabled:text-button-solid-negative-text',
    neutral: 'not-disabled:bg-button-solid-neutral-background not-disabled:text-button-solid-neutral-text',
    transparent: 'not-disabled:bg-transparent',
  }[color]

  return (
    <button
      className={clsx(
        colorClasses,
        'not-disabled:hover:brightness-90',
        'disabled:text-disabled-text',
        {
          'disabled:bg-disabled-background': color !== 'transparent',
          'disabled:opacity-70': color === 'transparent',
          'not-disabled:hover:bg-button-text-hover-background': color === 'transparent',
        },
        ButtonUtil.iconPaddingMapping[size],
        className
      )}
      {...restProps}
    >
      {children}
    </button>
  )
}

export { SolidButton, OutlineButton, TextButton, IconButton }
