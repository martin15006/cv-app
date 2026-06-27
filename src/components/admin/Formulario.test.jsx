// @vitest-environment jsdom
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Formulario from './Formulario.jsx'

describe('Formulario — campo con upper (rango)', () => {
  it('convierte a mayúscula al escribir y al guardar', () => {
    const onGuardar = vi.fn()
    render(
      <Formulario
        campos={[{ n: 'rango', label: 'Rango', tipo: 'texto', upper: true }]}
        onGuardar={onGuardar}
        onCancelar={() => {}}
      />
    )
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'a' } })
    expect(input.value).toBe('A') // mayúscula en vivo
    fireEvent.click(screen.getByText('Guardar'))
    expect(onGuardar).toHaveBeenCalledWith({ rango: 'A' }) // mayúscula al guardar
  })

  it('no afecta a campos normales', () => {
    const onGuardar = vi.fn()
    render(
      <Formulario
        campos={[{ n: 'titulo', label: 'Título', tipo: 'texto' }]}
        onGuardar={onGuardar}
        onCancelar={() => {}}
      />
    )
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'hola Mundo' } })
    expect(input.value).toBe('hola Mundo')
    fireEvent.click(screen.getByText('Guardar'))
    expect(onGuardar).toHaveBeenCalledWith({ titulo: 'hola Mundo' })
  })
})
