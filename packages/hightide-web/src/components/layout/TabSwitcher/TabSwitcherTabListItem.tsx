import { forwardRef } from 'react'
import { ColoringUtils, PropsUtil } from '../../../utils'
import { useTabSwitcherContext, type TabInfo } from './TabSwitcherContext'

export type TabSwitcherTabListItemProps = {
  info: TabInfo,
  isActive: boolean,
}

export const TabSwitcherTabListItem = forwardRef<HTMLLIElement, TabSwitcherTabListItemProps>(function TabSwitcherTabListItem({
  info,
  isActive,
}, forwardedRef) {
  const { config, dispatch } = useTabSwitcherContext()
  const isDisabled = !!info.disabled
  const isSegmented = config.variant === 'segmented-chips'

  return (
    <li
      ref={forwardedRef}
      id={info.labelId}
      {...(isDisabled ? {} : PropsUtil.aria.click(() => dispatch({ type: 'select', id: info.id })))}
      className="tab-list-item"
      data-style-variant={config.variant}
      data-active={PropsUtil.dataAttributes.bool(isActive)}
      {...ColoringUtils.build(isSegmented
        ? { color: isActive ? 'primary' : 'neutral', mode: 'interactive', coloringStyle: 'filled' }
        : { color: 'surface-inverse', mode: 'interactive', coloringStyle: 'foreground' })}
      data-disabled={PropsUtil.dataAttributes.bool(isDisabled)}
      role="tab"
      aria-selected={isActive}
      aria-disabled={isDisabled}
      aria-controls={info.id}
      tabIndex={isActive && !isDisabled ? 0 : -1}
    >
      {info.label}
    </li>
  )
})
