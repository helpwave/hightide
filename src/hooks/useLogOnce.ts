import { useEffect, useState } from 'react'

type Options = {
  message: string,
  condition: boolean,
  type?: 'info' | 'error' | 'warning',
}

export const useLogOnce = ({
  message,
  condition,
  type = 'warning',
                           }: Options) => {
  const [hasLogged,setHasLogged] = useState<boolean>(false)

  useEffect(() => {
    if(!hasLogged && condition) {
      switch (type) {
        case 'info': console.info(message)
          break
        case 'error': console.error(message)
          break
        case 'warning': console.warn(message)
          break
      }
      setHasLogged(true)
    }
  }, [condition]) // eslint-disable-line react-hooks/exhaustive-deps
}