import type { Meta, StoryObj } from '@storybook/nextjs'
import type { CarouselProps } from '../../src'
import { Carousel } from '../../src'

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
      heightClassName="h-[16rem]"
    >
      <div className="row justify-center items-center h-full bg-positive rounded-2xl mx-4">
        <img src="https://helpwave.de/favicon.ico" alt=""/>
      </div>
      <div className="row justify-center items-center h-full bg-negative rounded-2xl mx-4">
        <img src="https://helpwave.de/favicon.ico" alt=""/>
      </div>
      <div className="row justify-center items-center h-full bg-primary rounded-2xl mx-4">
        <img src="https://helpwave.de/favicon.ico" alt=""/>
      </div>
      <div className="row justify-center items-center h-full bg-neutral rounded-2xl mx-4">
        <img src="https://helpwave.de/favicon.ico" alt=""/>
      </div>
      <div className="row justify-center items-center h-full bg-warning rounded-2xl mx-4">
        <img src="https://helpwave.de/favicon.ico" alt=""/>
      </div>
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
