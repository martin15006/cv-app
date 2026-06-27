import { useEffect, useRef, useState } from 'react'

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

// Textarea que crece solo para mostrar todo el contenido (sin scroll interno).
function AutoArea({ value, onChange }) {
  const ref = useRef(null)
  const ajustar = () => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.max(el.scrollHeight, 70) + 'px'
  }
  useEffect(() => { ajustar() }, [value])
  return (
    <textarea
      ref={ref}
      className="a-area"
      value={value}
      onChange={onChange}
      onInput={ajustar}
      style={{ overflow: 'hidden', resize: 'none' }}
    />
  )
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
    campos.forEach((c) => {
      let v = aValor(valores[c.n], c.tipo)
      if (c.upper && typeof v === 'string') v = v.toUpperCase()
      fila[c.n] = v
    })
    setGuardando(true)
    Promise.resolve(onGuardar(fila)).finally(() => setGuardando(false))
  }

  const set = (n, v) => setValores((prev) => ({ ...prev, [n]: v }))

  return (
    <form onSubmit={submit} className="a-form">
      {campos.map((c) => (
        <label key={c.n} className="a-field">
          {c.label}
          {c.tipo === 'lista' || c.tipo === 'area' ? (
            <AutoArea value={valores[c.n]} onChange={(e) => set(c.n, e.target.value)} />
          ) : (
            <input
              className="a-input" type={c.tipo === 'numero' ? 'number' : 'text'}
              value={valores[c.n]}
              onChange={(e) => set(c.n, c.upper ? e.target.value.toUpperCase() : e.target.value)}
            />
          )}
        </label>
      ))}
      <div className="a-btnrow">
        <button type="submit" className="a-btn primary" disabled={guardando}>
          {guardando ? 'Guardando…' : 'Guardar'}
        </button>
        {onCancelar && <button type="button" className="a-btn" onClick={onCancelar}>Cancelar</button>}
      </div>
    </form>
  )
}
