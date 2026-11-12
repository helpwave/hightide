import type { ReactNode } from 'react'
import type { PopUpPanelProps } from '../../layout/PopUp/PopUp'
import type { FilterValue } from '../filter-functions'
import type { FilterOperator } from '../filter-operator'

export interface FilterPopUpProps extends PopUpPanelProps {
  name?: ReactNode,
  value?: FilterValue,
  onValueChange: (value: FilterValue) => void,
  onRemove: () => void,
  operatorOverrides?: FilterOperator[],
}
