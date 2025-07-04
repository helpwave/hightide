import type { ReactNode } from 'react'
import clsx from 'clsx'
import { Check } from 'lucide-react'

export type TileProps = {
  title: { value: ReactNode, className?: string },
  description?: { value: ReactNode, className?: string },
  onClick?: () => void,
  isDisabled?: boolean,
  isSelected?: boolean,
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
                       description,
                       onClick,
                       isSelected = false,
                       isDisabled = false,
                       prefix,
                       suffix,
                       normalClassName = 'hover:bg-primary/40 cursor-pointer',
                       selectedClassName = ' bg-primary/20',
                       disabledClassName = 'text-disabled-text bg-disabled-background cursor-not-allowed',
                       className
                     }: TileProps) => {
  return (
    <div
      className={clsx(
        'row gap-x-2 w-full items-center',
        {
          [normalClassName]: !!onClick && !isDisabled,
          [selectedClassName]: isSelected && !isDisabled,
          [disabledClassName]: isDisabled,
        },
        className
      )}
      onClick={isDisabled ? undefined : onClick}
    >
      {prefix}
      <div className="col gap-y-0 w-full">
        <h4 className={clsx(title.className ?? 'textstyle-title-normal')}>{title.value}</h4>
        {!!description &&
          <span className={clsx(description.className ?? 'textstyle-description')}>{description.value}</span>}
      </div>
      {suffix ?? (isSelected ? (<Check size={24}/>) : undefined)}
    </div>
  )
}
