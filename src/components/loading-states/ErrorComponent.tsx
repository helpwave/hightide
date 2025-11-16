import { AlertOctagon } from 'lucide-react'
import clsx from 'clsx'
import { useStandardTranslation } from '@/src/i18n/useTranslation'

export type ErrorComponentProps = {
  errorText?: string,
  classname?: string,
}

/**
 * The Component to show when an error occurred
 */
export const ErrorComponent = ({
                                 errorText,
                                 classname
                               }: ErrorComponentProps) => {
  const translation = useStandardTranslation()
  return (
    <div className={clsx('flex-col-4 items-center justify-center w-full h-24', classname)}>
      <AlertOctagon size={64} className="text-warning"/>
      {errorText ?? `${translation('errorOccurred')} :(`}
    </div>
  )
}
