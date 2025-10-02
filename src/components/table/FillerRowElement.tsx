import { clsx } from 'clsx'

export type FillerRowElementProps = {
  className?: string,
}
export const FillerRowElement = ({
                                   className
                                 }: FillerRowElementProps) => {
  return (
    <div className={clsx('flex flex-row items-center w-1/2 h-4 text-disabled font-bold', className)}>
      -
    </div>
  )
}