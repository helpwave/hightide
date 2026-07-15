import { useLocalization } from './useLocalization'

export const useTimeZone = () => {
  const context = useLocalization()
  return { timeZone: context.timeZone, setTimeZone: context.setTimeZone }
}
