import clsx from 'clsx'
import type { ButtonProps } from '../user-action/Button'
import { Button } from '../user-action/Button'
import { HelpwaveLogo } from '../icons-and-geometry/HelpwaveLogo'

type LoadingButtonProps = {
  isLoading?: boolean,
} & ButtonProps

export const LoadingButton = ({ isLoading = false, size = 'md', onClick, ...rest }: LoadingButtonProps) => {

  return (
    <div className="inline-block relative">
      {
        isLoading && (
          <div className={clsx('flex-row-2 absolute inset-0 items-center justify-center bg-white/40')}>
            <HelpwaveLogo animate="loading" className="text-white"/>
          </div>
        )
      }
      <Button {...rest} size={size} disabled={rest.disabled} onClick={onClick}/>
    </div>
  )
}
