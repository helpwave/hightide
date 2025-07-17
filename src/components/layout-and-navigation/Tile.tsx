import type { ReactNode } from 'react'
import clsx from 'clsx'
import { Check } from 'lucide-react'

export type TileProps = {
  title: ReactNode,
  titleClassName?: string,
  description?: ReactNode,
  descriptionClassName?: string,
  onClick?: () => void,
  disabled?: boolean,
  isSelected?: boolean,
  isListItem?: boolean,
  prefix?: ReactNode,
  suffix?: ReactNode,
  className?: string,
  normalClassName?: string,
  selectedClassName?: string,
  disabledClassName?: string,
}

/**
 * A component for creating a tile similar to the flutter ListTile
 */
export const Tile = ({
                       title,
                       titleClassName,
                       description,
                       descriptionClassName,
                       onClick,
                       isSelected = false,
                       disabled = false,
                       prefix,
                       suffix,
                       normalClassName = 'hover:bg-primary/40 cursor-pointer',
                       selectedClassName = 'bg-primary/20',
                       disabledClassName = 'text-disabled-text bg-disabled-background cursor-not-allowed',
                       className
                     }: TileProps) => {
  return (
    <div
      className={clsx(
        'flex-row-2 w-full items-center',
        {
          [normalClassName]: onClick && !disabled,
          [selectedClassName]: isSelected && !disabled,
          [disabledClassName]: disabled,
        },
        className
      )}
      onClick={disabled ? undefined : onClick}
    >
      {prefix}
      <div className="flex-col-0 w-full">
        <span className={clsx(titleClassName ?? ('textstyle-title-normal'))}>{title}</span>
        {!!description &&
          <span className={clsx(descriptionClassName ?? 'textstyle-description')}>{description}</span>}
      </div>
      {suffix ?? (isSelected ? (<Check size={24}/>) : undefined)}
    </div>
  )
}

export type ListTileProps = TileProps

export const ListTile = ({
  ...props
}: ListTileProps) => {
  return (
    <Tile
      {...props}
      titleClassName={props.titleClassName ?? 'font-semibold'}
      className={clsx('px-2 py-1 rounded-md', props.className)}
      disabledClassName={props.disabledClassName ?? 'text-disabled-text cursor-not-allowed'}
    />
  )
}
