import clsx from 'clsx'
import type { SolidButtonProps } from '../user-action/Button'
import { ButtonSizePaddings, SolidButton } from '../user-action/Button'
import { noop } from '../../util/noop'
import { Helpwave } from '../icons-and-geometry/Helpwave'

type LoadingButtonProps = {
  isLoading?: boolean,
} & SolidButtonProps

export const LoadingButton = ({ isLoading = false, size = 'medium', onClick, ...rest }: LoadingButtonProps) => {
  const paddingClass = ButtonSizePaddings[size]

  return (
    <div className="inline-block relative">
      {
        isLoading && (
          <div className={clsx('absolute inset-0 row items-center justify-center bg-white/40', paddingClass)}>
            <Helpwave animate="loading" className="text-white"/>
          </div>
        )
      }
      <SolidButton {...rest} disabled={rest.disabled} onClick={isLoading ? noop : onClick}/>
    </div>
  )
}
