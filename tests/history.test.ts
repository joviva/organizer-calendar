import { describe, it, expect } from 'vitest'
import { createHistory, pushHistory, undo, redo } from '../utils/history'

describe('history utils', () => {
  it('pushes, undoes and redoes correctly', () => {
    const h0 = createHistory<number[]>([])
    const h1 = pushHistory(h0, [1])
    expect(h1.present).toEqual([1])

    const h2 = pushHistory(h1, [1, 2])
    expect(h2.present).toEqual([1, 2])

    const h3 = undo(h2)
    expect(h3.present).toEqual([1])

    const h4 = redo(h3)
    expect(h4.present).toEqual([1, 2])
  })
})
