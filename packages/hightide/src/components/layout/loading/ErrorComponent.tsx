import { AlertOctagon } from 'lucide-react'
import clsx from 'clsx'
import { useHightideTranslation } from '@/src/i18n/useHightideTranslation'

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
  const translation = useHightideTranslation()
  return (
    <div className={clsx('flex-col-4 items-center justify-center w-full h-24', classname)}>
      <AlertOctagon size={64} className="text-warning"/>
      {errorText ?? `${translation('errorOccurred')} :(`}
    </div>
  )
}
