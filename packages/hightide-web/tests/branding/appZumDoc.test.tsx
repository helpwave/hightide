/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { AppZumDocBadge } from '../../src/components/branding/AppZumDocBadge'
import { AppZumDocLogo } from '../../src/components/branding/AppZumDocLogo'

describe('AppZumDocBadge', () => {
  test('renders the wordmark with the logo', () => {
    const { container } = render(<AppZumDocBadge size="md"/>)
    expect(screen.getByText('App zum Doc')).toBeTruthy()
    expect(container.querySelector('svg')).toBeTruthy()
  })
})

describe('AppZumDocLogo', () => {
  test('renders two filled paths by default', () => {
    const { container } = render(<AppZumDocLogo frontColor="#111111" backColor="#222222"/>)
    const paths = container.querySelectorAll('path[fill]')
    expect(paths).toHaveLength(2)
    expect(paths[0]!.getAttribute('fill')).toBe('#222222')
    expect(paths[1]!.getAttribute('fill')).toBe('#111111')
    expect(container.querySelector('clipPath')).toBeNull()
  })

  test('renders clipped animated strokes when loading', () => {
    const { container } = render(<AppZumDocLogo animate="loading"/>)
    expect(container.querySelectorAll('clipPath')).toHaveLength(2)
    const strokes = container.querySelectorAll('path[stroke]')
    expect(strokes).toHaveLength(2)
    expect(strokes[0]!.classList.contains('animate-azd-fill-back')).toBe(true)
    expect(strokes[1]!.classList.contains('animate-azd-fill-front')).toBe(true)
  })

  test('applies the animation duration variable', () => {
    const { container } = render(<AppZumDocLogo animate="loading" animationDuration={3}/>)
    const svg = container.querySelector('svg')!
    expect(svg.getAttribute('style')).toContain('--helpwave-loading-duration: 3s')
  })
})
