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
const SolidButton = forwardRef(function SolidButton({
                       children,
                       disabled = false,
                       color = 'primary',
                       size = 'medium',
                       startIcon,
                       endIcon,
                       onClick,
                       className,
                       ...restProps
                     }: SolidButtonProps) {
  const colorClasses = {
    primary: 'bg-button-solid-primary-background text-button-solid-primary-text',
    secondary: 'bg-button-solid-secondary-background text-button-solid-secondary-text',
    tertiary: 'bg-button-solid-tertiary-background text-button-solid-tertiary-text',
    positive: 'bg-button-solid-positive-background text-button-solid-positive-text',
    warning: 'bg-button-solid-warning-background text-button-solid-warning-text',
    negative: 'bg-button-solid-negative-background text-button-solid-negative-text',
    neutral: 'bg-button-solid-neutral-background text-button-solid-neutral-text',
  }[color]

  const iconColorClasses = {
    primary: 'text-button-solid-primary-icon',
    secondary: 'text-button-solid-secondary-icon',
    tertiary: 'text-button-solid-tertiary-icon',
    positive: 'text-button-solid-positive-icon',
    warning: 'text-button-solid-warning-icon',
    negative: 'text-button-solid-negative-icon',
    neutral: 'text-button-solid-neutral-icon',
  }[color]

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        {
          'text-disabled-text bg-disabled-background cursor-not-allowed': disabled,
          [clsx(colorClasses, 'hover:brightness-90')]: !disabled
        },
        ButtonUtil.paddingMapping[size],
        className
      )}
      {...restProps}
    >
      {startIcon && (
        <span
          className={clsx({
            [iconColorClasses]: !disabled,
            [`text-disabled-icon`]: disabled
          })}
        >
        {startIcon}
      </span>
      )}
      {children}
      {endIcon && (
        <span
          className={clsx({
            [iconColorClasses]: !disabled,
            [`text-disabled-icon`]: disabled
          })}
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
                         disabled = false,
                         color = 'primary',
                         size = 'medium',
                         startIcon,
                         endIcon,
                         onClick,
                         className,
                         ...restProps
                       }: OutlineButtonProps) => {
  const colorClasses = {
    primary: 'bg-transparent border-2 border-button-outline-primary-text text-button-outline-primary-text',
  }[color]

  const iconColorClasses = {
    primary: 'text-button-outline-primary-icon',
  }[color]
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        {
          'text-disabled-text border-disabled-outline cursor-not-allowed': disabled,
          [clsx(colorClasses, 'hover:brightness-80')]: !disabled,
        },
        ButtonUtil.paddingMapping[size],
        className
      )}
      {...restProps}
    >
      {startIcon && (
        <span
          className={clsx({
            [iconColorClasses]: !disabled,
            [`text-disabled-icon`]: disabled
          })}
        >
        {startIcon}
      </span>
      )}
      {children}
      {endIcon && (
        <span
          className={clsx({
            [iconColorClasses]: !disabled,
            [`text-disabled-icon`]: disabled
          })}
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
                      disabled = false,
                      color = 'neutral',
                      size = 'medium',
                      startIcon,
                      endIcon,
                      onClick,
                      className,
                      ...restProps
                    }: TextButtonProps) => {
  const colorClasses = {
    primary: 'bg-transparent text-button-text-primary-text',
    negative: 'bg-transparent text-button-text-negative-text',
    neutral: 'bg-transparent text-button-text-neutral-text',
  }[color]

  const iconColorClasses = {
    primary: 'text-button-text-primary-icon',
    negative: 'text-button-text-negative-icon',
    neutral: 'text-button-text-neutral-icon',
  }[color]
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        {
          'text-disabled-text cursor-not-allowed': disabled,
          [clsx(colorClasses, 'hover:bg-button-text-hover-background')]: !disabled,
        },
        ButtonUtil.paddingMapping[size],
        className
      )}
      {...restProps}
    >
      {startIcon && (
        <span
          className={clsx({
            [iconColorClasses]: !disabled,
            [`text-disabled-icon`]: disabled
          })}
        >
        {startIcon}
      </span>
      )}
      {children}
      {endIcon && (
        <span
          className={clsx({
            [iconColorClasses]: !disabled,
            [`text-disabled-icon`]: disabled
          })}
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
                      disabled = false,
                      color = 'primary',
                      size = 'medium',
                      onClick,
                      className,
                      ...restProps
                    }: IconButtonProps) => {
  const colorClasses = {
    primary: 'bg-button-solid-primary-background text-button-solid-primary-text',
    secondary: 'bg-button-solid-secondary-background text-button-solid-secondary-text',
    tertiary: 'bg-button-solid-tertiary-background text-button-solid-tertiary-text',
    positive: 'bg-button-solid-positive-background text-button-solid-positive-text',
    warning: 'bg-button-solid-warning-background text-button-solid-warning-text',
    negative: 'bg-button-solid-negative-background text-button-solid-negative-text',
    neutral: 'bg-button-solid-neutral-background text-button-solid-neutral-text',
    transparent: 'bg-transparent',
  }[color]

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        {
          'text-disabled-text bg-disabled-background cursor-not-allowed': disabled && color !== 'transparent',
          'text-disabled-text cursor-not-allowed opacity-70': disabled && color === 'transparent',
          'hover:bg-button-text-hover-background': !disabled && color === 'transparent',
          [clsx(colorClasses, 'hover:brightness-90')]: !disabled,
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
