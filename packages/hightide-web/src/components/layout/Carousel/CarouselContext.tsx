import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'

export type CarouselContextState = {
  id: string,
  currentIndex: number,
  slideCount: number,
  setSlideCount: (count: number) => void,
  isLooping: boolean,
  hintNext: boolean,
  transitionDuration: number,
  isDragging: boolean,
  setIsDragging: (isDragging: boolean) => void,
  goTo: (index: number) => void,
  goPrevious: () => void,
  goNext: () => void,
  canGoPrevious: boolean,
  canGoNext: boolean,
}

export const CarouselContext = createContext<CarouselContextState | null>(null)

export function useCarouselContext() {
  const context = useContext(CarouselContext)
  if (!context) {
    throw new Error('Carousel components must be used within a Carousel.Root')
  }
  return context
}

export type CarouselContextProviderProps = {
  value: CarouselContextState,
  children: ReactNode,
}

export function CarouselContextProvider({ value, children }: CarouselContextProviderProps) {
  return (
    <CarouselContext.Provider value={value}>
      {children}
    </CarouselContext.Provider>
  )
}
