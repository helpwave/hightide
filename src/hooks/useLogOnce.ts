import { useEffect, useState } from 'react'

type OptionsResolved = {
  type?: 'info' | 'error' | 'warning',
}

const defaultOptions: OptionsResolved = {
  type: 'warning',
}

type Options = Partial<OptionsResolved>

export const useLogOnce = (
  message: string,
  condition: boolean,
  options?: Options
) => {
  const [hasLogged, setHasLogged] = useState<boolean>(false)
  const { type } = { ...defaultOptions, ...options }

  useEffect(() => {
    if (!hasLogged && condition) {
      switch (type) {
        case 'info':
          console.info(message)
          break
        case 'error':
          console.error(message)
          break
        case 'warning':
          console.warn(message)
          break
      }
      setHasLogged(true)
    }
  }, [condition]) // eslint-disable-line react-hooks/exhaustive-deps
}