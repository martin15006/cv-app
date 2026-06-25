import { describe, it, expect } from 'vitest'
import { ordenar } from './util.js'

describe('ordenar', () => {
  it('ordena por el campo orden ascendente', () => {
    const entrada = [
      { orden: 2, x: 'b' },
      { orden: 1, x: 'a' },
    ]
    expect(ordenar(entrada).map((i) => i.x)).toEqual(['a', 'b'])
  })

  it('no falla si la lista es null', () => {
    expect(ordenar(null)).toEqual([])
  })
})
