import { useEffect, useState } from 'react'
import { obtenerPerfil, guardarPerfil } from '../../lib/crud.js'
import { CAMPOS_PERFIL } from '../../lib/secciones.js'
import Formulario from './Formulario.jsx'
import Modal from './Modal.jsx'

function valorMostrar(v) {
  if (v === null || v === undefined || v === '') return '—'
  const s = String(v)
  return s.length > 95 ? s.slice(0, 95) + '…' : s
}

export default function PerfilEditor() {
  const [perfil, setPerfil] = useState(null)
  const [msg, setMsg] = useState(null)
  const [abierto, setAbierto] = useState(false)

  useEffect(() => {
    obtenerPerfil().then(setPerfil).catch((e) => setMsg(e.message))
  }, [])

  async function guardar(fila) {
    try {
      await guardarPerfil(fila)
      setPerfil((p) => ({ ...p, ...fila }))
      setMsg('Perfil guardado ✅')
      setAbierto(false)
    } catch (e) {
      setMsg(e.message)
    }
  }

  return (
    <section className="a-panel">
      <div className="a-row" style={{ padding: '0 0 12px', borderBottom: '1px solid var(--line-soft)' }}>
        <h3 style={{ margin: 0, flex: 1 }}>Perfil</h3>
        <button className="a-btn small primary" onClick={() => setAbierto(true)} disabled={!perfil}>
          Editar
        </button>
      </div>
      {msg && <p className="a-msg">{msg}</p>}

      {perfil &&
        CAMPOS_PERFIL.map((c) => (
          <div className="a-row" key={c.n}>
            <span>
              <strong style={{ color: 'var(--ink)' }}>{c.label}:</strong> {valorMostrar(perfil[c.n])}
            </span>
          </div>
        ))}

      {abierto && perfil && (
        <Modal titulo="Editar perfil" onCerrar={() => setAbierto(false)}>
          <Formulario campos={CAMPOS_PERFIL} inicial={perfil} onGuardar={guardar} onCancelar={() => setAbierto(false)} />
        </Modal>
      )}
    </section>
  )
}
