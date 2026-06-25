import { useCallback, useEffect, useState } from 'react'
import { listar, crear, actualizar, borrar } from '../../lib/crud.js'
import Formulario from './Formulario.jsx'

export default function TablaCrud({ seccion }) {
  const [filas, setFilas] = useState([])
  const [editando, setEditando] = useState(null) // null | 'nuevo' | id
  const [error, setError] = useState(null)

  const recargar = useCallback(async () => {
    try {
      setError(null)
      setFilas(await listar(seccion.tabla))
    } catch (e) {
      setError(e.message)
    }
  }, [seccion.tabla])

  useEffect(() => { recargar() }, [recargar])

  async function guardar(fila) {
    try {
      if (editando === 'nuevo') await crear(seccion.tabla, fila)
      else await actualizar(seccion.tabla, editando, fila)
      setEditando(null)
      await recargar()
    } catch (e) {
      setError(e.message)
    }
  }

  async function eliminar(id) {
    if (!window.confirm('¿Borrar este elemento?')) return
    try {
      await borrar(seccion.tabla, id)
      await recargar()
    } catch (e) {
      setError(e.message)
    }
  }

  const resumen = (f) =>
    seccion.campos
      .map((c) => (Array.isArray(f[c.n]) ? f[c.n].join(', ') : f[c.n]))
      .filter(Boolean)
      .slice(0, 2)
      .join(' — ')

  return (
    <section style={{ marginBottom: 28 }}>
      <h3>{seccion.titulo}</h3>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      {filas.map((f) => (
        <div key={f.id}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '4px 0', borderBottom: '1px solid #eee' }}>
            <span style={{ flex: 1 }}>{resumen(f)}</span>
            <button onClick={() => setEditando(f.id)}>Editar</button>
            <button onClick={() => eliminar(f.id)}>Borrar</button>
          </div>
          {editando === f.id && (
            <Formulario campos={seccion.campos} inicial={f} onGuardar={guardar} onCancelar={() => setEditando(null)} />
          )}
        </div>
      ))}

      {editando === 'nuevo' ? (
        <Formulario campos={seccion.campos} onGuardar={guardar} onCancelar={() => setEditando(null)} />
      ) : (
        <button onClick={() => setEditando('nuevo')} style={{ marginTop: 8 }}>
          + Añadir {seccion.singular}
        </button>
      )}
    </section>
  )
}
