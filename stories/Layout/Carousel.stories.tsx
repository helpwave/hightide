import type { Meta, StoryObj } from '@storybook/nextjs'
import Image from 'next/image'
import { clsx } from 'clsx'
import type { CarouselProps } from '../../src/components/layout/Carousel'
import { Carousel } from '../../src/components/layout/Carousel'
import { range } from '../../src/utils/array'

type StoryArgs = CarouselProps & {
  hasBlur?: boolean,
}

const meta: Meta<StoryArgs> = {
  component: Carousel,
}

export default meta
type Story = StoryObj<typeof meta>;

export const carousel: Story = {
  args: {
    isLooping: true,
    isAutoPlaying: true,
    hintNext: true,
    hasBlur: true,
    arrows: true,
    dots: true,
    animationTime: 200,
    autoLoopingTimeOut: 5000,
    autoLoopAnimationTime: 1000,
    children: range(5).map(index => {
      const color = ['bg-positive', 'bg-negative', 'bg-primary', 'bg-secondary', 'bg-warning'][index]
      return (
        <div
          key={index}
          className={clsx(
            'flex-row-0 justify-center items-center h-full rounded-2xl mx-4 border-4 border-transparent',
            'group-focus-within/slide:border-primary',
            color
          )}
        >
          <Image src="https://helpwave.de/favicon.ico" alt="" width={256} height={256} draggable={false}/>
        </div>
      )
    }),
  },
  decorators: (Story) => {
    return (
      <>
        <style>
          {'main { padding: 0 !important;}'}
        </style>
        <div className="h-4"/>
        <Story/>
      </>
    )
  },
  render: ({ hasBlur,...props }) => {
    return (
      <Carousel
        {...props}
        blurColor={hasBlur ? 'from-background' : 'from-transparent'}
        heightClassName="h-64"
      />
    )
  }
}
