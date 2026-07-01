/**
 * @jest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { VerticalNavigationTree } from '../../src/components/layout/navigation/navigation-menus/VerticalNavigationTree'
import type { NavigationItemData } from '../../src/components/layout/navigation/navigation-menus/types'

/**
 * These tests pin the routing-relevant contract of the `AppPage` sidebar item:
 *
 * - internal items render a real `next/link` anchor (so navigation is client-side
 *   and history-aware) and carry no `target`, and
 * - external items — both the explicitly flagged ones and any item whose `url` is
 *   an absolute link — open in a new tab by default (`target="_blank"` +
 *   `rel="noopener noreferrer"`).
 *
 * The component no longer depends on the App-Router-only `useRouter`, so it renders
 * without a router context; `next/link` simply no-ops navigation in that case,
 * which is exactly what lets us render it in isolation here.
 */
const renderTree = (items: NavigationItemData[]) => render(<VerticalNavigationTree items={items}/>)

const linkFor = (label: string): HTMLAnchorElement =>
  screen.getByText(label).closest('a') as HTMLAnchorElement

describe('VerticalNavigationItem routing', () => {
  test('internal items render a next/link anchor without a target', () => {
    renderTree([{ id: 'tasks', label: 'My Tasks', url: '/tasks' }])

    const link = linkFor('My Tasks')
    expect(link).not.toBeNull()
    expect(link.getAttribute('href')).toBe('/tasks')
    expect(link.getAttribute('target')).toBeNull()
    expect(link.getAttribute('rel')).toBeNull()
  })

  test('explicitly external items open in a new tab by default', () => {
    renderTree([{ id: 'docs', label: 'Docs', url: 'https://helpwave.de', external: true }])

    const link = linkFor('Docs')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noopener noreferrer')
  })

  test('absolute URLs are treated as external even without the flag', () => {
    renderTree([{ id: 'ext', label: 'External', url: 'https://example.com/page' }])

    const link = linkFor('External')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noopener noreferrer')
  })
})
