/** @jest-environment jsdom */

import type { KeyboardEvent } from 'react'
import { handleTreeItemKeyDown } from '../../src/components/layout/navigation/vertical-navigation/useVerticalNavigationTreeKeyboard'

const actions = {
  navigateTo: jest.fn(),
  expand: jest.fn(),
  collapse: jest.fn(),
  next: jest.fn(),
  previous: jest.fn(),
  first: jest.fn(),
  last: jest.fn(),
}

const baseOptions = {
  id: 'root-a',
  hasChildren: true,
  firstChildId: 'child-a1',
  expanded: false,
  path: ['root-a'],
} as const

function createKeyboardEvent(key: string): KeyboardEvent<HTMLElement> {
  return {
    key,
    preventDefault: jest.fn(),
  } as unknown as KeyboardEvent<HTMLElement>
}

describe('handleTreeItemKeyDown', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('ArrowRight expands a closed branch without moving focus', () => {
    const event = createKeyboardEvent('ArrowRight')

    handleTreeItemKeyDown(event, { ...baseOptions, expanded: false }, actions)

    expect(event.preventDefault).toHaveBeenCalled()
    expect(actions.expand).toHaveBeenCalledWith('root-a')
    expect(actions.navigateTo).not.toHaveBeenCalled()
  })

  test('ArrowRight moves to first child when branch is open', () => {
    const event = createKeyboardEvent('ArrowRight')

    handleTreeItemKeyDown(event, { ...baseOptions, expanded: true }, actions)

    expect(actions.navigateTo).toHaveBeenCalledWith('child-a1')
  })

  test('ArrowLeft collapses an open branch without moving focus', () => {
    const event = createKeyboardEvent('ArrowLeft')

    handleTreeItemKeyDown(event, { ...baseOptions, expanded: true }, actions)

    expect(actions.collapse).toHaveBeenCalledWith('root-a')
    expect(actions.navigateTo).not.toHaveBeenCalled()
  })

  test('ArrowLeft moves to parent on a closed child node', () => {
    const event = createKeyboardEvent('ArrowLeft')

    handleTreeItemKeyDown(event, {
      id: 'child-a1',
      hasChildren: false,
      expanded: false,
      path: ['root-a', 'child-a1'],
    }, actions)

    expect(actions.navigateTo).toHaveBeenCalledWith('root-a')
  })

  test('Home and End call first and last', () => {
    const homeEvent = createKeyboardEvent('Home')
    const endEvent = createKeyboardEvent('End')

    handleTreeItemKeyDown(homeEvent, { ...baseOptions, expanded: true }, actions)
    handleTreeItemKeyDown(endEvent, { ...baseOptions, expanded: true }, actions)

    expect(actions.first).toHaveBeenCalled()
    expect(actions.last).toHaveBeenCalled()
  })
})
