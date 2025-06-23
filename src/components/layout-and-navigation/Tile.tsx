import type { ReactNode } from 'react'
import clsx from 'clsx'

export type TileProps = {
  title: { value: string, className?: string },
  description?: { value: string, className?: string },
  prefix?: ReactNode,
  suffix?: ReactNode,
  className?: string,
}

/**
 * A component for creating a tile similar to the flutter ListTile
 */
export const Tile = ({
                       title,
                       description,
                       prefix,
                       suffix,
                       className
                     }: TileProps) => {
  return (
    <div className={clsx('row gap-x-4 w-full items-center', className)}>
      {prefix}
      <div className="col gap-y-0 w-full">
        <h4 className={clsx(title.className ?? 'textstyle-title-normal')}>{title.value}</h4>
        {!!description &&
          <span className={clsx(description.className ?? 'textstyle-description')}>{description.value}</span>}
      </div>
      {suffix}
    </div>
  )
}

type ImageLocation = 'prefix' | 'suffix'
type ImageSize = {
  width: number,
  height: number,
}

export type TileWithImageProps = Omit<TileProps, 'suffix' | 'prefix'> & {
  url: string,
  imageLocation?: ImageLocation,
  imageSize?: ImageSize,
  imageClassName?: string,
}