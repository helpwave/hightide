import { AlertOctagon } from 'lucide-react'
import { Icon } from '../../display-and-visualization/Icon'
import clsx from 'clsx'
import { useHightideTranslation } from '@helpwave/hightide-utils/context/translation'

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
      <Icon icon={AlertOctagon} size="xl" className="text-warning" />
      {errorText ?? `${translation('errorOccurred')} :(`}
    </div>
  )
}
