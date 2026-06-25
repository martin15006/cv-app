import { useState } from 'react'

function aTexto(valor, tipo) {
  if (tipo === 'lista') return (valor || []).join('\n')
  return valor ?? ''
}

function aValor(texto, tipo) {
  if (tipo === 'lista')
    return texto.split('\n').map((s) => s.trim()).filter(Boolean)
  if (tipo === 'numero') return texto === '' ? 0 : Number(texto)
  return texto
}

export default function Formulario({ campos, inicial = {}, onGuardar, onCancelar }) {
  const [valores, setValores] = useState(() => {
    const o = {}
    campos.forEach((c) => { o[c.n] = aTexto(inicial[c.n], c.tipo) })
    return o
  })
  const [guardando, setGuardando] = useState(false)

  function submit(e) {
    e.preventDefault()
    const fila = {}
    campos.forEach((c) => { fila[c.n] = aValor(valores[c.n], c.tipo) })
    setGuardando(true)
    Promise.resolve(onGuardar(fila)).finally(() => setGuardando(false))
  }

  const set = (n, v) => setValores((prev) => ({ ...prev, [n]: v }))

  return (
    <form
      onSubmit={submit}
      style={{ display: 'grid', gap: 8, margin: '10px 0', padding: 12, border: '1px solid #ccc', borderRadius: 8, background: '#fafafa' }}
    >
      {campos.map((c) => (
        <label key={c.n} style={{ display: 'grid', gap: 2, fontSize: 13 }}>
          {c.label}
          {c.tipo === 'lista' || c.tipo === 'area' ? (
            <textarea
              rows={c.tipo === 'lista' ? 4 : 3}
              value={valores[c.n]}
              onChange={(e) => set(c.n, e.target.value)}
            />
          ) : (
            <input
              type={c.tipo === 'numero' ? 'number' : 'text'}
              value={valores[c.n]}
              onChange={(e) => set(c.n, e.target.value)}
            />
          )}
        </label>
      ))}
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="submit" disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar'}</button>
        {onCancelar && <button type="button" onClick={onCancelar}>Cancelar</button>}
      </div>
    </form>
  )
}
