/**
 * @jest-environment jsdom
 */
import { findPageScrollContainer, findScrollableAncestor } from '../../src/components/layout/virtualization/virtualizationScroll'

describe('findPageScrollContainer', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('resolves the AppPage content area regardless of current overflow state', () => {
    // jsdom has no layout, so scrollHeight === clientHeight === 0 everywhere:
    // the AppPage container is not "currently overflowing", yet page-scroll
    // virtualization must still bind to it (otherwise an empty list never
    // resolves a scroll element and renders zero rows).
    document.body.innerHTML = `
      <div data-name="app-page-content">
        <main>
          <div id="list">
            <table><tbody id="body"></tbody></table>
          </div>
        </main>
      </div>
    `
    const body = document.getElementById('body')!
    const appPageContent = document.querySelector('[data-name="app-page-content"]')

    expect(findScrollableAncestor(body)).toBeNull()
    expect(findPageScrollContainer(body)).toBe(appPageContent)
  })

  it('returns null when there is no AppPage container and nothing scrolls', () => {
    document.body.innerHTML = '<div><table><tbody id="body"></tbody></table></div>'
    const body = document.getElementById('body')!
    expect(findPageScrollContainer(body)).toBeNull()
  })

  it('returns null for a null element', () => {
    expect(findPageScrollContainer(null)).toBeNull()
  })
})
