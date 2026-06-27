import { useCallback, useEffect, useState } from 'react'
import { listar, crear, actualizar, borrar } from '../../lib/crud.js'
import { ordenarPorRango } from '../../lib/util.js'
import Formulario from './Formulario.jsx'
import Modal from './Modal.jsx'

export default function TablaCrud({ seccion }) {
  const [filas, setFilas] = useState([])
  const [editando, setEditando] = useState(null) // null | 'nuevo' | id
  const [error, setError] = useState(null)

  const recargar = useCallback(async () => {
    try {
      setError(null)
      const data = await listar(seccion.tabla)
      setFilas(seccion.tabla === 'proyectos' ? ordenarPorRango(data) : data)
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

  const filaEdit = editando && editando !== 'nuevo' ? filas.find((f) => f.id === editando) : null

  return (
    <section className="a-panel">
      <div className="a-row" style={{ padding: '0 0 12px', borderBottom: '1px solid var(--line-soft)' }}>
        <h3 style={{ margin: 0, flex: 1 }}>{seccion.titulo}</h3>
        <button className="a-btn small primary" onClick={() => setEditando('nuevo')}>+ Añadir</button>
      </div>
      {error && <p className="a-msg a-err">{error}</p>}

      {filas.map((f) => (
        <div className="a-row" key={f.id}>
          <span>{resumen(f)}</span>
          <button className="a-btn small" onClick={() => setEditando(f.id)}>Editar</button>
          <button className="a-btn small danger" onClick={() => eliminar(f.id)}>Borrar</button>
        </div>
      ))}

      {editando && (
        <Modal
          titulo={editando === 'nuevo' ? `Añadir ${seccion.singular}` : `Editar ${seccion.singular}`}
          onCerrar={() => setEditando(null)}
        >
          <Formulario
            campos={seccion.campos}
            inicial={filaEdit || {}}
            onGuardar={guardar}
            onCancelar={() => setEditando(null)}
          />
        </Modal>
      )}
    </section>
  )
}
