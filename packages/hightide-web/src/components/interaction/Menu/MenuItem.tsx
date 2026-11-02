import type { MouseEvent } from 'react'
import type { ListActionItemProps } from '../../layout/list/ListActionItem'
import { ListActionItem } from '../../layout/list/ListActionItem'
import { useMenuContext } from './MenuContext'

export type MenuItemProps = ListActionItemProps & {
  isClosingOnClick?: boolean,
}

export function MenuItem({
  isClosingOnClick = true,
  onClick,
  disabled,
  ...props
}: MenuItemProps) {
  const { dispatch, disabled: menuDisabled } = useMenuContext()

  return (
    <ListActionItem
      {...props}
      disabled={disabled || menuDisabled}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        if (isClosingOnClick && !event.defaultPrevented) {
          dispatch({ type: 'close' })
        }
      }}
    />
  )
}
