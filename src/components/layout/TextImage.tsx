import clsx from 'clsx'
import { useTranslation } from '@/src/i18n/useTranslation'

type TextImageColor = 'primary' | 'secondary' | 'dark'

export type TextImageProps = {
  title: string,
  description: string,
  imageUrl: string,
  onShowMoreClicked?: () => void,
  color?: TextImageColor,
  badge?: string,
  contentClassName?: string,
  className?: string,
}

/**
 * A Component for layering a Text upon an image
 */
export const TextImage = ({
                            title,
                            description,
                            imageUrl,
                            onShowMoreClicked,
                            color = 'primary',
                            badge,
                            contentClassName = '',
                            className = '',
                          }: TextImageProps) => {
  const translation = useTranslation()

  const chipColorMapping: Record<TextImageColor, string> = {
    primary: 'text-text-image-primary-background bg-text-image-primary-text',
    secondary: 'text-text-image-secondary-background bg-text-image-secondary-text',
    dark: 'text-text-image-dark-background bg-text-image-dark-text',
  }

  const colorMapping: Record<TextImageColor, string> = {
    primary: 'text-text-image-primary-text bg-linear-to-r from-30% from-text-image-primary-background to-text-image-primary-background/55',
    secondary: 'text-text-image-secondary-text bg-linear-to-r from-30% from-text-image-secondary-background to-text-image-secondary-background/55',
    dark: 'text-text-image-dark-text bg-linear-to-r from-30% from-text-image-dark-background to-text-image-dark-background/55',
  }

  return (
    <div
      className={clsx('rounded-2xl w-full', className)}
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
      }}>
      <div
        className={clsx(`flex-col-2 px-6 py-12 rounded-2xl h-full`, colorMapping[color], contentClassName)}
      >
        {badge && (
          <div className={clsx(`chip-full mb-2 py-2 px-4 w-fit`, chipColorMapping[color])}>
            <span className="text-lg font-bold">{badge}</span>
          </div>
        )}
        <div className="flex-col-1 overflow-hidden">
          <span className="typography-title-lg">{title}</span>
          <span className="text-ellipsis overflow-hidden">{description}</span>
        </div>
        {onShowMoreClicked && (
          <div className="flex-row-2 mt-2 underline">
            <button onClick={onShowMoreClicked}>{translation('showMore')}</button>
          </div>
        )}
      </div>
    </div>
  )
}
