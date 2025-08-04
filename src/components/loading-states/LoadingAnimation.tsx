import type { PropsForTranslation } from '../../localization/useTranslation'
import { useTranslation } from '../../localization/useTranslation'
import clsx from 'clsx'
import { HelpwaveLogo } from '../icons-and-geometry/HelpwaveLogo'
import type { FormTranslationType } from '../../localization/defaults/form'
import { formTranslation } from '../../localization/defaults/form'

type LoadingAnimationTranslation = FormTranslationType

export type LoadingAnimationProps = {
  loadingText?: string,
  classname?: string,
}

/**
 * A Component to show when loading data
 */
export const LoadingAnimation = ({
                                   overwriteTranslation,
                                   loadingText,
                                   classname
                                 }: PropsForTranslation<LoadingAnimationTranslation, LoadingAnimationProps>) => {
  const translation = useTranslation([formTranslation], overwriteTranslation)
  return (
    <div className={clsx('flex-col-2 items-center justify-center w-full h-24', classname)}>
      <HelpwaveLogo animate="loading"/>
      {loadingText ?? `${translation('loading')}...`}
    </div>
  )
}
