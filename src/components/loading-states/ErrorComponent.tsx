import { AlertOctagon } from 'lucide-react'
import type { PropsForTranslation, Translation } from '../../localization/useTranslation'
import { useTranslation } from '../../localization/useTranslation'
import clsx from 'clsx'

type ErrorComponentTranslation = {
  errorOccurred: string,
}

const defaultErrorComponentTranslation: Translation<ErrorComponentTranslation> = {
  en: {
    errorOccurred: 'An error occurred'
  },
  de: {
    errorOccurred: 'Ein Fehler ist aufgetreten'
  }
}

export type ErrorComponentProps = {
  errorText?: string,
  classname?: string,
}

/**
 * The Component to show when an error occurred
 */
export const ErrorComponent = ({
                                 overwriteTranslation,
                                 errorText,
                                 classname
                               }: PropsForTranslation<ErrorComponentTranslation, ErrorComponentProps>) => {
  const translation = useTranslation([defaultErrorComponentTranslation], overwriteTranslation)
  return (
    <div className={clsx('flex-col-4 items-center justify-center w-full h-24', classname)}>
      <AlertOctagon size={64} className="text-warning"/>
      {errorText ?? `${translation('errorOccurred')} :(`}
    </div>
  )
}
