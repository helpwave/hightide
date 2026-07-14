import { useReducer } from 'react'

export const useRerender = () => {
  return useReducer(() => ({}), {})[1]
}