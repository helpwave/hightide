import type { HTMLAttributes, ReactNode } from 'react'
import { Children, isValidElement } from 'react'
import clsx from 'clsx'

import type { CarouselArrowsProps } from './CarouselArrows'
import { CarouselArrows } from './CarouselArrows'
import type { CarouselContainerProps } from './CarouselContainer'
import { CarouselContainer } from './CarouselContainer'
import { CarouselContext } from './CarouselContext'
import type { CarouselFadeLayoverProps } from './CarouselFadeLayover'
import { CarouselFadeLayover } from './CarouselFadeLayover'
import type { CarouselRootProps } from './CarouselRoot'
import { CarouselRoot } from './CarouselRoot'
import type { CarouselSlideProps } from './CarouselSlide'
import { CarouselSlide } from './CarouselSlide'
import type { CarouselStepperProps } from './CarouselStepper'
import { CarouselStepper } from './CarouselStepper'

export type CarouselProps = Omit<CarouselRootProps, 'children'> & {
  children: ReactNode,
  arrows?: boolean,
  dots?: boolean,
  blurColor?: string,
  heightClassName?: string,
  slideClassName?: string,
  slideContainerProps?: HTMLAttributes<HTMLDivElement>,
  arrowsProps?: CarouselArrowsProps,
  fadeLayoverProps?: CarouselFadeLayoverProps,
  stepperProps?: CarouselStepperProps,
  containerProps?: Omit<CarouselContainerProps, 'children'>,
}

function slideElements(children: ReactNode) {
  return Children.map(children, (child, index) => {
    if (isValidElement(child) && child.type === CarouselSlide) {
      return child
    }
    return (
      <CarouselSlide key={index}>
        {child}
      </CarouselSlide>
    )
  })
}

function CarouselComponent({
  children,
  arrows = false,
  dots = true,
  blurColor = 'from-background',
  heightClassName = 'h-96',
  slideClassName = 'w-[70%] desktop:w-1/2',
  slideContainerProps,
  arrowsProps,
  fadeLayoverProps,
  stepperProps,
  containerProps,
  hintNext = false,
  ...props
}: CarouselProps) {
  return (
    <CarouselRoot {...props} hintNext={hintNext}>
      <CarouselContainer
        {...slideContainerProps}
        {...containerProps}
        slideClassName={slideClassName}
        className={clsx(heightClassName, slideContainerProps?.className, containerProps?.className)}
      >
        {slideElements(children)}
        {hintNext && (
          <CarouselFadeLayover
            {...fadeLayoverProps}
            className={clsx(blurColor, fadeLayoverProps?.className)}
          />
        )}
        {arrows && <CarouselArrows {...arrowsProps} />}
      </CarouselContainer>
      {dots && <CarouselStepper {...stepperProps} />}
    </CarouselRoot>
  )
}

const Carousel = Object.assign(CarouselComponent, {
  Root: CarouselRoot,
  Container: CarouselContainer,
  Slide: CarouselSlide,
  Arrows: CarouselArrows,
  FadeLayover: CarouselFadeLayover,
  Stepper: CarouselStepper,
  Context: CarouselContext,
  Consumer: CarouselContext.Consumer,
})

export { Carousel }
export type { CarouselRootProps, CarouselContainerProps, CarouselSlideProps, CarouselFadeLayoverProps, CarouselStepperProps }
export type { CarouselArrowsProps }
