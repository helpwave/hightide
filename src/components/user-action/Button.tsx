import type { ButtonHTMLAttributes, PropsWithChildren, ReactNode } from 'react'
import clsx from 'clsx'

/**
 * The allowed colors for the SolidButton and IconButton
 */
export type SolidButtonColor = 'primary' | 'secondary' | 'tertiary' | 'positive' | 'warning' | 'negative'
/**
 * The allowed colors for the OutlineButton
 */
export type OutlineButtonColor = 'primary'
/**
 * The allowed colors for the TextButton
 */
export type TextButtonColor = 'primary' | 'negative' | 'neutral'

/**
 * The different sizes for a button
 */
type ButtonSizes = 'small' | 'medium' | 'large'

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

const iconPaddingMapping: Record<ButtonSizes, string> = {
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

export type IconButtonProps = ButtonProps & {
  color?: SolidButtonColor,
}

/**
 * A button with a solid background and different sizes
 */
const SolidButton = ({
                       children,
                       disabled = false,
                       color = 'primary',
                       size = 'medium',
                       startIcon,
                       endIcon,
                       onClick,
                       className,
                       ...restProps
                     }: SolidButtonProps) => {
  const colorClasses = {
    primary: 'bg-button-solid-primary-background text-button-solid-primary-text',
    secondary: 'bg-button-solid-secondary-background text-button-solid-secondary-text',
    tertiary: 'bg-button-solid-tertiary-background text-button-solid-tertiary-text',
    positive: 'bg-button-solid-positive-background text-button-solid-positive-text',
    warning: 'bg-button-solid-warning-background text-button-solid-warning-text',
    negative: 'bg-button-solid-negative-background text-button-solid-negative-text',
  }[color]

  const iconColorClasses = {
    primary: 'text-button-solid-primary-icon',
    secondary: 'text-button-solid-secondary-icon',
    tertiary: 'text-button-solid-tertiary-icon',
    positive: 'text-button-solid-positive-icon',
    warning: 'text-button-solid-warning-icon',
    negative: 'text-button-solid-negative-icon',
  }[color]

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled || onClick === undefined}
      className={clsx(
        className,
        {
          'text-disabled-text bg-disabled-background': disabled,
          [clsx(colorClasses, 'hover:brightness-90')]: !disabled
        },
        ButtonUtil.paddingMapping[size]
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
      onClick={disabled ? undefined : onClick}
      disabled={disabled || onClick === undefined}
      className={clsx(
        className, {
          'text-disabled-text border-disabled-outline': disabled,
          [clsx(colorClasses, 'hover:brightness-80')]: !disabled,
        },
        ButtonUtil.paddingMapping[size]
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
      onClick={disabled ? undefined : onClick}
      disabled={disabled || onClick === undefined}
      className={clsx(
        className, {
          'text-disabled-text': disabled,
          [clsx(colorClasses, 'hover:bg-button-text-hover-background rounded-full')]: !disabled,
        },
        ButtonUtil.paddingMapping[size]
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
  }[color]

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled || onClick === undefined}
      className={clsx(
        className,
        {
          'text-disabled-text bg-disabled-background': disabled,
          [clsx(colorClasses, 'hover:brightness-90')]: !disabled
        },
        ButtonUtil.iconPaddingMapping[size]
      )}
      {...restProps}
    >
      {children}
    </button>
  )
}

export { SolidButton, OutlineButton, TextButton, IconButton }
