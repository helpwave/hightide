import type { ReactNode } from 'react'
import type { PopUpProps } from '../../layout/PopUp/PopUp'
import type { FilterValue } from '../filter-functions'
import type { FilterOperator } from '../filter-operator'

export interface FilterPopUpProps extends PopUpProps {
  name?: ReactNode,
  value?: FilterValue,
  onValueChange: (value: FilterValue) => void,
  onRemove: () => void,
  operatorOverrides?: FilterOperator[],
}
