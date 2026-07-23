import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'
import clsx from 'clsx'
import { HelpwaveLogo } from '../../branding/HelpwaveLogo'

export type LoadingAnimationProps = {
  loadingText?: string,
  classname?: string,
  animationDuration?: number,
}

export const LoadingAnimation = ({
  loadingText,
  classname,
  animationDuration
}: LoadingAnimationProps) => {
  const translation = useHightideTranslation()
  return (
    <div className={clsx('flex-col-2 items-center justify-center w-full h-24', classname)}>
      <HelpwaveLogo animate="loading" animationDuration={animationDuration} />
      {loadingText ?? `${translation('loading')}...`}
    </div>
  )
}
