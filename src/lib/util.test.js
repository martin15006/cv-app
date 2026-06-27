import { describe, it, expect } from 'vitest'
import { ordenar, ordenarPorRango } from './util.js'

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

describe('ordenarPorRango', () => {
  it('ordena S, A, B y desempata por orden', () => {
    const entrada = [
      { id: 1, rango: 'A', orden: 1, x: 'A1' },
      { id: 2, rango: 'S', orden: 5, x: 'S5' },
      { id: 3, rango: 'B', orden: 0, x: 'B0' },
      { id: 4, rango: 'S', orden: 0, x: 'S0' },
      { id: 5, rango: 'A', orden: 0, x: 'A0' },
    ]
    expect(ordenarPorRango(entrada).map((i) => i.x)).toEqual(['S0', 'S5', 'A0', 'A1', 'B0'])
  })

  it('los proyectos sin rango van al final', () => {
    const entrada = [
      { id: 1, rango: '', orden: 0, x: 'sin' },
      { id: 2, rango: 'A', orden: 0, x: 'A' },
    ]
    expect(ordenarPorRango(entrada).map((i) => i.x)).toEqual(['A', 'sin'])
  })

  it('acepta minúsculas en el rango', () => {
    const entrada = [
      { id: 1, rango: 'b', orden: 0, x: 'b' },
      { id: 2, rango: 's', orden: 0, x: 's' },
    ]
    expect(ordenarPorRango(entrada).map((i) => i.x)).toEqual(['s', 'b'])
  })

  it('no falla si la lista es null', () => {
    expect(ordenarPorRango(null)).toEqual([])
  })
})
