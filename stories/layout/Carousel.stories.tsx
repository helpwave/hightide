import type { Meta, StoryObj } from '@storybook/nextjs'
import Image from 'next/image'
import { clsx } from 'clsx'
import type { CarouselProps } from '../../src/components/layout-and-navigation/Carousel'
import { Carousel } from '../../src/components/layout-and-navigation/Carousel'
import { range } from '../../src/utils/array'

type CarouselExampleProps = Omit<CarouselProps, 'blurColor' | 'children'> & {
  hasBlur?: boolean,
}

const CarouselExample = ({
                           hasBlur,
                           ...props
                         }: CarouselExampleProps) => {
  return (
    <Carousel
      {...props}
      blurColor={hasBlur ? 'from-background !block' : 'from-transparent'}
      heightClassName="h-64"
    >
      {range(5).map(index => {
        const color = ['bg-positive', 'bg-negative', 'bg-primary', 'bg-secondary', 'bg-warning'][index]
        return (
          <div key={index} className={clsx('flex-row-0 justify-center items-center h-full  rounded-2xl mx-4', color)}>
            <Image src="https://helpwave.de/favicon.ico" alt="" width={256} height={256}/>
          </div>
        )
      })}
    </Carousel>
  )
}

const meta = {
  title: 'Layout',
  component: CarouselExample,
} satisfies Meta<typeof CarouselExample>

export default meta
type Story = StoryObj<typeof meta>;

export const carousel: Story = {
  args: {
    animationTime: 200,
    autoLoopingTimeOut: 5000,
    autoLoopAnimationTime: 500,
    hasBlur: true,
    hintNext: true,
    arrows: true,
    dots: true,
    isLooping: true,
    isAutoLooping: true,
  },
}
