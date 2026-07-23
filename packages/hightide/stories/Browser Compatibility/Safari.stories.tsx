import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import type { ReactNode } from 'react'
import { useState } from 'react'
import { Button } from '../../src/components/user-interaction/Button'
import { HelpwaveLogo } from '../../src/components/branding/HelpwaveLogo'

type DemoSectionProps = {
  title: string,
  description: string,
  children: ReactNode,
}

const DemoSection = ({ title, description, children }: DemoSectionProps) => (
  <section className="flex-col-2">
    <div className="flex-col-1">
      <h3 className="typography-title-sm text-text-primary">{title}</h3>
      <p className="typography-body-md text-description">{description}</p>
    </div>
    {children}
  </section>
)

const SafariCompatibilityDemo = () => {
  const [transformActive, setTransformActive] = useState(false)

  return (
    <div className="flex-col-8 max-w-2xl">
      <DemoSection
        title="position: sticky"
        description="Requires -webkit-sticky on older Safari versions."
      >
        <div className="h-48 overflow-auto border border-faded rounded-md">
          <div className="sticky top-0 z-10 bg-primary text-on-primary p-2">Sticky header</div>
          {Array.from({ length: 12 }, (_, index) => (
            <p key={index} className="p-2 typography-body-md text-text-primary border-b border-faded">
              {`Scroll row ${index + 1}`}
            </p>
          ))}
        </div>
      </DemoSection>

      <DemoSection
        title="user-select: none"
        description="Requires -webkit-user-select on WebKit browsers."
      >
        <div className="select-none rounded-md bg-surface p-4 typography-body-md text-text-primary">
          This text uses select-none and should not be selectable.
        </div>
      </DemoSection>

      <DemoSection
        title="appearance: none"
        description="Requires -webkit-appearance on WebKit browsers for native control styling resets."
      >
        <div className="flex-col-2">
          <input
            type="number"
            defaultValue={42}
            className="input-indicator-hidden rounded-md border border-faded bg-surface px-3 py-2 typography-body-md"
          />
          <input
            type="date"
            defaultValue="2026-07-06"
            className="input-indicator-hidden rounded-md border border-faded bg-surface px-3 py-2 typography-body-md"
          />
        </div>
      </DemoSection>

      <DemoSection
        title="touch-action"
        description="touch-none and touch-manipulation rely on prefixed touch-action support in older Safari."
      >
        <div className="flex-col-2">
          <div className="touch-none rounded-md bg-surface-variant p-4 typography-body-md text-text-primary">touch-none panel</div>
          <div className="touch-manipulation rounded-md bg-surface-variant p-4 typography-body-md text-text-primary">touch-manipulation panel</div>
        </div>
      </DemoSection>

      <DemoSection
        title="transform"
        description="Transform and translate utilities may require -webkit-transform on older Safari."
      >
        <div className="flex-col-2">
          <div
            className="transform transition-transform duration-300 ease-out rounded-md bg-secondary text-on-secondary p-4 typography-body-md data-[active]:translate-x-8 data-[active]:scale-105"
            data-active={transformActive ? '' : undefined}
          >
            Transformed panel
          </div>
          <Button onClick={() => setTransformActive((active) => !active)}>
            Toggle transform
          </Button>
        </div>
      </DemoSection>

      <DemoSection
        title="::-webkit-scrollbar"
        description="Custom scrollbar styling is WebKit-specific and must use -webkit-scrollbar pseudo-elements."
      >
        <div className="h-32 overflow-auto rounded-md border border-faded p-2 typography-body-md text-text-primary">
          {Array.from({ length: 20 }, (_, index) => (
            <p key={index} className="py-1">
              {`Scrollbar content line ${index + 1}`}
            </p>
          ))}
        </div>
      </DemoSection>

      <DemoSection
        title="animations and key frame"
        description="Custom animations and keyframes require -webkit- prefixes in older Safari."
      >
        <HelpwaveLogo animate="loading" size="md"/>
      </DemoSection>
    </div>
  )
}

const meta: Meta<typeof SafariCompatibilityDemo> = {
  title: 'Browser Compatibility/Safari',
  component: SafariCompatibilityDemo,
}

export default meta
type Story = StoryObj<typeof meta>

export const safari: Story = {}
