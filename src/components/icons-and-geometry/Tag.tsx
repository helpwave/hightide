import Image from 'next/image'

export type TagProps = {
  size?: number,
  className?: string,
}

/**
 * Tag icon from flaticon
 *
 * https://www.flaticon.com/free-icon/price-tag_721550?term=label&page=1&position=8&origin=tag&related_id=721550
 *
 * When using it make attribution
 */
export const TagIcon = ({
                          className,
                          size = 16,
                        }: TagProps) => {
  return (
    <Image
      style={{ width: `${size}px`, height: `${size}px`, minWidth: `${size}px`, minHeight: `${size}px` }}
      width={size}
      height={size}
      alt=""
      src="https://cdn.helpwave.de/icons/label.png"
      className={className}
    />
  )
}
