import type { Language } from '../../localization/util'
import type { PropsForTranslation } from '../../localization/useTranslation'
import { useTranslation } from '../../localization/useTranslation'
import clsx from 'clsx'
import { Helpwave } from '../icons-and-geometry/Helpwave'

type LoadingAnimationTranslation = {
  loading: string,
}

const defaultLoadingAnimationTranslation: Record<Language, LoadingAnimationTranslation> = {
  en: {
    loading: 'Loading data'
  },
  de: {
    loading: 'Lade Daten'
  }
}

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
  const translation = useTranslation(defaultLoadingAnimationTranslation, overwriteTranslation)
  return (
    <div className={clsx('col items-center justify-center w-full h-24', classname)}>
      <Helpwave animate="loading"/>
      {loadingText ?? `${translation.loading}...`}
    </div>
  )
}
