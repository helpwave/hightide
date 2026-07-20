import { useContext } from 'react'
import { LocalizationContext } from './LocalizationContext'

export const useDateTimeFormat = () => {
  const context = useContext(LocalizationContext)
  return {
    is24HourFormat: context?.is24HourFormat ?? true,
    timeZone: context?.timeZone,
  }
}
