import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'
import clsx from 'clsx'
import { HelpwaveLogo } from '@/src/components/branding/HelpwaveLogo'

export type LoadingAnimationProps = {
  loadingText?: string,
  classname?: string,
}

/**
 * A Component to show when loading data
 */
export const LoadingAnimation = ({
  loadingText,
  classname
}: LoadingAnimationProps) => {
  const translation = useHightideTranslation()
  return (
    <div className={clsx('flex-col-2 items-center justify-center w-full h-24', classname)}>
      <HelpwaveLogo animate="loading"/>
      {loadingText ?? `${translation('loading')}...`}
    </div>
  )
}
